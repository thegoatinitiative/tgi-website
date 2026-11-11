import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageFrame } from "@/components/PageFrame";
import { AUTH_ERRORS } from "@/lib/auth-messages";
import { safeNext } from "@/lib/reports";
import { pageMetadata } from "@/lib/seo";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

const EMAIL_LIST = "https://thecorygoat.substack.com/subscribe";

const description =
  "Sign in to reports with the login you were given, or join the email list. The email list does not use a password.";

export const metadata: Metadata = pageMetadata({
  title: "Reports or email list",
  description,
  path: "/login",
});

const inputClass =
  "w-full bg-dark border border-gray-700 px-4 py-3 text-gray-100 rounded-sm focus:border-primary focus:outline-none";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; account?: string }>;
}) {
  const params = await searchParams;
  const next = safeNext(params.next);
  const session = await getSession();
  if (session && !session.confirmed) redirect("/account");
  if (session) redirect(next);
  const error = params.error ? AUTH_ERRORS[params.error] : "";
  const reportAccount = Boolean(params.next || params.error || params.account === "1");

  return (
    <PageFrame path="/login" name="Reports or email list" description={description}>
      <section className="py-16">
        <div className="max-w-lg mx-auto px-4">
          {reportAccount ? (
            <ReportAccountForm next={next} error={error} />
          ) : (
            <>
              <h1 className="font-heading text-4xl text-gray-100 tracking-wider mb-4">
                <span className="text-primary">REPORTS</span>
              </h1>
              <p className="text-gray-400 leading-relaxed mb-8">
                One set of reports. Use the login you were given. The email list does not open them.
              </p>
              <div className="space-y-4">
                <Link href="/login?account=1" className="block border border-primary/30 bg-dark-100/80 p-6">
                  <p className="font-mono text-xs text-primary tracking-widest mb-3">THIS WEBSITE</p>
                  <h2 className="font-heading text-2xl text-gray-100 tracking-wider mb-3">Reports</h2>
                  <p className="text-gray-400 leading-relaxed mb-5">
                    Email and password for a report released on this website.
                  </p>
                  <span className="block w-full py-3 bg-primary text-dark font-heading text-sm tracking-wider text-center">
                    OPEN
                  </span>
                </Link>
                <a href="https://goatintel.com/" className="block border border-primary/30 bg-dark-100/80 p-6">
                  <p className="font-mono text-xs text-primary tracking-widest mb-3">APPROVAL USERNAME</p>
                  <h2 className="font-heading text-2xl text-gray-100 tracking-wider mb-3">Reports</h2>
                  <p className="text-gray-400 leading-relaxed mb-5">
                    Use the username from your approval email. This opens the files that go with a report.
                  </p>
                  <span className="block w-full py-3 bg-primary text-dark font-heading text-sm tracking-wider text-center">
                    SIGN IN
                  </span>
                </a>
                <a href={EMAIL_LIST} className="block border border-primary/30 bg-dark-100/80 p-6">
                  <p className="font-mono text-xs text-primary tracking-widest mb-3">NO PASSWORD</p>
                  <h2 className="font-heading text-2xl text-gray-100 tracking-wider mb-3">Email list</h2>
                  <p className="text-gray-400 leading-relaxed mb-5">
                    Get the briefings by email. This does not open the reports.
                  </p>
                  <span className="block w-full py-3 border border-primary text-primary font-heading text-sm tracking-wider text-center">
                    JOIN THE LIST
                  </span>
                </a>
              </div>
            </>
          )}
        </div>
      </section>
    </PageFrame>
  );
}

function ReportAccountForm({ next, error }: { next: string; error: string }) {
  return (
    <>
      <p className="font-mono text-xs text-primary tracking-widest mb-4">REPORT ACCOUNT</p>
      <h1 className="font-heading text-4xl text-gray-100 tracking-wider mb-4">
        OPEN A <span className="text-primary">REPORT</span>
      </h1>
      <p className="text-gray-400 leading-relaxed mb-8">
        This email and password opens a released report on this website. It does not use the approval username, and it does not join the email list.
      </p>
      <form action="/api/auth/login" method="post" className="space-y-4 bg-dark-100/80 border border-primary/20 p-6">
        <input type="hidden" name="next" value={next} />
        <label className="block">
          <span className="block font-mono text-[10px] text-gray-500 tracking-widest mb-2">EMAIL</span>
          <input name="email" type="email" required autoComplete="email" className={inputClass} />
        </label>
        <label className="block">
          <span className="block font-mono text-[10px] text-gray-500 tracking-widest mb-2">PASSWORD</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className={inputClass}
          />
        </label>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button type="submit" className="w-full py-3 bg-primary text-dark font-heading text-sm tracking-wider">
          OPEN REPORTS
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-6">
        Need an account?{" "}
        <Link href={`/join?next=${encodeURIComponent(next)}`} className="text-primary">
          Sign up
        </Link>
      </p>
      <p className="text-sm text-gray-500 mt-3">
        <a href="https://goatintel.com/" className="text-primary">
          Approval username
        </a>
        {" · "}
        <a href={EMAIL_LIST} className="text-primary">
          Email list
        </a>
      </p>
    </>
  );
}
