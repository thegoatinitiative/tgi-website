import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Donate",
  description:
    "Donate to The GOAT Initiative, a 501(c)(3) nonprofit. Gifts are tax deductible under EIN 99-3753614 and fund field operations.",
  path: "/donate",
});

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
