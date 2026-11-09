import { clientIp } from "@/lib/account-notice";
import { rateLimited } from "@/lib/auth-messages";
import { FirebaseTokenError, verifyFirebaseIdToken } from "@/lib/firebase-token";
import { AccessStoreError, finishRecovery } from "@/lib/goatintel-access";
import { jsonCors, preflight } from "@/lib/goatintel-cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function POST(request: Request) {
  if (rateLimited(`goatintel-recover-finish:${clientIp(request)}`)) {
    return jsonCors(request, { error: "rate" }, 429);
  }
  let payload: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 12000) return jsonCors(request, { error: "invalid" }, 400);
    payload = JSON.parse(raw);
  } catch {
    return jsonCors(request, { error: "invalid" }, 400);
  }
  const body = (payload && typeof payload === "object" ? payload : {}) as {
    idToken?: unknown;
    recoverToken?: unknown;
  };
  if (typeof body.idToken !== "string" || typeof body.recoverToken !== "string") {
    return jsonCors(request, { error: "invalid" }, 400);
  }

  let claims: { uid: string; email: string };
  try {
    claims = await verifyFirebaseIdToken(body.idToken);
  } catch (error) {
    if (error instanceof FirebaseTokenError && error.code === "unavailable") {
      return jsonCors(request, { error: "unavailable" }, 503);
    }
    return jsonCors(request, { error: "invalid" }, 401);
  }

  try {
    const result = await finishRecovery({
      token: body.recoverToken,
      uid: claims.uid,
      authEmail: claims.email,
    });
    if (result.ok) return jsonCors(request, { ok: true, username: result.username }, 200);
    return jsonCors(request, { error: result.error }, result.error === "taken" ? 409 : 400);
  } catch (error) {
    console.error("GOATINTEL recover finish", error instanceof AccessStoreError ? error.code : "store");
    return jsonCors(request, { error: "store" }, 503);
  }
}
