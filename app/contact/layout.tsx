import type { Metadata } from "next";
import { PageFrame } from "@/components/PageFrame";
import { contactFaq } from "@/lib/faqs";
import { pageMetadata } from "@/lib/seo";

const description =
  "Contact The GOAT Initiative with questions about the mission or to send a tip. Call 911 first if a crime is in progress.";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description,
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageFrame path="/contact" name="Contact" description={description} faq={contactFaq}>
      {children}
    </PageFrame>
  );
}
