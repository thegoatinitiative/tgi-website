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
  title: "THE GOAT INITIATIVE | Official Portal",
  description: "An official portal of The GOAT Initiative - Secure Operations Center",
  keywords: ["GOAT Initiative", "TGI", "Operations", "Mission"],
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
          <main className="flex-grow pt-28">
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
      </body>
    </html>
  );
}
