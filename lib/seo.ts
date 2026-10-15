import type { Metadata } from "next";

export const SITE_URL = "https://www.thegoatinitiative.org";
export const SITE_NAME = "The GOAT Initiative";

export const HOME_TITLE = "The GOAT Initiative | Border Intelligence Nonprofit";
export const HOME_DESCRIPTION =
  "The GOAT Initiative is a 501(c)(3) nonprofit. We document child trafficking, human trafficking, and other border intelligence and share it with law enforcement.";

const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "The GOAT Initiative",
} as const;

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      url: path,
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "NGO",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: "TGI",
      url: SITE_URL,
      email: "cory@thegoatinitiative.org",
      description: HOME_DESCRIPTION,
      nonprofitStatus: "Nonprofit501c3",
      taxID: "99-3753614",
      founder: {
        "@type": "Person",
        "@id": `${SITE_URL}/operatives#cory-gautereaux`,
        name: "Cory Gautereaux",
        jobTitle: "Founder and President",
        url: `${SITE_URL}/operatives#cory-gautereaux`,
        sameAs: ["https://x.com/thecorygoat", "https://thecorygoat.substack.com"],
      },
      areaServed: [
        { "@type": "Country", name: "United States" },
        { "@type": "AdministrativeArea", name: "San Diego County, California" },
      ],
      knowsAbout: [
        "Child trafficking",
        "Human trafficking",
        "U.S.–Mexico border security",
        "Special interest aliens",
        "Border intelligence",
      ],
      sameAs: [
        "https://x.com/GoatInitiative",
        "https://x.com/thecorygoat",
        "https://www.youtube.com/@TheGoatInitiative",
        "https://www.instagram.com/thegoatinitiative",
        "https://www.instagram.com/thecorygoat",
        "https://substack.com/@thecorygoat",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: HOME_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-US",
    },
  ],
};
