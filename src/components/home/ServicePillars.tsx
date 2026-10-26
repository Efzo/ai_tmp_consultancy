import React from 'react';
import Link from 'next/link';
import { Target, Code2, Bot, Layout } from 'lucide-react';

const pillars = [
  {
    title: "Technical Product Management",
    desc: "Turning business challenges into clear product direction and executable roadmaps.",
    slug: "technical-product-management",
    icon: Target,
  },
  {
    title: "Custom Software Engineering",
    desc: "Building reliable, maintainable full-stack applications that solve real problems.",
    slug: "software-engineering",
    icon: Code2,
  },
  {
    title: "AI Solutions & Automation",
    desc: "Applying LLMs and agentic workflows to drive operational efficiency.",
    slug: "ai-solutions",
    icon: Bot,
  },
  {
    title: "Software Architecture",
    desc: "Designing scalable, defensible systems that evolve with your business.",
    slug: "software-architecture",
    icon: Layout,
  },
];

interface ServicePillarsProps {
  content: {
    title: string;
    subheadline: string;
  };
}

export default function ServicePillars({ content }: ServicePillarsProps) {
  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            {content.title}
          </h2>
          <p className="text-slate-muted text-xl max-w-3xl mx-auto">
            {content.subheadline}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <Link 
                key={p.slug} 
                href={`/services/${p.slug}`} 
                className="glass-card p-10 flex flex-col group hover:border-electric/40 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-electric/10 flex items-center justify-center mb-6 text-electric group-hover:bg-electric group-hover:text-white transition-all">
                  <Icon size={24} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-electric transition-colors">{p.title}</h3>
                <p className="text-slate-muted text-lg leading-relaxed mb-8 flex-grow">{p.desc}</p>
                <div className="flex items-center text-electric font-bold gap-2 group-hover:gap-4 transition-all">
                  Explore Service <span className="text-xl">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
