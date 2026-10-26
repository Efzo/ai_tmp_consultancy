import { getManagedPageContent } from "@/lib/managed-pages";
import PagePreviewBanner from "@/components/admin/PagePreviewBanner";
export default async function ManagedLegalPage({ slug }: { slug: "privacy" | "terms" }) {
  const content = await getManagedPageContent(slug);
  return <main className="min-h-screen bg-midnight px-6 pb-24 pt-36 text-platinum"><PagePreviewBanner slug={slug} /><article className="prose prose-invert mx-auto max-w-3xl">{content.label && <p className="text-sm uppercase tracking-[0.25em] text-electric">{content.label}</p>}<h1>{content.title}</h1>{content.introduction.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}{content.sections.map((section, index) => <section key={index}><h2>{section.title}</h2>{section.body.split(/\n\s*\n/).map((paragraph, i) => <p key={i}>{paragraph}</p>)}</section>)}</article></main>;
}
