import type { Metadata } from "next";
import { PageFrame } from "@/components/PageFrame";
import { pageMetadata } from "@/lib/seo";
import { PortalForm } from "./PortalForm";

const description =
  "Request access to detailed files held by The GOAT Initiative. Staff review your name, email, phone number, and organization, then approve or deny the request.";

export const metadata: Metadata = pageMetadata({
  title: "Request access to detailed files",
  description,
  path: "/intel/portal",
});

export default function IntelPortalPage() {
  return (
    <PageFrame path="/intel/portal" name="Request access" description={description}>
      <section className="py-16">
        <div className="max-w-lg mx-auto px-4">
          <p className="font-mono text-xs text-primary tracking-widest mb-4">DETAILED FILES</p>
          <h1 className="font-heading text-4xl text-gray-100 tracking-wider mb-4">
            REQUEST <span className="text-primary">ACCESS</span>
          </h1>
          <PortalForm />
        </div>
      </section>
    </PageFrame>
  );
}
