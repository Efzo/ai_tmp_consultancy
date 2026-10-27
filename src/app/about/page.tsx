import { getConsultantPortrait, portraitPreviewUrl } from "@/lib/portraits";
import { getManagedPageContent, managedPageMetadata, canPreviewPages } from "@/lib/managed-pages";
import PagePreviewBanner from "@/components/admin/PagePreviewBanner";
import Image from "next/image";
import React from 'react';

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getManagedPageContent("about");
  const portrait = getConsultantPortrait(content, "about");
  const imageUrl = portraitPreviewUrl(portrait.url, await canPreviewPages());

  return (
    <main className="min-h-screen bg-midnight text-platinum pt-36 pb-20 px-6">
      <PagePreviewBanner slug="about" /><div className="max-w-5xl mx-auto">
        <section className="mb-20">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-8">
            {content.headline}
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6 text-lg text-slate-muted leading-relaxed">
              {content.bio.map((para: string, i: number) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <aside className="space-y-6">
              <figure className="about-portrait"><Image src={imageUrl} alt={portrait.alt} width={600} height={800} sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 384px, 310px" unoptimized={!imageUrl.startsWith("/photos/")} className="h-auto w-full rounded-2xl" /><figcaption>Efosa Ojomo · Technology & Product Consultant</figcaption></figure>
            <div className="glass-panel p-6 h-fit">
              <h3 className="text-xl font-bold mb-6">{content.expertiseHeading}</h3>
              <ul className="list-disc space-y-4 pl-5 text-sm text-slate-muted marker:text-slate-muted">
                {content.expertise.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            </aside>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6 text-cyan-ai">{content.pedigreeHeading}</h2>
            <div className="space-y-6 text-slate-muted">
              {content.pedigree.map((item: {title: string, desc: string}, i: number) => (
                <div key={i} className="border-l-2 border-electric pl-4">
                  <h4 className="text-white font-bold">{item.title}</h4>
                  <p className="text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6 text-cyan-ai">{content.certsHeading}</h2>
            <div className="grid grid-cols-1 gap-4 text-sm text-slate-muted">
              {content.certs.map((cert: {name: string, status: string}, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-glass">
                  <span>{cert.name}</span>
                  <span className="text-electric font-bold">{cert.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export async function generateMetadata() { return managedPageMetadata("about"); }
