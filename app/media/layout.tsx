import type { Metadata } from "next";
import { PageFrame } from "@/components/PageFrame";
import { mediaFaq } from "@/lib/faqs";
import { SITE_URL, pageMetadata } from "@/lib/seo";
import { videos, watchUrl } from "@/lib/videos";

const description =
  "Video briefings on border smuggling and the Matt Gaetz interview with Cory Gautereaux, founder of The GOAT Initiative.";

const owned = videos.find((video) => video.owned);

export const metadata: Metadata = pageMetadata({
  title: "Border Video Briefings",
  description,
  path: "/media",
});

export default function MediaLayout({ children }: { children: React.ReactNode }) {
  const extra: Record<string, unknown>[] = [
    {
      "@type": "ItemList",
      itemListElement: videos.map((video, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: video.title,
        url: watchUrl(video.id),
      })),
    },
  ];

  if (owned?.uploadDate) {
    extra.push({
      "@type": "VideoObject",
      name: owned.title,
      description: owned.description,
      thumbnailUrl: `https://i.ytimg.com/vi/${owned.id}/hqdefault.jpg`,
      uploadDate: owned.uploadDate,
      embedUrl: `https://www.youtube.com/embed/${owned.id}`,
      contentUrl: watchUrl(owned.id),
      publisher: { "@id": `${SITE_URL}/#organization` },
    });
  }

  return (
    <PageFrame path="/media" name="Video briefings" description={description} faq={mediaFaq} extra={extra}>
      {children}
    </PageFrame>
  );
}
