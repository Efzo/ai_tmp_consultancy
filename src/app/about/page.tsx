import React from 'react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-midnight text-platinum pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <section className="mb-20">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
            Bridging <span className="text-electric">Engineering</span>, <span className="text-cyan-ai">Product</span> & <span className="text-electric">Business</span>
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6 text-lg text-slate-muted leading-relaxed">
              <p>
                I am a Technical Product Manager and technology product leader with over 10 years of
                experience building at the intersection of product strategy, cloud architecture,
                enterprise software, and AI systems.
              </p>
              <p>
                Throughout my career—spanning leadership roles at Amazon, Microsoft, and Vertex—I have 
                specialized in one specific challenge: <span className="text-white font-medium">reducing the distance between a high-level business vision and a production-ready technical implementation.</span>
              </p>
              <p>
                My approach starts with the business and customer problem—not a particular technology.
                I combine technical fluency in cloud platforms, enterprise software, and AI systems with
                a product-first mindset focused on measurable business outcomes.
              </p>
              <p className="text-white font-medium">
                Strongest where technical depth meets product judgment: clarifying ambiguous customer 
                problems, defining rigorous PRDs, prioritizing high-impact trade-offs, and aligning 
                cross-functional teams to deliver on a roadmap.
              </p>
            </div>
            <div className="glass-panel p-8 h-fit">
              <h3 className="text-xl font-bold mb-6">Core Expertise</h3>
              <ul className="list-disc space-y-4 pl-5 text-sm text-slate-muted marker:text-slate-muted">
                <li>Technical Product Management & Roadmapping</li>
                <li>Enterprise SaaS Architecture</li>
                <li>Fractional TPM Leadership</li>
                <li>Cloud Platform Modernization</li>
                <li>AI Product Strategy & Evaluation</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6 text-cyan-ai">Professional Pedigree</h2>
            <div className="space-y-6 text-slate-muted">
              <div className="border-l-2 border-electric pl-4">
                <h4 className="text-white font-bold">Enterprise Leadership</h4>
                <p className="text-sm">Proven track record at global technology leaders (Amazon, Microsoft, Vertex) delivering scalable cloud and platform products.</p>
              </div>
              <div className="border-l-2 border-electric pl-4">
                <h4 className="text-white font-bold">AI Innovation</h4>
                <p className="text-sm">Deep experience in LLM integration, RAG systems, and Agentic AI strategy for modern SaaS platforms.</p>
              </div>
              <div className="border-l-2 border-electric pl-4">
                <h4 className="text-white font-bold">Product Rigor</h4>
                <p className="text-sm">Expertise in PRDs, backlog ownership, and OKR-driven delivery for complex enterprise environments.</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6 text-cyan-ai">Certifications</h2>
            <div className="grid grid-cols-1 gap-4 text-sm text-slate-muted">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-glass">
                <span>AWS Solutions Architect Associate</span>
                <span className="text-electric font-bold">Certified</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-glass">
                <span>Professional Scrum Master (PSM I)</span>
                <span className="text-electric font-bold">Certified</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-glass">
                <span>Professional Scrum Product Owner (PSPO I)</span>
                <span className="text-electric font-bold">Certified</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-glass">
                <span>Azure App Service Development</span>
                <span className="text-electric font-bold">Certified</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
