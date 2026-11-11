type Claims = { uid: string; username: string };

/**
 * Any verified intel-portal login may read reports.
 * The caller has already checked the Firebase ID token.
 * Admin tools use the Firestore role and are not decided here.
 */
export async function accountMayReadReports(idToken: string, claims: Claims): Promise<boolean> {
  void idToken;
  void claims;
  return true;
}
