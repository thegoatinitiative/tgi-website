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
  try {
    const raw = await request.text();
    if (raw.length > 4000) return jsonCors(request, { error: "invalid" }, 400);
    const body = JSON.parse(raw) as { path?: unknown };
    path = storagePath(body.path);
  } catch {
    return jsonCors(request, { error: "invalid" }, 400);
  }
  if (!path) return jsonCors(request, { error: "invalid" }, 400);

  try {
    const encoded = encodeURIComponent(path);
    let bytes: Uint8Array | null = null;
    let contentType = "";
    for (const bucket of BUCKETS) {
      const upstream = await fetch(
        `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encoded}?alt=media`,
        {
          headers: { Authorization: `Firebase ${token}` },
          redirect: "manual",
        }
      );
      if (upstream.status === 404) continue;
      if (upstream.status !== 200) return jsonCors(request, { error: "upstream" }, 502);
      bytes = await readLimited(upstream);
      contentType = (upstream.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
      break;
    }
    if (!bytes) return jsonCors(request, { error: "missing" }, 404);
    const pdf = bytes.byteLength >= 5 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
    const type = pdf ? "application/pdf" : contentType.startsWith("image/") ? contentType : "";
    if (!type) return jsonCors(request, { error: "type" }, 415);

    const headers = corsHeaders(request);
    headers.set("Content-Type", type);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Cache-Control", "private, no-store");
    return new NextResponse(Buffer.from(bytes), { status: 200, headers });
  } catch (error) {
    console.error("GOATINTEL file", error instanceof Error ? error.message : "read");
    return jsonCors(request, { error: "upstream" }, 502);
  }
}
