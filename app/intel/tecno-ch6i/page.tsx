import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { FerReader } from "./reader";

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

export default function TecnoCh6iPage() {
  return <FerReader />;
}
