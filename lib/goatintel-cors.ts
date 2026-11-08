import { NextResponse } from "next/server";

const ALLOWED = new Set(["https://goatintel.com", "https://www.goatintel.com"]);

export function corsHeaders(request: Request): Headers {
  const headers = new Headers();
  const origin = request.headers.get("origin");
  if (origin && ALLOWED.has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  }
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
  headers.set("Access-Control-Max-Age", "86400");
  headers.set("Cache-Control", "no-store");
  return headers;
}

export function preflight(request: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) });
}

export function jsonCors(request: Request, body: unknown, status: number) {
  const headers = corsHeaders(request);
  headers.set("Content-Type", "application/json");
  return new NextResponse(JSON.stringify(body), { status, headers });
}
