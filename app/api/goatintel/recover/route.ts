import { clientIp } from "@/lib/account-notice";
import { rateLimited } from "@/lib/auth-messages";
import { AccessStoreError, recoveryText, rollbackAccessRequest, stageRecovery } from "@/lib/goatintel-access";
import { jsonCors, preflight } from "@/lib/goatintel-cors";
import { sendPlainEmail } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function POST(request: Request) {
  if (rateLimited(`goatintel-recover:${clientIp(request)}`)) {
    return jsonCors(request, { error: "rate" }, 429);
  }
  let payload: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 2000) return jsonCors(request, { error: "invalid" }, 400);
    payload = JSON.parse(raw);
  } catch {
    return jsonCors(request, { error: "invalid" }, 400);
  }
  const account = (payload && typeof payload === "object" ? (payload as { account?: unknown }).account : null);
  if (typeof account !== "string" || account.trim().length < 2 || account.length > 254) {
    return jsonCors(request, { error: "invalid" }, 400);
  }

  let staged;
  try {
    staged = await stageRecovery(account);
  } catch (error) {
    console.error("GOATINTEL recover", error instanceof AccessStoreError ? error.code : "store");
    return jsonCors(request, { error: "store" }, 503);
  }

  if (staged.mailed && staged.email && staged.username && staged.recoverUrl && staged.uid) {
    try {
      await sendPlainEmail({
        to: staged.email,
        subject: "Your GOAT Intel sign-in",
        text: recoveryText(staged.username, staged.recoverUrl),
      });
    } catch {
      await rollbackAccessRequest(staged.uid, staged.previous).catch((error) => {
        console.error("GOATINTEL recover rollback", error instanceof AccessStoreError ? error.code : "rollback");
      });
      return jsonCors(request, { error: "mail" }, 503);
    }
  }

  return jsonCors(request, { ok: true }, 200);
}
