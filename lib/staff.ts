/** Staff emails come from the environment. A password in the page is not a staff check. */
export function isStaffEmail(email: string): boolean {
  const allow = (process.env.TGI_STAFF_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return allow.includes(email.trim().toLowerCase());
}
