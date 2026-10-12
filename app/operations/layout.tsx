import type { Metadata } from "next";
import { PageFrame } from "@/components/PageFrame";
import { operationsFaq } from "@/lib/faqs";
import { pageMetadata } from "@/lib/seo";

const description =
  "Active GOAT Initiative operations: border intelligence, special interest alien tracking, evidence documentation, and reports to law enforcement.";

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
