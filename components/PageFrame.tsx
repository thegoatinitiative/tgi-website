import Link from "next/link";
import { FaqList, type FaqItem } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const explore = [
  { href: "/mission", label: "Mission" },
  { href: "/operations", label: "Operations" },
  { href: "/operatives", label: "Leadership" },
  { href: "/media", label: "Video briefings" },
  { href: "/intel", label: "Intel updates" },
  { href: "/articles", label: "Articles" },
  { href: "/donate", label: "Donate" },
  { href: "/contact", label: "Contact" },
];

export function PageFrame({
  path,
  name,
  description,
  faq,
  extra = [],
  children,
}: {
  path: string;
  name: string;
  description: string;
  faq?: FaqItem[];
  extra?: Record<string, unknown>[];
  children: React.ReactNode;
}) {
  const pageUrl = `${SITE_URL}${path}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name, path },
  ];
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: `${name} | ${SITE_NAME}`,
      description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-US",
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.path === "/" ? SITE_URL : `${SITE_URL}${crumb.path}`,
      })),
    },
    ...extra,
  ];

  if (faq?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  const related = explore.filter((item) => item.href !== path).slice(0, 4);

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />
      <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-4 pt-6">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          {crumbs.map((crumb, index) => (
            <li key={crumb.path} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {index === crumbs.length - 1 ? (
                <span className="text-gray-300">{crumb.name}</span>
              ) : (
                <Link href={crumb.path} className="hover:text-primary transition-colors">
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      {children}
      {faq?.length ? <FaqList items={faq} /> : null}
      <section className="pb-16" aria-label="Related pages">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-heading text-sm text-primary tracking-widest mb-4">CONTINUE</h2>
          <ul className="flex flex-wrap gap-3">
            {related.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block px-4 py-2 border border-primary/30 text-sm text-gray-300 hover:text-primary hover:border-primary transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
