"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { FooterSettings, NavigationItem } from "@/lib/site-settings";

export default function PublicChrome({ children, footerSettings, navigationItems }: { children: ReactNode; footerSettings: FooterSettings; navigationItems: NavigationItem[] }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return <>{children}</>;
  return <><Navbar items={navigationItems} /><main>{children}</main><Footer settings={footerSettings} /></>;
}
