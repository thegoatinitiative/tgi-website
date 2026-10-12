import type { Metadata } from "next";
import { PageFrame } from "@/components/PageFrame";
import { missionFaq } from "@/lib/faqs";
import { pageMetadata } from "@/lib/seo";

const description =
  "The mission of The GOAT Initiative: collect border intelligence, including in the San Diego sector, and share findings with law enforcement.";

export const metadata: Metadata = pageMetadata({
  title: "Border Intelligence Mission",
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
