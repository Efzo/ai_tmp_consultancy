import Link from "next/link";
import { getEngagementModels } from "@/lib/engagements";
export default async function EngagementOverview({ content }: { content: { title: string; subheadline: string } }) {
  const models = await getEngagementModels();
  if (!models.length) return null;
  return <section className="section-shell"><div className="section-inner"><div className="section-heading"><h2 className="section-title">{content.title}</h2><p className="section-intro">{content.subheadline}</p></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{models.map((model) => <article key={model.id} className="engagement-card flex flex-col"><span className="section-eyebrow mb-5">{model.type === "RETAINER" ? "Ongoing leadership" : "Scoped engagement"}</span><h3 className="mb-4 text-xl">{model.name}</h3><p className="mb-6 flex-1 text-sm text-slate-muted">{model.description}</p><Link href={`/engagements#${model.slug}`} className="text-sm font-semibold text-electric">Explore Engagement ↗</Link></article>)}</div></div></section>;
}
