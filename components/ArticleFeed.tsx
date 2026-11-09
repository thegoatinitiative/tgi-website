const WRITERS = [
  {
    feed: "https://thecorygoat.substack.com/feed",
    author: "Cory Gautereaux",
    site: "https://thecorygoat.substack.com",
  },
  {
    feed: "https://helsapffel.substack.com/feed",
    author: "Hels Apffel",
    site: "https://helsapffel.substack.com",
  },
] as const;

export const SUBSTACK_FEED = WRITERS[0].feed;

export type Briefing = {
  title: string;
  url: string;
  date: string;
  excerpt: string;
  author: string;
  site: string;
  published: number;
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

const KEEP_UPPER = new Set([
  "ai",
  "cbp",
  "dhs",
  "dod",
  "doj",
  "fbi",
  "fisa",
  "hhs",
  "hsi",
  "ice",
  "id",
  "nato",
  "nsa",
  "oig",
  "osint",
  "pemex",
  "tgi",
  "u.s",
  "u.s.",
  "us",
  "usa",
]);

const SMALL_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "from",
  "in",
  "into",
  "of",
  "on",
  "or",
  "over",
  "the",
  "to",
  "vs",
  "with",
]);

function mostlyUpper(value: string) {
  const letters = value.replace(/[^A-Za-z]/g, "");
  if (letters.length < 8) return false;
  return (value.match(/[A-Z]/g)?.length ?? 0) / letters.length >= 0.8;
}

function titleCaseShout(value: string) {
  const word = /[A-Za-z0-9]+(?:[.'’][A-Za-z0-9]+)*/g;
  let capNext = true;
  let cursor = 0;
  let out = "";
  for (const match of value.matchAll(word)) {
    const gap = value.slice(cursor, match.index ?? 0);
    if (/[:.!?—–-]/.test(gap)) capNext = true;
    out += gap;

    let token = match[0];
    let end = (match.index ?? 0) + token.length;
    if (/^u\.s$/i.test(token) && value[end] === ".") {
      token += ".";
      end += 1;
    }

    const bare = token.toLowerCase();
    if (KEEP_UPPER.has(bare) || /\d/.test(token)) {
      out += bare === "u.s" || bare === "u.s." ? "U.S." : token.toUpperCase();
    } else if (capNext || !SMALL_WORDS.has(bare)) {
      out += bare.charAt(0).toUpperCase() + bare.slice(1);
    } else {
      out += bare;
    }
    capNext = false;
    cursor = end;
  }
  return out + value.slice(cursor);
}

export function readableTitle(title: string) {
  return title
    .split(/(\s*:\s*)/)
    .map((part, index) => (index % 2 === 1 || !mostlyUpper(part) ? part : titleCaseShout(part)))
    .join("");
}

export function parseFeed(
  xml: string,
  writer: { author: string; site: string },
): Briefing[] {
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
        author: writer.author,
        site: writer.site,
        published: Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime(),
      };
    })
    .filter((item) => item.title && item.url && item.title.toLowerCase() !== "coming soon");
}

async function loadFeed(writer: (typeof WRITERS)[number]): Promise<Briefing[]> {
  try {
    const response = await fetch(writer.feed, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TGISite/1.0; +https://www.thegoatinitiative.org)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    return parseFeed(await response.text(), writer);
  } catch {
    return [];
  }
}

export async function ArticleFeed() {
  const groups = await Promise.all(WRITERS.map(loadFeed));
  const seen = new Set<string>();
  const briefings = groups
    .flat()
    .filter((item) => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    })
    .sort((a, b) => b.published - a.published || a.title.localeCompare(b.title));

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
            </a>{" "}
            and{" "}
            <a
              href="https://helsapffel.substack.com"
              className="text-primary hover:underline"
              rel="noopener noreferrer"
            >
              Hels Apffel&apos;s Substack
            </a>
            .
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-8" aria-labelledby="briefing-list-heading">
      <div className="max-w-3xl mx-auto px-4">
        <h2 id="briefing-list-heading" className="mb-6 text-2xl font-semibold text-gray-100">
          Latest briefings
        </h2>
        <ol>
          {briefings.map((briefing) => (
            <li key={briefing.url} className="border-b border-gray-800/80 py-6 first:pt-0">
              <p className="mb-2 text-sm text-gray-500">
                {briefing.date}
                <span aria-hidden="true"> · </span>
                <a
                  href={briefing.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-primary"
                >
                  {briefing.author}
                </a>
              </p>
              <h3 className="mb-2 text-xl font-semibold leading-snug text-gray-100">
                <a
                  href={briefing.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  {readableTitle(briefing.title)}
                </a>
              </h3>
              {briefing.excerpt ? (
                <p className="text-base leading-7 text-gray-400">{briefing.excerpt}</p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
