export const SUBSTACK_FEED = "https://thecorygoat.substack.com/feed";

export type Briefing = {
  title: string;
  url: string;
  date: string;
  excerpt: string;
};

function decode(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block: string, name: string) {
  const match = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return match ? decode(match[1]) : "";
}

export function parseFeed(xml: string): Briefing[] {
  return Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g))
    .map((match) => {
      const block = match[1];
      const published = tag(block, "pubDate");
      const parsed = new Date(published);
      return {
        title: tag(block, "title"),
        url: tag(block, "link"),
        date: Number.isNaN(parsed.getTime())
          ? published
          : parsed.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              timeZone: "UTC",
            }),
        excerpt: tag(block, "description").slice(0, 240),
      };
    })
    .filter((item) => item.title && item.url && item.title.toLowerCase() !== "coming soon");
}

export async function ArticleFeed() {
  let briefings: Briefing[] = [];
  try {
    const response = await fetch(SUBSTACK_FEED, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TGISite/1.0; +https://www.thegoatinitiative.org)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      next: { revalidate: 3600 },
    });
    if (response.ok) {
      briefings = parseFeed(await response.text());
    }
  } catch {
    briefings = [];
  }

  if (briefings.length === 0) {
    return (
      <section className="pb-4">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-gray-400">
            Written briefings are published on{" "}
            <a
              href="https://thecorygoat.substack.com"
              className="text-primary hover:underline"
              rel="noopener noreferrer"
            >
              Cory Gautereaux&apos;s Substack
            </a>
            .
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-8" aria-labelledby="briefing-list-heading">
      <div className="max-w-5xl mx-auto px-4">
        <h2
          id="briefing-list-heading"
          className="font-heading text-2xl text-gray-100 tracking-wider mb-6"
        >
          LATEST BRIEFINGS
        </h2>
        <ol className="space-y-4">
          {briefings.map((briefing) => (
            <li key={briefing.url} className="bg-dark-100/80 border border-gray-800 rounded-sm p-5">
              <p className="font-mono text-[11px] text-gray-500 mb-2">{briefing.date}</p>
              <h3 className="font-heading text-lg text-gray-100 mb-2">
                <a
                  href={briefing.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {briefing.title}
                </a>
              </h3>
              {briefing.excerpt ? (
                <p className="text-sm text-gray-400 leading-relaxed">{briefing.excerpt}</p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
