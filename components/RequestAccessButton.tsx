import Link from "next/link";

export const requestAccessClass =
  "inline-flex w-full items-center justify-center bg-primary px-8 py-6 text-center font-heading text-xl font-bold tracking-widest text-dark transition-colors hover:bg-primary/90 sm:w-auto sm:px-16 sm:py-7 sm:text-2xl";

export function RequestAccessButton({ className = "" }: { className?: string }) {
  return (
    <Link href="/intel/portal" className={`${requestAccessClass} ${className}`.trim()}>
      REQUEST ACCESS
    </Link>
  );
}
