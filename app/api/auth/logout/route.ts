import { NextResponse } from "next/server";
import { sameOrigin } from "@/lib/reports";
import { COOKIE, cookieOptions } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const response = NextResponse.redirect(sameOrigin(request, "/"), 303);
  response.cookies.set(COOKIE, "", cookieOptions(0));
  return response;
}
