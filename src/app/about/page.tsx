import { getConsultantPortrait, portraitPreviewUrl } from "@/lib/portraits";
import { getManagedPageContent, managedPageMetadata, canPreviewPages } from "@/lib/managed-pages";
import ManagedPageCTA from "@/components/ManagedPageCTA";
import PagePreviewBanner from "@/components/admin/PagePreviewBanner";
import Image from "next/image";

export const dynamic = "force-dynamic";
const headingClass = "text-2xl font-semibold tracking-tight sm:text-3xl";
function Paragraphs({ items }: { items: string[] }) {
  return <div className="space-y-4 text-base leading-8 text-slate-muted">{items.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>;
}

export default async function AboutPage() {
  const content = await getManagedPageContent("about");
  const portrait = getConsultantPortrait(content, "about");
  const imageUrl = portraitPreviewUrl(portrait.url, await canPreviewPages());

  return <main className="min-h-screen bg-midnight px-6 pb-20 pt-36 text-platinum">
    <PagePreviewBanner slug="about" />
    <div className="mx-auto max-w-5xl space-y-16 sm:space-y-20">
      <section className="space-y-8" aria-labelledby="about-heading">
        <header className="max-w-4xl space-y-6">
          <h1 id="about-heading" className="text-4xl font-semibold tracking-tight md:text-6xl">{content.headline}</h1>
          <p className="text-xl font-medium leading-relaxed text-cyan-ai sm:text-2xl">{content.tagline}</p>
        </header>
        {content.introduction.length > 0 && <div className="max-w-3xl space-y-5">
          <h2 className={headingClass}>{content.introductionHeading}</h2>
          <Paragraphs items={content.introduction} />
          <p className="border-l-2 border-electric pl-5 text-lg font-medium leading-8">{content.promise}</p>
        </div>}
      </section>

      <section className="border-t border-glass pt-12" aria-labelledby="founder-heading">
        <h2 id="founder-heading" className={`${headingClass} mb-8`}>{content.founderHeading}</h2>
        <div className="grid items-start gap-10 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div><h3 className="text-2xl font-semibold">{content.founderName}</h3><p className="mt-3 text-sm leading-7 text-electric">{content.founderRole}</p></div>
            <Paragraphs items={content.bio.slice(0, 3)} />
            <blockquote className="border-l-2 border-electric py-2 pl-5 text-xl font-medium leading-8">{content.founderPrinciple}</blockquote>
            <Paragraphs items={content.bio.slice(3)} />
          </div>
          <aside className="space-y-6">
            <figure className="about-portrait"><Image src={imageUrl} alt={portrait.alt} width={600} height={800} sizes="(max-width: 639px) calc(100vw - 48px), (max-width: 1023px) 384px, 310px" unoptimized={!imageUrl.startsWith("/photos/")} className="h-auto w-full rounded-2xl" /><figcaption>{content.founderName}</figcaption></figure>
            {content.expertise.length > 0 && <div className="glass-panel p-6"><h3 className="mb-4 text-lg font-semibold">{content.expertiseHeading}</h3><ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-slate-muted">{content.expertise.map((item, index) => <li key={index}>{item}</li>)}</ul></div>}
          </aside>
        </div>
      </section>

      {content.audiences.cards.length > 0 && <section aria-labelledby="audiences-heading">
        <h2 id="audiences-heading" className={`${headingClass} mb-8`}>{content.audiences.heading}</h2>
        <div className="grid items-start gap-6 lg:grid-cols-3">{content.audiences.cards.map((item, index) => <article key={index} className="glass-card h-full space-y-4 p-6"><h3 className="text-xl font-semibold leading-8">{item.title}</h3><Paragraphs items={item.body} /></article>)}</div>
      </section>}

      {content.capabilities.cards.length > 0 && <section aria-labelledby="capabilities-heading">
        <h2 id="capabilities-heading" className={`${headingClass} mb-8`}>{content.capabilities.heading}</h2>
        <div className="grid gap-6 md:grid-cols-2">{content.capabilities.cards.map((item, index) => <article key={index} className="glass-card space-y-3 p-6"><h3 className="text-xl font-semibold">{item.title}</h3><p className="whitespace-pre-line leading-8 text-slate-muted">{item.description}</p></article>)}</div>
      </section>}

      {content.pedigree.length > 0 && <section aria-labelledby="values-heading">
        <h2 id="values-heading" className={`${headingClass} mb-8`}>{content.pedigreeHeading}</h2>
        <div className="divide-y divide-glass rounded-2xl border border-glass px-6">{content.pedigree.map((item, index) => <article key={index} className="grid gap-3 py-6 md:grid-cols-[1fr_2fr] md:gap-8"><h3 className="text-lg font-semibold">{item.title}</h3><p className="leading-8 text-slate-muted">{item.desc}</p></article>)}</div>
      </section>}

      {content.approach.steps.length > 0 && <section aria-labelledby="approach-heading">
        <h2 id="approach-heading" className={headingClass}>{content.approach.heading}</h2><p className="mt-3 text-lg text-cyan-ai">{content.approach.tagline}</p>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2">{content.approach.steps.map((item, index) => <li key={index} className="glass-card p-6"><span className="text-sm font-semibold text-electric">{item.step}</span><h3 className="mt-3 text-xl font-semibold">{item.title}</h3><p className="mt-3 leading-8 text-slate-muted">{item.description}</p></li>)}</ol>
      </section>}

      {content.foundation.paragraphs.length > 0 && <section className="border-t border-glass pt-12" aria-labelledby="foundation-heading"><h2 id="foundation-heading" className={`${headingClass} mb-6 max-w-3xl`}>{content.foundation.heading}</h2><div className="max-w-3xl"><Paragraphs items={content.foundation.paragraphs} /></div></section>}

      {content.education.length > 0 && <section className="glass-card p-6 sm:p-8" aria-labelledby="education-heading">
        <h2 id="education-heading" className={`${headingClass} mb-8`}>{content.educationHeading}</h2>
        <ol className="space-y-7 border-l border-electric/30 pl-6">{content.education.map((item, index) => <li key={index} className="relative before:absolute before:-left-[29px] before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-electric"><h3 className="font-semibold">{item.qualification}</h3><p className="mt-1 text-slate-muted">{item.institution}</p>{item.period && <p className="mt-2 text-sm text-slate-muted">{item.period}</p>}{item.details && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-muted">{item.details}</p>}</li>)}</ol>
      </section>}
      {content.certs.length > 0 && <section aria-labelledby="certifications-heading"><h2 id="certifications-heading" className={`${headingClass} mb-6`}>{content.certsHeading}</h2><ul className="grid gap-3 sm:grid-cols-2">{content.certs.map((cert, index) => <li key={index} className="flex items-start justify-between gap-4 rounded-xl border border-glass bg-white/5 p-4"><span className="text-sm leading-6">{cert.name}</span><span className="shrink-0 text-xs font-semibold leading-6 text-cyan-ai">{cert.status}</span></li>)}</ul></section>}

      <ManagedPageCTA content={content.cta} />
      <p className="text-center text-sm text-slate-muted">{content.signature}</p>
    </div>
  </main>;
}

export async function generateMetadata() { return managedPageMetadata("about"); }
