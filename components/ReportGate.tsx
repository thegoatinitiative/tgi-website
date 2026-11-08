import Link from "next/link";

export function ReportGate({
  title,
  reason,
  nextPath,
}: {
  title: string;
  reason: "signed-out" | "unconfirmed" | "locked";
  nextPath: string;
}) {
  const join = `/join?next=${encodeURIComponent(nextPath)}`;
  const login = `/login?next=${encodeURIComponent(nextPath)}`;

  return (
    <div className="min-h-screen py-16">
      <section className="max-w-3xl mx-auto px-4">
        <Link
          href="/intel"
          className="inline-flex items-center gap-2 font-mono text-xs text-primary tracking-widest mb-8 hover:underline"
        >
          INTEL UPDATES
        </Link>
        <p className="text-sm text-primary mb-3">Field report</p>
        <h1 className="text-2xl md:text-3xl font-medium text-gray-50 leading-snug mb-4">
          {title}
        </h1>
        {reason === "signed-out" ? (
          <>
            <p className="text-gray-300 leading-relaxed mb-8">
              Create an account and confirm your email. This report opens when The GOAT Initiative releases it.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={join}
                className="px-5 py-2.5 bg-primary text-dark font-medium text-sm"
              >
                Sign up
              </Link>
              <Link
                href={login}
                className="px-5 py-2.5 border border-primary/40 text-primary font-medium text-sm"
              >
                Sign in
              </Link>
            </div>
          </>
        ) : reason === "unconfirmed" ? (
          <>
            <p className="text-gray-300 leading-relaxed mb-8">
              Confirm the email we sent you. After that, this report opens when The GOAT Initiative releases it.
            </p>
            <Link href="/account" className="px-5 py-2.5 bg-primary text-dark font-medium text-sm">
              Confirm email
            </Link>
          </>
        ) : (
          <>
            <p className="text-gray-300 leading-relaxed mb-8">
              This report is still locked. It opens for every confirmed member when The GOAT Initiative releases it.
            </p>
            <Link href="/intel" className="text-primary text-sm">
              Back to Intel Updates
            </Link>
          </>
        )}
        <p className="text-gray-300 leading-relaxed mt-8">
          Detailed files are a separate account on{" "}
          <a href="https://goatintel.vercel.app/" className="text-primary hover:underline">GOAT Intel</a>.
          That account stays closed until it is approved.
        </p>
      </section>
    </div>
  );
}
