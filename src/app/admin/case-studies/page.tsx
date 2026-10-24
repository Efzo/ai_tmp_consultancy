import { AdminModule } from "@/components/admin/AdminModule";
import { caseStudies } from "@/data/case-studies";

export default function CaseStudiesAdminPage() { return <AdminModule title="Case studies" description="Review evidence-based work shown on the public site." status="Read-only catalog"><div className="grid gap-4">{caseStudies.map((study) => <article key={study.slug} className="glass-card p-6"><p className="text-xs uppercase tracking-widest text-electric">{study.category}</p><h2 className="mt-3 text-xl font-bold">{study.title}</h2><p className="mt-3 text-sm leading-relaxed text-slate-muted">{study.summary}</p></article>)}</div></AdminModule>; }
