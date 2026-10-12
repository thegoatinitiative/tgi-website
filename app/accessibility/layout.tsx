import type { Metadata } from "next";
import { PageFrame } from "@/components/PageFrame";
import { pageMetadata } from "@/lib/seo";

const description = "Accessibility statement for the website of The GOAT Initiative.";

export const metadata: Metadata = pageMetadata({
  title: "Accessibility",
  description,
  path: "/accessibility",
});

export default function AccessibilityLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageFrame path="/accessibility" name="Accessibility" description={description}>
      {children}
    </PageFrame>
  );
}
