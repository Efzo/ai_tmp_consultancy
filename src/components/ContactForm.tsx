"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { submitInquiry } from "@/app/actions/contact";
import type { ContactBudgetOption } from "@/lib/site-settings";

type FormValues = {
  name: string;
  email: string;
  company: string;
  website: string;
  service: string;
  challenge: string;
  timeline: string;
  budget: string;
  budgetCustom: string;
  consent: boolean;
};

type ServiceOption = { slug: string; title: string };

const initialValues: FormValues = {
  name: "",
  email: "",
  company: "",
  website: "",
  service: "fractional-tpm",
  challenge: "",
  timeline: "immediate",
  budget: "undetermined",
  budgetCustom: "",
  consent: false,
};

export default function ContactForm({ budgetOptions, services }: { budgetOptions: ContactBudgetOption[]; services: ServiceOption[] }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [values, setValues] = useState<FormValues>(initialValues);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("email", values.email);
    formData.set("company", values.company);
    formData.set("website", values.website);
    formData.set("service", values.service);
    formData.set("challenge", values.challenge);
    formData.set("timeline", values.timeline);
    formData.set("budget", values.budget === "custom" ? values.budgetCustom : values.budget);
    formData.set("consent", values.consent ? "on" : "");
    formData.set("bot-field", "");

    try {
      const result = await submitInquiry(formData);
      setStatus(result.success ? "success" : "error");
      setMessage(result.message);
    } catch {
      setStatus("error");
      setMessage("We could not send your inquiry. Your entries are still here—please try again.");
    }
  }

  if (status === "success") {
    return (
      <main className="min-h-screen bg-midnight px-6 pb-20 pt-32 text-platinum">
        <div className="glass-panel mx-auto flex max-w-2xl items-center justify-center p-12 text-center">
          <div>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-electric/30 bg-electric/20 text-3xl text-electric">✓</div>
            <h1 className="mb-4 text-3xl font-bold">Inquiry Received</h1>
            <p className="mb-10 text-lg text-slate-muted">{message}</p>
            <Link href="/" className="btn-primary inline-block">Return Home</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-midnight px-6 pb-20 pt-32 text-platinum">
      <div className="mx-auto max-w-4xl">
        <section className="mb-16 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">Start a <span className="text-electric">Conversation</span></h1>
          <p className="mx-auto max-w-2xl text-xl text-slate-muted">Have a product, technology, or transformation challenge? Share the context and I&apos;ll prepare a tailored perspective for our first call.</p>
        </section>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-muted">Full Name
                  <input name="name" required value={values.name} onChange={(event) => update("name", event.target.value)} className="mt-2 w-full rounded-xl border border-glass bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-electric" placeholder="Jane Doe" />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-muted">Business Email
                  <input name="email" type="email" required value={values.email} onChange={(event) => update("email", event.target.value)} className="mt-2 w-full rounded-xl border border-glass bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-electric" placeholder="jane@company.com" />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-muted">Company Name
                  <input name="company" required value={values.company} onChange={(event) => update("company", event.target.value)} className="mt-2 w-full rounded-xl border border-glass bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-electric" placeholder="Enterprise AI Inc." />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-muted">Company Website
                  <input name="website" value={values.website} onChange={(event) => update("website", event.target.value)} className="mt-2 w-full rounded-xl border border-glass bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-electric" placeholder="https://company.com" />
                </label>
              </div>

              <label className="block space-y-2 text-sm font-medium text-slate-muted">Consulting Service
                <select name="service" required value={values.service} onChange={(event) => update("service", event.target.value)} className="mt-2 w-full appearance-none rounded-xl border border-glass bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-electric">
                  {services.map((service) => <option key={service.slug} value={service.slug} className="bg-midnight">{service.title}</option>)}
                </select>
              </label>

              <label className="block space-y-2 text-sm font-medium text-slate-muted">Business Challenge
                <textarea name="challenge" required minLength={20} rows={4} value={values.challenge} onChange={(event) => update("challenge", event.target.value)} className="mt-2 w-full rounded-xl border border-glass bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-electric" placeholder="Describe the product, technology, or business challenge you are trying to solve..." />
              </label>

              <div className="hidden" aria-hidden="true"><label htmlFor="bot-field">Leave this field empty</label><input id="bot-field" name="bot-field" tabIndex={-1} autoComplete="off" /></div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-muted">Expected Timeline
                  <select name="timeline" required value={values.timeline} onChange={(event) => update("timeline", event.target.value)} className="mt-2 w-full appearance-none rounded-xl border border-glass bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-electric">
                    <option value="immediate" className="bg-midnight">Immediate (1-4 weeks)</option>
                    <option value="short-term" className="bg-midnight">Short-term (1-3 months)</option>
                    <option value="long-term" className="bg-midnight">Long-term (3+ months)</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-muted">Estimated Budget Range
                  <select name="budget" value={values.budget} onChange={(event) => update("budget", event.target.value)} className="mt-2 w-full appearance-none rounded-xl border border-glass bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-electric">
                    {budgetOptions.map((option) => <option key={option.value} value={option.value} className="bg-midnight">{option.label}</option>)}
                    <option value="custom" className="bg-midnight">Other / custom amount</option>
                  </select>
                  {values.budget === "custom" && <input name="budgetCustom" required value={values.budgetCustom} onChange={(event) => update("budgetCustom", event.target.value)} className="mt-3 w-full rounded-xl border border-electric bg-white/5 px-4 py-3 text-white outline-none" placeholder="e.g. $75,000 or an approximate range" />}
                </label>
              </div>

              <label className="flex items-start gap-3 text-sm text-slate-muted"><input name="consent" type="checkbox" required checked={values.consent} onChange={(event) => update("consent", event.target.checked)} className="mt-1 accent-electric" /><span>I consent to being contacted about this inquiry and understand that this form is not an agreement to begin paid work.</span></label>

              <button type="submit" disabled={status === "submitting"} className="btn-primary w-full py-4 text-lg font-bold disabled:opacity-50">{status === "submitting" ? "Sending Inquiry..." : "Request Consulting Proposal"}</button>
              {status === "error" && <p role="alert" className="text-center text-sm text-red-400">{message}</p>}
            </form>
          </div>

          <div className="space-y-8"><div className="glass-panel sticky top-32 p-8"><h3 className="mb-6 text-xl font-bold">Prefer a call?</h3><p className="mb-8 text-sm leading-relaxed text-slate-muted">If you&apos;d prefer to skip the form and speak directly, you can book a slot in my calendar instantly.</p><Link href="/book" className="btn-secondary mb-4 block w-full text-center">Book a Call</Link><div className="rounded-xl border border-electric/20 bg-electric/10 p-4"><p className="text-xs italic text-slate-muted">Note: I prioritize inquiries with detailed business challenges to ensure we maximize our time together.</p></div></div></div>
        </div>
      </div>
    </main>
  );
}
