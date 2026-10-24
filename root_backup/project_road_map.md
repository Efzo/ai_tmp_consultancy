# CODEX PROJECT BRIEF: Transform ojomoefosa.com into an AI Technical Product Management Consultancy

## 1. Project Objective

You are a senior full-stack engineer, product designer, technical architect, and conversion-focused website developer.

I want you to redesign and transform my existing website, **https://ojomoefosa.com**, from a personal career portfolio into a professional, client-facing **AI Technical Product Management and AI Product Consulting business**.

This is a real commercial business, not a demo, portfolio exercise, or landing-page prototype.

The finished website must be production-ready, professionally designed, secure, SEO-optimized, mobile-responsive, and capable of accepting client inquiries, booking consultations, and initiating paid engagements.

**Hosting:** Vercel  
**Domain:** ojomoefosa.com  
**Business identity:** Efosa Ojomo — AI Product & Technical Consulting  
**Primary market:** United States  
**Secondary market:** International businesses  
**Primary audience:** Startups, SaaS companies, founders, SMBs, and enterprise teams.

Use my existing repository and preserve valuable content, SEO equity, and genuine professional achievements.

## 2. First: Audit the Existing Project

Before making changes:

1. Inspect the entire codebase, project structure, dependencies, routes, API endpoints, environment variables, and current deployment configuration.
2. Identify the existing frontend framework and backend functionality.
3. Review the current design and content.
4. Identify reusable components and functionality.
5. Evaluate the existing contact form, blog, SEO implementation, and security.
6. Identify obsolete portfolio sections that should be removed, rewritten, or moved to an About page.
7. Create a concise implementation plan before coding.

Do not rebuild the application unnecessarily if the existing architecture is suitable.

Use the current framework where practical. If the project already uses Next.js, retain it.

## 3. Business Positioning

Position the business as a consultancy that helps organizations move from AI ideas and business challenges to validated product strategies, technical requirements, implementation roadmaps, and measurable business outcomes.

Core positioning:

**"AI Product Strategy. Technical Leadership. Real Business Outcomes."**

Supporting message:

"We help startups and businesses define, plan, and deliver AI-powered products, combining technical product leadership, enterprise software architecture, and practical AI implementation expertise."

The website should communicate business value, not read like a résumé or job application.

Avoid generic AI marketing language, excessive buzzwords, unverified claims, and exaggerated promises.

## 4. Consulting Services

Create dedicated service pages for the following offerings.

### Service 1: AI Product Strategy & Roadmapping

Services include:

- AI opportunity discovery and use-case assessment
- Customer and stakeholder discovery
- Product vision and strategy
- Product requirements documents (PRDs)
- MVP definition and prioritization
- Product roadmaps and delivery planning
- Business case development
- Success metrics, KPIs, and OKRs
- AI feasibility and risk assessments

### Service 2: Fractional AI Technical Product Management

Provide ongoing technical product leadership for organizations that do not require a full-time senior TPM.

Services include:

- Product backlog and roadmap ownership
- Engineering and stakeholder coordination
- Agile delivery management
- Requirements and acceptance criteria
- Technical trade-off evaluation
- AI product evaluation and release readiness
- Product performance reporting
- Vendor and technology assessments

### Service 3: AI Solution Architecture & Implementation Advisory

Services include:

- AI application architecture
- LLM integration strategy
- Retrieval-augmented generation (RAG)
- AI agent workflows
- Enterprise knowledge assistants
- API and SaaS integration planning
- Cloud architecture
- AI security and governance considerations
- Evaluation, monitoring, and deployment planning

Clearly distinguish advisory and architecture work from hands-on implementation. Do not promise implementation capacity or outcomes that have not been established.

### Service 4: Enterprise Search & AI Knowledge Systems

Services include:

- Enterprise search strategy
- Document ingestion and indexing
- Keyword, semantic, and hybrid retrieval
- AI-powered knowledge assistants
- Search relevance evaluation
- Human-in-the-loop workflows
- Retrieval quality and hallucination risk evaluation
- Search and knowledge management roadmaps

### Service 5: AI Product Audit & Technical Assessment

Offer structured reviews of existing AI initiatives.

Deliverables may include:

- Product and technical assessment
- Architecture review
- Risk and gap analysis
- Prioritized improvement recommendations
- Evaluation framework
- Implementation roadmap

Every service page must explain the customer problem, target audience, deliverables, engagement process, and next action.

## 5. Required Website Pages

Build the following structure:

**Home /**  
Professional consultancy homepage with a compelling value proposition, services, credibility, consulting process, selected work, and conversion-focused CTAs.

**Services /services**  
Overview of all consulting offerings, linking to dedicated service pages.

**Individual service pages /services/[slug]**  
Detailed, SEO-friendly pages with a clear call to action.

**About /about**  
My professional background, experience, technical expertise, certifications, and approach to consulting.

Preserve my genuine experience with enterprise software, product delivery, AI, cloud platforms, and ClinchDesk.

**Case Studies /case-studies**  
Showcase relevant projects, including ClinchDesk, with clearly identified responsibilities, technical decisions, product challenges, and measurable results where verifiable.

Do not invent clients, testimonials, projects, or business outcomes. Label conceptual projects appropriately.

**How We Work /process**  
Explain the consulting engagement lifecycle:

1. Discovery
2. Business problem assessment
3. Scope and proposal
4. Product strategy and technical planning
5. Execution or implementation oversight
6. Evaluation and handover

**Pricing /pricing**  
Display consulting packages with configurable prices or "Starting at" labels. Treat initial pricing as provisional until I approve it.

Include discovery workshops, roadmap engagements, project-based consulting, and monthly fractional TPM retainers.

**Book a Consultation /book**  
Provide a working scheduling integration.

**Contact /contact**  
Provide a secure client inquiry form.

**Blog /blog**  
Preserve existing articles and build a professional content experience focused on AI product management, technical strategy, enterprise AI, RAG, SaaS, and product delivery.

**Privacy Policy /privacy**  
**Terms of Service /terms**

Create these as editable drafts that require legal review before production publication.

## 6. Website Design Requirements

Design the website to resemble a premium technology consulting firm.

Design direction:

- Modern, clean, and executive-friendly
- Professional navy, white, charcoal, and restrained blue accents
- Strong typography and clear visual hierarchy
- High-quality, relevant imagery and diagrams
- Responsive across desktop, tablet, and mobile
- Subtle animations
- Accessible navigation and interactions
- Fast-loading pages
- Consistent design system
- Clear calls to action

Avoid excessive gradients, clutter, decorative animations, generic robot imagery, and artificial-looking stock visuals.

The site should inspire confidence among founders, CTOs, product executives, and enterprise decision-makers.

## 7. Client Acquisition and Conversion

The website must be built to convert visitors into qualified consulting opportunities.

Implement:

### Primary CTA

**Book a Discovery Call**

### Secondary CTA

**Request a Consulting Proposal**

### Client Inquiry Form

Capture:

- Full name
- Business email
- Company name
- Company website (optional)
- Type of consulting service
- Business challenge or project description
- Expected project timeline
- Budget range (optional)
- Consent to be contacted

Implement server-side validation, spam protection, rate limiting, and secure data handling.

Send a notification to the business when a lead is submitted and an acknowledgment to the prospective client.

Use Resend or another appropriate Vercel-compatible email provider.

Never expose email credentials or API keys in client-side code.

## 8. Consultation Booking

Integrate a production-ready booking solution such as Calendly or Cal.com.

Requirements:

- Booking page
- Discovery-call availability
- Timezone handling
- Confirmation and reminders
- Meeting link generation through the selected provider
- Basic intake questions
- Clear rescheduling and cancellation instructions

Prefer a proven scheduling provider over developing a custom calendar system.

The booking flow must be fully functional before launch.

## 9. Consulting Payments

Integrate Stripe Checkout for approved fixed-price consulting products, such as paid discovery workshops.

Requirements:

- Secure hosted checkout
- Server-side price validation
- Payment success and cancellation pages
- Verified webhook processing
- Payment confirmation
- Transaction status tracking
- No storage of card information on our servers

Do not automatically charge clients for custom engagements without an approved proposal and clearly communicated terms.

Keep custom proposals, contracts, and recurring retainers as a separate workflow initially.

## 10. Lead Management

Implement a lightweight lead management workflow.

At minimum, store:

- Lead ID
- Contact information
- Company
- Requested service
- Inquiry details
- Lead source
- Submission timestamp
- Lead status
- Follow-up notes

Statuses:

New → Qualified → Discovery Scheduled → Proposal Sent → Won / Lost

Use a suitable managed database or established CRM integration.

For an internal dashboard, implement secure authentication and authorization. Never expose client records publicly.

Prefer an established CRM if it reduces unnecessary development and maintenance.

## 11. Google Ads and Analytics Readiness

Prepare the website for paid client acquisition.

Implement:

- Google Analytics 4 integration
- Google Tag Manager, if appropriate
- Google Ads conversion event support
- UTM campaign attribution
- Lead form submission conversion tracking
- Qualified booking conversion tracking
- Successful paid engagement tracking
- Cookie and consent handling where legally required
- Clear privacy disclosures

Track actual successful actions, not just button clicks.

Create focused landing pages for:

- AI Product Consulting
- Fractional Technical Product Manager
- AI MVP Strategy
- Enterprise AI Search Consulting

Landing pages must match advertising intent and have one primary conversion objective.

Do not launch advertising campaigns automatically.

## 12. SEO and Content

Implement technical and on-page SEO:

- Unique titles and meta descriptions
- Canonical URLs
- XML sitemap
- Robots.txt
- Open Graph metadata
- Appropriate structured data
- Internal linking
- Optimized image assets
- Semantic HTML
- Fast page performance
- Google Search Console readiness

Preserve relevant existing URLs or add permanent redirects.

Optimize for relevant consulting service searches without keyword stuffing or unsupported location claims.

## 13. Technical Architecture

The website will be hosted on Vercel.

Requirements:

- Production-grade Next.js architecture if already in use
- TypeScript
- Reusable components
- Responsive styling
- Secure server-side APIs
- Proper environment-variable management
- Error handling and logging
- Accessibility
- SEO
- Performance optimization
- Deployment documentation

Use third-party managed services where appropriate for payments, scheduling, email, database, and analytics.

Avoid introducing unnecessary microservices, complex infrastructure, or dependencies.

## 14. Testing and Quality Assurance

Before declaring the website complete:

- Run linting and type checks
- Run a production build
- Test all routes and navigation
- Test mobile layouts
- Test form validation
- Verify email delivery
- Verify booking integration
- Test Stripe in sandbox mode
- Test webhook signature verification and idempotency
- Test CRM/database persistence
- Verify conversion events
- Check accessibility
- Review SEO metadata
- Test error states and failure recovery
- Verify no secrets are committed
- Confirm existing content and redirects remain accessible

Document anything that cannot be verified without external credentials.

## 15. Vercel Deployment

Prepare the repository for deployment to Vercel.

Provide:

- Required environment variables
- Production build configuration
- Domain and DNS instructions
- Third-party integration setup
- Database migration instructions, if applicable
- Deployment checklist
- Rollback guidance

Do not modify production DNS or deploy changes without my approval.

## 16. Implementation Process

Work in phases:

**Phase 1 — Audit and Architecture**

Inspect the existing repository and create a technical implementation plan.

**Phase 2 — Design and Website Structure**

Implement the new consultancy design, navigation, service pages, and content architecture.

**Phase 3 — Client Acquisition Features**

Implement lead capture, scheduling, email notifications, and lead management.

**Phase 4 — Payments and Analytics**

Implement approved Stripe payment products, analytics, attribution, and conversion tracking.

**Phase 5 — Testing and Deployment Readiness**

Complete security checks, functional testing, SEO verification, documentation, and production build.

At the end of each phase, summarize the changes, tests performed, and remaining dependencies.

Do not describe unfinished features as completed.

## 17. Definition of Done

The website is considered launch-ready only when:

- It clearly positions me as an AI Technical Product Management consultant.
- Visitors can understand and compare my consulting services.
- Prospective clients can submit inquiries successfully.
- Clients can book discovery calls through a working scheduling provider.
- Paid fixed-price services can be purchased through a verified payment workflow, if enabled.
- Lead information is captured securely.
- Email notifications work.
- Analytics and conversions are verifiable.
- All pages work on mobile and desktop.
- SEO and accessibility fundamentals are implemented.
- The project builds successfully for Vercel.
- All required production integrations are configured and tested.
- No placeholder testimonials, fictional clients, or unverified achievements appear.

**Start by auditing the existing repository. Present the findings and implementation plan before making major changes. Ask me for business decisions, credentials, or approvals only when they are actually required.**


What you will need to configure
Codex can build the website, but it cannot make external services operational without the required accounts, API keys, domain access, and your approval.
Integration	Purpose
Vercel	Hosting and production deployment
Calendly or Cal.com	Client bookings
Resend	Client and business notifications
Stripe	Secure consulting payments
Supabase or CRM	Lead management
Google Analytics	Visitor and conversion analytics
Google Ads	Client acquisition

One important business decision: I would not make a custom client portal, invoicing platform, or complex CRM a launch requirement. Those features could delay your first client unnecessarily. A working website with booking, qualified lead capture, and secure payments for defined services is enough for an initial launch.

Your existing professional experience should become supporting evidence for the consulting services—not disappear during the redesign.

My recommendation: Give Codex the specification above, have it audit your current repository first, and implement the website in phases. Your immediate target should be a Vercel-deployed consultancy site that can receive its first legitimate client inquiry, rather than a large software platform that takes months to

# SECTION 18 — ADMIN CMS, WEBSITE MANAGEMENT & PREMIUM GLASS UI

## 18.1 Core Objective

Extend the existing consultancy website specification with a fully integrated, secure, production-ready Content Management System (CMS).

I want to manage the entire public website from a private admin portal without needing to modify source code for routine content changes.

The website must have two distinct experiences:

1. **Public consultancy website:** Premium, conversion-focused AI Technical Product Management consulting website.
2. **Private admin portal:** Modern, glass-style management dashboard for content, website sections, articles, services, leads, bookings, and site settings.

The CMS must be connected to the public website so that publishing content updates the live site without requiring a new Vercel deployment.

Do not build a decorative admin dashboard with nonfunctional buttons. All implemented controls must persist data and perform their intended actions.

## 18.2 Premium Design System — Glass UI

Create a distinctive visual identity appropriate for an enterprise AI consultancy.

Design style: **Executive AI Glass — Premium Technology Consultancy**

The design should combine:

- Refined glassmorphism
- Minimalist enterprise SaaS aesthetics
- High-end editorial typography
- Dark navy and deep graphite surfaces
- Subtle electric blue and cyan accents
- Soft translucent panels
- Fine borders and controlled background blur
- Elegant micro-interactions
- Spacious layouts and professional visual hierarchy

### Brand color palette

Use these initial design tokens:

| Token | Color |
|---|---|
| Midnight Navy | #0B1120 |
| Deep Slate | #111C30 |
| Electric Blue | #397BFF |
| AI Cyan | #40D9E8 |
| Platinum White | #F5F7FB |
| Muted Slate | #94A3B8 |
| Glass Border | rgba(255,255,255,0.12) |

Create reusable light and dark theme tokens.

Avoid generic purple AI gradients, neon overload, excessive glowing effects, and unnecessary animation.

Use glass effects selectively on navigation, feature panels, interactive cards, and admin surfaces.

Maintain WCAG AA contrast, readable typography, keyboard accessibility, and performance on low-powered devices.

### Typography

Use a premium modern sans-serif such as Geist or Inter.

Establish consistent typography for headings, body text, labels, and buttons.

The website must feel like a credible technology consulting firm serving executives, founders, CTOs, and product leaders.

## 18.3 Admin Portal

Create a protected admin portal at:

**/admin**

Use a professional SaaS-style layout with:

- Collapsible sidebar
- Top navigation
- Search
- Dashboard overview
- Notifications
- Account menu
- Responsive layouts
- Dark/light mode
- Glass-style cards and panels
- Loading, empty, error, and success states

### Admin navigation

- Dashboard
- Pages & Content
- Page Builder
- Blog & Articles
- Consulting Services
- Case Studies
- Media Library
- Leads & Inquiries
- Bookings
- Consulting Packages
- Testimonials
- SEO Manager
- Website Navigation
- Site Settings
- User Management
- Audit Logs

Only show modules that have been implemented and are operational.

## 18.4 CMS Content Management

I must be able to:

- Create pages
- Edit existing pages
- Delete or archive pages
- Publish and unpublish content
- Save drafts
- Schedule publication
- Edit titles and descriptions
- Change page slugs
- Add images and videos
- Manage page sections
- Update calls to action
- Preview content before publication
- Restore previous content versions

Implement content states:

Draft → In Review → Scheduled → Published → Archived

Use appropriate validation and publication controls.

Prevent accidental deletion of critical website pages.

## 18.5 Visual Page Builder

Build a structured, component-based page builder.

I want to create and rearrange website sections without writing code.

Provide reusable blocks:

- Hero sections
- Rich text
- Service grids
- Feature cards
- Statistics
- Testimonials
- Case study previews
- Process timelines
- Pricing cards
- FAQ sections
- Image and text layouts
- Video embeds
- Call-to-action sections
- Contact forms
- Consultation booking blocks
- Custom content sections

Support:

- Add section
- Remove section
- Duplicate section
- Drag-and-drop reordering
- Edit section content
- Change approved layout variants
- Configure backgrounds and spacing
- Show/hide sections
- Responsive preview
- Draft preview
- Publish changes

Use a validated block schema rather than storing arbitrary executable HTML or JavaScript.

Do not allow CMS users to inject scripts into public pages.

The public website must render content from the CMS while preserving consistent branding and responsive layouts.

## 18.6 Rich Text Editor & Blog CMS

Implement a professional writing interface similar to modern publishing platforms.

Required capabilities:

- Rich text formatting
- Headings
- Bold, italic, and links
- Lists
- Quotes
- Tables
- Code blocks
- Images
- Embedded videos
- Article excerpts
- Categories
- Tags
- Author information
- Featured images
- Drafts
- Scheduled publishing
- SEO metadata
- Article preview
- Revision history

The editor should support autosave and protect against accidental loss of content.

Public articles should have clean, readable layouts, related content, sharing options, and appropriate structured data.

Preserve existing blog articles and URLs where possible.

## 18.7 Services & Pricing Management

Allow me to manage consulting services from the admin portal.

For each service, I should be able to configure:

- Service title
- Slug
- Description
- Target customer
- Business problems addressed
- Deliverables
- Engagement process
- Pricing visibility
- Starting price
- CTA text
- SEO metadata
- Publication status

Support adding new services without code changes.

Allow consulting packages to be created, edited, enabled, or disabled.

Never trust client-submitted prices. Paid products must map to approved server-side Stripe price identifiers.

## 18.8 Leads & Client Management

Integrate the CMS dashboard with the website's lead management system.

Display:

- New inquiries
- Qualified leads
- Discovery calls
- Proposals
- Won and lost opportunities
- Lead source
- Submission dates
- Follow-up notes

Allow filtering, searching, status updates, and assignment where applicable.

Show conversion metrics using actual persisted data.

Do not display fabricated analytics or sample clients in production.

Protect personal information with role-based access control and server-side authorization.

## 18.9 Media Library

Create a central media manager.

Support:

- Image uploads
- Document uploads where appropriate
- Asset search
- Folder or category organization
- Image alt text
- Asset metadata
- File replacement
- Asset reuse across pages
- Image optimization
- Deletion safeguards

Use Vercel Blob or another suitable managed object storage provider.

Do not store uploaded files on Vercel's ephemeral local filesystem.

Validate file types and sizes and restrict unsafe uploads.

## 18.10 SEO Management

Create an SEO editor for pages, services, articles, and case studies.

Manage:

- SEO title
- Meta description
- URL slug
- Canonical URL
- Open Graph image
- Social sharing description
- Indexing controls
- Structured data configuration
- Redirects

Automatically generate and update the sitemap when content is published.

Provide SEO completeness checks without falsely guaranteeing Google rankings.

## 18.11 Website Settings

Create an admin settings interface to manage:

- Brand name
- Logo
- Favicon
- Business contact email
- Social media links
- Footer content
- Navigation menus
- Homepage sections
- CTA labels and destinations
- Scheduling link
- Public pricing visibility
- Analytics configuration
- Basic design theme settings

Keep credentials, API keys, and other secrets in protected server-side environment variables, never in publicly accessible CMS content.

## 18.12 Authentication & Security

The admin portal must be private.

Implement:

- Secure authentication
- Multi-factor authentication where supported
- Server-side session validation
- Role-based authorization
- Protected admin routes
- Input validation
- Rich-text sanitization
- CSRF protections where applicable
- Rate limiting
- Audit logs
- Secure upload handling
- Session expiration
- Least-privilege database access

Initial roles:

- Owner: Full administrative access
- Editor: Manage and publish content
- Viewer: Read-only access

Do not rely solely on hiding buttons or navigation items for authorization.

Do not permit public self-registration for administrator accounts.

## 18.13 Technical Architecture

The public website and CMS must share a coherent architecture.

Preferred approach, subject to repository audit:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Reusable design system
- shadcn/ui or comparable accessible primitives
- Motion library for subtle interactions
- Managed PostgreSQL database
- Drizzle ORM or Prisma
- Managed authentication
- Managed object storage
- Vercel deployment

Evaluate Payload CMS as a potential foundation for the CMS rather than automatically building every CMS capability from scratch.

If Payload CMS fits the existing architecture and Vercel deployment requirements, prefer using its established content modeling, editor, authentication, access control, and media capabilities.

Use custom components where they create meaningful business value, especially for the public website, admin dashboard, and structured page builder.

Document the trade-offs before choosing the final CMS architecture.

### Content model

Design appropriate entities for:

- Users
- Roles
- Pages
- Page Sections
- Articles
- Categories
- Tags
- Services
- Case Studies
- Testimonials
- Media
- Navigation
- Site Settings
- Leads
- Bookings
- Consulting Packages
- Audit Events

Use relationships, validation, indexes, and migration scripts where appropriate.

Avoid duplicating data unnecessarily.

## 18.14 CMS Publishing Workflow

When I publish or update content:

1. Validate the content.
2. Persist it to the database.
3. Update the publication state.
4. Invalidate affected Next.js caches.
5. Refresh the relevant public pages.
6. Update sitemap data where required.
7. Record the publishing action in the audit log.

Publishing must not require a manual Vercel redeployment.

Draft content must not be publicly accessible without authorized preview access.

Support rollback to previous content versions.

## 18.15 Admin Dashboard Analytics

Show useful operational metrics:

- Total inquiries
- New leads
- Discovery bookings
- Qualified leads
- Proposal opportunities
- Won clients
- Published articles
- Most visited pages, when analytics data is connected
- Conversion rates, when the required data is available

Distinguish between website traffic, inquiries, qualified opportunities, and paying clients.

Never fabricate metrics.

If an analytics integration is not configured, show a clear setup or unavailable state.

## 18.16 Testing & Acceptance Criteria

Test the complete CMS workflow.

Verify that:

1. An authorized administrator can sign in securely.
2. Unauthorized users cannot access admin data or mutations.
3. I can create a new article.
4. I can save the article as a draft.
5. I can preview the draft.
6. I can publish it.
7. The public blog displays the article.
8. I can edit an existing service.
9. I can create a new page using approved blocks.
10. I can rearrange homepage sections.
11. Published changes appear without redeployment.
12. I can upload and reuse images.
13. I can manage navigation and SEO metadata.
14. Leads appear in the admin dashboard.
15. Content revision and rollback work.
16. The CMS works on desktop and tablet.
17. Glass UI remains accessible and performant.
18. The application builds successfully for Vercel.

Add automated tests for critical authentication, authorization, publishing, and lead-management workflows.

## 18.17 Implementation Priority

Implement the CMS in stages:

**Stage A — Foundation**
Authentication, database, admin layout, CMS architecture, and content models.

**Stage B — Content Management**
Pages, articles, services, media, and SEO editing.

**Stage C — Visual Page Builder**
Reusable blocks, reordering, preview, publishing, and version history.

**Stage D — Business Management**
Leads, bookings, consulting packages, and operational dashboard.

**Stage E — Production Readiness**
Security testing, performance, accessibility, backups, deployment configuration, and end-to-end verification.

## Final Instruction to Codex

This is a production consultancy business platform.

Build a cohesive, premium experience across the public website and private CMS dashboard.

Prioritize functional workflows, security, maintainability, excellent visual design, and the ability to manage website content without writing code.

Do not sacrifice reliability or accessibility for glassmorphism effects.

Do not build an unnecessarily complex custom CMS if an established solution provides the required functionality.

First audit the existing codebase, evaluate the CMS architecture, and present the implementation plan. Then proceed with implementation in approved stages.
