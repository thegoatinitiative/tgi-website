import { NextResponse } from "next/server";
import { clientIp } from "@/lib/account-notice";
import { rateLimited } from "@/lib/auth-messages";
import { FirebaseTokenError, verifyFirebaseIdToken } from "@/lib/firebase-token";
import { accessStatus, isStaffUsername } from "@/lib/goatintel-access";
import { corsHeaders, jsonCors, preflight } from "@/lib/goatintel-cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 4 * 1024 * 1024;
const BUCKET = "intel-portal-9578e.firebasestorage.app";
const STORAGE_HOSTS = new Set([
  "firebasestorage.googleapis.com",
  "storage.googleapis.com",
]);

function bearer(request: Request): string | null {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(\S+)$/i);
  return match ? match[1] : null;
}

function storageUrl(raw: unknown): URL | null {
  if (typeof raw !== "string" || raw.length > 2000) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  if (url.hostname !== "firebasestorage.googleapis.com") return null;
  if (!url.pathname.startsWith(`/v0/b/${BUCKET}/o/`)) return null;
  if (url.searchParams.get("alt") !== "media") return null;
  if (!url.searchParams.get("token")) return null;
  return url;
}

function allowedRedirect(raw: string, base: string): string | null {
  let url: URL;
  try {
    url = new URL(raw, base);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || !STORAGE_HOSTS.has(url.hostname)) return null;
  return url.toString();
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

  let target: URL | null = null;
  try {
    const raw = await request.text();
    if (raw.length > 4000) return jsonCors(request, { error: "invalid" }, 400);
    const body = JSON.parse(raw) as { url?: unknown };
    target = storageUrl(body.url);
  } catch {
    return jsonCors(request, { error: "invalid" }, 400);
  }
  if (!target) return jsonCors(request, { error: "invalid" }, 400);

  try {
    let current = target.toString();
    let upstream: Response | null = null;
    for (let hop = 0; hop < 2; hop += 1) {
      upstream = await fetch(current, { redirect: "manual" });
      if (upstream.status < 300 || upstream.status >= 400) break;
      const next = allowedRedirect(upstream.headers.get("location") || "", current);
      if (!next) return jsonCors(request, { error: "upstream" }, 502);
      current = next;
      upstream = null;
    }
    if (!upstream || upstream.status !== 200 || !upstream.body) {
      return jsonCors(request, { error: "upstream" }, 502);
    }
    const announced = Number(upstream.headers.get("content-length") || "0");
    if (announced > MAX_BYTES) return jsonCors(request, { error: "size" }, 413);

    const reader = upstream.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const step = await reader.read();
      if (step.done) break;
      total += step.value.byteLength;
      if (total > MAX_BYTES) {
        await reader.cancel();
        return jsonCors(request, { error: "size" }, 413);
      }
      chunks.push(step.value);
    }
    const bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const pdf = total >= 5 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
    const upstreamType = (upstream.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    const type = pdf
      ? "application/pdf"
      : upstreamType.startsWith("image/")
        ? upstreamType
        : "";
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
