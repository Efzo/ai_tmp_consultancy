# Engagements & Pricing administration

The canonical public page is `/engagements`. `/pricing` permanently redirects there. Navigation, footer, and the homepage preview link to the canonical page; the sitemap lists `/engagements`.

## Edit offers

Open **Admin → Services & Pricing → Engagements & Pricing** (`/admin/packages`). The previous `/admin/engagements` link redirects to this editor.

Each offer has an editable name, unique slug ID, public price label, description, related service capability, intended audience, business problem, engagement model/capacity, deliverables, optional add-ons, engagement type, CTA text, and CTA destination.

- **Display price publicly** controls the fee label on both the full page and homepage. With this off, the full page says “Request a tailored quote.” Prices are not included in structured data.
- **Published** controls the entire card on both pages. All cards can be unpublished without restoring defaults.
- **Booking** sends visitors to the existing `/book` workflow.
- **Contact** sends visitors to `/contact?offer=<id>` and identifies the selected published offer in the inquiry form.
- **Save offers** immediately updates the shared list. This editor does not have a separate draft/publish step. Owners and editors can save; viewers cannot.

Prices are USD labels. Include “Starting at” and the period for indicative fees; do not present a starting fee as a final quotation. Keep capacity and responsibilities explicit for monthly advisory.

## Business model offer templates

The unified catalog uses the `pricing.engagements.v1` setting. Existing saved offers and publication choices are preserved. If no unified catalog has been saved, the nine managed technology offers below are used as defaults. The older `pricing.plans` record stays untouched and does not control public pricing.

Choose **Review business model offers** to load the new list into the editor. Nothing changes publicly until **Save offers**. This replaces the complete reviewed list; keep any custom offers you want before saving. Paid prices are blank and hidden by default because the PDF's sample prices have not been validated.

| Offer | Default pricing visibility |
| --- | --- |
| Introductory Discovery Call | Free · 20–30 minutes |
| Business Website Build | Tailored quote |
| Website Care & Maintenance | Monthly plan, tailored quote |
| Customer Support System Setup | Tailored quote |
| Business Workflow Automation | Tailored quote |
| Support & Automation Management | Monthly plan, tailored quote |
| Product Discovery Sprint | Tailored quote |
| Fractional Technical Product Management | Monthly plan, tailored quote |
| Custom Software Engineering | Tailored quote |

See [Business model setup](BUSINESS_MODEL.md) for the full CMS rollout and the two customer paths.

Existing legacy engagement-model and service database records remain intact. The contact dropdown uses the published unified offers rather than all service database records, so changing an offer name or publication state also changes the contact choices. A requested `?offer=` is selected automatically; older `?service=` links map to a related published offer. If all offers are unpublished, the contact form retains a general-inquiry option.

Seven historical service slugs (`ai-strategy`, `fractional-tpm`, `solution-architecture`, `enterprise-search`, `ai-audit`, `product-management`, and `product-delivery`) are omitted from public service listings and the sitemap. Their routes resolve to the published current capability. Service Pages in admin labels them as historical aliases. Core service records and other intentionally created services remain editable. The four primary pillars cover websites/software, product management, support systems, and business automation. Architecture/advisory remains a specialist service. The offers describe how clients buy project delivery and ongoing care.

## Publish a new service capability

On **Admin → Service Pages**, choose **Save draft** to keep a new service private or **Create & publish** to show it immediately on `/services`. The editor keeps the saved service and confirmation on screen. For an existing draft, check **Published on public site** and click **Save service**. Refreshing the public page does not publish a draft.

Saving a service refreshes the service list, its detail page, the homepage, sitemap, and admin list. Historical alias slugs cannot be used for new services, because those URLs resolve to current capabilities. Adding a service capability does not create a priced offer automatically; use **Engagements & Pricing** for prices and contact choices.

## Edit the page introduction and SEO

Use **Edit page introduction & SEO** in the offer editor, or open `/admin/pages/engagements`. The existing draft, preview, revision, and publication workflow applies to the introduction and SEO. `/admin/pages/pricing` redirects to this editor. Custom engagement metadata is retained; the old default heading “How to Engage” is read as “Engagements & Pricing.”

Use **Edit Homepage** for the homepage section title, introduction, placement, and visibility. Its cards always read the same unified offers as the full page and the contact dropdown. Public menu settings are normalized to a single “Engagements & Pricing” link, including when older saved menus use `/pricing`.

The public page explains written agreements, indicative fees, scope-dependent quotations, bounded retainers, and separately scoped revisions/support. Structured data describes only published services and does not assert fixed prices, reviews, or guaranteed results. No checkout or subscription billing was added.

## Validation

- Lint and production build pass.
- Unit tests cover requested defaults, safe unique IDs, visible-price validation, legacy content, CMS persistence, role restrictions, cache refreshes, saved navigation normalization, publication/price visibility, and escaped structured data.
- `node scripts/smoke-consulting.mjs` against a local production server in `DEMO_MODE=true` checks 19 public routes, all nine offer destinations, the `/pricing` redirect, protected admin routes, sitemap, and media authorization.
- No live payment, scheduling submission, email, production database write, migration, push, or deployment is part of this change. Desktop/mobile browser interaction and real authenticated CMS/database saves should be checked in staging before release; native browser interaction could not complete because the browser was being used concurrently.
