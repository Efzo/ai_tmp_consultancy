"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { FooterSettings } from "@/lib/site-settings";

export default function PublicChrome({ children, footerSettings }: { children: ReactNode; footerSettings: FooterSettings }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return <>{children}</>;
  return <><Navbar /><main>{children}</main><Footer settings={footerSettings} /></>;
}
