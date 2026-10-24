"use client";

import { useState } from "react";
import { updateSiteSetting } from "@/app/actions/cms";
import type { FooterSettings } from "@/lib/site-settings";

const fields: Array<{ key: keyof FooterSettings; label: string; description: string }> = [
  { key: "linkedinUrl", label: "LinkedIn", description: "Your professional profile or company page." },
  { key: "articlesUrl", label: "Articles", description: "Your blog, articles page, or external publication." },
  { key: "allServicesUrl", label: "All Services", description: "The main services destination." },
  { key: "aiStrategyUrl", label: "AI Strategy", description: "The AI strategy service page." },
  { key: "fractionalTpmUrl", label: "Fractional TPM", description: "The fractional TPM service page." },
  { key: "aiArchitectureUrl", label: "AI Architecture", description: "The solution architecture service page." },
  { key: "aboutUrl", label: "About", description: "The company or consultant profile page." },
  { key: "processUrl", label: "How We Work", description: "The process page." },
  { key: "caseStudiesUrl", label: "Case Studies", description: "The case studies page." },
  { key: "contactUrl", label: "Contact", description: "The contact page." },
  { key: "privacyUrl", label: "Privacy Policy", description: "The privacy policy page." },
  { key: "termsUrl", label: "Terms of Service", description: "The terms page." },
];

export default function FooterLinksEditor({ settings }: { settings: FooterSettings }) {
  const [values, setValues] = useState(settings);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  async function save(key: keyof FooterSettings) {
    setSaving(key);
    setMessage("");
    const result = await updateSiteSetting(`footer.${key}`, values[key]);
    setMessage(result.message);
    setSaving(null);
  }

  return (
    <div className="glass-panel overflow-hidden">
      <div className="border-b border-glass px-6 py-5">
        <h2 className="text-lg font-semibold text-white">Footer links</h2>
        <p className="mt-1 text-sm text-slate-muted">Update where each public footer item sends visitors.</p>
      </div>
      <div className="divide-y divide-glass">
        {fields.map((field) => (
          <div key={field.key} className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-end">
            <label className="min-w-0 flex-1 text-sm font-medium text-white">
              {field.label}
              <span className="mt-1 block text-xs font-normal text-slate-muted">{field.description}</span>
              <input
                value={values[field.key]}
                onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
                type="text"
                placeholder="/about or https://example.com"
                className="mt-3 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric"
              />
            </label>
            <button type="button" onClick={() => save(field.key)} disabled={saving === field.key} className="btn-secondary shrink-0 disabled:cursor-wait disabled:opacity-60">
              {saving === field.key ? "Saving…" : "Save link"}
            </button>
          </div>
        ))}
      </div>
      {message && <p className="border-t border-glass px-6 py-4 text-sm text-cyan-ai">{message}</p>}
    </div>
  );
}
