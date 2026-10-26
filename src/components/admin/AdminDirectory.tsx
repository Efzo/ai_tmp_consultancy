"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { adminGroups } from "@/lib/admin-navigation";

export default function AdminDirectory() {
  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase();
  const groups = adminGroups.map((group) => ({ ...group, items: group.items.filter((item) => item.href !== "/admin/content" && `${group.name} ${item.name} ${item.description}`.toLowerCase().includes(search)) })).filter((group) => group.items.length);
  return <section className="space-y-8">
    <label className="block"><span className="text-sm font-semibold">Find an editor or setting</span><span className="relative mt-2 block"><Search aria-hidden="true" className="absolute left-4 top-3.5 h-5 w-5 text-slate-muted" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try homepage, pricing, contact, screenshots, or inquiries" className="w-full rounded-xl border border-glass bg-midnight py-3 pl-12 pr-4" /></span></label>
    <div aria-live="polite" className="sr-only">{groups.reduce((total, group) => total + group.items.length, 0)} matching destinations</div>
    {groups.map((group) => <section key={group.id}><h2 className="text-xl font-bold">{group.name}</h2><p className="mt-2 text-sm text-slate-muted">{group.description}</p><div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{group.items.map((item) => <Link key={item.href} href={item.href} className="glass-card p-5 hover:border-electric/40"><item.icon aria-hidden="true" className="mb-4 h-5 w-5 text-electric" /><h3 className="font-semibold">{item.name}</h3><p className="mt-2 text-sm leading-relaxed text-slate-muted">{item.description}</p><span className="mt-4 inline-block text-sm text-cyan-ai">Open {item.name} →</span></Link>)}</div></section>)}
    {!groups.length && <p className="glass-panel p-6 text-slate-muted">No matching editor. Try a page name or a task such as pricing, images, or contact.</p>}
  </section>;
}
