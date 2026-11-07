import { NextResponse } from "next/server";
import {
  cleanEmail,
  cleanName,
  cleanPassword,
  clientKey,
  rateLimited,
} from "@/lib/auth-messages";
import { noticeAccount } from "@/lib/account-notice";
import { sendConfirmation } from "@/lib/mail";
import { createMember, MemberStoreError, newConfirmToken } from "@/lib/members";
import { safeNext, sameOrigin } from "@/lib/reports";
import { COOKIE, cookieOptions, createSessionToken, hashPassword } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function back(request: Request, code: string, next: string) {
  const url = sameOrigin(request, "/join");
  url.searchParams.set("error", code);
  url.searchParams.set("next", next);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const next = safeNext(form.get("next"));
  if (rateLimited(clientKey(request, "signup"))) return back(request, "rate", next);

  const name = cleanName(form.get("name"));
  const email = cleanEmail(form.get("email"));
  const password = cleanPassword(form.get("password"));
  if (!name || !email) return back(request, name ? "email" : "missing", next);
  if (typeof password !== "string") return back(request, password.error === "missing" ? "missing" : password.error, next);

  try {
    const issued = newConfirmToken();
    const member = await createMember({
      name,
      email,
      passwordHash: await hashPassword(password),
      confirmTokenHash: issued.hash,
      confirmExpires: issued.expires,
    });
    const link = sameOrigin(request, `/api/auth/confirm?token=${encodeURIComponent(issued.token)}`);
    const sent = await sendConfirmation({
      memberId: member.id,
      to: member.email,
      name: member.name,
      url: link.toString(),
    });
    const dest = sameOrigin(request, "/account");
    if (sent === "local") dest.searchParams.set("error", "mail");
    await noticeAccount(request, { action: "Signed up", name: member.name, email: member.email });
    const response = NextResponse.redirect(dest, 303);
    response.cookies.set(COOKIE, createSessionToken(member.id), cookieOptions());
    return response;
  } catch (error) {
    if (error instanceof MemberStoreError) {
      return back(request, error.code === "taken" ? "taken" : "store", next);
    }
    if (error instanceof Error && error.message.includes("TGI_SESSION_SECRET")) {
      return back(request, "config", next);
    }
    throw error;
  }
}
