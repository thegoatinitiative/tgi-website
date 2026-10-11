import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Leadership",
  description:
    "Leadership of The GOAT Initiative: founder Cory Gautereaux, vice president Dan Conchas, and board secretary Tayler James.",
  path: "/operatives",
});

export default function OperativesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
