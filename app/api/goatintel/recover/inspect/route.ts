import { clientIp } from "@/lib/account-notice";
import { rateLimited } from "@/lib/auth-messages";
import { inspectRecovery } from "@/lib/goatintel-access";
import { jsonCors, preflight } from "@/lib/goatintel-cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function POST(request: Request) {
  if (rateLimited(`goatintel-recover-inspect:${clientIp(request)}`, 30)) {
    return jsonCors(request, { error: "rate" }, 429);
  }
  let payload: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 1000) return jsonCors(request, { error: "invalid" }, 400);
    payload = JSON.parse(raw);
  } catch {
    return jsonCors(request, { error: "invalid" }, 400);
  }
  const token = payload && typeof payload === "object" ? (payload as { token?: unknown }).token : null;
  if (typeof token !== "string") return jsonCors(request, { error: "invalid" }, 400);
  try {
    const result = await inspectRecovery(token);
    if (result === "ok") return jsonCors(request, { ok: true }, 200);
    return jsonCors(request, { error: result }, 400);
  } catch {
    return jsonCors(request, { error: "store" }, 503);
  }
}
