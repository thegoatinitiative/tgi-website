import { accessStatus } from "@/lib/goatintel-access";

const PROJECT = "intel-portal-9578e";

type Claims = { uid: string; username: string };

function safeUid(uid: string): string | null {
  if (!/^[A-Za-z0-9]{8,128}$/.test(uid)) return null;
  return uid;
}

/** True when this signed-in account's own users document is admin or analyst. */
async function hasFirestorePortalRole(idToken: string, uid: string): Promise<boolean> {
  const safe = safeUid(uid);
  if (!safe) return false;
  const url =
    "https://firestore.googleapis.com/v1/projects/" +
    PROJECT +
    "/databases/(default)/documents/users/" +
    safe;
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${idToken}` },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return false;
    const body = (await response.json()) as {
      fields?: { role?: { stringValue?: unknown } };
    };
    const role = body.fields?.role?.stringValue;
    return role === "admin" || role === "analyst";
  } catch {
    return false;
  }
}

/**
 * A login by itself is not enough. The account must already be a member,
 * or Cory must have approved the access request.
 * Creating a Firebase login does not grant this.
 */
export async function accountMayReadReports(idToken: string, claims: Claims): Promise<boolean> {
  if (await hasFirestorePortalRole(idToken, claims.uid)) return true;
  try {
    return (await accessStatus(claims.uid)) === "approved";
  } catch {
    return false;
  }
}
