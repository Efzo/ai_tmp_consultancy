import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import PublicChrome from "@/components/PublicChrome";
import { getFooterSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Efosa Ojomo | AI Product Strategy & Technical Consulting",
  description: "Transforming AI ideas into validated product strategies and real business outcomes.",
  metadataBase: new URL("https://ojomoefosa.com"),
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/logo_pack/favicon.ico", type: "image/x-icon" },
      { url: "/logo_pack/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/logo_pack/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo_pack/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/logo_pack/favicon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/logo_pack/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo_pack/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/logo_pack/favicon.ico",
    apple: [{ url: "/logo_pack/favicon-180.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    title: "Efosa Ojomo | AI Product Strategy & Technical Consulting",
    description: "Transforming AI ideas into validated product strategies and real business outcomes.",
    url: "https://ojomoefosa.com",
    siteName: "Efosa Ojomo AI Product & Technical Consulting",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footerSettings = await getFooterSettings();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-midnight text-platinum">
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('site-theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;}else if(window.matchMedia('(prefers-color-scheme: light)').matches){document.documentElement.dataset.theme='light';}}catch(e){}})();` }} />
        <GoogleAnalytics />
        <PublicChrome footerSettings={footerSettings}>{children}</PublicChrome>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Efosa Ojomo AI Product & Technical Consulting",
          url: "https://ojomoefosa.com",
          areaServed: "Worldwide",
          serviceType: ["AI Product Strategy", "Technical Product Management", "AI Solution Architecture"],
        }) }} />
      </body>
    </html>
  );
}
