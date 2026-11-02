import { getManagedPageContent } from "@/lib/managed-pages";

export default async function Process({ content }: { content: { title: string; subheadline: string } }) {
  const { steps } = await getManagedPageContent("process");
  return <section className="section-shell section-tint"><div className="section-inner"><div className="section-heading"><h2 className="section-title">{content.title}</h2><p className="section-intro">{content.subheadline}</p></div><ol className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">{steps.map((step, index) => <li className="process-step" key={index}><span className="process-step-number">{step.step}</span><h3 className="mb-3 mt-5 text-xl">{step.title}</h3><p className="text-sm text-slate-muted">{step.description}</p></li>)}</ol></div></section>;
}
