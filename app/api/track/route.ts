import { NextRequest, NextResponse } from "next/server";
import { classifyGovernment, noteGovernmentIp } from "@/lib/government-network";

// Your Discord Webhook URL - Set this in your environment variables
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "";

interface GeoData {
  country: string;
  regionName: string;
  city: string;
  isp: string;
  org: string;
  as?: string;
  asname?: string;
  reverse?: string;
  lat: number;
  lon: number;
}

async function getGeoData(ip: string): Promise<GeoData | null> {
  try {
    // Using ip-api.com (free, no API key needed, 45 requests/min limit)
    const response = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,regionName,city,isp,org,as,asname,reverse,lat,lon`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Geo lookup failed:", error);
  }
  return null;
}

function parseUserAgent(ua: string): { device: string; browser: string; os: string } {
  let device = "desktop";
  let browser = "Unknown";
  let os = "Unknown";

  // Detect device type
  if (/mobile/i.test(ua)) device = "mobile";
  else if (/tablet|ipad/i.test(ua)) device = "tablet";

  // Detect OS
  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os/i.test(ua)) os = "macOS";
  else if (/linux/i.test(ua)) os = "Linux";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) {
    os = "iOS";
    const match = ua.match(/OS (\d+[._]\d+[._]?\d*)/);
    if (match) os = `iOS ${match[1].replace(/_/g, ".")}`;
  }

  // Detect browser
  if (/firefox/i.test(ua)) {
    const match = ua.match(/Firefox\/(\d+)/);
    browser = match ? `Firefox ${match[1]}` : "Firefox";
  } else if (/edg/i.test(ua)) {
    const match = ua.match(/Edg\/(\d+)/);
    browser = match ? `Edge ${match[1]}` : "Edge";
  } else if (/chrome/i.test(ua)) {
    const match = ua.match(/Chrome\/(\d+)/);
    browser = match ? `Chrome ${match[1]}` : "Chrome";
  } else if (/safari/i.test(ua)) {
    const match = ua.match(/Version\/(\d+\.\d+)/);
    browser = match ? `Safari ${match[1]}` : "Safari";
  }

  return { device, browser, os };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, referrer } = body;

    // Get IP address
    const vercel = request.headers.get("x-vercel-forwarded-for");
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = vercel
      ? vercel.split(",")[0].trim()
      : forwarded
        ? forwarded.split(",")[0].trim()
        : request.headers.get("x-real-ip") || "Unknown";

    // Get user agent
    const userAgent = request.headers.get("user-agent") || "Unknown";
    const { device, browser, os } = parseUserAgent(userAgent);

    // Get geo data
    const geo = await getGeoData(ip);

    // Build location string
    const location = geo 
      ? `${geo.city}, ${geo.regionName}, ${geo.country}`
      : "Unknown";

    // Build Google Maps link
    const mapsLink = geo 
      ? `https://www.google.com/maps?q=${geo.lat},${geo.lon}`
      : null;

    const flag = geo
      ? classifyGovernment({
          country: geo.country,
          isp: geo.isp,
          org: geo.org,
          as: geo.as,
          asname: geo.asname,
          reverse: geo.reverse,
        })
      : null;
    const visit = flag ? noteGovernmentIp(ip) : null;
    const title = flag
      ? visit === "new"
        ? `New government IP — ${flag.label}`
        : `Government IP again — ${flag.label}`
      : "New Visitor";
    if (flag) console.log(`VISITOR_GOV ip=${ip} gov=${flag.label} visit=${visit} page=${page || "/"}`);

    // Send to Discord webhook
    if (DISCORD_WEBHOOK_URL) {
      const embed = {
        content: flag ? `🚩 ${title}${geo?.country ? ` · ${geo.country}` : ""}` : "",
        allowed_mentions: { parse: [] },
        embeds: [
          {
            title,
            color: flag ? 0xffb000 : 0x00d4ff,
            fields: [
              ...(flag
                ? [{
                    name: "Flag",
                    value: `${flag.label}${geo?.country ? ` · ${geo.country}` : ""} · ${visit === "new" ? "first time this address has been seen" : "this address has been seen before"}`,
                    inline: false,
                  }]
                : []),
              {
                name: "📍 Location",
                value: location,
                inline: true,
              },
              {
                name: "🌐 IP Address",
                value: `\`${ip}\``,
                inline: true,
              },
              {
                name: "📄 Page",
                value: page || "/",
                inline: true,
              },
              {
                name: "💻 Device",
                value: `${device} - ${browser} on ${os}`,
                inline: true,
              },
              {
                name: "🏢 ISP/Org",
                value: [geo?.isp, geo?.org, geo?.asname].filter(Boolean).filter((value, index, all) => all.indexOf(value) === index).join(" · ") || "Unknown",
                inline: true,
              },
              ...(referrer ? [{
                name: "🔗 Referrer",
                value: referrer,
                inline: true,
              }] : []),
              ...(mapsLink ? [{
                name: "🗺️ Map",
                value: `[View on Google Maps](${mapsLink})`,
                inline: false,
              }] : []),
            ],
            footer: {
              text: "TGI Visitor Tracking",
            },
            timestamp: new Date().toISOString(),
          },
        ],
      };

      await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(embed),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
