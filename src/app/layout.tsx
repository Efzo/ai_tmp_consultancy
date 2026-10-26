import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import PublicChrome from "@/components/PublicChrome";
import { getFooterSettings, getNavigationItems, getSeoSettings } from "@/lib/site-settings";

const inter = localFont({ src: "../../public/fonts/InterVariable.woff2", variable: "--font-inter", weight: "100 900", style: "normal", display: "swap", fallback: ["Arial", "sans-serif"], adjustFontFallback: "Arial" });

export const dynamic = "force-dynamic";

const metadataIcons: Metadata["icons"] = {
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
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  return {
  title: seo.title,
  description: seo.description,
  metadataBase: new URL("https://ojomoefosa.com"),

  icons: metadataIcons,
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    title: seo.title,
    description: seo.description,
    url: "https://ojomoefosa.com",
    siteName: "Efosa Ojomo Technology & Product Consulting",
    images: [{ url: seo.ogImage }],
  },
};
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footerSettings = await getFooterSettings();
  const navigationItems = await getNavigationItems();
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased bg-midnight text-platinum">
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('site-theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;}else if(window.matchMedia('(prefers-color-scheme: light)').matches){document.documentElement.dataset.theme='light';}}catch(e){}})();` }} />
        <GoogleAnalytics />
        <PublicChrome footerSettings={footerSettings} navigationItems={navigationItems}>{children}</PublicChrome>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Efosa Ojomo Technology & Product Consulting",
          url: "https://ojomoefosa.com",
          areaServed: "Worldwide",
          serviceType: ["Technical Product Management", "Custom Software Engineering", "AI Solutions and Automation", "Software Architecture and Technical Advisory"],
        }) }} />
      </body>
    </html>
  );
}
