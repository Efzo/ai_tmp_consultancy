import { getManagedPageContent, managedPageMetadata } from "@/lib/managed-pages";
import PagePreviewBanner from "@/components/admin/PagePreviewBanner";
import React from 'react';
import VideoInsights from '@/components/home/VideoInsights';
import { getVideoInsights } from '@/app/actions/videos';


export const dynamic = "force-dynamic";

export default async function VideosPage() {
  const content = await getManagedPageContent("videos");
  const videos = await getVideoInsights();

  if (!videos || videos.length === 0) {
    return (
      <main className="min-h-screen bg-midnight text-platinum pt-36 pb-20 px-6 flex items-center justify-center text-center"><PagePreviewBanner slug="videos" />
        <div>
          <h1 className="text-4xl font-bold mb-4">{content.emptyTitle}</h1>
          <p className="text-slate-muted">{content.emptyText}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-midnight text-platinum pt-36 pb-20 px-6"><PagePreviewBanner slug="videos" />
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6">
            {content.title}
          </h1>
          <p className="section-intro mx-auto">
            {content.description}
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


export async function generateMetadata() { return managedPageMetadata("videos"); }
