import type { Metadata } from "next";
import { ReportGate } from "@/components/ReportGate";
import { reportAccess } from "@/lib/access";
import { pageMetadata } from "@/lib/seo";
import { IphoneReader } from "./reader";

export const dynamic = "force-dynamic";

const description =
  "Chinese iPhone found in the desert next to the border wall, off Jewel Valley Road in Boulevard, California. Intelligence report prepared by The GOAT Initiative.";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Chinese iPhone Found in the Desert Next to the Border Wall",
    description,
    path: "/intel/iphone-11",
  }),
  title: { absolute: "Chinese iPhone Found in the Desert Next to the Border Wall | The GOAT Initiative" },
  robots: { index: false, follow: false },
};

export default async function Iphone11Page() {
  const access = await reportAccess("iphone-11");
  if (!access.ok) {
    return (
      <ReportGate
        title="Chinese iPhone found in the desert next to the border wall"
        reason={access.reason}
        nextPath="/intel/iphone-11"
      />
    );
  }
  return <IphoneReader />;
}
