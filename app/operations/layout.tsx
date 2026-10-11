import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Operations",
  description:
    "Active GOAT Initiative operations along the border, including intelligence collection, special interest alien tracking, and evidence documentation.",
  path: "/operations",
});

export default function OperationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
