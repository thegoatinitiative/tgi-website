import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { FerReader } from "./reader";

const description =
  "Device forensic report on an unlocked TECNO CAMON 19 Neo recovered at Otay Mountain. Prepared by The GOAT Initiative.";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "TECNO CAMON 19 Neo",
    description,
    path: "/intel/tecno-ch6i",
  }),
  title: { absolute: "TECNO CAMON 19 Neo | The GOAT Initiative" },
  robots: { index: false, follow: false },
};

export default function TecnoCh6iPage() {
  return <FerReader />;
}
