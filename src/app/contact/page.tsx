"use client";
import React, { useState } from 'react';
import { submitInquiry } from '@/app/actions/contact';
import Link from 'next/link';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(formData: FormData) {
    setStatus('submitting');
    try {
      const result = await submitInquiry(formData);
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
      } else {
        throw new Error();
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again or book a call directly.');
    }
  }

  if (status === 'success') {
    return (
      <main className="min-h-screen bg-midnight text-platinum pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="glass-panel p-12 max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-electric/20 text-electric rounded-full flex items-center justify-center mx-auto mb-6 text-3xl border border-electric/30">
            ✓
          </div>
          <h1 className="text-3xl font-bold mb-4">Inquiry Received</h1>
          <p className="text-slate-muted text-lg mb-10">{message}</p>
          <Link href="/" className="btn-primary inline-block">Return Home</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-midnight text-platinum pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Start a <span className="text-electric">Conversation</span>
          </h1>
          <p className="text-slate-muted text-xl max-w-2xl mx-auto">
            Ready to move your AI strategy forward? Provide some details about your 
            business challenge, and I'll prepare a tailored perspective for our first call.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <form action={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-muted">Full Name</label>
                  <input 
                    name="name" required 
                    className="w-full bg-white/5 border border-glass rounded-xl px-4 py-3 text-white focus:border-electric focus:outline-none transition-all" 
                    placeholder="Jane Doe" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-muted">Business Email</label>
                  <input 
                    name="email" type="email" required 
                    className="w-full bg-white/5 border border-glass rounded-xl px-4 py-3 text-white focus:border-electric focus:outline-none transition-all" 
                    placeholder="jane@company.com" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-muted">Company Name</label>
                  <input 
                    name="company" required 
                    className="w-full bg-white/5 border border-glass rounded-xl px-4 py-3 text-white focus:border-electric focus:outline-none transition-all" 
                    placeholder="Enterprise AI Inc." 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-muted">Company Website</label>
                  <input 
                    name="website" 
                    className="w-full bg-white/5 border border-glass rounded-xl px-4 py-3 text-white focus:border-electric focus:outline-none transition-all" 
                    placeholder="https://company.com" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-muted">Consulting Service</label>
                <select 
                  name="service" required 
                  className="w-full bg-white/5 border border-glass rounded-xl px-4 py-3 text-white focus:border-electric focus:outline-none transition-all appearance-none"
                >
                  <option value="ai-strategy" className="bg-midnight">AI Product Strategy & Roadmapping</option>
                  <option value="fractional-tpm" className="bg-midnight">Fractional AI Technical Product Management</option>
                  <option value="solution-architecture" className="bg-midnight">AI Solution Architecture</option>
                  <option value="enterprise-search" className="bg-midnight">Enterprise Search & Knowledge Systems</option>
                  <option value="ai-audit" className="bg-midnight">AI Product Audit & Assessment</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-muted">Business Challenge</label>
                <textarea 
                  name="challenge" required rows={4} 
                  className="w-full bg-white/5 border border-glass rounded-xl px-4 py-3 text-white focus:border-electric focus:outline-none transition-all" 
                  placeholder="Describe the problem you are trying to solve with AI..." 
                ></textarea>
              </div>

              <div className="hidden" aria-hidden="true">
                <label htmlFor="bot-field">Leave this field empty</label>
                <input id="bot-field" name="bot-field" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-muted">Expected Timeline</label>
                  <select 
                    name="timeline" required 
                    className="w-full bg-white/5 border border-glass rounded-xl px-4 py-3 text-white focus:border-electric focus:outline-none transition-all appearance-none"
                  >
                    <option value="immediate" className="bg-midnight">Immediate (1-4 weeks)</option>
                    <option value="short-term" className="bg-midnight">Short-term (1-3 months)</option>
                    <option value="long-term" className="bg-midnight">Long-term (3+ months)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-muted">Estimated Budget Range</label>
                  <select 
                    name="budget" 
                    className="w-full bg-white/5 border border-glass rounded-xl px-4 py-3 text-white focus:border-electric focus:outline-none transition-all appearance-none"
                  >
                    <option value="undetermined" className="bg-midnight">Undetermined</option>
                    <option value="5k-15k" className="bg-midnight">$5k - $15k</option>
                    <option value="15k-50k" className="bg-midnight">$15k - $50k</option>
                    <option value="50k-plus" className="bg-midnight">$50k+</option>
                  </select>
                </div>
              </div>

              <label className="flex items-start gap-3 text-sm text-slate-muted">
                <input name="consent" type="checkbox" required className="mt-1 accent-electric" />
                <span>I consent to being contacted about this inquiry and understand that this form is not an agreement to begin paid work.</span>
              </label>

              <button 
                disabled={status === 'submitting'} 
                className="btn-primary w-full py-4 text-lg font-bold disabled:opacity-50"
              >
                {status === 'submitting' ? 'Sending Inquiry...' : 'Request Consulting Proposal'}
              </button>
              {status === 'error' && <p className="text-red-400 text-center text-sm">{message}</p>}
            </form>
          </div>

          <div className="space-y-8">
            <div className="glass-panel p-8 sticky top-32">
              <h3 className="text-xl font-bold mb-6">Prefer a call?</h3>
              <p className="text-slate-muted text-sm mb-8 leading-relaxed">
                If you'd prefer to skip the form and speak directly, you can book 
                a slot in my calendar instantly.
              </p>
              <Link href="/book" className="btn-secondary block text-center w-full mb-4">
                Book a Call
              </Link>
              <div className="p-4 bg-electric/10 rounded-xl border border-electric/20">
                <p className="text-xs text-slate-muted italic">
                  Note: I prioritize inquiries with detailed business challenges to ensure we maximize our time together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
