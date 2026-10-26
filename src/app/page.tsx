import React from 'react';
import Hero from '@/components/home/Hero';
import Trust from '@/components/home/Trust';
import ServicePillars from '@/components/home/ServicePillars';
import Process from '@/components/home/Process';
import VideoInsights from '@/components/home/VideoInsights';
import FeaturedProject from '@/components/home/FeaturedProject';
import TechExpertise from '@/components/home/TechExpertise';
import EngagementOverview from '@/components/home/EngagementOverview';
import Differentiator from '@/components/home/Differentiator';
import FAQ from '@/components/home/FAQ';
import FinalCTA from '@/components/home/FinalCTA';
import { getHomePageContent } from '@/lib/homepage';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const content = await getHomePageContent();

  return (
    <main className="min-h-screen bg-midnight text-platinum">
      <Hero content={content.hero} />
      <Trust content={content.trust} />
      <ServicePillars content={content.pillars} />
      <Process content={content.process} />
      <VideoInsights content={content.videos} />
      <FeaturedProject content={content.featured} />
      <TechExpertise content={content.expertise} />
      <EngagementOverview content={content.engagements} />
      <Differentiator content={content.differentiator} />
      <FAQ content={content.faq} />
      <FinalCTA content={content.finalCta} />
    </main>
  );
}
