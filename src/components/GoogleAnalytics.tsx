"use client";
import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
export default function GoogleAnalytics() {
  const pathname = usePathname();
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const enabled = Boolean(id && /^G-[A-Z0-9]+$/.test(id) && !id.includes("XXXX") && !id.includes("DEMO")) && !pathname.startsWith("/admin");
  useEffect(() => {
    if (!enabled) return;
    trackEvent("page_view", { page_path: pathname, page_location: `${window.location.origin}${pathname}` });
    const click = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest("a") : null;
      if (!anchor) return;
      const url = new URL(anchor.href, window.location.origin);
      if (url.origin === window.location.origin && url.pathname === "/book") trackEvent("consultation_booking_click", { destination: "booking_page" });
      if (anchor.dataset.booking === "external") trackEvent("consultation_booking_click", { destination: "calendar_provider" });
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, [enabled, pathname]);
  if (!enabled) return null;
  return <><Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${id}`} /><Script id="ga-init" strategy="afterInteractive" onReady={() => trackEvent("page_view", { page_path: window.location.pathname, page_location: `${window.location.origin}${window.location.pathname}` })}>{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${id}',{send_page_view:false});`}</Script></>;
}
