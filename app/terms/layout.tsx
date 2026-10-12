import type { Metadata } from "next";
import { PageFrame } from "@/components/PageFrame";
import { pageMetadata } from "@/lib/seo";

const description = "Terms of service for using the website of The GOAT Initiative.";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description,
  path: "/terms",
});

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageFrame path="/terms" name="Terms of Service" description={description}>
      {children}
    </PageFrame>
  );
}
