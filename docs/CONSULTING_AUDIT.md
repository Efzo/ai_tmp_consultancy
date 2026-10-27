# Consulting acquisition audit and implementation

Branch: `audit`. No production deployment, Git push, database migration, production email, or production data write was performed.

## 1. Audit and diagnosis

The application uses Next.js 16.4.3 App Router, React 19.3.1, TypeScript, Tailwind CSS, Prisma 6.19/PostgreSQL, NextAuth credentials/JWT sessions, Zod validation, Vercel Blob private storage, Resend email, a configurable scheduling iframe, and GA4. The CMS is implemented inside `/admin` with server actions, database content models, `SiteSetting` JSON records, role checks, revisions, and an audit log. Vercel can build it with the existing Next.js build script; there is no additional hosting service requirement.

Reviewed public routes, nested service/case/blog pages, shared navigation and footer, homepage sections, admin modules, server actions, media endpoints, authentication/proxy, Prisma schema/migration/seed, static content catalogs, SEO routes, environment example, and legacy assets/scripts. Live comparison was attempted at the homepage and engagement URL but the web tool could not access the site.

Confirmed priorities before changes:

| Priority | Finding | Resolution |
| --- | --- | --- |
| Critical | No engagement fallback/seed; empty engagement page | Three shared engagement definitions; CMS editor and safe owner import |
| Critical | Case detail used `findUnique` without publication restrictions | Published-only case listing/detail, consistent sitemap source |
| Critical | Production login could fall back to environment credentials on database failure | Database-backed authentication fails closed; explicit demo mode retains demo behavior |
| Critical | Contact honeypot value was always replaced with an empty string | Submit the real field value and validate on the server |
| High | Inquiry text interpolated into notification HTML | Send plain-text email summaries, with a bounded provider timeout |
| High | Homepage service links and static fallback catalog disagreed | Shared four-capability catalog; homepage links use published CMS services |
| High | All services carried an advisory-only disclaimer | Explicit advisory, implementation, maintenance, and proposal boundaries |
| High | Homepage editor saved blocks the homepage ignored | Validated homepage editor with published snapshots and revision restore |
| High | Two different case-study sources; legacy source had unsupported metrics | One public Prisma-backed reader and a conservative ClinchDesk fallback |
| High | Screenshot placeholder; no case image attachment flow | CMS screenshot uploads, alt text, image references, and honest empty state |
| Medium | AI-only booking/process language; inconsistent CTAs | Broader consulting positioning and discovery-call routing |
| Medium | Root canonical inherited by other public pages | Route-specific canonical/title/description/social metadata |
| Medium | Seed overwrote existing settings/services | Create-only upserts; existing records and publication choices preserved |
| Medium | Prices always rendered; offer list lacked four requested categories | CMS publication and explicit opt-in price visibility, add-ons, three pricing models |
| Medium | Budget defaults displayed truncated labels | Restored readable dollar ranges |
| Medium | Existing lint errors across CMS components and maintenance scripts | Type cleanup and correctly scoped CommonJS lint configuration |

## 2. Public content and conversion changes

- Homepage: requested strategy-to-software positioning, four capabilities, problems, Discover → Design → Build → Launch → Improve process, published featured work, engagements, reasons to work together, CMS articles, editable FAQs, approved published testimonials, final CTA.
- Primary CTA is **Book a Discovery Call** at `/book`; secondary is **Explore Services**. Offers also support quote inquiries and consultation booking.
- Engagements define audience, problems, deliverables, and proposal/retainer structure without guaranteed schedules or fabricated results. Public engagement cards do not expose private price notes.
- ClinchDesk includes the ten requested sections. Feature scope comes from the owner's task description. The local repository does not include ClinchDesk's implementation, so detailed architecture decisions, responsibilities, challenges, lessons, deployment status, adoption, or financial/performance outcomes are not invented.
- Screenshots are absent until approved real images are supplied through the CMS. The homepage uses an explicitly textual overview; the case page shows an honest image empty state.
- Services explain intended clients, problems, deliverables, process, and scope boundaries. Historical service URL aliases resolve to matching current capabilities when the old record does not exist.
- Booking retains the provider embed, validates an HTTPS URL, provides an external-calendar link, and falls back to inquiry without exposing deployment instructions to visitors.
- Contact retains qualification fields, consent, validation, success/error handling, and entries on error. Quote links preserve the selected offer in the inquiry text. Public contact email and availability are CMS editable.

## 3. CMS improvements and operation

| Content | Location | Capabilities |
| --- | --- | --- |
| Other public pages | `/admin/pages` | About, process, booking/contact copy, legal pages, listing introductions, SEO, draft preview, publication, and revision restore |
| Homepage and FAQs | `/admin/page-builder` | Edit copy/CTA paths/metadata; reorder/hide sections; add/remove FAQs; save draft; publish; restore revisions |
| Services | `/admin/services` | Create drafts; edit descriptions, audience, problem/deliverable/process lists, CTA label, SEO; publish/unpublish; owner delete |
| Engagements | `/admin/engagements` | Create, edit structure/features, publish/unpublish, owner delete; defaults available for initial setup |
| Case studies | `/admin/case-studies` | Existing CRUD plus screenshots/alt text, technical trade-offs, product features, lessons; publication/status enforced |
| Consulting offers | `/admin/packages` | Four recommended offers; edit inclusions/add-ons/pricing model/CTA; optional price; explicit price visibility and publication |
| Blog/categories | `/admin/blog` | Existing category text, draft/revision/publish; added unpublish/archive and owner delete |
| Testimonials | `/admin/testimonials` | Existing quote editing, publication, removal; only approved published quotes shown |
| Contact information | `/admin/settings` | Public business email and availability; existing budget and footer-link editing |
| Global SEO/navigation | `/admin/seo`, `/admin/navigation` | Existing global metadata and menu management, plus service/homepage metadata in their editors |
| Initial catalog | `/admin/content` | Owner-only **Add missing consulting content**; fills missing canonical services, engagements and ClinchDesk, corrects the title typo, preserves existing content |

Homepage snapshots, optional case-study details, and contact settings use the existing `SiteSetting` model. No schema change is required. Public image access checks that a raster image is explicitly attached to a published case study before reading private Blob storage; unrelated media/documents remain private.

Production sessions refresh database roles. CMS actions re-check roles; production admin route access also verifies that the JWT user still exists. New services start unpublished. Seed/import operations do not overwrite existing editorial content or publication settings.

**Existing production content:** deploying code does not overwrite database copy. Review existing service/case descriptions in the CMS. If an older offer list already exists, click **Review recommended offers**, review it locally in the editor, then **Save packages** to adopt the four-offer structure. Existing ClinchDesk content remains intact except the safe title correction; use its editor to add verified detail. The initialization marker prevents intentionally deleted catalogs from being recreated by public fallbacks.

## 4. SEO, accessibility, and measurement

Unique metadata/canonicals/social metadata were added for core public routes and service/case detail routes. Homepage/service metadata is editable, blog metadata continues to follow article content, and the global social image remains configurable. Sitemap now includes engagements and uses the same published case reader as the public pages. Existing robots exclusion for admin is retained. ProfessionalService structured data now describes all four capabilities without reviews or ratings.

GA4 uses a validated measurement ID, excludes admin pages, and records route views without query strings in the explicit page URL. `generate_lead` fires only after a successful non-demo inquiry. `consultation_booking_click` distinguishes the booking-page CTA from the external provider link. No inquiry names, emails, company names, or challenge text are included in these custom events. Booking clicks do not assert that an appointment was completed.

Added a skip link, visible keyboard focus, reduced-motion support, a single public main landmark, smaller mobile hero typography, responsive grids, screenshot dimensions/alt text/lazy loading, and a lazy calendar embed. No new dependency or paid service was introduced.

## 5. Validation

- `npm run lint`: passed, no errors or warnings.
- `npx tsc --noEmit`: passed.
- `npm test`: 31 focused tests covering contact validation/spam/consent, normalization and notification format, repeat submissions, publication filtering, title correction, draft snapshot isolation, intentional catalog deletion, fail-closed login/stale-session access, private-media exposure checks, and page save/publish/preview/rendering/revision workflows.
- `npm run build`: production build passed, including Prisma generation, compilation, TypeScript, and route generation.
- `git diff --check`: passed.
- `node scripts/smoke-consulting.mjs` against both the local development server and final production build in demo mode: 16 public pages returned 200 with headings/canonicals; engagement/case sections present; five admin routes redirected unauthenticated requests; media APIs rejected unauthorized access; private media returned 404; sitemap/robots assertions passed.

Unit tests isolate the actual server modules with mocked infrastructure. They do not prove real database writes, Resend delivery, Blob delivery, provider scheduling, or browser behavior. No enabled browser was available, so desktop/mobile screenshot review, keyboard interaction, screen-reader testing, and Lighthouse/Core Web Vitals measurement remain manual checks. The local demo used `DEMO_MODE=true` to avoid production writes.

## 6. Required configuration and remaining limitations

- PostgreSQL: confirm `DATABASE_URL`; review/apply the repository's existing migration against a backed-up staging database if it has not already been applied. This task adds no migration. Do not run migrations blindly against production.
- Authentication: set a strong `NEXTAUTH_SECRET`, correct HTTPS `NEXTAUTH_URL`, and `ADMIN_EMAIL`. Production login requires an existing database user with a bcrypt password. Seed only after reviewing the create-only seed; `ADMIN_PASSWORD` is used to provision a missing owner, never as a production login fallback. Ensure `DEMO_MODE=false` in production.
  For account-only setup, terminal password recovery, and email recovery configuration, follow [Admin access](ADMIN_ACCESS.md). Use `npm run admin:create` instead of seeding website content when only an owner account is needed.
- Email: configure `RESEND_API_KEY`, a verified `RESEND_FROM_EMAIL`, and `BUSINESS_EMAIL`. Test both business notification and customer acknowledgement in staging. Persisted leads remain successful if email fails; `lead.notification_failed` audit records identify failures. There is no background retry queue.
- Scheduling: set a real HTTPS `NEXT_PUBLIC_BOOKING_URL`; verify embed permissions, timezone, reminders, rescheduling, mobile behavior, and an actual test booking in the provider.
- Analytics: set a real `NEXT_PUBLIC_GA_MEASUREMENT_ID`; verify events in GA4 DebugView and configure key events as desired. Provider webhooks or provider-side tracking would be needed for completed appointment measurement; this change tracks booking intent only.
- Media: configure `BLOB_READ_WRITE_TOKEN` for the existing private store. Upload real approved screenshots with descriptive alt text. An uploaded image becomes public only once referenced by a published case study.
- Editorial: verify ClinchDesk details against its source project before adding stronger technical/outcome claims. Review existing About employment/certification claims and approved client quotes; this audit did not independently verify them. No testimonials or credentials were manufactured.
- Existing privacy/terms pages remain labeled drafts and require owner/legal review and approved contact/business details before launch. They were not represented as finalized policies.
- Contact spam controls include a honeypot, bounded-process cooldown cleanup, and a database check for recent same-email leads. They are not a distributed IP-based abuse-prevention system; configure appropriate existing hosting/provider controls if needed.
- The generic page builder does not create arbitrary public routes. Website Pages now connects all 12 additional primary pages to typed content editors; page introductions and SEO are editable alongside the existing homepage and specialized record editors. The existing route layouts are preserved.
- Core Web Vitals gains are not claimed without browser measurement. No real external email, calendar, authenticated database CMS, or Blob upload was exercised in this session.

## 7. Deployment checklist

1. Review the `audit` branch diff and content, including the file inventory below.
2. Configure a Vercel preview/staging environment with non-production data; set `DEMO_MODE=false` there when testing real integrations.
3. Confirm the existing database schema and take a backup before any migration or seed. No migration is required for these changes.
4. Sign in as owner; import missing consulting content; review recommended offers and publish the desired list; verify homepage revisions, FAQ edits, service edits, case images, and publish/unpublish/delete behavior in staging.
5. Check real contact persistence, both email deliveries, error behavior, upload access, and calendar booking. Review notification audit records.
6. Review desktop/mobile layouts, keyboard navigation, form errors, contrast, image alt text, and Lighthouse on the preview.
7. Verify sitemap/canonicals/social previews and GA4 events with the intended production hostname.
8. Approve the legal/editorial content and production environment settings.
9. Re-run lint/tests/type checks/build/diff check. Deploy only after explicit owner approval; monitor lead storage, notification errors, and scheduling after release.

## 8. Files modified or created

- `.gitignore`
- `eslint.config.mjs`
- `package.json`
- `prisma/seed.mjs`
- `scripts/smoke-consulting.mjs`
- `src/app/about/page.tsx`
- `src/app/actions/cms.ts`
- `src/app/actions/contact.ts`
- `src/app/actions/media.ts`
- `src/app/actions/videos.ts`
- `src/app/admin/case-studies/page.tsx`
- `src/app/admin/content/page.tsx`
- `src/app/admin/engagements/page.tsx`
- `src/app/admin/layout.tsx`
- `src/app/admin/page-builder/page.tsx`
- `src/app/admin/settings/page.tsx`
- `src/app/api/media/[id]/route.ts`
- `src/app/blog/[slug]/page.tsx`
- `src/app/book/page.tsx`
- `src/app/case-studies/[slug]/page.tsx`
- `src/app/case-studies/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/engagements/page.tsx`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/pricing/page.tsx`
- `src/app/process/page.tsx`
- `src/app/services/[slug]/page.tsx`
- `src/app/services/page.tsx`
- `src/app/sitemap.ts`
- `src/app/videos/page.tsx`
- `src/components/ContactForm.tsx`
- `src/components/GoogleAnalytics.tsx`
- `src/components/PublicChrome.tsx`
- `src/components/admin/BlogEditor.tsx`
- `src/components/admin/CaseImageUpload.tsx`
- `src/components/admin/CaseStudyEditor.tsx`
- `src/components/admin/ConsultingImport.tsx`
- `src/components/admin/ContactDetailsEditor.tsx`
- `src/components/admin/EngagementEditor.tsx`
- `src/components/admin/HomeEditor.tsx`
- `src/components/admin/PricingEditor.tsx`
- `src/components/admin/ServiceEditor.tsx`
- `src/components/admin/TrustLogoItem.tsx`
- `src/components/admin/TrustLogosEditor.tsx`
- `src/components/admin/VideoEditor.tsx`
- `src/components/home/Differentiator.tsx`
- `src/components/home/EngagementOverview.tsx`
- `src/components/home/FAQ.tsx`
- `src/components/home/FeaturedProject.tsx`
- `src/components/home/FinalCTA.tsx`
- `src/components/home/Hero.tsx`
- `src/components/home/ServicePillars.tsx`
- `src/components/home/TechExpertise.tsx`
- `src/components/home/Trust.tsx`
- `src/data/case-studies.ts`
- `src/data/consulting.json`
- `src/data/homepage.json`
- `src/data/offers.json`
- `src/data/pricing.ts`
- `src/data/services.ts`
- `src/lib/analytics.ts`
- `src/lib/auth.ts`
- `src/lib/case-details.ts`
- `src/lib/case-studies.ts`
- `src/lib/content.ts`
- `src/lib/engagements.ts`
- `src/lib/home-content.ts`
- `src/lib/homepage.ts`
- `src/lib/seo.ts`
- `src/lib/services.ts`
- `src/lib/site-settings.ts`
- `src/proxy.ts`
- `src/types/index.ts`
- `tests/consulting.test.mjs`
- `docs/CONSULTING_AUDIT.md` (this report)
