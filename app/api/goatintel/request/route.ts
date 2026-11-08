import { clientIp, noticeAccount } from "@/lib/account-notice";
import { cleanEmail, cleanName, rateLimited } from "@/lib/auth-messages";
import { FirebaseTokenError, verifyFirebaseIdToken } from "@/lib/firebase-token";
import {
  AccessStoreError,
  accessRequestText,
  rollbackAccessRequest,
  stageAccessRequest,
} from "@/lib/goatintel-access";
import { jsonCors, preflight } from "@/lib/goatintel-cors";
import { mailInbox, sendPlainEmail } from "@/lib/mail";
import { sameOrigin } from "@/lib/reports";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (rateLimited(`goatintel-request:${ip}`)) {
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
    name?: unknown;
    email?: unknown;
  };
  if (typeof body.idToken !== "string") return jsonCors(request, { error: "invalid" }, 400);

  let claims: { uid: string; username: string };
  try {
    claims = await verifyFirebaseIdToken(body.idToken);
  } catch (error) {
    if (error instanceof FirebaseTokenError && error.code === "unavailable") {
      return jsonCors(request, { error: "unavailable" }, 503);
    }
    return jsonCors(request, { error: "invalid" }, 401);
  }

  let staged;
  try {
    staged = await stageAccessRequest({
      uid: claims.uid,
      username: claims.username,
      name: cleanName(body.name),
      email: cleanEmail(body.email),
      ip,
      origin: sameOrigin(request, "/").origin,
    });
  } catch (error) {
    if (error instanceof AccessStoreError && error.code === "missing") {
      return jsonCors(request, { error: "missing" }, 400);
    }
    console.error("GOATINTEL store", error instanceof Error ? error.message : "store");
    return jsonCors(request, { error: "store" }, 503);
  }

  if (staged.mailed && staged.approveUrl && staged.denyUrl) {
    try {
      await sendPlainEmail({
        to: mailInbox(),
        subject: "GOAT Intel access request",
        text: accessRequestText({
          name: staged.name,
          email: staged.email,
          username: staged.username,
          phone: staged.phone,
          organization: staged.organization,
          firstName: staged.firstName,
          lastName: staged.lastName,
          ip,
          approveUrl: staged.approveUrl,
          denyUrl: staged.denyUrl,
        }),
      });
    } catch {
      await rollbackAccessRequest(claims.uid, staged.previous).catch((error) => {
        console.error("GOATINTEL rollback", error instanceof Error ? error.message : "rollback");
      });
      return jsonCors(request, { error: "mail" }, 503);
    }
    await noticeAccount(request, {
      action: "Requested GOAT Intel",
      name: staged.name,
      email: staged.email,
      username: staged.username,
      phone: staged.phone,
      organization: staged.organization,
    });
  }

  return jsonCors(request, { status: staged.status, mailed: staged.mailed }, staged.mailed ? 201 : 200);
}
