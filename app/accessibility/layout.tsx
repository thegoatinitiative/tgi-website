import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Accessibility",
  description: "Accessibility statement for the website of The GOAT Initiative.",
  path: "/accessibility",
});

export default function AccessibilityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
