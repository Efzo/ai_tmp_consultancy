import React from 'react';
import { Search, PencilRuler, Hammer, Rocket, TrendingUp } from 'lucide-react';

const steps = [
  { title: "Discover", desc: "Problem definition, user research, and technical feasibility.", icon: Search },
  { title: "Design", desc: "System architecture, data modeling, and product roadmapping.", icon: PencilRuler },
  { title: "Build", desc: "Agile implementation with modern AI-augmented engineering.", icon: Hammer },
  { title: "Launch", desc: "Deployment, QA, and operational readiness.", icon: Rocket },
  { title: "Improve", desc: "Monitoring, iterative feedback, and scaling.", icon: TrendingUp },
];

interface ProcessProps {
  content: {
    title: string;
    subheadline: string;
  };
}

export default function Process({ content }: ProcessProps) {
  return (
    <section className="py-32 px-6 bg-slate-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            {content.title}
          </h2>
          <p className="text-slate-muted text-xl max-w-3xl mx-auto">
            {content.subheadline}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative p-6 text-center group">
                <div className="w-12 h-12 mx-auto rounded-full bg-electric/10 flex items-center justify-center mb-4 text-electric group-hover:bg-electric group-hover:text-white transition-all">
                  <Icon size={20} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-slate-muted text-sm leading-relaxed">{step.desc}</p>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-electric/30 text-2xl">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
