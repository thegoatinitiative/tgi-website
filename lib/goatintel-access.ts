import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { mkdir, readFile, rename, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { get, put, BlobNotFoundError, BlobPreconditionFailedError } from "@vercel/blob";
import { usesBlobStore } from "@/lib/members";

export class AccessStoreError extends Error {
  code: "readonly" | "missing";

  constructor(code: "readonly" | "missing") {
    super(code);
    this.name = "AccessStoreError";
    this.code = code;
  }
}

export type AccessStatus = "pending" | "approved" | "denied";

export type AccessRequest = {
  uid: string;
  username: string;
  name: string;
  email: string;
  ip: string;
  status: AccessStatus;
  createdAt: string;
  decidedAt: string | null;
  approveTokenHash: string | null;
  denyTokenHash: string | null;
  tokenExpires: string | null;
};

type Store = { requests: AccessRequest[] };

type Snapshot = { store: Store; etag: string | null };

export type StagedAccess = {
  status: AccessStatus;
  mailed: boolean;
  name: string;
  email: string;
  username: string;
  approveUrl: string | null;
  denyUrl: string | null;
  previous: AccessRequest | null;
};

const FILE = process.env.TGI_GOATINTEL_FILE || join(process.cwd(), "data", "goatintel-access.json");
const BLOB_PATH = "goatintel/access.json";
const TOKEN_MS = 7 * 24 * 60 * 60 * 1000;

function emptyStore(): Store {
  return { requests: [] };
}

function assertWritable() {
  if (process.env.VERCEL && !usesBlobStore()) throw new AccessStoreError("readonly");
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

function isRequest(value: unknown): value is AccessRequest {
  if (!value || typeof value !== "object") return false;
  const request = value as Partial<AccessRequest>;
  if (!request.uid || !request.username || !request.name || !request.email) return false;
  if (request.status !== "pending" && request.status !== "approved" && request.status !== "denied") return false;
  request.ip = typeof request.ip === "string" ? request.ip : "Unknown";
  request.createdAt = typeof request.createdAt === "string" ? request.createdAt : new Date(0).toISOString();
  request.decidedAt = typeof request.decidedAt === "string" ? request.decidedAt : null;
  request.approveTokenHash = typeof request.approveTokenHash === "string" ? request.approveTokenHash : null;
  request.denyTokenHash = typeof request.denyTokenHash === "string" ? request.denyTokenHash : null;
  request.tokenExpires = typeof request.tokenExpires === "string" ? request.tokenExpires : null;
  return true;
}

function parseStore(raw: string): Store {
  const parsed = JSON.parse(raw) as Partial<Store>;
  const requests = Array.isArray(parsed.requests) ? parsed.requests.filter(isRequest) : [];
  return { requests };
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

async function mutate<T>(
  fn: (store: Store) => { result: T; changed: boolean } | Promise<{ result: T; changed: boolean }>
): Promise<T> {
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
    throw lastError instanceof Error ? lastError : new AccessStoreError("readonly");
  });
}

function sameHash(stored: string, incoming: string): boolean {
  const left = Buffer.from(stored);
  const right = Buffer.from(incoming);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function newToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: createHash("sha256").update(token).digest("base64url") };
}

function tokenLive(request: AccessRequest, now: number): boolean {
  if (!request.approveTokenHash || !request.denyTokenHash || !request.tokenExpires) return false;
  const expires = Date.parse(request.tokenExpires);
  return Number.isFinite(expires) && expires > now;
}

function copyRequest(request: AccessRequest): AccessRequest {
  return { ...request };
}

export async function accessStatus(uid: string): Promise<AccessStatus | "legacy"> {
  const snapshot = await readSnapshot();
  return snapshot.store.requests.find((request) => request.uid === uid)?.status ?? "legacy";
}

export async function stageAccessRequest(input: {
  uid: string;
  username: string;
  name: string | null;
  email: string | null;
  ip: string;
  origin: string;
}): Promise<StagedAccess> {
  const now = Date.now();
  return mutate<StagedAccess>((store) => {
    const existing = store.requests.find((request) => request.uid === input.uid) ?? null;
    if (existing && existing.status !== "pending") {
      return {
        result: {
          status: existing.status,
          mailed: false,
          name: existing.name,
          email: existing.email,
          username: existing.username,
          approveUrl: null,
          denyUrl: null,
          previous: null,
        },
        changed: false,
      };
    }
    if (existing && tokenLive(existing, now)) {
      let changed = false;
      if (input.ip && existing.ip !== input.ip) {
        existing.ip = input.ip;
        changed = true;
      }
      if (input.name && existing.name !== input.name) {
        existing.name = input.name;
        changed = true;
      }
      if (input.email && existing.email !== input.email) {
        existing.email = input.email;
        changed = true;
      }
      if (existing.username !== input.username) {
        existing.username = input.username;
        changed = true;
      }
      return {
        result: {
          status: "pending" as const,
          mailed: false,
          name: existing.name,
          email: existing.email,
          username: existing.username,
          approveUrl: null,
          denyUrl: null,
          previous: null,
        },
        changed,
      };
    }
    const name = input.name || existing?.name || "";
    const email = input.email || existing?.email || "";
    if (!name || !email) throw new AccessStoreError("missing");
    const previous = existing ? copyRequest(existing) : null;
    const approve = newToken();
    const deny = newToken();
    const record: AccessRequest = {
      uid: input.uid,
      username: input.username,
      name,
      email,
      ip: input.ip || "Unknown",
      status: "pending",
      createdAt: existing?.createdAt || new Date(now).toISOString(),
      decidedAt: null,
      approveTokenHash: approve.hash,
      denyTokenHash: deny.hash,
      tokenExpires: new Date(now + TOKEN_MS).toISOString(),
    };
    if (existing) Object.assign(existing, record);
    else store.requests.push(record);
    const decide = `${input.origin.replace(/\/$/, "")}/api/goatintel/decide?token=`;
    return {
      result: {
        status: "pending" as const,
        mailed: true,
        name,
        email,
        username: input.username,
        approveUrl: `${decide}${approve.token}`,
        denyUrl: `${decide}${deny.token}`,
        previous,
      },
      changed: true,
    };
  });
}

export async function rollbackAccessRequest(uid: string, previous: AccessRequest | null): Promise<void> {
  await mutate((store) => {
    const index = store.requests.findIndex((request) => request.uid === uid);
    if (previous) {
      if (index === -1) store.requests.push(previous);
      else store.requests[index] = previous;
      return { result: undefined, changed: true };
    }
    if (index === -1) return { result: undefined, changed: false };
    store.requests.splice(index, 1);
    return { result: undefined, changed: true };
  });
}

export function accessRequestText(input: {
  name: string;
  email: string;
  username: string;
  ip: string;
  approveUrl: string;
  denyUrl: string;
}): string {
  return [
    "A GOAT Intel account is waiting for approval.",
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Username: ${input.username}`,
    `IP address: ${input.ip}`,
    "",
    "Approve:",
    input.approveUrl,
    "",
    "Deny:",
    input.denyUrl,
    "",
    "Each link works once and expires in 7 days.",
    "Approving lets that account open detailed files.",
    "Denying keeps it closed.",
    "",
    "The GOAT Initiative",
  ].join("\n");
}

export async function decideAccess(token: string): Promise<"approved" | "denied" | "expired" | "invalid"> {
  if (typeof token !== "string" || token.length < 20 || token.length > 200) return "invalid";
  const hash = createHash("sha256").update(token).digest("base64url");
  return mutate((store) => {
    const request = store.requests.find(
      (entry) =>
        (entry.approveTokenHash && sameHash(entry.approveTokenHash, hash)) ||
        (entry.denyTokenHash && sameHash(entry.denyTokenHash, hash))
    );
    if (!request) return { result: "invalid" as const, changed: false };
    const action = request.approveTokenHash && sameHash(request.approveTokenHash, hash) ? "approve" : "deny";
    const expires = request.tokenExpires ? Date.parse(request.tokenExpires) : NaN;
    request.approveTokenHash = null;
    request.denyTokenHash = null;
    request.tokenExpires = null;
    if (!Number.isFinite(expires) || expires < Date.now()) {
      return { result: "expired" as const, changed: true };
    }
    const status = action === "approve" ? "approved" : "denied";
    request.status = status;
    request.decidedAt = new Date().toISOString();
    return { result: status, changed: true };
  });
}
