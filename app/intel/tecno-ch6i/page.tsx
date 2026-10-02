import type { Metadata } from "next";
import { FerReader } from "./reader";

export const metadata: Metadata = {
  title: "TECNO CAMON 19 Neo | Intel Updates",
  description:
    "Device forensic report on an unlocked TECNO CAMON 19 Neo recovered at Otay Mountain. Prepared by The GOAT Initiative.",
  robots: { index: false, follow: false },
};

export default function TecnoCh6iPage() {
  return <FerReader />;
}
