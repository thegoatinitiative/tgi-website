import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageFrame } from "@/components/PageFrame";
import { AUTH_ERRORS } from "@/lib/auth-messages";
import { localConfirmLink } from "@/lib/mail";
import { listUnlocked } from "@/lib/members";
import { REPORTS } from "@/lib/reports";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login?next=/account");
  const params = await searchParams;
  const preview = session.confirmed ? null : await localConfirmLink(session.id);
  const unlocked = await listUnlocked();
  const next = REPORTS.find((report) => !unlocked.includes(report.id));
  const error = params.error ? AUTH_ERRORS[params.error] : "";

  return (
    <PageFrame
      path="/account"
      name="Account"
      description="Your account for field reports released by The GOAT Initiative."
    >
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <p className="font-mono text-xs text-primary tracking-widest mb-4">MEMBER</p>
          <h1 className="font-heading text-4xl text-gray-100 tracking-wider mb-2">{session.name}</h1>
          <p className="text-gray-500 mb-8">{session.email}</p>
          {!session.confirmed ? (
            <div className="border border-primary/30 bg-dark-100/80 p-6 mb-8">
              <h2 className="text-lg font-medium text-gray-50 mb-2">Confirm your email</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We sent a confirmation link to {session.email}. Open it and your account can read each report after it is released.
              </p>
              {params.sent ? <p className="text-sm text-primary mb-4">We sent another confirmation email.</p> : null}
              {error ? <p className="text-sm text-red-300 mb-4">{error}</p> : null}
              {preview ? (
                <p className="text-sm text-gray-300 mb-4">
                  Mail did not go out, so use this link on this computer:{" "}
                  <a href={preview} className="text-primary break-all">Confirm account</a>
                </p>
              ) : null}
              <form action="/api/auth/resend" method="post">
                <button type="submit" className="px-5 py-2.5 bg-primary text-dark font-medium text-sm">
                  Send the email again
                </button>
              </form>
            </div>
          ) : error ? (
            <p className="text-sm text-red-300 mb-6">{error}</p>
          ) : null}

          <div className="space-y-4 mb-10">
            {REPORTS.map((report) => {
              const released = unlocked.includes(report.id);
              return (
                <div key={report.id} className="border border-primary/20 bg-dark-100/80 p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] text-gray-500 tracking-widest mb-2">
                      {released ? "RELEASED" : "LOCKED"} · {report.product}
                    </p>
                    <p className="text-gray-200">{report.title}</p>
                  </div>
                  {(session.staff || (session.confirmed && released)) ? (
                    <Link href={`/intel/${report.id}`} className="text-sm text-primary shrink-0">
                      {released ? "Open" : "Preview"}
                    </Link>
                  ) : (
                    <span className="text-sm text-gray-500 shrink-0">
                      {session.confirmed ? "Locked" : "Confirm email"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {session.staff && next ? (
            <form action="/api/auth/unlock" method="post" className="border border-primary/30 p-6 mb-8">
              <p className="font-mono text-[10px] text-primary tracking-widest mb-3">STAFF</p>
              <p className="text-gray-300 mb-4">
                Next release: {next.title}. Every confirmed member will be able to read it.
              </p>
              <input type="hidden" name="expected" value={next.id} />
              <button type="submit" className="px-6 py-3 bg-primary text-dark font-heading text-sm tracking-wider">
                UNLOCK NEXT
              </button>
            </form>
          ) : null}

          {session.staff && !next ? (
            <p className="text-gray-400 mb-8">Every report is released.</p>
          ) : null}

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/intel" className="text-primary font-heading text-sm tracking-wider">
              INTEL UPDATES
            </Link>
            <form action="/api/auth/logout" method="post">
              <button type="submit" className="text-gray-400 font-heading text-sm tracking-wider hover:text-primary">
                SIGN OUT
              </button>
            </form>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
