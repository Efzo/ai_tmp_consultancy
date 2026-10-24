"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, BriefcaseBusiness, CalendarDays, ChevronLeft, FileCog, FileText, FolderOpen, LayoutDashboard, LogOut, Menu, Package, PanelLeft, Search, Settings, ShieldCheck, SlidersHorizontal, Users, Workflow } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Pages & Content", href: "/admin/content", icon: FileText },
  { name: "Page Builder", href: "/admin/page-builder", icon: PanelLeft },
  { name: "Blog & Articles", href: "/admin/blog", icon: BookOpen },
  { name: "Consulting Services", href: "/admin/services", icon: BriefcaseBusiness },
  { name: "Case Studies", href: "/admin/case-studies", icon: FolderOpen },
  { name: "Media Library", href: "/admin/media", icon: FileCog },
  { name: "Leads & Inquiries", href: "/admin/leads", icon: Users },
  { name: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { name: "Consulting Packages", href: "/admin/packages", icon: Package },
  { name: "Testimonials", href: "/admin/testimonials", icon: FileText },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "SEO Manager", href: "/admin/seo", icon: Search },
  { name: "Website Navigation", href: "/admin/navigation", icon: Workflow },
  { name: "Site Settings", href: "/admin/settings", icon: Settings },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Security", href: "/admin/security", icon: ShieldCheck },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: SlidersHorizontal },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  if (["/admin/login", "/admin/forgot-password", "/admin/reset-password"].includes(pathname)) return <div className="min-h-screen bg-midnight text-platinum"><Navbar /><main>{children}</main><Footer /></div>;

  return (
    <div className="min-h-screen bg-slate-deep text-platinum">
      <button type="button" aria-label="Open admin navigation" onClick={() => setIsMobileOpen(true)} className="fixed left-4 top-4 z-40 rounded-lg border border-glass bg-midnight p-2 text-white md:hidden"><Menu className="h-5 w-5" /></button>
      {isMobileOpen && <button aria-label="Close admin navigation" type="button" onClick={() => setIsMobileOpen(false)} className="fixed inset-0 z-40 bg-black/60 md:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-glass bg-midnight/95 backdrop-blur-xl transition-all duration-300 ${isCollapsed ? "w-20" : "w-72"} ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-glass px-5">
          {!isCollapsed && <Link href="/admin" className="text-xl font-bold tracking-tight">Admin<span className="text-electric">CMS</span></Link>}
          <button type="button" aria-label="Collapse sidebar" onClick={() => setIsCollapsed(!isCollapsed)} className="rounded-lg p-2 text-slate-muted hover:bg-white/10 hover:text-white"><ChevronLeft className={`h-5 w-5 transition-transform ${isCollapsed ? "rotate-180" : ""}`} /></button>
        </div>
        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
            return <Link key={item.href} href={item.href} onClick={() => setIsMobileOpen(false)} title={isCollapsed ? item.name : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? "bg-electric/15 text-electric" : "text-slate-muted hover:bg-white/10 hover:text-white"}`}><item.icon className="h-5 w-5 shrink-0" />{!isCollapsed && <span>{item.name}</span>}</Link>;
          })}
        </nav>
        <div className="shrink-0 border-t border-glass p-3"><Link href="/api/auth/signout" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-muted hover:bg-red-500/10 hover:text-red-300"><LogOut className="h-5 w-5" />{!isCollapsed && <span>Sign out</span>}</Link></div>
      </aside>

      <div className={`min-h-screen transition-[padding] duration-300 ${isCollapsed ? "md:pl-20" : "md:pl-72"}`}>
        <header className="sticky top-0 z-30 flex h-16 min-w-0 items-center justify-between border-b border-glass bg-midnight/90 px-4 backdrop-blur-xl md:px-8"><div className="min-w-0 pl-10 md:pl-0"><p className="truncate text-sm text-slate-muted">Admin Console <span className="px-2">/</span><span className="text-white">{navItems.find((item) => pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`)))?.name ?? "Overview"}</span></p></div><div className="flex shrink-0 items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-electric text-xs font-bold">EO</div><span className="hidden text-sm text-white sm:inline">Efosa Ojomo</span></div></header>
        <main className="min-w-0 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
