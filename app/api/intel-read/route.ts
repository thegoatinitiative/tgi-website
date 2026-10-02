import { appendFile, mkdir } from "fs/promises";
import { dirname } from "path";
import { NextRequest, NextResponse } from "next/server";
import { classifyGovernment, noteGovernmentIp } from "@/lib/government-network";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DISCORD_WEBHOOK_URL = (process.env.DISCORD_WEBHOOK_URL || "").trim();
const MAX_SECONDS = 6 * 60 * 60;

interface GeoData {
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
}

function clientIp(request: NextRequest): string {
  const vercel = request.headers.get("x-vercel-forwarded-for");
  if (vercel) return vercel.split(",")[0].trim();
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "Unknown";
}

function isPublicIp(ip: string): boolean {
  if (!ip || ip === "Unknown" || ip === "::1") return false;
  if (ip.startsWith("127.") || ip.startsWith("10.") || ip.startsWith("192.168.")) return false;
  const parts = ip.split(".").map((part) => Number(part));
  if (parts.length === 4 && parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return false;
  return true;
}

function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.min(MAX_SECONDS, Math.floor(seconds)));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const rem = s % 60;
  if (h > 0) return `${h}h ${m}m ${rem}s`;
  if (m > 0) return `${m}m ${rem}s`;
  return `${rem}s`;
}

function parseUserAgent(ua: string): string {
  let device = "desktop";
  let browser = "Unknown";
  let os = "Unknown";

  if (/mobile/i.test(ua)) device = "mobile";
  else if (/tablet|ipad/i.test(ua)) device = "tablet";

  if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os/i.test(ua)) os = "macOS";
  else if (/linux/i.test(ua)) os = "Linux";

  if (/firefox/i.test(ua)) browser = "Firefox";
  else if (/edg/i.test(ua)) browser = "Edge";
  else if (/chrome/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua)) browser = "Safari";

  return `${device} — ${browser} on ${os}`;
}

const geoCache = new Map<string, GeoData | null>();

async function getGeoData(ip: string): Promise<GeoData | null> {
  if (!isPublicIp(ip)) return null;
  if (geoCache.has(ip)) return geoCache.get(ip) ?? null;
  try {
    const response = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,regionName,city,isp,org,as,asname,reverse,lat,lon`
    );
    if (!response.ok) {
      geoCache.set(ip, null);
      return null;
    }
    const data = (await response.json()) as GeoData;
    const geo = data.status === "fail" ? null : data;
    geoCache.set(ip, geo);
    return geo;
  } catch {
    geoCache.set(ip, null);
    return null;
  }
}

function webhookMessageUrl(messageId: string): string {
  const base = DISCORD_WEBHOOK_URL.split("?")[0].replace(/\/$/, "");
  return `${base}/messages/${messageId}`;
}

function webhookPostUrl(): string {
  return DISCORD_WEBHOOK_URL.includes("?")
    ? `${DISCORD_WEBHOOK_URL}&wait=true`
    : `${DISCORD_WEBHOOK_URL}?wait=true`;
}

async function publishDiscord(payload: object, messageId: string | null): Promise<string | null> {
  if (!DISCORD_WEBHOOK_URL) return null;

  if (messageId && /^\d{5,22}$/.test(messageId)) {
    const edited = await fetch(webhookMessageUrl(messageId), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (edited.ok) return messageId;
  }

  const created = await fetch(webhookPostUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!created.ok) {
    console.error("INTEL_READ discord post failed", created.status);
    return null;
  }
  const data = (await created.json()) as { id?: string };
  return typeof data.id === "string" ? data.id : null;
}

function logFilePath(): string | null {
  if (process.env.INTEL_READ_LOG) return process.env.INTEL_READ_LOG;
  if (process.env.VERCEL) return null;
  if (!process.env.HOME) return null;
  return `${process.env.HOME}/Desktop/TGI/intel-read-log.jsonl`;
}

async function writeLog(entry: Record<string, unknown>) {
  const path = logFilePath();
  if (!path) return;
  try {
    await mkdir(dirname(path), { recursive: true });
    await appendFile(path, `${JSON.stringify(entry)}\n`);
  } catch (error) {
    console.error("INTEL_READ log file failed", error);
  }
}

function clampSeconds(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(MAX_SECONDS, Math.floor(n));
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.text();
    const body = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};

    const status = body.status === "left" ? "left" : "reading";
    const visibleSeconds = clampSeconds(body.visibleSeconds);
    const openSeconds = clampSeconds(body.openSeconds);
    const sessionId = typeof body.sessionId === "string" ? body.sessionId.slice(0, 36) : "";
    const priorMessageId = typeof body.messageId === "string" ? body.messageId : null;
    const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 200) : "";

    const ip = clientIp(request);
    const userAgent = (request.headers.get("user-agent") || "Unknown").slice(0, 300);
    const device = parseUserAgent(userAgent);
    const geo = await getGeoData(ip);

    const location = geo?.city
      ? [geo.city, geo.regionName, geo.country].filter(Boolean).join(", ")
      : "Unknown";
    const mapsLink =
      geo?.lat != null && geo?.lon != null
        ? `https://www.google.com/maps?q=${geo.lat},${geo.lon}`
        : null;

    const flag = classifyGovernment({
      country: geo?.country,
      isp: geo?.isp,
      org: geo?.org,
      as: geo?.as,
      asname: geo?.asname,
      reverse: geo?.reverse,
    });
    const visit = flag ? noteGovernmentIp(ip) : null;
    const baseTitle =
      status === "left"
        ? "Left the briefing"
        : visibleSeconds < 5
          ? "Briefing opened"
          : "Still on the briefing";
    const title = flag
      ? `${visit === "new" ? "New government IP" : "Government IP again"} — ${baseTitle}`
      : baseTitle;

    const entry = {
      at: new Date().toISOString(),
      ip,
      location,
      isp: geo?.isp || geo?.org || "Unknown",
      org: geo?.org || null,
      asname: geo?.asname || null,
      government: flag?.label || null,
      visit,
      device,
      status,
      visibleSeconds,
      openSeconds,
      session: sessionId.slice(0, 8),
      referrer: referrer || null,
    };
    console.log(
      `INTEL_READ ip=${ip} status=${status} visible=${visibleSeconds}s open=${openSeconds}s session=${sessionId.slice(0, 8)}${flag ? ` gov=${flag.label} visit=${visit}` : ""}`
    );
    await writeLog(entry);

    const network = [geo?.isp, geo?.org, geo?.asname].filter(Boolean).filter((value, index, all) => all.indexOf(value) === index).join(" · ") || "Unknown";
    const fields = [
      ...(flag
        ? [{
            name: "Flag",
            value: `${flag.label}${geo?.country ? ` · ${geo.country}` : ""} · ${visit === "new" ? "first time this address has been seen" : "this address has been seen before"}`,
            inline: false,
          }]
        : []),
      { name: "Time on report", value: formatDuration(visibleSeconds), inline: true },
      { name: "Tab open", value: formatDuration(openSeconds), inline: true },
      { name: "Status", value: status === "left" ? "Left" : "Reading", inline: true },
      { name: "IP Address", value: `\`${ip}\``, inline: true },
      { name: "Location", value: location, inline: true },
      { name: "Device", value: device, inline: true },
      { name: "Network", value: network.slice(0, 1024), inline: false },
      { name: "Report", value: "TECNO CH6i FER · FER-2026-0906", inline: true },
      { name: "Session", value: sessionId ? `\`${sessionId.slice(0, 8)}\`` : "—", inline: true },
      ...(referrer ? [{ name: "Referrer", value: referrer, inline: false }] : []),
      ...(mapsLink ? [{ name: "Map", value: `[View on Google Maps](${mapsLink})`, inline: false }] : []),
    ];

    const messageId = await publishDiscord(
      {
        content: flag ? `🚩 ${title}` : "",
        allowed_mentions: { parse: [] },
        embeds: [
          {
            title,
            color: flag ? 0xffb000 : status === "left" ? 0xff2a6d : 0x00d4ff,
            fields,
            footer: { text: "TGI Briefing Log · time on report is visible time in the browser" },
            timestamp: new Date().toISOString(),
          },
        ],
      },
      priorMessageId
    );

    return NextResponse.json({ ok: true, messageId: messageId || priorMessageId });
  } catch (error) {
    console.error("INTEL_READ error", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
