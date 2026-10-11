import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Articles and Briefings",
  description:
    "Articles and briefings from The GOAT Initiative on border security, with the latest writing on Substack.",
  path: "/articles",
});

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
