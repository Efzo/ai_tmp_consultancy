import { getManagedPageContent, managedPageMetadata } from "@/lib/managed-pages";
import PagePreviewBanner from "@/components/admin/PagePreviewBanner";
import React from 'react';
import Link from 'next/link';
import { getCaseStudies } from '@/lib/case-studies';

export const dynamic = "force-dynamic";

export default async function CaseStudiesPage() {
  const content = await getManagedPageContent("case-studies");
  const caseStudies = await getCaseStudies();

  return (
    <main className="min-h-screen bg-midnight text-platinum pt-36 pb-20 px-6"><PagePreviewBanner slug="case-studies" />
      <div className="max-w-6xl mx-auto">
        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl font-semibold mb-6 tracking-tight">{content.title}</h1>
          <p className="section-intro mx-auto">{content.description}</p>
        </section>

        {caseStudies.length === 0 ? (
          <div className="text-center py-20 glass-card">
            <p className="text-slate-muted text-lg">{content.emptyText}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((study) => (
              <div key={study.id} className="glass-card p-8 flex flex-col h-full group hover:border-electric/40 transition-colors">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-xs font-bold tracking-widest uppercase text-electric bg-electric/10 px-3 py-1 rounded-full border border-electric/20">
                    {study.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-electric transition-colors">{study.title}</h3>
                <p className="text-slate-muted mb-8 flex-grow leading-relaxed">
                  {study.summary}
                </p>
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="btn-secondary text-center w-full"
                >
                  {content.itemCta}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}


export async function generateMetadata() { return managedPageMetadata("case-studies"); }
