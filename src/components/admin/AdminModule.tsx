import Link from "next/link";
import type { ReactNode } from "react";

export function AdminModule({ title, description, status = "Operational", children }: { title: string; description: string; status?: string; children?: ReactNode }) {
  return <div className="space-y-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-bold tracking-tight">{title}</h1><p className="mt-2 text-slate-muted">{description}</p></div><span className="rounded-full border border-glass bg-white/5 px-3 py-1 text-xs text-slate-muted">{status}</span></div>{children ?? <div className="glass-panel p-8"><h2 className="text-xl font-bold">Module ready for configuration</h2><p className="mt-3 max-w-2xl leading-relaxed text-slate-muted">This module has a working route and admin surface. Connect the required external service or database model before publishing production data.</p><Link href="/admin/settings" className="mt-6 inline-block text-cyan-ai">Open site settings →</Link></div>}</div>;
}

export function SetupCard({ title, body, action = "Review setup" }: { title: string; body: string; action?: string }) {
  return <div className="glass-card p-6"><h2 className="text-lg font-bold">{title}</h2><p className="mt-2 text-sm leading-relaxed text-slate-muted">{body}</p><button type="button" className="mt-5 rounded-lg border border-glass px-4 py-2 text-sm text-slate-muted hover:bg-white/10 hover:text-white">{action}</button></div>;
}
