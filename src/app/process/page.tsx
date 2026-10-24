import React from 'react';
import Link from 'next/link';

const processSteps = [
  {
    step: "01",
    title: "Discovery",
    description: "We start with an intensive discovery phase to understand your current state, existing data silos, and the underlying business objectives. This involves stakeholder interviews and technical audits of your current stack."
  },
  {
    step: "02",
    title: "Business Problem Assessment",
    description: "We strip away the AI hype to identify the actual problem. We define the 'Job to be Done' and determine if AI is the most effective tool for the solution, or if a simpler architectural change is required."
  },
  {
    step: "03",
    title: "Scope & Proposal",
    description: "I provide a detailed project proposal including a defined scope, target outcomes, timeline, and resource requirements. This ensures total alignment on expectations before any engineering begins."
  },
  {
    step: "04",
    title: "Product Strategy & Technical Planning",
    description: "The core design phase. We create the product roadmap, define the technical architecture (RAG, Agentic workflows, etc.), and write the high-fidelity PRDs that engineering teams can execute against."
  },
  {
    step: "05",
    title: "Execution & Implementation Oversight",
    description: "Whether acting as a Fractional TPM or an Advisor, I ensure the build stays aligned with the strategy. I manage the backlog, resolve technical trade-offs, and conduct rigorous quality evaluations."
  },
  {
    step: "06",
    title: "Evaluation & Handover",
    description: "We measure the results against the initial KPIs. I provide the final documentation, operational guidelines, and a handover plan to ensure your internal team can maintain and scale the system."
  }
];

export default function ProcessPage() {
  return (
    <main className="min-h-screen bg-midnight text-platinum pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            How <span className="text-electric">We Work</span>
          </h1>
          <p className="text-slate-muted text-xl max-w-3xl mx-auto">
            A structured, outcome-driven engagement lifecycle designed to move 
            you from uncertainty to a scalable, production-ready AI product.
          </p>
        </section>

        <div className="space-y-12 relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-glass hidden md:block"></div>
          
          {processSteps.map((item) => (
            <div key={item.step} className="relative md:pl-24 group">
              <div className="absolute left-0 top-0 w-16 h-16 hidden md:flex items-center justify-center z-10">
                <div className="w-10 h-10 rounded-full bg-midnight border-2 border-electric text-electric font-bold flex items-center justify-center transition-all duration-300 group-hover:bg-electric group-hover:text-white">
                  {item.step}
                </div>
              </div>
              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold mb-4 text-cyan-ai">{item.title}</h3>
                <p className="text-slate-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-20 text-center">
          <div className="glass-panel p-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to start your transformation?</h2>
            <p className="text-slate-muted mb-10 text-lg">
              Whether you need a one-time strategy roadmap or ongoing fractional leadership, 
              let's determine the best way to work together.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/book" className="btn-primary">Book a Discovery Call</Link>
              <Link href="/contact" className="btn-secondary">Request a Proposal</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
