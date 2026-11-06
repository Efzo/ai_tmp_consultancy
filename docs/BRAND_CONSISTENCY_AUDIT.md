# Production brand and marketing consistency audit

Reviewed 5 November 2026 against the approved About narrative and the live public website. This is an evidence-based content and routing review, not a conversion-rate measurement or credential verification.

## Coverage and limits

- Read all 20 URLs in the production sitemap, plus the missing Customer Support Systems destination, `/pricing`, and three legacy service URLs: 25 URL checks in total.
- Cross-checked production CMS records in Search & Social Sharing, Service Pages, Project Case Studies, Contact & Site Settings, Engagements & Pricing, the homepage builder, and the published About editor. Reviewed CMS source wiring for the homepage, managed pages, navigation, pricing, blog, videos, and public metadata.
- Reviewed public form choices, booking destination, visible service scope, empty content states, and calls to action. Did not send inquiries, book appointments, inspect private leads/accounts, or verify commercial outcomes.
- The public booking button has a configured external calendar destination; this does not confirm appointment availability or successful booking.
- Findings below describe the production snapshot. Local source corrections are identified separately. No production CMS records were changed during this audit.

## Recommended brand standard

**Business name:** Efosa Ojomo Technology Services.

**Tagline:** Your Vision. Our Expertise. Technology That Works for You.

**Positioning:** Practical technology services for small businesses, founders, and growing organizations: websites and custom software, customer support systems, business automation, and product/technology management. Architecture and advisory support those services.

**Voice:** Use “we” for the business offer and delivery approach. Use “I” for Efosa's founder biography and documented personal project responsibilities. A founder-led business can use both without suggesting an unverified team size.

**Commercial model:** Defined projects plus separately agreed ongoing care/management. Keep written scope, capacity, exclusions, service hours, third-party costs, and no-unlimited-development boundaries.

**Primary CTA:** Book a Discovery Call → `/book`. Secondary service-navigation CTAs may say Explore Services / Explore Our Services → `/services`. Context-specific inquiry buttons should remain descriptive.

## Findings in priority order

| Priority | Finding and evidence | Impact | Corrective action and owner |
| --- | --- | --- | --- |
| Critical | `/services/customer-support-systems` returns 404. The footer and business-owner path link to it; About and the offers page promote it. No matching record appeared in Service Pages. | A promoted core service leads to a dead end. | In `/admin/services`, load the Customer Support Systems template, review its scope, and publish the missing service. Confirm the page, sitemap, and homepage card afterward. |
| High | Homepage says “Four connected services” but displays only three. | The main service promise does not match what visitors see. | Publish the missing support-system service and verify the selected homepage slugs in `/admin/page-builder`. Restore the intended four core cards, rather than inserting an unrelated card just to make the count four. |
| High | Visible logo/About use Technology Services; saved global SEO title uses Technology & Product Consulting; layout structured data uses Managed Technology & Business Solutions; install manifest uses Technology & Product Consulting. | Customers and crawlers receive three business identities. | Update `/admin/seo` using the exact copy below. Local layout/manifest names have been corrected to Technology Services; deployment is pending. |
| High | Global footer description still says “Technical product management, AI strategy, and technology advisory for organizations building and modernizing digital products.” | Narrows the business to the old enterprise/AI positioning on every page. | Replace the saved global description in `/admin/seo`; it also controls footer copy. |
| High | Privacy and Terms publicly show “Legal draft — review required,” production-review instructions, and unfinished contact sections. Privacy still names the older consultancy brand. | The site's public trust information is visibly unfinished. | Review actual business identity, vendors, contact process, and policy terms with the responsible owner/adviser before replacing/publishing this text through `/admin/pages/privacy` and `/admin/pages/terms`. This audit does not approve legal wording or silently remove review notices. |
| High | ClinchDesk has a published summary, but CMS fields for problem, implementation, outcomes, stack, role, requirements, architecture, and challenges are empty. The public page shows headings without corresponding detail and a trade-off verification placeholder. | The main proof point does not substantiate the marketing summary. | Complete `/admin/case-studies` from actual project evidence, add approved screenshots/product URL, and verify responsibilities and claims. Do not invent outcomes or client metrics. The CMS title also contains “ClincDdesk”; public readers currently receive a normalized title. |
| Medium | Introductory Discovery Call is a published Service record as well as an engagement. Its service page has empty problem/deliverable/process sections. | Confuses a buying step with a service capability and duplicates an existing offer. | Keep the discovery call in `/book` and Engagements & Pricing. Plan a permanent redirect from its current service URL before retiring that published service record; do not delete a live indexed URL casually. |
| Medium | Software service says Custom Software Engineering and leads with SaaS/type-safe-stack language; the business promises websites as well. AI service overview and deliverables assume AI even though the offer includes ordinary automation. | Business owners may not recognize their website or non-AI workflow needs. | Review existing service templates in `/admin/services`; use the proposed names and opening copy below while keeping current canonical slugs and agreed deliverables. |
| Medium | Footer uses old service paths `/ai-strategy`, `/fractional-tpm`, `/solution-architecture`. They successfully redirect to current pages. The CMS calls the automation link “AI Product Strategy.” | Avoidable redirects and an editor label that disagrees with the public footer. | Update saved footer links in `/admin/settings` to canonical paths. Local fallback URLs and CMS labels have been corrected; deployment does not replace already saved links. |
| Medium | Seven sitemap pages have meta descriptions longer than 160 characters: Services 182; Engagements 167; Booking 182; Contact 172; Privacy 265; Terms 198; ClinchDesk 200. | Snippets can become overlong or be rewritten. This is not a claim of a ranking penalty. | Local shared metadata now generates a concise, consistent search/Open Graph/Twitter description without changing page body copy. Review authored descriptions in their CMS editors too. |
| Medium | Public Blog has no articles and says “No articles match your search” on first visit; Videos says “No Insights Yet” / “strategic video briefings.” Blog introduction is narrowly product/AI focused. | The navigation suggests useful resources that currently feel empty and corporate. | Publish useful, accurate material before emphasizing these channels, or temporarily remove their menu links in `/admin/navigation`. Update `/admin/pages/blog` and `/admin/pages/videos` with the copy below. No fabricated posts, videos, or testimonials were added. |
| Low | Case-study back link says Portfolio although navigation says Case Studies. Several footer headings skip heading levels. | Small navigation/accessibility inconsistency. | Back-link wording is corrected locally. Heading hierarchy can be reviewed separately without changing the brand's visual design. |
| Optional | Contact budget options begin at $5k–$15k after Undetermined. | Smaller business owners may perceive a minimum fee even though services are tailored quotes. | Decide whether a smaller-budget option fits the actual business. Do not change fees, budget ranges, or published prices without an owner decision. |

## Exact proposed CMS copy

### Global SEO and footer — `/admin/seo`

**Site title:** Efosa Ojomo Technology Services | Your Technology Partner

**Description:** Websites, custom software, customer support systems, automation, and product leadership. Project delivery and ongoing care for businesses and founders.

Keep the existing approved logo/social image. This is the same proposed description now prepared in local defaults; the saved production record still needs updating.

### Service presentation — `/admin/services`

Keep existing URLs to protect current links and search history.

| Current canonical slug | Recommended public label | Recommended opening description |
| --- | --- | --- |
| `software-engineering` | Websites & Custom Software | Professional websites, business applications, and custom software built around your customers, workflows, and day-to-day operations. |
| `technical-product-management` | Product & Technology Management | Turn business goals into clear requirements, practical roadmaps, and coordinated delivery from discovery through ongoing improvement. |
| `customer-support-systems` | Customer Support Systems | Organize customer inquiries with ticketing, knowledge bases, routing, and support workflows designed for your team. |
| `ai-solutions` | Business Automation & AI Solutions | Connect your tools and simplify repetitive work with practical automation, using AI where it fits the agreed business need. |
| `software-architecture` | Technology Architecture & Advisory | Evaluate systems, plan improvements, and make sound architecture and integration decisions for maintainable technology. |

Retain the explicit exclusion of human support-agent staffing and round-the-clock cover. Do not promise a guaranteed improvement percentage or unbounded support.

### Footer link destinations — `/admin/settings`

- Business Automation → `/services/ai-solutions`
- Product & Technology Management → `/services/technical-product-management`
- Technology Advisory → `/services/software-architecture`

### Blog and video page copy

**Blog headline:** Practical technology insights for your business.

**Blog description:** Guidance on websites, custom software, customer support systems, automation, and product delivery for business owners, founders, and growing teams.

**Video empty heading:** Practical technology videos are on the way.

**Video empty text:** Explore our services and case studies, or book a discovery call to discuss your technology needs.

The empty blog state also needs a small renderer change to distinguish an empty catalog from a search with no matches.

## Public page coverage

| Public route | Assessment |
| --- | --- |
| `/` | Strong customer-led positioning and clear paths. Fix missing fourth capability and substantiate featured project. |
| `/for-businesses` | Good fit and clear scope boundaries. Support-system card currently leads to 404. |
| `/for-founders` | Clear discovery/build/management path. Preserve practical delivery language. |
| `/services` | Capability catalog needs missing support service and discovery-call cleanup. |
| `/about` | Approved company-led version is live, including founder story, three degrees, and saved certifications. |
| `/case-studies` | One project; strengthen project detail before treating this as strong proof. |
| `/case-studies/clinchdesk` | Incomplete supporting evidence and fields; requires owner/project facts. |
| `/process` | Strong agreement, handover, and ongoing-care boundaries; broadly consistent. |
| `/engagements` | Nine clear offers with tailored quotes and exclusions; preserve this model. |
| `/book` | Relevant discovery messaging and configured calendar link. Availability not tested. |
| `/contact` | Engagement choices align with the nine offers. Budget positioning is an owner decision. |
| `/blog` | No published articles; update audience breadth and initial empty state. |
| `/videos` | No published videos; update empty copy or defer menu prominence. |
| `/privacy`, `/terms` | Public draft/placeholder content; owner-approved completion needed. |
| Four existing core service detail pages | Reachable and technically credible; broaden website/automation descriptions as proposed. |
| `/services/introductory-discovery-call` | Reachable but duplicates the buying step and has incomplete detail. |
| `/services/customer-support-systems` | Missing / 404. |
| `/pricing` and three legacy service URLs | Redirect successfully to current destinations. |

## Work prepared locally

- Corrected layout Open Graph site name and ProfessionalService name.
- Corrected browser-install manifest name and description.
- Corrected fallback footer destinations and the CMS's automation/product link labels.
- Corrected the case-study back-link label.
- Prepared the proposed global title/description defaults.
- Added shared concise description generation for search and social metadata, with automated checks.

These changes are local, uncommitted, and undeployed. They do not replace production CMS records. The remaining content and catalog actions above are proposed corrections, not completed production writes.

## Recommended release order

1. Review/approve missing service content and website/automation naming; publish the support-system service and verify all four homepage capabilities.
2. Apply the global SEO/footer copy and canonical footer links in the production CMS.
3. Complete the project evidence and public policy drafts with real, approved information.
4. Deploy the reviewed local brand/metadata fixes, then recheck the sitemap and public routes.
5. Publish useful resources or reduce empty navigation destinations; review conversion data after the changes rather than assigning an invented marketing score.

## Validation of prepared code

`npm test` passed all 76 checks; `npm run lint`, `npm run build`, and `git diff --check` passed. These are local checks, not evidence that a production CMS edit or deployment has occurred.

## Authorized implementation — 5 November 2026

The owner authorized edits and publication after this audit. The initial findings above remain the original snapshot.

Production CMS updates:

- Published the missing Customer Support Systems template, retaining explicit exclusions for human staffing and round-the-clock coverage.
- Published revised titles, introductions, scope wording, and metadata for websites/software, product management, automation/AI, and technology advisory. Existing service URLs and price settings were retained.
- Saved the approved Technology Services global title and description, including the footer introduction; preserved the existing logo/social image.
- Saved all three canonical footer destinations.
- Published broader business-focused blog and video introductions, empty-state wording, and search metadata.
- A subsequent public crawl confirmed the new service returns 200 and the four revised service names are visible.

Source changes included in this release:

- Unified schema, Open Graph site name, and install-manifest branding.
- Limited shared search/social descriptions to 160 characters without shortening page body copy.
- Redirected the historical discovery-call service URL to booking and excluded it from capability lists, the sitemap, and service schema. Added an explanatory CMS notice; retained the database record.
- Added useful service/booking links when blog or video catalogs are empty.
- Hid case-study narrative, detail, stack, and media sections when their content is absent. Removed the public verification placeholder; no project claims or metrics were invented.
- Corrected footer fallback destinations and CMS link labels.

Validation: all 77 tests, lint, production build, production-mode route/authentication/media/sitemap smoke checks, and whitespace checks passed. Deployment and final production checks are separate from local validation.

Remaining factual work: the owner confirmed the business operates in the United States. The specific state, actual privacy practices, policy terms, and ClinchDesk source evidence were not provided. Privacy/Terms completion and detailed project claims remain open; the approved About page, education, and saved certifications were preserved.
