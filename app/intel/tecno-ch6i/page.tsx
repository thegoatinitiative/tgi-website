import type { Metadata } from "next";
import { ReportGate } from "@/components/ReportGate";
import { reportAccess } from "@/lib/access";
import { pageMetadata } from "@/lib/seo";
import { FerReader } from "./reader";

export const dynamic = "force-dynamic";

const description =
  "Device forensic report on a handset associated with Feroz Shah of Mardan, recovered at Otay Mountain. Prepared by The GOAT Initiative.";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Feroz Shah's Phone Found on Otay Mountain",
    description,
    path: "/intel/tecno-ch6i",
  }),
  title: { absolute: "Feroz Shah's Phone Found on Otay Mountain | The GOAT Initiative" },
  robots: { index: false, follow: false },
};

export default async function TecnoCh6iPage() {
  const access = await reportAccess("tecno-ch6i");
  if (!access.ok) {
    return (
      <ReportGate
        title="Feroz Shah's phone found on Otay Mountain"
        reason={access.reason}
        nextPath="/intel/tecno-ch6i"
      />
    );
  }
  return <FerReader />;
}
