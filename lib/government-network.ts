export interface NetworkIdentity {
  country?: string;
  isp?: string;
  org?: string;
  as?: string;
  asname?: string;
  reverse?: string;
}

export interface GovernmentFlag {
  label: string;
  detail: string;
}

const RULES: { label: string; pattern: RegExp }[] = [
  {
    label: "U.S. Defense",
    pattern:
      /\b(department of defense|dept\.? of defense|dod network|usdod|\bdisa\b|defense information systems|\.mil\b|nic\.mil)\b/i,
  },
  {
    label: "U.S. Homeland Security",
    pattern:
      /\b(department of homeland security|homeland security|\bdhs\b|customs and border protection|u\.?s\. customs|border patrol|immigration and customs enforcement|\buscis\b|transportation security administration|\bfema\b|federal emergency management|u\.?s\. secret service|secret service)\b/i,
  },
  {
    label: "U.S. Justice",
    pattern:
      /\b(department of justice|federal bureau of investigation|\bfbi\b|drug enforcement administration|u\.?s\. marshals|united states marshals|bureau of alcohol, tobacco)\b/i,
  },
  {
    label: "U.S. intelligence",
    pattern:
      /\b(central intelligence agency|\bcia\b|national security agency|\bnsa\b|defense intelligence agency|national reconnaissance office|director of national intelligence|\bodni\b|national geospatial-intelligence)\b/i,
  },
  {
    label: "U.S. armed forces",
    pattern:
      /\b(u\.?s\.?\s+army|united states army|u\.?s\.?\s+navy|united states navy|u\.?s\.?\s+air force|u\.?s\.?\s+marine corps|u\.?s\.?\s+coast guard|u\.?s\.?\s+space force)\b/i,
  },
  {
    label: "U.S. Congress",
    pattern: /\b(u\.?s\.?\s+senate|united states senate|house of representatives|library of congress)\b/i,
  },
  {
    label: "U.S. civilian agency",
    pattern:
      /\b(department of state|federal reserve|internal revenue service|\birs\b|social security administration|\busps\b|postal service|national aeronautics|\bnasa\b|national oceanic|\busgs\b|national institutes of health|\bnih\b|department of veterans affairs|veterans affairs)\b/i,
  },
  {
    label: "National police or defense ministry",
    pattern:
      /\b(national police|policia federal|police nationale|gendarmerie|guardia civil|carabinieri|royal canadian mounted|\brcmp\b|bundespolizei|bundeswehr|bundesamt|ministry of defence|ministry of defense|ministerio de defensa|ministère de la défense)\b/i,
  },
  {
    label: "State or local government",
    pattern:
      /\b(state of [a-z][a-z.'-]+|city of [a-z][a-z.'-]+|county of [a-z][a-z.'-]+|commonwealth of [a-z][a-z.'-]+)\b/i,
  },
  {
    label: "Government network",
    pattern:
      /\b(government of|gouvernement|gobierno de|governo do|governo de|ministry of|ministerio de|ministère|ministerium|ministerie van|department of|dept\. of)\b/i,
  },
];

const AS_NAMES: { label: string; pattern: RegExp }[] = [
  {
    label: "U.S. government network",
    pattern: /^(DNIC|DOD|USDOD|DISA|DHS|USSS|FBI|FBICJIS|CIA|NSA|USPS|IRS|SSA|NASA|NOAA|USGS|NIH)([-_]|$)/i,
  },
];

function governmentHost(host: string | undefined): string | null {
  if (!host) return null;
  const name = host.trim().toLowerCase().replace(/\.$/, "");
  if (!name || !name.includes(".")) return null;
  if (/\.(gov|mil)$/.test(name)) return "Government domain";
  if (/\.(gov|gob|gouv)\.[a-z]{2}$/.test(name)) return "Government domain";
  if (/\.(gc\.ca|gov\.uk|gov\.au|govt\.nz|go\.jp|go\.kr|gov\.sg|gov\.br|gov\.mx)$/.test(name)) {
    return "Government domain";
  }
  return null;
}

export function classifyGovernment(net: NetworkIdentity): GovernmentFlag | null {
  const parts = [net.isp, net.org, net.as, net.asname].filter(Boolean) as string[];
  const haystack = parts.join(" · ");
  if (!haystack && !net.reverse) return null;

  const hostLabel = governmentHost(net.reverse);
  if (hostLabel) {
    return { label: hostLabel, detail: net.reverse || haystack };
  }

  for (const rule of RULES) {
    if (rule.pattern.test(haystack)) {
      return { label: rule.label, detail: haystack };
    }
  }

  const asname = (net.asname || "").trim();
  for (const rule of AS_NAMES) {
    if (rule.pattern.test(asname)) {
      return { label: rule.label, detail: haystack || asname };
    }
  }

  return null;
}

const seenGovernmentIps = new Map<string, { last: number; kind: "new" | "return" }>();
const SAME_VISIT_MS = 2 * 60 * 1000;

/** First look at an IP is "new". A later visit, after a gap, is "return". Heartbeats stay with the open visit. */
export function noteGovernmentIp(ip: string, now = Date.now()): "new" | "return" {
  const prev = seenGovernmentIps.get(ip);
  if (!prev || now - prev.last > SAME_VISIT_MS) {
    const kind = prev ? "return" : "new";
    seenGovernmentIps.set(ip, { last: now, kind });
    return kind;
  }
  prev.last = now;
  return prev.kind;
}
