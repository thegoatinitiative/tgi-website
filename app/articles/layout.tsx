import type { Metadata } from "next";
import { PageFrame } from "@/components/PageFrame";
import { articlesFaq } from "@/lib/faqs";
import { pageMetadata } from "@/lib/seo";

const description =
  "Border briefings by Cory Gautereaux and The GOAT Initiative, with titles and links to each essay on Substack.";

export const metadata: Metadata = pageMetadata({
  title: "Border Briefings",
  description,
  path: "/articles",
});

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageFrame path="/articles" name="Articles" description={description} faq={articlesFaq}>
      {children}
    </PageFrame>
  );
}
