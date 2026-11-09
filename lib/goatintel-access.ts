import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { mkdir, readFile, rename, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { get, head, put, BlobNotFoundError, BlobPreconditionFailedError } from "@vercel/blob";
import { usesBlobStore } from "@/lib/members";

export class AccessStoreError extends Error {
  code: "readonly" | "missing" | "rate";

  constructor(code: "readonly" | "missing" | "rate") {
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
  phone: string;
  organization: string;
  firstName: string;
  lastName: string;
  kind: "account" | "portal";
  setupTokenHash: string | null;
  setupExpires: string | null;
};

type Store = { requests: AccessRequest[] };

type Snapshot = { store: Store; etag: string | null };

export type StagedAccess = {
  status: AccessStatus;
  mailed: boolean;
  audience: "staff" | "applicant" | "none";
  uid: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  organization: string;
  firstName: string;
  lastName: string;
  approveUrl: string | null;
  denyUrl: string | null;
  setupUrl: string | null;
  previous: AccessRequest | null;
};

export type AccessDecision = {
  outcome: "approved" | "denied" | "expired" | "invalid";
  portal: boolean;
  applicantEmail: string | null;
  setupUrl: string | null;
  uid: string | null;
};

const FILE = process.env.TGI_GOATINTEL_FILE || join(process.cwd(), "data", "goatintel-access.json");
const BLOB_PATH = "goatintel/access.json";
const TOKEN_MS = 7 * 24 * 60 * 60 * 1000;
const SETUP_PAGE = "https://goatintel.com/?setup=";
const PUBLIC_ORIGINS = new Set([
  "https://www.thegoatinitiative.org",
  "https://thegoatinitiative.org",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);
const STAFF_USERNAMES = new Set(["cgautereaux", "admin"]);
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 8;

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
  if (typeof request.uid !== "string" || !request.uid) return false;
  if (typeof request.name !== "string" || !request.name) return false;
  if (typeof request.email !== "string" || !request.email) return false;
  if (request.status !== "pending" && request.status !== "approved" && request.status !== "denied") return false;
  request.username = typeof request.username === "string" ? request.username : "";
  request.ip = typeof request.ip === "string" ? request.ip : "Unknown";
  request.createdAt = typeof request.createdAt === "string" ? request.createdAt : new Date(0).toISOString();
  request.decidedAt = typeof request.decidedAt === "string" ? request.decidedAt : null;
  request.approveTokenHash = typeof request.approveTokenHash === "string" ? request.approveTokenHash : null;
  request.denyTokenHash = typeof request.denyTokenHash === "string" ? request.denyTokenHash : null;
  request.tokenExpires = typeof request.tokenExpires === "string" ? request.tokenExpires : null;
  request.phone = typeof request.phone === "string" ? request.phone : "";
  request.organization = typeof request.organization === "string" ? request.organization : "";
  request.firstName = typeof request.firstName === "string" ? request.firstName : "";
  request.lastName = typeof request.lastName === "string" ? request.lastName : "";
  request.kind = request.kind === "portal" ? "portal" : "account";
  request.setupTokenHash = typeof request.setupTokenHash === "string" ? request.setupTokenHash : null;
  request.setupExpires = typeof request.setupExpires === "string" ? request.setupExpires : null;
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
  let etag: string | null = null;
  try {
    const metadata = await head(BLOB_PATH);
    etag = metadata.etag || null;
  } catch (error) {
    if (error instanceof BlobNotFoundError) return { store: emptyStore(), etag: null };
    throw error;
  }
  try {
    const result = await get(BLOB_PATH, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200 || !result.stream) return { store: emptyStore(), etag };
    const raw = await new Response(result.stream).text();
    return { store: parseStore(raw), etag };
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

function stagedFrom(
  request: Pick<
    AccessRequest,
    "uid" | "name" | "email" | "username" | "phone" | "organization" | "firstName" | "lastName"
  >,
  extra: Partial<StagedAccess> & Pick<StagedAccess, "status" | "mailed" | "audience">
): StagedAccess {
  return {
    uid: request.uid,
    name: request.name,
    email: request.email,
    username: request.username,
    phone: request.phone,
    organization: request.organization,
    firstName: request.firstName,
    lastName: request.lastName,
    approveUrl: null,
    denyUrl: null,
    setupUrl: null,
    previous: null,
    ...extra,
  };
}

function setupLive(request: AccessRequest, now: number): boolean {
  if (!request.setupTokenHash || !request.setupExpires) return false;
  const expires = Date.parse(request.setupExpires);
  return Number.isFinite(expires) && expires > now;
}

function decideBase(origin: string): string {
  const cleaned = origin.replace(/\/$/, "");
  return PUBLIC_ORIGINS.has(cleaned) ? cleaned : "https://www.thegoatinitiative.org";
}

function recentFromIp(store: Store, ip: string, now: number): number {
  return store.requests.filter((request) => {
    const created = Date.parse(request.createdAt);
    return request.ip === ip && Number.isFinite(created) && now - created < RATE_WINDOW_MS;
  }).length;
}

export function isStaffUsername(username: string): boolean {
  return STAFF_USERNAMES.has(username);
}

export async function accessStatus(uid: string): Promise<AccessStatus> {
  const snapshot = await readSnapshot();
  return snapshot.store.requests.find((request) => request.uid === uid)?.status ?? "denied";
}

export type TokenLook = "approve" | "deny" | "expired" | "invalid";

/** Reads an approval link without spending it. */
export async function inspectAccess(token: string): Promise<TokenLook> {
  if (typeof token !== "string" || token.length < 20 || token.length > 200) return "invalid";
  if (!/^[A-Za-z0-9_-]+$/.test(token)) return "invalid";
  const hash = createHash("sha256").update(token).digest("base64url");
  const snapshot = await readSnapshot();
  const request = snapshot.store.requests.find(
    (entry) =>
      (entry.approveTokenHash && sameHash(entry.approveTokenHash, hash)) ||
      (entry.denyTokenHash && sameHash(entry.denyTokenHash, hash))
  );
  if (!request) return "invalid";
  const expires = request.tokenExpires ? Date.parse(request.tokenExpires) : NaN;
  if (!Number.isFinite(expires) || expires < Date.now()) return "expired";
  return request.approveTokenHash && sameHash(request.approveTokenHash, hash) ? "approve" : "deny";
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
        result: stagedFrom(existing, { status: existing.status, mailed: false, audience: "none" }),
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
        result: stagedFrom(existing, { status: "pending", mailed: false, audience: "none" }),
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
      phone: existing?.phone || "",
      organization: existing?.organization || "",
      firstName: existing?.firstName || "",
      lastName: existing?.lastName || "",
      kind: existing?.kind === "portal" ? "portal" : "account",
      setupTokenHash: null,
      setupExpires: null,
    };
    if (existing) Object.assign(existing, record);
    else store.requests.push(record);
    const decide = `${decideBase(input.origin)}/api/goatintel/decide?token=`;
    return {
      result: stagedFrom(record, {
        status: "pending",
        mailed: true,
        audience: "staff",
        approveUrl: `${decide}${approve.token}`,
        denyUrl: `${decide}${deny.token}`,
        previous,
      }),
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
  phone: string;
  organization: string;
  firstName: string;
  lastName: string;
  ip: string;
  approveUrl: string;
  denyUrl: string;
}): string {
  const lines = ["A GOAT Intel access request is waiting for approval.", ""];
  if (input.firstName || input.lastName) {
    lines.push(`First name: ${input.firstName}`, `Last name: ${input.lastName}`);
  } else {
    lines.push(`Name: ${input.name}`);
  }
  lines.push(`Email: ${input.email}`);
  if (input.phone) lines.push(`Phone: ${input.phone}`);
  if (input.organization) lines.push(`Department / agency / organization: ${input.organization}`);
  if (input.username) lines.push(`Username: ${input.username}`);
  lines.push(`IP address: ${input.ip}`, "", "Approve:", input.approveUrl, "", "Deny:", input.denyUrl, "");
  lines.push("Each link works once and expires in 7 days.");
  if (input.phone || input.organization) {
    lines.push(
      "Approving emails them a link to choose a username and password.",
      "Denying keeps the request closed."
    );
  } else {
    lines.push("Approving lets that account open detailed files.", "Denying keeps it closed.");
  }
  lines.push("", "The GOAT Initiative");
  return lines.join("\n");
}

export function applicantSetupText(setupUrl: string): string {
  return [
    "Your request for access to GOAT Intel was approved.",
    "",
    "Choose a username and password here:",
    setupUrl,
    "",
    "This link works once and expires in 7 days.",
    "A field-report account on thegoatinitiative.org does not sign you in.",
    "",
    "The GOAT Initiative",
  ].join("\n");
}

function blankDecision(outcome: AccessDecision["outcome"], portal = false): AccessDecision {
  return { outcome, portal, applicantEmail: null, setupUrl: null, uid: null };
}

export async function decideAccess(token: string): Promise<AccessDecision> {
  if (typeof token !== "string" || token.length < 20 || token.length > 200) return blankDecision("invalid");
  const hash = createHash("sha256").update(token).digest("base64url");
  return mutate((store) => {
    const request = store.requests.find(
      (entry) =>
        (entry.approveTokenHash && sameHash(entry.approveTokenHash, hash)) ||
        (entry.denyTokenHash && sameHash(entry.denyTokenHash, hash))
    );
    if (!request) return { result: blankDecision("invalid"), changed: false };
    const portal = request.kind === "portal";
    const action = request.approveTokenHash && sameHash(request.approveTokenHash, hash) ? "approve" : "deny";
    const expires = request.tokenExpires ? Date.parse(request.tokenExpires) : NaN;
    request.approveTokenHash = null;
    request.denyTokenHash = null;
    request.tokenExpires = null;
    if (!Number.isFinite(expires) || expires < Date.now()) {
      return { result: blankDecision("expired", portal), changed: true };
    }
    const outcome = action === "approve" ? "approved" : "denied";
    request.status = outcome;
    request.decidedAt = new Date().toISOString();
    if (outcome === "approved" && portal && !request.username) {
      const setup = newToken();
      request.setupTokenHash = setup.hash;
      request.setupExpires = new Date(Date.now() + TOKEN_MS).toISOString();
      return {
        result: {
          outcome,
          portal: true,
          applicantEmail: request.email,
          setupUrl: `${SETUP_PAGE}${setup.token}`,
          uid: request.uid,
        },
        changed: true,
      };
    }
    if (outcome === "denied") {
      request.setupTokenHash = null;
      request.setupExpires = null;
    }
    return { result: blankDecision(outcome, portal), changed: true };
  });
}

export async function stagePortalRequest(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  ip: string;
  origin: string;
}): Promise<StagedAccess> {
  const now = Date.now();
  return mutate((store) => {
    const existing =
      store.requests.find((request) => request.kind === "portal" && request.email === input.email) ?? null;
    if (existing && existing.status === "denied") {
      return { result: stagedFrom(existing, { status: "denied", mailed: false, audience: "none" }), changed: false };
    }
    if (existing && existing.status === "approved") {
      if (existing.username || setupLive(existing, now)) {
        return { result: stagedFrom(existing, { status: "approved", mailed: false, audience: "none" }), changed: false };
      }
      const previous = copyRequest(existing);
      const setup = newToken();
      existing.setupTokenHash = setup.hash;
      existing.setupExpires = new Date(now + TOKEN_MS).toISOString();
      return {
        result: stagedFrom(existing, {
          status: "approved",
          mailed: true,
          audience: "applicant",
          setupUrl: `${SETUP_PAGE}${setup.token}`,
          previous,
        }),
        changed: true,
      };
    }
    if (existing && tokenLive(existing, now)) {
      return { result: stagedFrom(existing, { status: "pending", mailed: false, audience: "none" }), changed: false };
    }
    if (!existing && recentFromIp(store, input.ip || "Unknown", now) >= RATE_LIMIT) {
      throw new AccessStoreError("rate");
    }
    const previous = existing ? copyRequest(existing) : null;
    const approve = newToken();
    const deny = newToken();
    const record: AccessRequest = {
      uid: existing?.uid || `portal_${randomBytes(16).toString("base64url")}`,
      username: "",
      name: `${input.firstName} ${input.lastName}`,
      email: input.email,
      ip: input.ip || "Unknown",
      status: "pending",
      createdAt: existing?.createdAt || new Date(now).toISOString(),
      decidedAt: null,
      approveTokenHash: approve.hash,
      denyTokenHash: deny.hash,
      tokenExpires: new Date(now + TOKEN_MS).toISOString(),
      phone: input.phone,
      organization: input.organization,
      firstName: input.firstName,
      lastName: input.lastName,
      kind: "portal",
      setupTokenHash: null,
      setupExpires: null,
    };
    if (existing) Object.assign(existing, record);
    else store.requests.push(record);
    const decide = `${decideBase(input.origin)}/api/goatintel/decide?token=`;
    return {
      result: stagedFrom(record, {
        status: "pending",
        mailed: true,
        audience: "staff",
        approveUrl: `${decide}${approve.token}`,
        denyUrl: `${decide}${deny.token}`,
        previous,
      }),
      changed: true,
    };
  });
}

export async function clearPortalSetup(uid: string): Promise<void> {
  await mutate((store) => {
    const request = store.requests.find((entry) => entry.uid === uid);
    if (!request || (!request.setupTokenHash && !request.setupExpires)) {
      return { result: undefined, changed: false };
    }
    request.setupTokenHash = null;
    request.setupExpires = null;
    return { result: undefined, changed: true };
  });
}

export async function finishPortalSetup(input: {
  token: string;
  uid: string;
  username: string;
}): Promise<"ok" | "invalid" | "expired" | "taken"> {
  if (typeof input.token !== "string" || input.token.length < 20 || input.token.length > 200) return "invalid";
  if (!input.uid || !input.username) return "invalid";
  const hash = createHash("sha256").update(input.token).digest("base64url");
  return mutate((store) => {
    const request = store.requests.find((entry) => entry.setupTokenHash && sameHash(entry.setupTokenHash, hash));
    if (!request || request.kind !== "portal" || request.status !== "approved") {
      return { result: "invalid" as const, changed: false };
    }
    const expires = request.setupExpires ? Date.parse(request.setupExpires) : NaN;
    if (!Number.isFinite(expires) || expires < Date.now()) {
      request.setupTokenHash = null;
      request.setupExpires = null;
      return { result: "expired" as const, changed: true };
    }
    if (store.requests.some((entry) => entry !== request && entry.uid === input.uid)) {
      return { result: "taken" as const, changed: false };
    }
    request.uid = input.uid;
    request.username = input.username;
    request.setupTokenHash = null;
    request.setupExpires = null;
    return { result: "ok" as const, changed: true };
  });
}
