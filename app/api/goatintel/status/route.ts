import { clientIp } from "@/lib/account-notice";
import { rateLimited } from "@/lib/auth-messages";
import { FirebaseTokenError, verifyFirebaseIdToken } from "@/lib/firebase-token";
import { accountMayReadReports } from "@/lib/goatintel-role";
import { jsonCors, preflight } from "@/lib/goatintel-cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bearer(request: Request): string | null {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(\S+)$/i);
  return match ? match[1] : null;
}

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function GET(request: Request) {
  if (rateLimited(`goatintel-status:${clientIp(request)}`, 30)) {
    return jsonCors(request, { error: "rate" }, 429);
  }
  const token = bearer(request);
  if (!token) return jsonCors(request, { error: "invalid" }, 401);
  try {
    const claims = await verifyFirebaseIdToken(token);
    if (!(await accountMayReadReports(token, claims))) {
      return jsonCors(request, { status: "denied" }, 200);
    }
    return jsonCors(request, { status: "approved" }, 200);
  } catch (error) {
    if (error instanceof FirebaseTokenError && error.code === "unavailable") {
      return jsonCors(request, { error: "unavailable" }, 503);
    }
    if (error instanceof FirebaseTokenError) return jsonCors(request, { error: "invalid" }, 401);
    console.error("GOATINTEL status", error instanceof Error ? error.message : "status");
    return jsonCors(request, { error: "store" }, 503);
  }
}
