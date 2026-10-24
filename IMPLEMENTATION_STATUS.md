# Implementation status

This file records the current state against `root_backup/project_road_map.md`. It intentionally separates working local behavior from integrations that require external accounts.

## Working locally

- Next.js App Router, TypeScript, Tailwind v4, linting, and production build.
- Public home, services, case studies, about, process, pricing, booking, contact, blog, privacy, and terms routes.
- Responsive navigation with mobile menu.
- Blog listing with search/category filters and static article pages preserving the original article topics and URLs under `/blog/[slug]`.
- Generated sitemap and robots rules, canonical metadata on core routes, redirects for the legacy `index.html`, `blog.html`, and `thank-you.html` URLs.
- Focused consulting landing pages for AI product consulting, fractional technical product management, AI MVP strategy, and enterprise AI search.
- Contact validation with required consent, honeypot spam field, basic rate limiting, and demo-mode behavior.
- Lead persistence and notification code is implemented for a configured PostgreSQL database and Resend account.
- CMS persistence is implemented for page drafts, page versions, publishing/restoration, blog drafts and publishing, services, site settings, user roles, audit events, and media records. Vercel Blob upload validation is implemented at `/api/admin/media`.
- Admin route protection through NextAuth middleware and environment-provided credentials. Local demo login uses the credentials in `.env` and must be replaced before deployment.
- Admin dashboard and lead list do not display fabricated sample metrics; they show a setup state until real database data is available.
- Admin navigation now has real routes for Pages & Content, Page Builder, Blog, Services, Case Studies, Media, Leads, Bookings, Packages, Testimonials, Analytics, SEO, Navigation, Settings, Users, Security, and Audit Logs. The Page Builder supports validated block types, local draft save/load, ordering, visibility, and removal.

## Still requires external configuration

- PostgreSQL/Supabase: run `npx prisma migrate deploy` after setting a real `DATABASE_URL`.
- After migration, run `npm run db:seed` to create the initial services, homepage page record, and owner user record.
- Vercel Blob: set `BLOB_READ_WRITE_TOKEN` before using the Media Library upload form.
- Calendly or Cal.com: set `NEXT_PUBLIC_BOOKING_URL`.
- Resend: set `RESEND_API_KEY`, `BUSINESS_EMAIL`, `RESEND_FROM_EMAIL`, and verify the sending domain.
- Stripe: checkout, webhook verification, idempotency, and payment records still need implementation and sandbox credentials before paid services are enabled.
- GA4 and consent management: set a real measurement ID and choose the applicable cookie/consent policy before advertising.
- Vercel deployment, DNS, domain verification, backups, and production secret rotation.
- `npm audit --omit=dev` currently reports four high-severity advisories in the pinned Prisma 6 CLI/config dependency chain. Resolve the Prisma upgrade path and rerun the audit before production launch.

## CMS items not yet launch-ready

The current admin area has database-backed mutations for pages, blog posts, services, settings, users, and media when the integrations are configured. Scheduling, navigation persistence, package management, and a complete public render of arbitrary CMS page blocks still need their final production workflow and automated end-to-end coverage.

## Local verification

```bash
npm install
npx prisma generate
npm run db:migrate
npm run db:seed
npm run lint
npm run build
npm run dev
```

The local `.env` is intentionally ignored by Git. Use `.env.example` as the deployment checklist.
