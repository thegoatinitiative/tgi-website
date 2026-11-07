import { NextResponse } from "next/server";
import { MemberStoreError, unlockNext } from "@/lib/members";
import { sameOrigin } from "@/lib/reports";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(sameOrigin(request, "/login?next=/account"), 303);
  }
  if (!session.staff) {
    return NextResponse.redirect(sameOrigin(request, "/account?error=staff"), 303);
  }

  const form = await request.formData();
  const expected = String(form.get("expected") || "");
  try {
    const result = await unlockNext(expected);
    const code = result.ok ? "" : result.code;
    const url = sameOrigin(request, "/account");
    if (code) url.searchParams.set("error", code);
    return NextResponse.redirect(url, 303);
  } catch (error) {
    if (error instanceof MemberStoreError) {
      return NextResponse.redirect(sameOrigin(request, "/account?error=store"), 303);
    }
    throw error;
  }
}
