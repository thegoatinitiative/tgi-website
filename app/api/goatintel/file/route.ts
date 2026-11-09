import { NextResponse } from "next/server";
import { clientIp } from "@/lib/account-notice";
import { rateLimited } from "@/lib/auth-messages";
import { FirebaseTokenError, verifyFirebaseIdToken } from "@/lib/firebase-token";
import { accessStatus, isStaffUsername } from "@/lib/goatintel-access";
import { corsHeaders, jsonCors, preflight } from "@/lib/goatintel-cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 4 * 1024 * 1024;
const BUCKETS = [
  "intel-portal-9578e.firebasestorage.app",
  "intel-portal-9578e.appspot.com",
];
const STORAGE_HOSTS = new Set([
  "firebasestorage.googleapis.com",
  "storage.googleapis.com",
]);

function bearer(request: Request): string | null {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(\S+)$/i);
  return match ? match[1] : null;
}

function storagePath(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.length < 5 || raw.length > 300) return null;
  if (!raw.startsWith("attachments/")) return null;
  if (raw.includes("..") || raw.includes("\\") || raw.includes("\0") || /[\r\n?#]/.test(raw)) return null;
  if (!/^attachments\/[A-Za-z0-9][A-Za-z0-9._-]{0,80}\/[^/]+$/.test(raw)) return null;
  return raw;
}

function downloadUrl(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.length < 20 || raw.length > 2000) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.username || url.password) return null;
  if (url.hostname !== "firebasestorage.googleapis.com") return null;
  if (!BUCKETS.some((bucket) => url.pathname.startsWith(`/v0/b/${bucket}/o/`))) return null;
  if (url.searchParams.get("alt") !== "media") return null;
  return url.toString();
}

function allowedRedirect(raw: string, base: string): string | null {
  let url: URL;
  try {
    url = new URL(raw, base);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.username || url.password) return null;
  if (!STORAGE_HOSTS.has(url.hostname)) return null;
  return url.toString();
}

async function fetchAuthorized(start: string, token: string): Promise<Response> {
  let current = start;
  let sendAuth = true;
  let last: Response | null = null;
  for (let hop = 0; hop < 3; hop += 1) {
    const headers = new Headers();
    if (sendAuth) headers.set("Authorization", `Firebase ${token}`);
    last = await fetch(current, { headers, redirect: "manual" });
    if (last.status < 300 || last.status >= 400) return last;
    const next = allowedRedirect(last.headers.get("location") || "", current);
    await last.body?.cancel();
    if (!next) return last;
    current = next;
    sendAuth = false;
  }
  return last as Response;
}

async function fetchStoredLink(start: string): Promise<Response> {
  let current = start;
  let last: Response | null = null;
  for (let hop = 0; hop < 3; hop += 1) {
    last = await fetch(current, { redirect: "manual" });
    if (last.status < 300 || last.status >= 400) return last;
    const next = allowedRedirect(last.headers.get("location") || "", current);
    await last.body?.cancel();
    if (!next) return last;
    current = next;
  }
  return last as Response;
}

async function readLimited(response: Response): Promise<Uint8Array | null> {
  if (!response.body) return null;
  const announced = Number(response.headers.get("content-length") || "0");
  if (announced > MAX_BYTES) return null;
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const step = await reader.read();
    if (step.done) break;
    total += step.value.byteLength;
    if (total > MAX_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(step.value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function POST(request: Request) {
  if (rateLimited(`goatintel-file:${clientIp(request)}`, 40)) {
    return jsonCors(request, { error: "rate" }, 429);
  }
  const token = bearer(request);
  if (!token) return jsonCors(request, { error: "invalid" }, 401);

  try {
    const claims = await verifyFirebaseIdToken(token);
    if (!isStaffUsername(claims.username)) {
      const status = await accessStatus(claims.uid);
      if (status !== "approved") return jsonCors(request, { error: "denied" }, 403);
    }
  } catch (error) {
    if (error instanceof FirebaseTokenError && error.code === "unavailable") {
      return jsonCors(request, { error: "unavailable" }, 503);
    }
    if (error instanceof FirebaseTokenError) return jsonCors(request, { error: "invalid" }, 401);
    console.error("GOATINTEL file auth", error instanceof Error ? error.message : "auth");
    return jsonCors(request, { error: "store" }, 503);
  }

  let path: string | null = null;
  let extra: string | null = null;
  try {
    const raw = await request.text();
    if (raw.length > 4000) return jsonCors(request, { error: "invalid" }, 400);
    const body = JSON.parse(raw) as { path?: unknown; url?: unknown };
    path = storagePath(body.path);
    extra = downloadUrl(body.url);
  } catch {
    return jsonCors(request, { error: "invalid" }, 400);
  }
  if (!path) return jsonCors(request, { error: "invalid" }, 400);

  try {
    const encoded = encodeURIComponent(path);
    const targets = BUCKETS.map(
      (bucket) => `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encoded}?alt=media`
    );
    if (extra && !targets.includes(extra)) targets.push(extra);

    let bytes: Uint8Array | null = null;
    let contentType = "";
    let missing = true;
    let tooBig = false;

    const consider = async (upstream: Response): Promise<boolean> => {
      if (upstream.status === 404) return false;
      missing = false;
      if (upstream.status !== 200) {
        await upstream.body?.cancel();
        return false;
      }
      const announced = Number(upstream.headers.get("content-length") || "0");
      if (announced > MAX_BYTES) {
        tooBig = true;
        await upstream.body?.cancel();
        return false;
      }
      const got = await readLimited(upstream);
      if (!got) {
        tooBig = true;
        return false;
      }
      const headerType = (upstream.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
      const pdf = got.byteLength >= 5 && got[0] === 0x25 && got[1] === 0x50 && got[2] === 0x44 && got[3] === 0x46;
      const type = pdf ? "application/pdf" : headerType.startsWith("image/") ? headerType : "";
      if (!type) return false;
      bytes = got;
      contentType = type;
      return true;
    };

    for (const target of targets) {
      if (await consider(await fetchAuthorized(target, token))) break;
    }
    if (!bytes && extra) await consider(await fetchStoredLink(extra));
    if (!bytes) {
      if (tooBig) return jsonCors(request, { error: "large" }, 413);
      return jsonCors(request, { error: missing ? "missing" : "upstream" }, missing ? 404 : 502);
    }

    const headers = corsHeaders(request);
    headers.set("Content-Type", contentType);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Cache-Control", "private, no-store");
    return new NextResponse(Buffer.from(bytes), { status: 200, headers });
  } catch (error) {
    console.error("GOATINTEL file", error instanceof Error ? error.message : "read");
    return jsonCors(request, { error: "upstream" }, 502);
  }
}
