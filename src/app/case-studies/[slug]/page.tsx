import { pageMetadata } from "@/lib/seo";
import CaseStudyShowcase from "@/components/CaseStudyShowcase";
import { prisma } from "@/lib/prisma";
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

  const sections = [
    ["Project Overview", study.summary],
    ["Product Objectives", study.requirements],
    ["My Role and Responsibilities", study.role],
    ["Technical Architecture", study.architecture],
    ["Business Problem", study.businessProblem],
    ["Implementation Approach", study.implementation],
    ["Technical Trade-offs", study.details?.tradeoffs],
    ["Challenges and Solutions", study.challenges],
    ["Outcomes and Lessons Learned", [study.outcomes, study.details?.lessons].filter(Boolean).join("\n\n")],
  ];
  const projectDetails = [["Role", study.role], ["Requirements", study.requirements], ["Architecture", study.architecture]].filter(([, text]) => text?.trim());
  const hasSidebar = projectDetails.length > 0 || study.stack.length > 0;
  const imageIds = study.images.filter((url) => url.startsWith("/api/media/")).map((url) => url.split("/").pop()!);
  const assets = imageIds.length ? await prisma.mediaAsset.findMany({ where: { id: { in: imageIds } }, select: { id: true, altText: true } }).catch(() => []) : [];
  return (
    <main className="min-h-screen bg-midnight text-platinum pt-36 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/case-studies" className="text-electric hover:underline mb-8 inline-block">
          ← Back to Case Studies
        </Link>

        <header className="mb-12 text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-electric bg-electric/10 px-3 py-1 rounded-full border border-electric/20 mb-4 inline-block">
            {study.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-semibold mb-6 tracking-tight">{study.title}</h1>
          <p className="text-slate-muted text-xl leading-relaxed">{study.summary}</p>
        </header>

        <div className={`grid grid-cols-1 gap-12 ${hasSidebar ? "lg:grid-cols-3" : ""}`}>
          <div className={`${hasSidebar ? "lg:col-span-2" : ""} space-y-12`}>
            {sections.filter(([, text]) => text?.trim()).map(([heading, text]) => <section key={heading}><h2 className="mb-4 text-2xl font-bold text-electric">{heading}</h2><p className="whitespace-pre-line leading-relaxed text-slate-muted">{text}</p></section>)}
            {!!study.details?.features.length && <section><h2 className="mb-4 text-2xl font-bold text-electric">Product Features</h2><ul className="list-disc pl-5 text-slate-muted">{study.details.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></section>}
          </div>
          {hasSidebar && <aside className="space-y-8">
            {!!projectDetails.length && <div className="glass-card p-6"><h2 className="mb-4 border-b border-electric/20 pb-2 text-lg font-bold">Project Details</h2><dl className="space-y-4">{projectDetails.map(([label, text]) => <div key={label}><dt className="text-xs font-bold uppercase tracking-wider text-slate-muted">{label}</dt><dd className="text-sm">{text}</dd></div>)}</dl></div>}
            {!!study.stack.length && <div className="glass-card p-6"><h2 className="mb-4 border-b border-electric/20 pb-2 text-lg font-bold">Technology Stack</h2><div className="flex flex-wrap gap-2">{study.stack.map((tech) => <span key={tech} className="rounded border border-electric/20 bg-electric/10 px-2 py-1 text-xs text-electric">{tech}</span>)}</div></div>}
          </aside>}
        </div>

        <CaseStudyShowcase title={study.title} images={study.images} details={study.details} assets={assets} />
        <section className="mt-20 pt-10 border-t border-electric/20 text-center">
          <h3 className="text-2xl font-bold mb-6">Discuss a related project</h3>
          <Link href="/contact" className="btn-primary inline-block">
            Discuss Your Project
          </Link>
        </section>
      </div>
    </main>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  return study ? pageMetadata(study.title, study.summary, `/case-studies/${study.slug}`) : {};
}
