"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import type { NavigationItem } from "@/lib/site-settings";
const defaultItems: NavigationItem[] = [
  { label: "Services", href: "/services" }, { label: "Portfolio", href: "/case-studies" },
  { label: "Engagements", href: "/engagements" }, { label: "About", href: "/about" },
  { label: "Insights", href: "/blog" }, { label: "Videos", href: "/videos" }, { label: "Contact", href: "/contact" },
];
export default function Navbar({ items = defaultItems }: { items?: NavigationItem[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const desktopMenu = items.length <= 7 && items.reduce((length, item) => length + item.label.length, 0) <= 70;
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 20);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (event.target instanceof Node && !navRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  const active = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  return <nav ref={navRef} aria-label="Main navigation" onKeyDown={(event) => { if (event.key === "Escape" && open) { setOpen(false); menuRef.current?.focus(); } }} className={`fixed top-0 z-50 w-full transition-[padding] duration-200 ${scrolled ? "py-2" : "py-4"}`}><div className="mx-auto max-w-7xl px-4 sm:px-6">
    <div className="site-nav-surface glass-panel flex items-center justify-between gap-4 px-4 py-3 lg:px-5">
      <Link href="/" onClick={() => setOpen(false)} aria-label="Efosa Ojomo home" className="flex shrink-0 items-center gap-2.5 text-lg font-semibold tracking-tight"><Image src="/logo_pack/logo.png" alt="" width={34} height={34} priority className="h-8 w-8 rounded-lg object-cover" /><span>Efosa <span className="text-electric">Ojomo</span></span></Link>
      <div className={desktopMenu ? "hidden items-center gap-5 text-sm xl:flex" : "hidden"}>{items.map((item) => <Link key={`${item.label}-${item.href}`} href={item.href} aria-current={active(item.href) ? "page" : undefined} className={`inline-flex min-h-11 items-center transition-colors hover:text-platinum ${active(item.href) ? "text-platinum" : "text-slate-muted"}`}>{item.label}</Link>)}</div>
      <div className="flex shrink-0 items-center gap-2"><ThemeToggle /><Link href="/book" className="btn-primary hidden text-sm sm:inline-flex">Book a Discovery Call</Link><button ref={menuRef} type="button" aria-expanded={open} aria-controls="public-navigation-menu" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)} className={`flex h-11 w-11 items-center justify-center rounded-xl border border-glass ${desktopMenu ? "xl:hidden" : ""}`}>{open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}</button></div>
    </div>
    {open && <div id="public-navigation-menu" className={`site-nav-surface glass-panel mt-2 grid max-h-[calc(100dvh-7rem)] gap-1 overflow-y-auto p-3 ${desktopMenu ? "xl:hidden" : ""}`}>{items.map((item) => <Link key={`${item.label}-${item.href}`} onClick={() => setOpen(false)} href={item.href} aria-current={active(item.href) ? "page" : undefined} className={`rounded-lg px-3 py-3 text-sm hover:bg-white/5 ${active(item.href) ? "text-electric" : "text-slate-muted"}`}>{item.label}</Link>)}<Link onClick={() => setOpen(false)} href="/book" className="btn-primary mt-2 sm:hidden">Book a Discovery Call</Link></div>}
  </div></nav>;
}
