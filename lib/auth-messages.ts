export const AUTH_ERRORS: Record<string, string> = {
  missing: "Enter your name, email, and password.",
  email: "Enter a valid email address.",
  short: "Use a password of at least 10 characters.",
  long: "That password is too long.",
  taken: "An account with that email already exists. Sign in instead.",
  credentials: "That email or password is wrong.",
  rate: "Too many attempts. Wait a few minutes and try again.",
  store: "Signups on the live site are not saved yet. A database has to be connected first.",
  config: "Sign-in is not configured on this server.",
  staff: "Only staff can release a report.",
  changed: "That report was already released. Refresh and try the next one.",
  done: "Every report is already released.",
  confirm: "That confirmation link is invalid or expired. Sign in and send a new one.",
  mail: "We could not send the confirmation email. Try again in a minute.",
};

const hits = new Map<string, number[]>();

export function rateLimited(key: string, limit = 8): boolean {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((time) => now - time < 10 * 60 * 1000);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

export function clientKey(request: Request, action: string): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return `${action}:${forwarded || "local"}`;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function cleanName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const name = value.replace(/\s+/g, " ").trim();
  if (name.length < 1 || name.length > 80) return null;
  if (/[\u0000-\u001f]/.test(name)) return null;
  return name;
}

export function cleanEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !EMAIL.test(email)) return null;
  return email;
}

export function cleanPassword(value: unknown): string | { error: "missing" | "short" | "long" } {
  if (typeof value !== "string" || value.length === 0) return { error: "missing" };
  if (value.length < 10) return { error: "short" };
  if (value.length > 200) return { error: "long" };
  return value;
}
