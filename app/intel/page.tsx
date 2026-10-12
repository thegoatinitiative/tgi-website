import { PageFrame } from "@/components/PageFrame";
import { intelFaq } from "@/lib/faqs";
import { IntelClient } from "./IntelClient";

const description =
  "Intel updates from The GOAT Initiative: field reports and threat briefings from the U.S.–Mexico border.";

export default function IntelPage() {
  return (
    <PageFrame path="/intel" name="Intel Updates" description={description} faq={intelFaq}>
      <IntelClient />
    </PageFrame>
  );
}
