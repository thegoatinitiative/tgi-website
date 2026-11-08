/** Release order. Unlocking a report opens every card that points at it. */
export const REPORTS = [
  {
    id: "iphone-11",
    title: "Chinese iPhone found in the desert next to the border wall",
    product: "TGI-IIR-2026-1101-001",
  },
  {
    id: "tecno-ch6i",
    title: "Feroz Shah's phone found on Otay Mountain",
    product: "FER-2026-0906-TECNO-CH6i",
  },
] as const;

export type ReportId = (typeof REPORTS)[number]["id"];

export function isReportId(value: string): value is ReportId {
  return REPORTS.some((report) => report.id === value);
}

export function reportById(id: string) {
  return REPORTS.find((report) => report.id === id) ?? null;
}

/** Same-site return paths. A bad value falls back to the catalog. */
export function safeNext(value: unknown): string {
  if (typeof value !== "string") return "/intel";
  if (!/^\/(?:account|intel(?:\/(?:iphone-11|tecno-ch6i|portal))?(?:#[A-Za-z0-9-]+)?)$/.test(value)) {
    return "/intel";
  }
  return value;
}

/** Keep the redirect on the host that set the session cookie. */
export function sameOrigin(request: Request, path: string): URL {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host")?.trim();
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const proto = forwardedProto || new URL(request.url).protocol.replace(":", "") || "https";
  const origin = host ? `${proto}://${host}` : new URL(request.url).origin;
  return new URL(path, origin);
}
