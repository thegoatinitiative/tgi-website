import { createHash, randomBytes, randomUUID, timingSafeEqual } from "crypto";
import { mkdir, readFile, rename, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { get, put, BlobNotFoundError, BlobPreconditionFailedError } from "@vercel/blob";
import { isReportId, REPORTS, type ReportId } from "@/lib/reports";

export class MemberStoreError extends Error {
  code: "readonly" | "taken";

  constructor(code: "readonly" | "taken") {
    super(code);
    this.name = "MemberStoreError";
    this.code = code;
  }
}

export type Member = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  confirmedAt: string | null;
  confirmTokenHash: string | null;
  confirmExpires: string | null;
};

type Store = {
  members: Member[];
  unlocked: ReportId[];
};

type Snapshot = {
  store: Store;
  etag: string | null;
};

const FILE = process.env.TGI_MEMBERS_FILE || join(process.cwd(), "data", "members.json");
const BLOB_PATH = "members/store.json";

export function usesBlobStore(): boolean {
  return Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
}

function emptyStore(): Store {
  return { members: [], unlocked: [] };
}

function assertWritable() {
  if (process.env.VERCEL && !usesBlobStore()) {
    throw new MemberStoreError("readonly");
  }
}

let chain: Promise<unknown> = Promise.resolve();

function locked<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(fn, fn);
  chain = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

function isMember(value: unknown): value is Member {
  if (!value || typeof value !== "object") return false;
  const member = value as Partial<Member>;
  if (!member.id || !member.email || !member.passwordHash || !member.name) return false;
  member.confirmedAt = typeof member.confirmedAt === "string" ? member.confirmedAt : null;
  member.confirmTokenHash = typeof member.confirmTokenHash === "string" ? member.confirmTokenHash : null;
  member.confirmExpires = typeof member.confirmExpires === "string" ? member.confirmExpires : null;
  return true;
}

function parseStore(raw: string): Store {
  const parsed = JSON.parse(raw) as Partial<Store>;
  const members = Array.isArray(parsed.members) ? parsed.members.filter(isMember) : [];
  const unlocked = Array.isArray(parsed.unlocked)
    ? parsed.unlocked.filter((id): id is ReportId => typeof id === "string" && isReportId(id))
    : [];
  return { members, unlocked };
}

async function readFileStore(): Promise<Snapshot> {
  try {
    const raw = await readFile(FILE, "utf8");
    return { store: parseStore(raw), etag: null };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return { store: emptyStore(), etag: null };
    throw error;
  }
}

async function readBlobStore(): Promise<Snapshot> {
  try {
    const result = await get(BLOB_PATH, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200 || !result.stream) return { store: emptyStore(), etag: null };
    const raw = await new Response(result.stream).text();
    return { store: parseStore(raw), etag: result.blob.etag };
  } catch (error) {
    if (error instanceof BlobNotFoundError) return { store: emptyStore(), etag: null };
    throw error;
  }
}

async function readSnapshot(): Promise<Snapshot> {
  return usesBlobStore() ? readBlobStore() : readFileStore();
}

async function writeFileStore(store: Store): Promise<void> {
  await mkdir(dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(store, null, 2), { mode: 0o600 });
  await rename(tmp, FILE);
}

async function writeBlobStore(store: Store, etag: string | null): Promise<void> {
  try {
    await put(BLOB_PATH, JSON.stringify(store), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: etag !== null,
      contentType: "application/json",
      cacheControlMaxAge: 60,
      ...(etag ? { ifMatch: etag } : {}),
    });
  } catch (error) {
    if (error instanceof BlobPreconditionFailedError) throw error;
    const message = error instanceof Error ? error.message : "";
    if (message.includes("already exists") || message.includes("precondition")) {
      throw new BlobPreconditionFailedError();
    }
    throw error;
  }
}

async function writeSnapshot(store: Store, etag: string | null): Promise<void> {
  assertWritable();
  if (usesBlobStore()) {
    await writeBlobStore(store, etag);
    return;
  }
  await writeFileStore(store);
}

async function mutate<T>(fn: (store: Store) => { result: T; changed: boolean } | Promise<{ result: T; changed: boolean }>): Promise<T> {
  return locked(async () => {
    assertWritable();
    let lastError: unknown;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const snapshot = await readSnapshot();
      const { result, changed } = await fn(snapshot.store);
      if (!changed) return result;
      try {
        await writeSnapshot(snapshot.store, snapshot.etag);
        return result;
      } catch (error) {
        if (!(error instanceof BlobPreconditionFailedError)) throw error;
        lastError = error;
      }
    }
    throw lastError instanceof Error ? lastError : new MemberStoreError("readonly");
  });
}

export function newConfirmToken(): { token: string; hash: string; expires: string } {
  const token = randomBytes(32).toString("base64url");
  return {
    token,
    hash: createHash("sha256").update(token).digest("base64url"),
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

function sameHash(stored: string, incoming: string): boolean {
  const left = Buffer.from(stored);
  const right = Buffer.from(incoming);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export async function listUnlocked(): Promise<ReportId[]> {
  const snapshot = await readSnapshot();
  return snapshot.store.unlocked;
}

export async function findMemberById(id: string): Promise<Member | null> {
  const snapshot = await readSnapshot();
  return snapshot.store.members.find((member) => member.id === id) ?? null;
}

export async function findMemberByEmail(email: string): Promise<Member | null> {
  const snapshot = await readSnapshot();
  const needle = email.trim().toLowerCase();
  return snapshot.store.members.find((member) => member.email === needle) ?? null;
}

export async function createMember(input: {
  name: string;
  email: string;
  passwordHash: string;
  confirmTokenHash: string;
  confirmExpires: string;
}): Promise<Member> {
  return mutate((store) => {
    const email = input.email.trim().toLowerCase();
    if (store.members.some((member) => member.email === email)) {
      throw new MemberStoreError("taken");
    }
    const member: Member = {
      id: randomUUID(),
      name: input.name,
      email,
      passwordHash: input.passwordHash,
      createdAt: new Date().toISOString(),
      confirmedAt: null,
      confirmTokenHash: input.confirmTokenHash,
      confirmExpires: input.confirmExpires,
    };
    store.members.push(member);
    return { result: member, changed: true };
  });
}

export async function setConfirmToken(memberId: string, hash: string, expires: string): Promise<boolean> {
  return mutate((store) => {
    const member = store.members.find((item) => item.id === memberId);
    if (!member || member.confirmedAt) return { result: false, changed: false };
    member.confirmTokenHash = hash;
    member.confirmExpires = expires;
    return { result: true, changed: true };
  });
}

export async function confirmByToken(token: string): Promise<Member | null> {
  if (token.length < 20 || token.length > 200) return null;
  const hash = createHash("sha256").update(token).digest("base64url");
  return mutate((store) => {
    const member = store.members.find(
      (item) => item.confirmTokenHash && sameHash(item.confirmTokenHash, hash)
    );
    if (!member || !member.confirmExpires || Date.parse(member.confirmExpires) < Date.now()) {
      return { result: null, changed: false };
    }
    member.confirmedAt = new Date().toISOString();
    member.confirmTokenHash = null;
    member.confirmExpires = null;
    return { result: member, changed: true };
  });
}

export async function unlockNext(expected: string): Promise<
  { ok: true; id: ReportId } | { ok: false; code: "changed" | "done" }
> {
  return mutate((store): {
    result: { ok: true; id: ReportId } | { ok: false; code: "changed" | "done" };
    changed: boolean;
  } => {
    const next = REPORTS.find((report) => !store.unlocked.includes(report.id))?.id;
    if (!next) return { result: { ok: false, code: "done" }, changed: false };
    if (next !== expected) return { result: { ok: false, code: "changed" }, changed: false };
    store.unlocked.push(next);
    return { result: { ok: true, id: next }, changed: true };
  });
}
