import { classifyGovernment, noteGovernmentIp } from "@/lib/government-network";

type Geo = {
  country?: string;
  regionName?: string;
  city?: string;
  isp?: string;
  org?: string;
  as?: string;
  asname?: string;
  reverse?: string;
  lat?: number;
  lon?: number;
  status?: string;
};

const geoCache = new Map<string, Geo | null>();

export function clientIp(request: Request): string {
  const vercel = request.headers.get("x-vercel-forwarded-for");
  if (vercel) return vercel.split(",")[0].trim();
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "Unknown";
}

function publicIp(ip: string): boolean {
  if (!ip || ip === "Unknown" || ip === "::1") return false;
  if (ip.startsWith("127.") || ip.startsWith("10.") || ip.startsWith("192.168.")) return false;
  const parts = ip.split(".").map((part) => Number(part));
  if (parts.length === 4 && parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return false;
  return true;
}

function deviceOf(ua: string): string {
  const device = /mobile/i.test(ua) ? "mobile" : /tablet|ipad/i.test(ua) ? "tablet" : "desktop";
  const os = /iphone|ipad|ipod/i.test(ua)
    ? "iOS"
    : /android/i.test(ua)
      ? "Android"
      : /windows/i.test(ua)
        ? "Windows"
        : /macintosh|mac os/i.test(ua)
          ? "macOS"
          : /linux/i.test(ua)
            ? "Linux"
            : "Unknown";
  const browser = /firefox/i.test(ua)
    ? "Firefox"
    : /edg/i.test(ua)
      ? "Edge"
      : /chrome/i.test(ua)
        ? "Chrome"
        : /safari/i.test(ua)
          ? "Safari"
          : "Unknown";
  return `${device} — ${browser} on ${os}`;
}

function plain(value: string): string {
  return value.replace(/[`<>\r\n]/g, "").trim().slice(0, 200) || "—";
}

async function geoFor(ip: string): Promise<Geo | null> {
  if (!publicIp(ip)) return null;
  if (geoCache.has(ip)) return geoCache.get(ip) ?? null;
  try {
    const response = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,regionName,city,isp,org,as,asname,reverse,lat,lon`
    );
    if (!response.ok) {
      geoCache.set(ip, null);
      return null;
    }
    const data = (await response.json()) as Geo;
    const geo = data.status === "fail" ? null : data;
    geoCache.set(ip, geo);
    return geo;
  } catch {
    geoCache.set(ip, null);
    return null;
  }
}

/** Posts a signup, sign-in, or confirmation to the private Discord channel. Never throws. */
export async function noticeAccount(
  request: Request,
  input: {
    action: "Signed up" | "Signed in" | "Confirmed email" | "Requested GOAT Intel";
    name: string;
    email: string;
    username?: string;
    phone?: string;
    organization?: string;
  }
): Promise<void> {
  const webhook = (process.env.DISCORD_WEBHOOK_URL || "").trim();
  const ip = clientIp(request);
  if (!webhook) return;
  try {
    const geo = await geoFor(ip);
    const location = geo?.city
      ? [geo.city, geo.regionName, geo.country].filter(Boolean).join(", ")
      : "Unknown";
    const network =
      [geo?.isp, geo?.org, geo?.asname]
        .filter((value): value is string => Boolean(value))
        .filter((value, index, all) => all.indexOf(value) === index)
        .join(" · ") || "Unknown";
    const flag = classifyGovernment({
      country: geo?.country,
      isp: geo?.isp,
      org: geo?.org,
      as: geo?.as,
      asname: geo?.asname,
      reverse: geo?.reverse,
    });
    const visit = flag ? noteGovernmentIp(ip) : null;
    const title = flag
      ? `${visit === "new" ? "New government IP" : "Government IP again"} — ${input.action}`
      : input.action;
    const maps =
      geo?.lat != null && geo?.lon != null ? `https://www.google.com/maps?q=${geo.lat},${geo.lon}` : null;
    const payload = {
      content: flag ? `🚩 ${title}` : "",
      allowed_mentions: { parse: [] as string[] },
      embeds: [
        {
          title,
          color: flag ? 0xffb000 : 0x00d4ff,
          fields: [
            { name: "Account", value: plain(input.name), inline: true },
            { name: "Email", value: plain(input.email), inline: true },
            ...(input.phone ? [{ name: "Phone", value: plain(input.phone), inline: true }] : []),
            ...(input.organization
              ? [{ name: "Organization", value: plain(input.organization), inline: false }]
              : []),
            ...(input.username ? [{ name: "Username", value: plain(input.username), inline: true }] : []),
            { name: "IP Address", value: `\`${plain(ip)}\``, inline: true },
            { name: "Location", value: location.slice(0, 1024), inline: true },
            { name: "Device", value: deviceOf(request.headers.get("user-agent") || ""), inline: true },
            { name: "Network", value: network.slice(0, 1024), inline: false },
            ...(maps ? [{ name: "Map", value: `[View on Google Maps](${maps})`, inline: false }] : []),
          ],
          footer: { text: "TGI Account Log" },
          timestamp: new Date().toISOString(),
        },
      ],
    };
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) console.error("ACCOUNT_NOTICE discord post failed", response.status);
  } catch (error) {
    console.error("ACCOUNT_NOTICE failed", error instanceof Error ? error.message : "notice");
  }
}
