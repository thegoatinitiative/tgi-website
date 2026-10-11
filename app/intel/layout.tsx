import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Intel Updates",
  description:
    "Intel updates from The GOAT Initiative: field reports and threat briefings from the U.S.–Mexico border.",
  path: "/intel",
});

export default function IntelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
