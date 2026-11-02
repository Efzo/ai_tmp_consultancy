# Managed technology business model

The current direction comes from `Efosa_business_model.pdf`: Efosa Ojomo is a technology partner for business owners and founders, from initial delivery to everyday operations. The main message is “Busy running your business? Let us handle the technology.”

## Public positioning

Four primary pillars are Websites & Custom Software, Product & Technology Management, Customer Support Systems, and Business Automation. Software Architecture & Technical Advisory remains available as a specialist service. Existing service URLs and historical aliases remain supported.

The homepage introduces two editable paths:

- `/for-businesses`: websites, care, support systems, and workflow automation.
- `/for-founders`: discovery, engineering, product delivery, and technical decisions.

Both have connected editors under Website Pages, with draft, preview, publication, SEO, and revision history. Their cards can be added, removed, reordered, and linked to a relevant service or inquiry destination. Both routes are included in the sitemap.

The default catalog has nine offers: introductory call, business website build, website care, support-system setup, workflow automation, support/automation management, product discovery, fractional technical product management, and custom software engineering. The introductory call retains its free label. Paid fees start blank and hidden because the PDF's sample prices are unvalidated. Editors can set and show approved prices independently.

## Adopt the model in an existing CMS

Start at **Admin → Business Model & Positioning** (`/admin/business-model`). Deployment alone does not replace existing saved CMS content or pricing. The existing `pricing.engagements.v1` key is retained so saved offers, custom fees, and publication choices continue to take precedence.

1. Open Service Pages. Use the business model button on existing services to load revised copy. Use the missing-service template selector to create Customer Support Systems. Review each card before saving. Templates retain existing IDs, URLs, price/SEO settings, and publication choices. New services can be saved privately or published explicitly; template deliverables and process steps persist on creation.
2. Open Engagements & Pricing and choose **Review business model offers**. This replaces the form's unsaved list. Review all offers and prices; **Save offers** applies the reviewed list immediately to the public offers page, homepage cards, and contact choices.
3. Open Website Pages and review/publish both customer-path pages. Edit card destinations if you change which services or plans are available.
4. Open Edit Homepage and choose **Review business model homepage**. Review hero copy, customer paths, featured service slugs, FAQs, metadata, and section visibility. Save a draft and preview, then publish. Featured services follow the selected order and show only published records; an empty selection shows no service cards.
5. Use **Review business model copy** on About, How I Work, Services, Engagements, Contact, and Booking. Review before publishing each page. About template loading preserves experience, certifications, and portrait fields; Booking preserves its calendar URL. The homepage process steps read from the How I Work editor.
6. Under Search & Social Sharing, load and review the business model title/description, then save. The description is also used in the public footer. Menu Links can add customer-path pages to the navigation.

The homepage schema accepts older snapshots without injecting a new section into their saved section order. Page and homepage drafts continue to use published snapshots so draft edits remain private. No Prisma schema change or migration is required.

## Service boundaries

Project delivery and monthly care are separate scopes. Monthly agreements define tasks, named systems, capacity, service hours, response expectations, exclusions, and usage limits. Maintenance does not include unlimited development. New features and workflows are quoted separately. Support-system management covers technology and workflows, not support-agent staffing or 24-hour coverage. Third-party subscriptions and usage costs are identified separately.

The engagement introduction editor controls its positioning label, price notice, and scope explanation/list, alongside the existing title, introduction, and CTA. All individual offer details remain in Engagements & Pricing.

## Validation

- Production build and lint pass; all 61 automated tests pass.
- Local production preview in demo mode passes HTTP checks for 19 public routes, all nine offer CTA destinations, eight protected admin routes, media authorization, sitemap, and robots.
- Chrome desktop visual review covers the homepage, its customer-path cards, and the business-owner page. A dedicated mobile visual pass was not performed.
- Tests use isolated persistence and provider mocks. Real authenticated CMS saves, production database state, email, and scheduling delivery were not exercised.
- No production data write, migration, Git push, or deployment was performed. The existing `.env` and owner-supplied PDF remain unchanged.
