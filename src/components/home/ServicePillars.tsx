import Link from "next/link";
import { Target, Code2, Bot, Layout } from "lucide-react";
import { getManagedServices } from "@/lib/services";
export default async function ServicePillars({ content }: { content: { title: string; subheadline: string } }) {
  const published = await getManagedServices();
  const currentSlugs = ["technical-product-management", "software-engineering", "ai-solutions", "software-architecture"];
  const current = currentSlugs.flatMap((slug) => published.filter((service) => service.slug === slug));
  const services = current.length ? current : published.slice(0, 4);
  const icons = [Target, Code2, Bot, Layout];
  return <section className="section-shell"><div className="section-inner">
    <div className="section-heading"><h2 className="section-title">{content.title}</h2><p className="section-intro">{content.subheadline}</p></div>
    <div className="grid gap-x-10 gap-y-3 md:grid-cols-2">{services.map((service, index) => {
      const Icon = icons[index % icons.length];
      return <Link href={`/services/${service.slug}`} key={service.slug} className="capability-card group"><div className="mb-5 flex items-center justify-between"><Icon aria-hidden="true" className="h-6 w-6 text-electric" strokeWidth={1.5} /><span className="text-xs text-slate-muted">{String(index + 1).padStart(2, "0")}</span></div><h3 className="mb-3 text-xl">{service.title}</h3><p className="mb-5 max-w-xl text-slate-muted">{service.shortDescription}</p><span className="text-sm font-semibold text-electric">Explore Service <span aria-hidden="true">↗</span></span></Link>;
    })}</div><Link href="/services" className="mt-8 inline-block text-sm font-semibold text-electric">View all services ↗</Link>
  </div></section>;
}
