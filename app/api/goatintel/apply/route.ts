import { NextResponse } from "next/server";
import { clientIp, noticeAccount } from "@/lib/account-notice";
import { cleanEmail, cleanName, cleanOrganization, cleanPhone, rateLimited } from "@/lib/auth-messages";
import {
  AccessStoreError,
  accessRequestText,
  applicantSetupText,
  rollbackAccessRequest,
  stagePortalRequest,
} from "@/lib/goatintel-access";
import { mailInbox, sendPlainEmail } from "@/lib/mail";
import { sameOrigin } from "@/lib/reports";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE_ORIGINS = new Set([
  "https://www.thegoatinitiative.org",
  "https://thegoatinitiative.org",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

function json(body: unknown, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && !SITE_ORIGINS.has(origin)) return json({ error: "invalid" }, 403);
  const ip = clientIp(request);
  if (rateLimited(`goatintel-apply:${ip}`)) return json({ error: "rate" }, 429);

  let payload: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 8000) return json({ error: "invalid" }, 400);
    payload = JSON.parse(raw);
  } catch {
    return json({ error: "invalid" }, 400);
  }
  const body = (payload && typeof payload === "object" ? payload : {}) as {
    firstName?: unknown;
    lastName?: unknown;
    email?: unknown;
    phone?: unknown;
    organization?: unknown;
  };
  const firstName = cleanName(body.firstName);
  const lastName = cleanName(body.lastName);
  const email = cleanEmail(body.email);
  const phone = cleanPhone(body.phone);
  const organization = cleanOrganization(body.organization);
  if (!firstName || !lastName || !email || !phone || !organization) return json({ error: "invalid" }, 400);

  let staged;
  try {
    staged = await stagePortalRequest({
      firstName,
      lastName,
      email,
      phone,
      organization,
      ip,
      origin: sameOrigin(request, "/").origin,
    });
  } catch (error) {
    if (error instanceof AccessStoreError && error.code === "rate") return json({ error: "rate" }, 429);
    if (error instanceof AccessStoreError) return json({ error: "store" }, 503);
    console.error("GOATINTEL apply", error instanceof Error ? error.message : "apply");
    return json({ error: "store" }, 503);
  }

  if (staged.audience === "staff" && staged.approveUrl && staged.denyUrl) {
    try {
      await sendPlainEmail({
        to: mailInbox(),
        subject: "GOAT Intel access request",
        text: accessRequestText({
          name: staged.name,
          email: staged.email,
          username: staged.username,
          phone: staged.phone,
          organization: staged.organization,
          firstName: staged.firstName,
          lastName: staged.lastName,
          ip,
          approveUrl: staged.approveUrl,
          denyUrl: staged.denyUrl,
        }),
      });
    } catch {
      await rollbackAccessRequest(staged.uid, staged.previous).catch((error) => {
        console.error("GOATINTEL rollback", error instanceof Error ? error.message : "rollback");
      });
      return json({ error: "mail" }, 503);
    }
    await noticeAccount(request, {
      action: "Requested GOAT Intel",
      name: staged.name,
      email: staged.email,
      phone: staged.phone,
      organization: staged.organization,
    });
  } else if (staged.audience === "applicant" && staged.setupUrl) {
    try {
      await sendPlainEmail({
        to: staged.email,
        subject: "Your GOAT Intel request was approved",
        text: applicantSetupText(staged.setupUrl),
      });
    } catch {
      await rollbackAccessRequest(staged.uid, staged.previous).catch((error) => {
        console.error("GOATINTEL rollback", error instanceof Error ? error.message : "rollback");
      });
      return json({ error: "mail" }, 503);
    }
  }

  return json({ ok: true }, 200);
}
