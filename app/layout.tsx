import type { Metadata, Viewport } from "next";
import { Inter, Orbitron } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { TrustBanner } from "@/components/TrustBanner";
import { Navbar } from "@/components/Navbar";
import { FloatingHUD } from "@/components/FloatingHUD";
import { FloatingDonate } from "@/components/FloatingDonate";
import { Footer } from "@/components/Footer";
import { VisitorTracker } from "@/components/VisitorTracker";
import { HOME_DESCRIPTION, HOME_TITLE, SITE_NAME, SITE_URL, organizationJsonLd } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0f",
};

const adsensePublisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "ca-pub-3375791945592013";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: HOME_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    url: "/",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TGI Portal",
  },
  other: {
    "google-adsense-account": adsensePublisherId,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="google-adsense-account" content={adsensePublisherId} />
      </head>
      <body
        className={`${inter.variable} ${orbitron.variable} font-sans bg-dark min-h-screen`}
      >
        {/* Google AdSense Auto Ads Script */}
        <Script
          id="adsbygoogle-auto-ads"
          strategy="beforeInteractive"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`}
          crossOrigin="anonymous"
        />
        {/* Google AdSense Auto Ads Initialization */}
        <Script
          id="adsbygoogle-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: "${adsensePublisherId}",
                enable_page_level_ads: true
              });
            `,
          }}
        />
        {/* CRT Scanline Overlay */}
        <div className="crt-scanlines" aria-hidden="true" />
        
        {/* Topographic/Hex Grid Background */}
        <div className="topo-grid" aria-hidden="true" />
        
        {/* Main Content Wrapper */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Trust Banner */}
          <TrustBanner />
          
          {/* Navigation */}
          <Navbar />
          
          {/* Main Content */}
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-dark focus:px-4 focus:py-2"
          >
            Skip to content
          </a>
          <main id="content" className="flex-grow pt-28">
            {children}
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
        
        {/* Floating HUD */}
        <FloatingHUD />
        
        {/* Floating Donate Button */}
        <FloatingDonate />
        
        {/* Visitor Tracking */}
        <VisitorTracker />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
