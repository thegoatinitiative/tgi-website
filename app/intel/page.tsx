import { PageFrame } from "@/components/PageFrame";
import { intelFaq } from "@/lib/faqs";
import { listUnlocked } from "@/lib/members";
import { getSession } from "@/lib/session";
import { IntelClient } from "./IntelClient";

export const dynamic = "force-dynamic";

const description =
  "Intel updates from The GOAT Initiative: field reports and threat briefings from the U.S.–Mexico border.";

export default async function IntelPage() {
  const session = await getSession();
  const unlocked = await listUnlocked();
  return (
    <PageFrame path="/intel" name="Intel Updates" description={description} faq={intelFaq}>
      <IntelClient
        signedIn={Boolean(session)}
        confirmed={Boolean(session?.confirmed)}
        staff={Boolean(session?.staff)}
        unlocked={unlocked}
      />
    </PageFrame>
  );
}
