import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { HomeContent } from "@/lib/home-content";

export default function AudiencePaths({ content }: { content: HomeContent["audiences"] }) {
  if (!content.items.length) return null;
  return <section className="section-shell border-y border-glass"><div className="section-inner">
    <div className="section-heading"><h2 className="section-title">{content.title}</h2><p className="section-intro">{content.subheadline}</p></div>
    <div className="grid gap-6 md:grid-cols-2">{content.items.map((item, index) => <Link key={index} href={item.href} className="engagement-card group flex flex-col">
      <h3 className="mb-4 text-2xl">{item.title}</h3><p className="mb-6 flex-1 text-slate-muted">{item.description}</p>
      <span className="flex items-center gap-2 text-sm font-semibold text-electric">{item.cta}<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></span>
    </Link>)}</div>
  </div></section>;
}
