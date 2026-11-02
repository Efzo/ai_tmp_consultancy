import Link from "next/link";
import ManagedPageCTA from "@/components/ManagedPageCTA";
import PagePreviewBanner from "@/components/admin/PagePreviewBanner";
import { getManagedPageContent } from "@/lib/managed-pages";

export default async function AudiencePage({ slug }: { slug: "for-businesses" | "for-founders" }) {
  const content = await getManagedPageContent(slug);
  return <main className="min-h-screen bg-midnight text-platinum px-6 pt-36 pb-20">
    <PagePreviewBanner slug={slug} />
    <div className="section-inner">
      <header className="max-w-4xl mb-16"><h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">{content.title}</h1><p className="section-intro">{content.description}</p></header>
      <section aria-labelledby="audience-services"><h2 id="audience-services" className="section-title mb-8">{content.servicesHeading}</h2><div className="grid gap-6 md:grid-cols-2">{content.items.map((item, index) => <Link key={index} href={item.href} className="engagement-card flex flex-col"><h3 className="text-2xl mb-4">{item.title}</h3><p className="text-slate-muted mb-6 flex-1">{item.description}</p><span className="text-sm font-semibold text-electric">{item.cta} <span aria-hidden="true">↗</span></span></Link>)}</div></section>
      <section className="glass-panel p-8 mt-12"><h2 className="text-2xl mb-4">{content.ongoingTitle}</h2><p className="text-slate-muted leading-relaxed">{content.ongoingDescription}</p></section>
      <ManagedPageCTA content={content.cta} />
    </div>
  </main>;
}
