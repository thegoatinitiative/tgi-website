import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/mission", label: "Mission" },
  { href: "/operatives", label: "Leadership" },
  { href: "/articles", label: "Articles" },
  { href: "/donate", label: "Donate" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-24 text-center">
      <p className="font-heading text-xs text-primary tracking-widest mb-4">404</p>
      <h1 className="font-heading text-4xl text-gray-100 tracking-wider mb-4">PAGE NOT FOUND</h1>
      <p className="text-gray-400 mb-8">
        That address is not on The GOAT Initiative site. Use one of the pages below.
      </p>
      <ul className="flex flex-wrap justify-center gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-block px-4 py-2 border border-primary/30 text-sm text-gray-300 hover:text-primary hover:border-primary transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
