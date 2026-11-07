import { listUnlocked } from "@/lib/members";
import type { ReportId } from "@/lib/reports";
import { getSession } from "@/lib/session";

export async function reportAccess(id: ReportId): Promise<
  { ok: true } | { ok: false; reason: "signed-out" | "unconfirmed" | "locked" }
> {
  const session = await getSession();
  if (!session) return { ok: false, reason: "signed-out" };
  if (session.staff) return { ok: true };
  if (!session.confirmed) return { ok: false, reason: "unconfirmed" };
  const unlocked = await listUnlocked();
  if (!unlocked.includes(id)) return { ok: false, reason: "locked" };
  return { ok: true };
}
