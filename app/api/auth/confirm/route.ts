import { NextResponse } from "next/server";
import { noticeAccount } from "@/lib/account-notice";
import { confirmByToken } from "@/lib/members";
import { sameOrigin } from "@/lib/reports";
import { COOKIE, cookieOptions, createSessionToken } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") || "";
  const member = await confirmByToken(token);
  if (!member) {
    const url = sameOrigin(request, "/login");
    url.searchParams.set("error", "confirm");
    url.searchParams.set("next", "/account");
    const response = NextResponse.redirect(url, 303);
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  }
  await noticeAccount(request, { action: "Confirmed email", name: member.name, email: member.email });
  const response = NextResponse.redirect(sameOrigin(request, "/intel"), 303);
  response.cookies.set(COOKIE, createSessionToken(member.id), cookieOptions());
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
