import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Video Briefings",
  description:
    "Video briefings from The GOAT Initiative on border smuggling, discarded evidence, and risks to homeland security.",
  path: "/media",
});

export default function MediaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
