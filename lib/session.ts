import { createHmac, randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { cookies } from "next/headers";
import { findMemberById } from "@/lib/members";
import { isStaffEmail } from "@/lib/staff";

const scryptAsync = promisify(scrypt);

export const COOKIE = "tgi_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

export type Session = {
  id: string;
  name: string;
  email: string;
  staff: boolean;
  confirmed: boolean;
};

type TokenPayload = { sub: string; exp: number };

function secret(): string {
  const value = process.env.TGI_SESSION_SECRET || "";
  if (value.length < 32) {
    throw new Error("TGI_SESSION_SECRET must be at least 32 characters");
  }
  return value;
}

export function cookieOptions(maxAge = SESSION_MAX_AGE) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("base64url");
  const derived = (await scryptAsync(password, salt, 32)) as Buffer;
  return `scrypt$${salt}$${derived.toString("base64url")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const salt = parts[1];
  const hash = parts[2];
  const derived = (await scryptAsync(password, salt, 32)) as Buffer;
  const expected = Buffer.from(hash, "base64url");
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

export function createSessionToken(memberId: string): string {
  const body = Buffer.from(
    JSON.stringify({ sub: memberId, exp: Date.now() + SESSION_MAX_AGE * 1000 } satisfies TokenPayload)
  ).toString("base64url");
  const mac = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${mac}`;
}

function readToken(token: string): TokenPayload | null {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  const actualBuf = Buffer.from(mac);
  const expectedBuf = Buffer.from(expected);
  if (actualBuf.length !== expectedBuf.length || !timingSafeEqual(actualBuf, expectedBuf)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString()) as TokenPayload;
    if (!parsed || typeof parsed.sub !== "string" || typeof parsed.exp !== "number") return null;
    if (parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  let payload: TokenPayload | null = null;
  try {
    payload = readToken(token);
  } catch {
    return null;
  }
  if (!payload) return null;
  const member = await findMemberById(payload.sub);
  if (!member) return null;
  return {
    id: member.id,
    name: member.name,
    email: member.email,
    staff: isStaffEmail(member.email),
    confirmed: Boolean(member.confirmedAt),
  };
}
