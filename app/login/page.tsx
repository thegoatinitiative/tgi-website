import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageFrame } from "@/components/PageFrame";
import { AUTH_ERRORS } from "@/lib/auth-messages";
import { safeNext } from "@/lib/reports";
import { pageMetadata } from "@/lib/seo";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

const description = "Sign in to read field reports released by The GOAT Initiative.";

export const metadata: Metadata = pageMetadata({
  title: "Sign in",
  description,
  path: "/login",
});

const inputClass =
  "w-full bg-dark border border-gray-700 px-4 py-3 text-gray-100 rounded-sm focus:border-primary focus:outline-none";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = safeNext(params.next);
  const session = await getSession();
  if (session && !session.confirmed) redirect("/account");
  if (session) redirect(next);
  const error = params.error ? AUTH_ERRORS[params.error] : "";

  return (
    <PageFrame path="/login" name="Sign in" description={description}>
      <section className="py-16">
        <div className="max-w-lg mx-auto px-4">
          <p className="font-mono text-xs text-primary tracking-widest mb-4">FIELD REPORTS</p>
          <h1 className="font-heading text-4xl text-gray-100 tracking-wider mb-4">
            SIGN <span className="text-primary">IN</span>
          </h1>
          <p className="text-gray-400 leading-relaxed mb-8">
            Signed-in members can open each report after it is released.
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
            <button
              type="submit"
              className="w-full py-3 bg-primary text-dark font-heading text-sm tracking-wider"
            >
              SIGN IN
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-6">
            Need an account?{" "}
            <Link href={`/join?next=${encodeURIComponent(next)}`} className="text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </PageFrame>
  );
}
