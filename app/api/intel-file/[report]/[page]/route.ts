import { readFile } from "fs/promises";
import path from "path";
import { get, BlobNotFoundError } from "@vercel/blob";
import { NextResponse } from "next/server";
import { reportAccess } from "@/lib/access";
import { FER_PUBLIC_PAGES } from "@/lib/fer-ch6i";
import { IIR_1101_PAGES } from "@/lib/iir-1101";
import { usesBlobStore } from "@/lib/members";
import { isReportId } from "@/lib/reports";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGES: Record<string, ReadonlySet<number>> = {
  "iphone-11": new Set(IIR_1101_PAGES),
  "tecno-ch6i": new Set(FER_PUBLIC_PAGES),
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ report: string; page: string }> }
) {
  const { report, page } = await context.params;
  if (!isReportId(report)) return new NextResponse(null, { status: 404 });
  const pageNumber = Number(page);
  if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > 99) {
    return new NextResponse(null, { status: 404 });
  }

  const access = await reportAccess(report);
  if (!access.ok) {
    return new NextResponse(null, { status: access.reason === "signed-out" ? 401 : 403 });
  }
  if (!PAGES[report].has(pageNumber)) return new NextResponse(null, { status: 404 });

  const name = `page-${String(pageNumber).padStart(2, "0")}.jpg`;
  const headers = {
    "Content-Type": "image/jpeg",
    "Cache-Control": "private, no-store",
    Vary: "Cookie",
    "X-Content-Type-Options": "nosniff",
  };

  if (usesBlobStore()) {
    try {
      const blob = await get(`intel/${report}/${name}`, { access: "private" });
      if (!blob || blob.statusCode !== 200 || !blob.stream) return new NextResponse(null, { status: 404 });
      return new NextResponse(blob.stream, { headers });
    } catch (error) {
      if (error instanceof BlobNotFoundError) return new NextResponse(null, { status: 404 });
      throw error;
    }
  }

  const file = path.join(process.cwd(), "content", "intel", report, name);
  try {
    const bytes = await readFile(file);
    return new NextResponse(new Uint8Array(bytes), { headers });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
