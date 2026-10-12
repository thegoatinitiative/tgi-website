import type { Metadata } from "next";
import { PageFrame } from "@/components/PageFrame";
import { operativesFaq } from "@/lib/faqs";
import { SITE_URL, pageMetadata } from "@/lib/seo";

const description =
  "Leadership of The GOAT Initiative: founder Cory Gautereaux, vice president Dan Conchas, board secretary Tayler James, and Hels Apffel.";

const people: { id: string; name: string; jobTitle: string; sameAs?: string[] }[] = [
  {
    id: "cory-gautereaux",
    name: "Cory Gautereaux",
    jobTitle: "Founder and President",
    sameAs: ["https://x.com/thecorygoat", "https://thecorygoat.substack.com"],
  },
  { id: "dan-conchas", name: "Dan Conchas", jobTitle: "Vice President" },
  { id: "tayler-james", name: "Tayler James", jobTitle: "Board Secretary" },
  { id: "hels-apffel", name: "Hels Apffel", jobTitle: "Director of Strategic Intelligence" },
];

export const metadata: Metadata = pageMetadata({
  title: "Cory Gautereaux and Leadership",
  description,
  path: "/operatives",
});

export default function OperativesLayout({ children }: { children: React.ReactNode }) {
  const extra = people.map((person) => ({
    "@type": "Person",
    "@id": `${SITE_URL}/operatives#${person.id}`,
    name: person.name,
    jobTitle: person.jobTitle,
    url: `${SITE_URL}/operatives#${person.id}`,
    worksFor: { "@id": `${SITE_URL}/#organization` },
    ...(person.sameAs ? { sameAs: person.sameAs } : {}),
  }));

  return (
    <PageFrame
      path="/operatives"
      name="Leadership"
      description={description}
      faq={operativesFaq}
      extra={extra}
    >
      {children}
    </PageFrame>
  );
}
