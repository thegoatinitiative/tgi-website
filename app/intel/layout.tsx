import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Reports",
  description:
    "Reports from The GOAT Initiative, from the U.S.–Mexico border.",
  path: "/intel",
});

export default function IntelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
