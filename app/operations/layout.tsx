import type { Metadata } from "next";
import { PageFrame } from "@/components/PageFrame";
import { operationsFaq } from "@/lib/faqs";
import { pageMetadata } from "@/lib/seo";

const description =
  "How The GOAT Initiative reports child trafficking, human trafficking, and other border intelligence to law enforcement.";

export const metadata: Metadata = pageMetadata({
  title: "Border Operations",
  description,
  path: "/operations",
});

export default function OperationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageFrame path="/operations" name="Operations" description={description} faq={operationsFaq}>
      {children}
    </PageFrame>
  );
}
