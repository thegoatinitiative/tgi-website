import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our Mission",
  description:
    "The mission of The GOAT Initiative: collect border intelligence, identify special interest aliens, and share findings with law enforcement.",
  path: "/mission",
});

export default function MissionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
