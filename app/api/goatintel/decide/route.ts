import { NextResponse } from "next/server";
import { decideAccess } from "@/lib/goatintel-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGES = {
  approved: ["Approved", "That GOAT Intel account can open detailed files."],
  denied: ["Denied", "That account stays closed."],
  expired: [
    "Link expired",
    "This link has expired. The request is still waiting. They can send it again from GOAT Intel.",
  ],
  invalid: ["Link invalid", "This link is invalid or was already used."],
} as const;

function page(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="referrer" content="no-referrer">
  <title>${title}</title>
</head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0a0f;color:#e5e7eb;font-family:Inter,system-ui,sans-serif">
  <main style="max-width:32rem;padding:2rem">
    <h1 style="font-size:1.6rem;letter-spacing:0.04em;color:#00d4ff">${title}</h1>
    <p style="line-height:1.6">${body}</p>
  </main>
</body>
</html>`;
}

function html(title: string, body: string, status: number) {
  const response = new NextResponse(page(title, body), {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
      "X-Robots-Tag": "noindex",
    },
  });
  return response;
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") || "";
  try {
    const result = await decideAccess(token);
    const [title, body] = PAGES[result];
    return html(title, body, 200);
  } catch (error) {
    console.error("GOATINTEL decide", error instanceof Error ? error.message : "decide");
    return html("Not saved", "The decision was not saved. Open the link again in a minute.", 503);
  }
}
