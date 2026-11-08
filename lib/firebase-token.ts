import { createPublicKey, createVerify } from "crypto";

const PROJECT = "intel-portal-9578e";
const ISSUER = `https://securetoken.google.com/${PROJECT}`;
const CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";
const EMAIL_DOMAIN = "@intelportal.app";

export class FirebaseTokenError extends Error {
  code: "invalid" | "unavailable";

  constructor(code: "invalid" | "unavailable") {
    super(code);
    this.name = "FirebaseTokenError";
    this.code = code;
  }
}

type TokenClaims = {
  uid: string;
  email: string;
  username: string;
};

type CertMap = Record<string, string>;

let cached: { certs: CertMap; expires: number } | null = null;

function decodePart(part: string): unknown {
  try {
    return JSON.parse(Buffer.from(part, "base64url").toString("utf8"));
  } catch {
    throw new FirebaseTokenError("invalid");
  }
}

function usernameFromEmail(email: string): string | null {
  const lower = email.trim().toLowerCase();
  if (!lower.endsWith(EMAIL_DOMAIN)) return null;
  const username = lower.slice(0, -EMAIL_DOMAIN.length);
  if (username.length < 2 || username.length > 32) return null;
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(username)) return null;
  return username;
}

async function googleCerts(): Promise<CertMap> {
  if (cached && cached.expires > Date.now()) return cached.certs;
  let response: Response;
  try {
    response = await fetch(CERTS_URL, { signal: AbortSignal.timeout(5000) });
  } catch {
    throw new FirebaseTokenError("unavailable");
  }
  if (!response.ok) throw new FirebaseTokenError("unavailable");
  const certs = (await response.json()) as CertMap;
  if (!certs || typeof certs !== "object") throw new FirebaseTokenError("unavailable");
  const maxAge = Number(response.headers.get("cache-control")?.match(/max-age=(\d+)/)?.[1] || 3600);
  cached = { certs, expires: Date.now() + Math.min(maxAge, 3600) * 1000 };
  return certs;
}

function signatureMatches(token: string, certPem: string): boolean {
  const parts = token.split(".");
  try {
    const key = createPublicKey(certPem);
    const verifier = createVerify("RSA-SHA256");
    verifier.update(`${parts[0]}.${parts[1]}`);
    verifier.end();
    return verifier.verify(key, Buffer.from(parts[2], "base64url"));
  } catch {
    return false;
  }
}

/** Verifies a Firebase ID token for intel-portal-9578e. The raw token is never logged. */
export async function verifyFirebaseIdToken(
  token: string,
  options?: { certs?: CertMap; now?: number }
): Promise<TokenClaims> {
  if (typeof token !== "string" || token.length < 20 || token.length > 8192) {
    throw new FirebaseTokenError("invalid");
  }
  const parts = token.split(".");
  if (parts.length !== 3) throw new FirebaseTokenError("invalid");
  const header = decodePart(parts[0]) as { alg?: string; kid?: string };
  if (header.alg !== "RS256" || !header.kid) throw new FirebaseTokenError("invalid");

  let certs = options?.certs;
  if (!certs) {
    certs = await googleCerts();
    if (!certs[header.kid]) {
      cached = null;
      certs = await googleCerts();
    }
  }
  const cert = certs[header.kid];
  if (!cert || !signatureMatches(token, cert)) throw new FirebaseTokenError("invalid");

  const payload = decodePart(parts[1]) as {
    iss?: string;
    aud?: string;
    sub?: string;
    user_id?: string;
    email?: string;
    iat?: number;
    exp?: number;
    auth_time?: number;
    firebase?: { sign_in_provider?: string };
  };
  const now = options?.now ?? Math.floor(Date.now() / 1000);
  if (payload.iss !== ISSUER || payload.aud !== PROJECT) throw new FirebaseTokenError("invalid");
  if (payload.firebase?.sign_in_provider !== "password") throw new FirebaseTokenError("invalid");
  if (typeof payload.exp !== "number" || payload.exp < now - 60) throw new FirebaseTokenError("invalid");
  if (typeof payload.iat !== "number" || payload.iat > now + 300) throw new FirebaseTokenError("invalid");
  if (typeof payload.sub !== "string" || payload.sub.length < 1 || payload.sub.length > 128) {
    throw new FirebaseTokenError("invalid");
  }
  if (payload.user_id && payload.user_id !== payload.sub) throw new FirebaseTokenError("invalid");
  if (typeof payload.email !== "string") throw new FirebaseTokenError("invalid");
  const username = usernameFromEmail(payload.email);
  if (!username) throw new FirebaseTokenError("invalid");
  return { uid: payload.sub, email: payload.email.trim().toLowerCase(), username };
}
