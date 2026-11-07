import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ signedIn: false });
  return NextResponse.json({ signedIn: true, name: session.name, staff: session.staff });
}
