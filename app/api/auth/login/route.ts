import { NextResponse } from "next/server";
import { noticeAccount } from "@/lib/account-notice";
import { cleanEmail, cleanPassword, clientKey, rateLimited } from "@/lib/auth-messages";
import { findMemberByEmail } from "@/lib/members";
import { safeNext, sameOrigin } from "@/lib/reports";
import {
  COOKIE,
  cookieOptions,
  createSessionToken,
  hashPassword,
  verifyPassword,
} from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function back(request: Request, code: string, next: string) {
  const url = sameOrigin(request, "/login");
  url.searchParams.set("error", code);
  url.searchParams.set("next", next);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const next = safeNext(form.get("next"));
  if (rateLimited(clientKey(request, "login"))) return back(request, "rate", next);

  const email = cleanEmail(form.get("email"));
  const password = cleanPassword(form.get("password"));
  if (!email || typeof password !== "string") return back(request, "credentials", next);

  const member = await findMemberByEmail(email);
  const matches = member
    ? await verifyPassword(password, member.passwordHash)
    : await hashPassword(password).then(() => false);
  if (!member || !matches) return back(request, "credentials", next);

  try {
    const dest = member.confirmedAt ? next : "/account";
    await noticeAccount(request, { action: "Signed in", name: member.name, email: member.email });
    const response = NextResponse.redirect(sameOrigin(request, dest), 303);
    response.cookies.set(COOKIE, createSessionToken(member.id), cookieOptions());
    return response;
  } catch (error) {
    if (error instanceof Error && error.message.includes("TGI_SESSION_SECRET")) {
      return back(request, "config", next);
    }
    throw error;
  }
}
