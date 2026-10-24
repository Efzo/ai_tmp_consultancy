import React from 'react';
import Link from 'next/link';

export default function BookPage() {
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;

  return (
    <main className="min-h-screen bg-midnight text-platinum pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          Book a <span className="text-electric">Discovery Call</span>
        </h1>
        <p className="text-slate-muted text-xl mb-12 max-w-2xl mx-auto">
          Let's determine if we're a fit. In this 30-minute call, we'll discuss your 
          business challenges, AI goals, and how my expertise can drive your outcomes.
        </p>
        
        <div className="glass-panel min-h-[420px] overflow-hidden rounded-3xl bg-white/10 p-4">
          {bookingUrl ? (
            <iframe title="Book a discovery call" src={bookingUrl} className="min-h-[680px] w-full rounded-2xl border-0" />
          ) : (
            <div className="flex min-h-[420px] items-center justify-center p-10 text-center text-slate-muted">
              <div>
                <p className="mb-4 text-xl text-white">Scheduling is being connected.</p>
                <p className="mx-auto max-w-lg text-sm leading-relaxed">Add your Calendly or Cal.com URL as <code className="text-electric">NEXT_PUBLIC_BOOKING_URL</code> to activate booking. Until then, use the inquiry form and I will respond directly.</p>
                <Link href="/contact" className="btn-secondary mt-8 inline-block">Request a Proposal Instead</Link>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="glass-card p-6">
            <h4 className="font-bold mb-2 text-cyan-ai">No Commitment</h4>
            <p className="text-sm text-slate-muted">The discovery call is a zero-pressure exploration of your needs.</p>
          </div>
          <div className="glass-card p-6">
            <h4 className="font-bold mb-2 text-cyan-ai">Strategic Focus</h4>
            <p className="text-sm text-slate-muted">We focus on outcomes, not features, during our initial call.</p>
          </div>
          <div className="glass-card p-6">
            <h4 className="font-bold mb-2 text-cyan-ai">Expert Guidance</h4>
            <p className="text-sm text-slate-muted">You'll leave the call with immediate clarity on your AI path.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
