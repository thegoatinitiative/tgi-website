import { jsonCors, preflight } from "@/lib/goatintel-cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function OPTIONS(request: Request) {
  return preflight(request);
}

/** Public self-signup is closed. Staff issue GOAT Intel logins. */
export function POST(request: Request) {
  return jsonCors(request, { error: "closed" }, 403);
}
