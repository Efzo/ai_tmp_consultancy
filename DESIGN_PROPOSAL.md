# Design Proposal: Strategic Repositioning of ojomoefosa.com

## 1. Strategic Goal
Transform the website from a specialized consulting brochure to a premium client-acquisition platform that sells both **Technical Product Leadership** and **Hands-on Software Delivery**.

## 2. Data Model Evolution (Prisma)

### A. CaseStudy Model (NEW)
To replace the current JSON-blob approach and provide deep, evidence-based narratives.
- `id`: String @id
- `slug`: String @unique
- `title`: String
- `summary`: String (Brief overview for grid)
- `category`: String (Matches one of the 4 service pillars)
- `businessProblem`: String (The 'Why')
- `role`: String (Role played: Architect, Lead, etc.)
- `requirements`: String (What was needed)
- `architecture`: String (Technical design description)
- `stack`: String[] (Array of technologies)
- `implementation`: String (How it was built)
- `challenges`: String (Trade-offs and hurdles)
- `outcomes`: String (Measurable results)
- `images`: String[] (URLs to MediaAssets)
- `relatedServices`: String[] (Slugs of related Services)
- `status`: ContentStatus
- `isPublished`: Boolean
- `createdAt`, `updatedAt`: DateTime

### B. EngagementModel Model (NEW)
To formalize how clients engage, moving from "Pricing Plans" JSON to structured offerings.
- `id`: String @id
- `slug`: String @unique
- `name`: String
- `description`: String
- `price`: String
- `features`: String[]
- `type`: EngagementType (FIXED | RETAINER | HOURLY)
- `ctaText`: String
- `relatedServices`: String[] (Slugs of related Services)
- `isPublished`: Boolean
- `createdAt`, `updatedAt`: DateTime

## 3. Information Architecture (Routes)

| Route | Page Title | Purpose |
| :--- | :--- | :--- |
| `/` | Home | The high-conversion landing page |
| `/services` | Services | Overview of the 4 core pillars |
| `/services/[slug]` | [Service Name] | Deep dive into a specific capability |
| `/case-studies` | Portfolio | Grid of all case studies, filterable by category |
| `/case-studies/[slug]` | [Project Name] | Full evidence-based project narrative |
| `/engagements` | How to Work With Me | Clear offerings (Discovery, MVP, Fractional) |
| `/about` | About Efosa | Repositioned professional biography |
| `/contact` | Contact | Lead generation with service-interest routing |

## 4. Homepage Blueprint (10 Sections)
1. **Hero**: "From Product Strategy to Production-Ready Software."
2. **Trust**: Credibility indicators (Enterprise experience, Certs).
3. **Pillars**: 4-column grid of core services.
4. **Process**: The "Discover $\rightarrow$ Design $\rightarrow$ Build $\rightarrow$ Launch $\rightarrow$ Improve" flow.
5. **Featured Project**: High-impact spotlight on ClinchDesk.
6. **Expertise**: Visual "Tech Stack" (Next.js, NestJS, AI, etc.).
7. **Engagements**: 3 cards showing the ways to engage.
8. **Differentiator**: "The Intersection of Strategy & Code" (Why work with me).
9. **FAQ**: Addressing common consulting concerns.
10. **Final CTA**: "Discuss Your Project" $\rightarrow$ Booking link.

## 5. Implementation Order
1. **Prisma Schema Update**: Add `CaseStudy`, `EngagementModel`, and update enums.
2. **CMS Integration**: Add admin pages to manage Case Studies and Engagement Models.
3. **Frontend: Portfolio**: Implement `/case-studies` and `/case-studies/[slug]`.
4. **Frontend: Services**: Refactor `/services` to follow the 4-pillar hierarchy.
5. **Frontend: Homepage**: Full redesign to the 10-section structure.
6. **Lead Gen**: Update `/contact` form fields and server-side handling.
