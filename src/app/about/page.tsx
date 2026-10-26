import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const page = await prisma.page.findUnique({
    where: { slug: "about" },
  });

  // Define the structure we expect in page.content
  const content = (page?.content as any) || {
    headline: "Bridging Engineering, Product & Business",
    bio: [
      "I am a Technical Product Manager and technology product leader with over 10 years of experience building at the intersection of product strategy, cloud architecture, enterprise software, and AI systems.",
      "Throughout my career—spanning leadership roles at Amazon, Microsoft, and Vertex—I have specialized in one specific challenge: reducing the distance between a high-level business vision and a production-ready technical implementation.",
      "My approach starts with the business and customer problem—not a particular technology. I combine technical fluency in cloud platforms, enterprise software, and AI systems with a product-first mindset focused on measurable business outcomes.",
      "Strongest where technical depth meets product judgment: clarifying ambiguous customer problems, defining rigorous PRDs, prioritizing high-impact trade-offs, and aligning cross-functional teams to deliver on a roadmap."
    ],
    expertise: [
      "Technical Product Management & Roadmapping",
      "Enterprise SaaS Architecture",
      "Fractional TPM Leadership",
      "Cloud Platform Modernization",
      "AI Product Strategy & Evaluation"
    ],
    pedigree: [
      { title: "Enterprise Leadership", desc: "Proven track record at global technology leaders (Amazon, Microsoft, Vertex) delivering scalable cloud and platform products." },
      { title: "AI Innovation", desc: "Deep experience in LLM integration, RAG systems, and Agentic AI strategy for modern SaaS platforms." },
      { title: "Product Rigor", desc: "Expertise in PRDs, backlog ownership, and OKR-driven delivery for complex enterprise environments." },
    ],
    certs: [
      { name: "AWS Solutions Architect Associate", status: "Certified" },
      { name: "Professional Scrum Master (PSM I)", status: "Certified" },
      { name: "Professional Scrum Product Owner (PSPO I)", status: "Certified" },
      { name: "Azure App Service Development", status: "Certified" },
    ]
  };

  return (
    <main className="min-h-screen bg-midnight text-platinum pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <section className="mb-20">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
            {content.headline.split(' ').map((word: string, i: number) => 
              i % 2 === 0 ? <span key={i}>{word} </span> : <span key={i} className="text-electric">{word} </span>
            )}
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6 text-lg text-slate-muted leading-relaxed">
              {content.bio.map((para: string, i: number) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="glass-panel p-8 h-fit">
              <h3 className="text-xl font-bold mb-6">Core Expertise</h3>
              <ul className="list-disc space-y-4 pl-5 text-sm text-slate-muted marker:text-slate-muted">
                {content.expertise.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6 text-cyan-ai">Professional Pedigree</h2>
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
            <h2 className="text-2xl font-bold mb-6 text-cyan-ai">Certifications</h2>
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
