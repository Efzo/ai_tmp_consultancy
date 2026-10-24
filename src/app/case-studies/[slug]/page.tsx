import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCaseStudies } from '@/lib/site-settings';

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies();
  return caseStudies.map((study) => ({
    slug: study.slug,
  }));
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseStudies = await getCaseStudies();
  const study = caseStudies.find((s) => s.slug === slug);

  if (!study) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-midnight text-platinum pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <Link href="/case-studies" className="text-slate-muted hover:text-white transition-colors text-sm mb-4 block">
            ← Back to Case Studies
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <span className="text-xs font-bold tracking-widest uppercase text-electric bg-electric/10 px-3 py-1 rounded-full border border-electric/20 w-fit">
              {study.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {study.title}
          </h1>
          <p className="text-xl text-slate-muted max-w-3xl leading-relaxed">
            {study.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-cyan-ai">The Challenge</h2>
              <p className="text-slate-muted leading-relaxed text-lg">
                {study.challenge}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-cyan-ai">The Solution</h2>
              <p className="text-slate-muted leading-relaxed text-lg">
                {study.solution}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 text-cyan-ai">Technical Decisions</h2>
              <div className="grid grid-cols-1 gap-4">
                {study.technicalDecisions.map((decision, idx) => (
                  <div key={idx} className="glass-card p-4 flex items-start gap-3">
                    <span className="text-slate-muted">•</span>
                    <span className="text-slate-muted">{decision}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="glass-panel p-8 sticky top-32">
              <h3 className="text-xl font-bold mb-6">Key Outcomes</h3>
              <div className="space-y-6 mb-10">
                {study.metrics.map((metric, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-glass pb-4">
                    <span className="text-sm text-slate-muted">{metric.label}</span>
                    <span className="font-bold text-electric">{metric.value}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-electric/10 rounded-xl border border-electric/20 mb-8">
                <h4 className="text-sm font-bold text-white mb-2">Bottom Line:</h4>
                <p className="text-sm text-slate-muted italic leading-relaxed">
                  "{study.outcome}"
                </p>
              </div>
              <Link 
                href="/book" 
                className="btn-primary block text-center w-full"
              >
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
