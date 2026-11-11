import { NextResponse } from "next/server";
import { get, BlobNotFoundError } from "@vercel/blob";
import { clientIp } from "@/lib/account-notice";
import { rateLimited } from "@/lib/auth-messages";
import { FirebaseTokenError, verifyFirebaseIdToken } from "@/lib/firebase-token";
import { accountMayReadReports } from "@/lib/goatintel-role";
import { corsHeaders, jsonCors, preflight } from "@/lib/goatintel-cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REPORT_ID = /^RPT-\d{4}-\d{4}$/;

function bearer(request: Request): string | null {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(\S+)$/i);
  return match ? match[1] : null;
}

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  if (rateLimited(`goatintel-assessment:${clientIp(request)}`, 60)) {
    return jsonCors(request, { error: "rate" }, 429);
  }
  const { id } = await context.params;
  if (!REPORT_ID.test(id)) return jsonCors(request, { error: "invalid" }, 400);
  const token = bearer(request);
  if (!token) return jsonCors(request, { error: "invalid" }, 401);

  try {
    const claims = await verifyFirebaseIdToken(token);
    if (!(await accountMayReadReports(token, claims))) {
      return jsonCors(request, { error: "denied" }, 403);
    }
  } catch (error) {
    if (error instanceof FirebaseTokenError && error.code === "unavailable") {
      return jsonCors(request, { error: "unavailable" }, 503);
    }
    if (error instanceof FirebaseTokenError) return jsonCors(request, { error: "invalid" }, 401);
    console.error("GOATINTEL assessment auth", error instanceof Error ? error.message : "auth");
    return jsonCors(request, { error: "store" }, 503);
  }

  try {
    const stored = await get(`goatintel/reports/${id}.html`, { access: "private", useCache: false });
    if (!stored || stored.statusCode !== 200 || !stored.stream) {
      return jsonCors(request, { error: "missing" }, 404);
    }
    const headers = corsHeaders(request);
    headers.set("Content-Type", "text/html; charset=utf-8");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Cache-Control", "private, no-store");
    return new NextResponse(stored.stream, { status: 200, headers });
  } catch (error) {
    if (error instanceof BlobNotFoundError) return jsonCors(request, { error: "missing" }, 404);
    console.error("GOATINTEL assessment", error instanceof Error ? error.message : "read");
    return jsonCors(request, { error: "store" }, 503);
  }
}
