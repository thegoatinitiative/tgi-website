import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageFrame } from "@/components/PageFrame";
import { AUTH_ERRORS } from "@/lib/auth-messages";
import { safeNext } from "@/lib/reports";
import { pageMetadata } from "@/lib/seo";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

const description =
  "Create an account to read field reports from The GOAT Initiative as each report is released.";

export const metadata: Metadata = pageMetadata({
  title: "Sign up to read reports",
  description,
  path: "/join",
});

const inputClass =
  "w-full bg-dark border border-gray-700 px-4 py-3 text-gray-100 rounded-sm focus:border-primary focus:outline-none";

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = safeNext(params.next);
  const session = await getSession();
  if (session?.confirmed) redirect(next);
  if (session) redirect("/account");
  const error = params.error ? AUTH_ERRORS[params.error] : "";

  return (
    <PageFrame path="/join" name="Sign up" description={description}>
      <section className="py-16">
        <div className="max-w-lg mx-auto px-4">
          <p className="font-mono text-xs text-primary tracking-widest mb-4">FIELD REPORTS</p>
          <h1 className="font-heading text-4xl text-gray-100 tracking-wider mb-4">
            SIGN <span className="text-primary">UP</span>
          </h1>
          <p className="text-gray-400 leading-relaxed mb-8">
            This account opens a released report on this website. We email you a confirmation link. It does not add you to the email list.
          </p>
          <form action="/api/auth/signup" method="post" className="space-y-4 bg-dark-100/80 border border-primary/20 p-6">
            <input type="hidden" name="next" value={next} />
            <label className="block">
              <span className="block font-mono text-[10px] text-gray-500 tracking-widest mb-2">NAME</span>
              <input name="name" required autoComplete="name" className={inputClass} />
            </label>
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
                minLength={10}
                autoComplete="new-password"
                className={inputClass}
              />
              <span className="block text-xs text-gray-600 mt-2">At least 10 characters.</span>
            </label>
            {error ? <p className="text-sm text-red-300">{error}</p> : null}
            <button
              type="submit"
              className="w-full py-3 bg-primary text-dark font-heading text-sm tracking-wider"
            >
              CREATE ACCOUNT
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-primary">
              Sign in
            </Link>
          </p>
          <p className="text-sm text-gray-500 mt-3">
            <a href="https://thecorygoat.substack.com/subscribe" className="text-primary">
              Join the email list
            </a>
            {" · "}
            <a href="https://goatintel.com/" className="text-primary">
              Intel reports login
            </a>
          </p>
        </div>
      </section>
    </PageFrame>
  );
}
