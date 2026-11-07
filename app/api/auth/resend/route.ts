import { NextResponse } from "next/server";
import { clientKey, rateLimited } from "@/lib/auth-messages";
import { sendConfirmation } from "@/lib/mail";
import { findMemberById, setConfirmToken, newConfirmToken } from "@/lib/members";
import { sameOrigin } from "@/lib/reports";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.redirect(sameOrigin(request, "/login?next=/account"), 303);
  const dest = sameOrigin(request, "/account");
  if (session.confirmed) return NextResponse.redirect(dest, 303);
  if (rateLimited(clientKey(request, "resend"), 5)) {
    dest.searchParams.set("error", "rate");
    return NextResponse.redirect(dest, 303);
  }

  const member = await findMemberById(session.id);
  if (!member) return NextResponse.redirect(sameOrigin(request, "/login?next=/account"), 303);
  const issued = newConfirmToken();
  const saved = await setConfirmToken(member.id, issued.hash, issued.expires);
  if (!saved) return NextResponse.redirect(dest, 303);

  const link = sameOrigin(request, `/api/auth/confirm?token=${encodeURIComponent(issued.token)}`);
  try {
    const sent = await sendConfirmation({
      memberId: member.id,
      to: member.email,
      name: member.name,
      url: link.toString(),
    });
    if (sent === "local") dest.searchParams.set("error", "mail");
    else dest.searchParams.set("sent", "1");
  } catch (error) {
    console.error("Confirmation email was not sent.", error instanceof Error ? error.message : "mail");
    dest.searchParams.set("error", "mail");
  }
  return NextResponse.redirect(dest, 303);
}
