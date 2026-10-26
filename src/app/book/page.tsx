import { getManagedPageContent, managedPageMetadata } from "@/lib/managed-pages";
import PagePreviewBanner from "@/components/admin/PagePreviewBanner";

import React from 'react';
import Link from 'next/link';

export default async function BookPage() {
  const content = await getManagedPageContent("book");
  const configuredUrl = content.bookingUrl || process.env.NEXT_PUBLIC_BOOKING_URL;
  const bookingUrl = configuredUrl && /^https:\/\//.test(configuredUrl) && !configuredUrl.includes("your-username") ? configuredUrl : undefined;

  return (
    <main className="min-h-screen bg-midnight text-platinum pt-36 pb-20 px-6">
      <PagePreviewBanner slug="book" /><div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-semibold mb-6 tracking-tight">
          {content.title}
        </h1>
        <p className="text-slate-muted text-xl mb-12 max-w-2xl mx-auto">
          {content.description}
        </p>

        <div className="glass-panel min-h-[420px] overflow-hidden rounded-3xl bg-white/10 p-4">
          {bookingUrl ? (
            <><a href={bookingUrl} data-booking="external" target="_blank" rel="noopener noreferrer" className="btn-secondary inline-block mb-4">{content.calendarText}</a><iframe loading="lazy" referrerPolicy="strict-origin-when-cross-origin" title="Book a discovery call" src={bookingUrl} className="min-h-[680px] w-full rounded-2xl border-0" /></>
          ) : (
            <div className="flex min-h-[420px] items-center justify-center p-10 text-center text-slate-muted">
              <div>
                <p className="mb-4 text-xl text-white">{content.unavailableTitle}</p>
                <p className="mx-auto max-w-lg text-sm leading-relaxed">{content.unavailableDescription}</p>
                <Link href={content.fallbackUrl} className="btn-secondary mt-8 inline-block">{content.fallbackText}</Link>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {content.cards.map((card, index) => <div className="glass-card p-6" key={index}><h2 className="font-bold mb-2 text-cyan-ai">{card.title}</h2><p className="text-sm text-slate-muted">{card.description}</p></div>)}
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata() { return managedPageMetadata("book"); }
