import { clientIp } from "@/lib/account-notice";
import { rateLimited } from "@/lib/auth-messages";
import { authEmailForUsername } from "@/lib/goatintel-access";
import { jsonCors, preflight } from "@/lib/goatintel-cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const USERNAME = /^[a-z0-9][a-z0-9._-]{1,31}$/;
const DOMAIN = "@intelportal.app";

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function POST(request: Request) {
  if (rateLimited(`goatintel-auth-email:${clientIp(request)}`, 40)) {
    return jsonCors(request, { error: "rate" }, 429);
  }
  let payload: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 200) return jsonCors(request, { error: "invalid" }, 400);
    payload = JSON.parse(raw);
  } catch {
    return jsonCors(request, { error: "invalid" }, 400);
  }
  const username = payload && typeof payload === "object" ? (payload as { username?: unknown }).username : null;
  if (typeof username !== "string" || !USERNAME.test(username.trim().toLowerCase())) {
    return jsonCors(request, { error: "invalid" }, 400);
  }
  const normalized = username.trim().toLowerCase();
  try {
    const saved = await authEmailForUsername(normalized);
    const email = saved && saved.endsWith(DOMAIN) ? saved : `${normalized}${DOMAIN}`;
    return jsonCors(request, { email }, 200);
  } catch {
    return jsonCors(request, { error: "store" }, 503);
  }
}
