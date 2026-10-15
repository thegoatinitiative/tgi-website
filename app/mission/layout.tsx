import type { Metadata } from "next";
import { PageFrame } from "@/components/PageFrame";
import { missionFaq } from "@/lib/faqs";
import { pageMetadata } from "@/lib/seo";

const description =
  "The GOAT Initiative documents child trafficking and human trafficking on the southern border, along with other border intelligence, and shares those findings with law enforcement.";

export const metadata: Metadata = pageMetadata({
  title: "Trafficking and Border Intelligence",
  description,
  path: "/mission",
});

export default function MissionLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageFrame path="/mission" name="Mission" description={description} faq={missionFaq}>
      {children}
    </PageFrame>
  );
}
