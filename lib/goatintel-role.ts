import { accessStatus, isStaffUsername } from "@/lib/goatintel-access";

const PROJECT = "intel-portal-9578e";

type Claims = { uid: string; username: string };

function safeUid(uid: string): string | null {
  if (!/^[A-Za-z0-9]{8,128}$/.test(uid)) return null;
  return uid;
}

/** True when this signed-in account's own users document is admin or analyst. */
export async function hasFirestorePortalRole(idToken: string, uid: string): Promise<boolean> {
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
 * Staff usernames, admin-panel accounts, and approved access requests can read reports.
 * A Firestore role is enough because those documents are created by an admin.
 */
export async function accountMayReadReports(idToken: string, claims: Claims): Promise<boolean> {
  if (isStaffUsername(claims.username)) return true;
  if (await hasFirestorePortalRole(idToken, claims.uid)) return true;
  return (await accessStatus(claims.uid)) === "approved";
}
