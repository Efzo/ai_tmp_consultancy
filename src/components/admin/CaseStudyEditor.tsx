"use client";

import { useState } from "react";
import { saveCaseStudy, deleteCaseStudy } from "@/app/actions/cms";
import type { CaseStudy } from "@prisma/client";

export default function CaseStudyEditor({ studies }: { studies: CaseStudy[] }) {
  const [rows, setRows] = useState<Partial<CaseStudy>[]>(studies);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const update = (index: number, key: keyof CaseStudy, value: any) => 
    setRows((current) => current.map((study, studyIndex) => studyIndex === index ? { ...study, [key]: value } : study));

  const add = () => {
    setRows((current) => [...current, { 
      slug: `case-study-${current.length + 1}`, 
      title: "New case study", 
      category: "Custom Software Engineering", 
      summary: "Short summary of the project.", 
      businessProblem: "What was the core challenge?", 
      role: "Architect / Lead", 
      requirements: "What were the main requirements?", 
      architecture: "How was the system designed?", 
      stack: [], 
      implementation: "How was it implemented?", 
      challenges: "What were the trade-offs?", 
      outcomes: "What were the results?", 
      images: [], 
      relatedServices: [], 
      isPublished: false, 
      status: "DRAFT" 
    }]);
  };

  const remove = async (index: number) => {
    const study = rows[index];
    if (!study.id) {
      setRows((current) => current.filter((_, studyIndex) => studyIndex !== index));
      return;
    }
    if (!confirm("Are you sure you want to delete this case study?")) return;
    const result = await deleteCaseStudy(study.id);
    if (result.success) {
      setRows((current) => current.filter((_, studyIndex) => studyIndex !== index));
      setMessage(result.message);
    } else {
      setMessage(result.message);
    }
  };

  const save = async (index: number) => {
    setSaving(true);
    const study = rows[index];
    const result = await saveCaseStudy(study);
    setMessage(result.message);
    if (result.success && result.id) {
      update(index, "id", result.id);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Case study library</h2>
          <p className="mt-1 text-sm text-slate-muted">Manage your professional proof points and evidence-based narratives.</p>
        </div>
        <button type="button" onClick={add} className="btn-secondary">Add case study</button>
      </div>

      {rows.map((study, index) => (
        <article key={study.id || `new-${index}`} className="glass-panel space-y-4 p-6 border border-glass">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm text-slate-muted">Title
              <input value={study.title || ""} onChange={(e) => update(index, "title", e.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
            </label>
            <label className="text-sm text-slate-muted">Slug
              <input value={study.slug || ""} onChange={(e) => update(index, "slug", e.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
            </label>
            <label className="text-sm text-slate-muted">Category
              <input value={study.category || ""} onChange={(e) => update(index, "category", e.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
            </label>
          </div>

          <label className="block text-sm text-slate-muted">Summary
            <textarea value={study.summary || ""} onChange={(e) => update(index, "summary", e.target.value)} rows={2} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-muted">Business Problem
              <textarea value={study.businessProblem || ""} onChange={(e) => update(index, "businessProblem", e.target.value)} rows={4} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
            </label>
            <label className="text-sm text-slate-muted">Implementation Approach
              <textarea value={study.implementation || ""} onChange={(e) => update(index, "implementation", e.target.value)} rows={4} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
            </label>
          </div>

          <label className="block text-sm text-slate-muted">Outcomes & Results
            <textarea value={study.outcomes || ""} onChange={(e) => update(index, "outcomes", e.target.value)} rows={3} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-muted">Technical Stack (comma separated)
              <input value={(study.stack || []).join(", ") || ""} onChange={(e) => update(index, "stack", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
            </label>
            <label className="text-sm text-slate-muted">Challenges & Trade-offs
              <textarea value={study.challenges || ""} onChange={(e) => update(index, "challenges", e.target.value)} rows={3} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm text-slate-muted">Role
              <input value={study.role || ""} onChange={(e) => update(index, "role", e.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
            </label>
            <label className="text-sm text-slate-muted">Requirements
              <input value={study.requirements || ""} onChange={(e) => update(index, "requirements", e.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
            </label>
            <label className="text-sm text-slate-muted">Architecture
              <input value={study.architecture || ""} onChange={(e) => update(index, "architecture", e.target.value)} className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
            </label>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-glass pt-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-muted cursor-pointer">
                <input type="checkbox" checked={study.isPublished || false} onChange={(e) => update(index, "isPublished", e.target.checked)} className="accent-electric" />
                Published
              </label>
              <select value={study.status || "DRAFT"} onChange={(e) => update(index, "status", e.target.value)} className="rounded-lg border border-glass bg-white/5 px-3 py-1 text-xs text-white outline-none focus:border-electric">
                <option value="DRAFT">Draft</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => remove(index)} className="rounded-lg border border-red-400/30 px-3 py-2 text-sm text-red-300 hover:bg-red-400/10 transition-colors">Remove</button>
              <button type="button" onClick={() => save(index)} disabled={saving} className="btn-primary px-4 py-2 text-sm disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </article>
      ))}
      
      <div className="flex items-center justify-between gap-4 mt-8">
        <p className="text-sm text-cyan-ai">{message}</p>
      </div>
    </div>
  );
}
