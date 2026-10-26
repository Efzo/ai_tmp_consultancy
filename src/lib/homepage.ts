import { prisma } from "@/lib/prisma";

export async function getHomePageContent() {
  const page = await prisma.page.findUnique({
    where: { slug: "home" },
  });

  let videos: any[] = [];
  try {
    videos = await prisma.videoInsight.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    });
  } catch (e) {
    console.error("Error fetching video insights:", e);
    videos = [];
  }

  const defaults = {
    hero: {
      title: "From Product Strategy to Production-Ready Software",
      subheadline: "Technical product consulting, custom software engineering, AI integration, and scalable architecture for startups, growing businesses, and enterprises.",
      primaryCta: "Discuss Your Project",
      secondaryCta: "Explore Services",
    },
    trust: {
      title: "Enterprise Grade Expertise",
      text: "Combining leadership from world-class technology organizations with the agility of a specialized consultant.",
      logos: ["Vertex AI", "Microsoft", "Amazon", "LTIMindtree"],
    },
    pillars: {
      title: "Core Capabilities",
      subheadline: "I provide the end-to-end technical leadership needed to move from a product idea to a production-ready system.",
    },
    process: {
      title: "How I Work",
      subheadline: "A rigorous, outcome-driven process designed to minimize risk and maximize velocity.",
    },
    videos: {
      title: "Strategic Insights",
      subheadline: "Watch how we bridge the gap between strategy and delivery to build high-impact software.",
      videos: [],
    },
    featured: {
      category: "Featured Case Study",
      title: "ClinchDesk",
      description: "A multi-tenant customer support SaaS built from the ground up. I led the product strategy and architecture, implementing a robust RBAC system, AI-assisted ticketing, and a scalable PostgreSQL backend.",
      cta: "View Case Study",
      slug: "clinchdesk",
    },
    expertise: {
      title: "Technical Expertise",
      subheadline: "A modern, high-performance stack focused on developer velocity and production stability.",
    },
    engagements: {
      title: "Engagement Models",
      subheadline: "Whether you need a one-time strategic blueprint or ongoing technical leadership.",
    },
    differentiator: {
      title: "The Intersection of Strategy & Code",
      text: "Most consultants offer only the roadmap; most engineers offer only the code. I bridge that gap. By combining Technical Product Management with hands-on Software Architecture, I ensure that what is planned is buildable, and what is built actually solves the business problem.",
    },
    faq: {
      title: "Common Questions",
    },
    finalCta: {
      title: "Ready to build something exceptional?",
      text: "Let's turn your business challenges into production-ready software.",
      cta: "Discuss Your Project",
    }
  };

  if (!page) return { ...defaults, videos: { ...defaults.videos, videos } };

  const content = page.content as any;
  
  if (Array.isArray(content)) {
    return { ...defaults, videos: { ...defaults.videos, videos } };
  }

  return { ...defaults, ...content, videos: { ...defaults.videos, videos } };
}
