import type { Metadata } from "next";
import { PageFrame } from "@/components/PageFrame";
import { donateFaq } from "@/lib/faqs";
import { SITE_URL, pageMetadata } from "@/lib/seo";

const description =
  "Donate to The GOAT Initiative, a 501(c)(3) nonprofit. Gifts are tax deductible under EIN 99-3753614 and fund field operations.";

export const metadata: Metadata = pageMetadata({
  title: "Donate",
  description,
  path: "/donate",
});

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageFrame
      path="/donate"
      name="Donate"
      description={description}
      faq={donateFaq}
      extra={[
        {
          "@type": "DonateAction",
          name: "Donate to The GOAT Initiative",
          target: "https://donorbox.org/the-goat-initiative",
          recipient: { "@id": `${SITE_URL}/#organization` },
        },
      ]}
    >
      {children}
    </PageFrame>
  );
}
