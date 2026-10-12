import type { Metadata } from "next";
import { PageFrame } from "@/components/PageFrame";
import { pageMetadata } from "@/lib/seo";

const description =
  "Privacy policy for The GOAT Initiative website, including what the site collects and how that information is used.";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description,
  path: "/privacy",
});

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageFrame path="/privacy" name="Privacy Policy" description={description}>
      {children}
    </PageFrame>
  );
}
