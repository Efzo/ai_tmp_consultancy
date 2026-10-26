import React from 'react';
import { getCaseStudy } from '@/lib/case-studies';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = "force-dynamic";

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);

  if (!study) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-midnight text-platinum pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/case-studies" className="text-electric hover:underline mb-8 inline-block">
          \u2190 Back to Portfolio
        </Link>

        <header className="mb-16 text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-electric bg-electric/10 px-3 py-1 rounded-full border border-electric/20 mb-4 inline-block">
            {study.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">{study.title}</h1>
          <p className="text-slate-muted text-xl leading-relaxed">{study.summary}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-electric">The Challenge</h2>
              <p className="text-slate-muted leading-relaxed">{study.businessProblem}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-electric">Implementation Approach</h2>
              <p className="text-slate-muted leading-relaxed">{study.implementation}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-electric">Trade-offs & Challenges</h2>
              <p className="text-slate-muted leading-relaxed">{study.challenges}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-electric">The Outcome</h2>
              <p className="text-slate-muted leading-relaxed">{study.outcomes}</p>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-4 border-b border-electric/20 pb-2">Project Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-slate-muted font-bold">Role</label>
                  <p className="text-sm">{study.role}</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-slate-muted font-bold">Requirements</label>
                  <p className="text-sm">{study.requirements}</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-slate-muted font-bold">Architecture</label>
                  <p className="text-sm">{study.architecture}</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-4 border-b border-electric/20 pb-2">Technology Stack</h3>
              <div className="flex flex-wrap gap-2">
                {study.stack.map((tech) => (
                  <span key={tech} className="text-xs bg-electric/10 text-electric px-2 py-1 rounded border border-electric/20">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-20 pt-10 border-t border-electric/20 text-center">
          <h3 className="text-2xl font-bold mb-6">Interested in a similar result?</h3>
          <Link href="/contact" className="btn-primary inline-block">
            Discuss Your Project
          </Link>
        </section>
      </div>
    </main>
  );
}
