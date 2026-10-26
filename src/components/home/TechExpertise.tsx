import React from 'react';

const stacks = [
  { category: "Product Management", items: ["Product Strategy", "Roadmapping", "PRDs", "Backlog Mgmt", "Stakeholder Alignment", "Agile/Scrum"] },
  { category: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Zustand"] },
  { category: "Backend", items: ["Node.js", "NestJS", "Python", "FastAPI", "Go"] },
  { category: "Data & Infrastructure", items: ["PostgreSQL", "Redis", "AWS", "Docker", "Vercel"] },
  { category: "AI & Automation", items: ["OpenAI", "Claude", "LangChain", "Vector DBs", "Copilot Studio"] },
];

export default function TechExpertise({ content }: { content: { title: string; subheadline: string } }) {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {stacks.map((s) => (
            <div key={s.category} className="glass-card p-8">
              <h3 className="text-lg font-bold mb-6 text-electric border-b border-electric/20 pb-2">{s.category}</h3>
              <div className="flex flex-wrap gap-2">
                {s.items.map((item) => (
                  <span key={item} className="text-sm bg-white/5 px-3 py-1 rounded-full border border-white/10 hover:border-electric/40 transition-colors">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
