import React from 'react';
import VideoInsights from '@/components/home/VideoInsights';
import { getVideoInsights } from '@/app/actions/videos';
import { notFound } from 'next/navigation';

export const dynamic = "force-dynamic";

export default async function VideosPage() {
  const videos = await getVideoInsights();

  if (!videos || videos.length === 0) {
    return (
      <main className="min-h-screen bg-midnight text-platinum pt-32 pb-20 px-6 flex items-center justify-center text-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">No Insights Yet</h1>
          <p className="text-slate-muted">We are currently preparing our strategic video briefings.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-midnight text-platinum pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            Video <span className="text-electric">Insights</span>
          </h1>
          <p className="text-slate-muted text-xl max-w-3xl mx-auto">
            Deep dives into product strategy, technical delivery, and how we build production-ready software.
          </p>
        </header>

        <VideoInsights 
          content={{
            title: "", // Hidden in full page
            subheadline: "", // Hidden in full page
            videos: videos,
          }} 
        />
      </div>
    </main>
  );
}
