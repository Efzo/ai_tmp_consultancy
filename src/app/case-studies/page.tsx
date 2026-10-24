import React from 'react';
import Link from 'next/link';
import { getCaseStudies } from '@/lib/site-settings';

export const dynamic = "force-dynamic";

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();
  return (
    <main className="min-h-screen bg-midnight text-platinum pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Proven <span className="text-electric">Outcomes</span>
          </h1>
          <p className="text-slate-muted text-xl max-w-3xl mx-auto">
            A showcase of technical leadership and product strategy in action—moving 
            from complex challenges to measurable business results.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudies.map((study) => (
            <div key={study.slug} className="glass-card p-8 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-bold tracking-widest uppercase text-electric bg-electric/10 px-3 py-1 rounded-full border border-electric/20">
                  {study.category}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">{study.title}</h3>
              <p className="text-slate-muted mb-8 flex-grow leading-relaxed">
                {study.summary}
              </p>
              <Link 
                href={`/case-studies/${study.slug}`} 
                className="btn-secondary text-center w-full"
              >
                Read Case Study
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
