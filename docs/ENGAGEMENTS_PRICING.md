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

## Six offers appear automatically

The unified catalog uses the versioned `pricing.engagements.v1` setting. Until that setting is saved, all six recommended offers and their prices appear automatically. The older `pricing.plans` record stays untouched for reference but no longer controls public pricing or contact options. This prevents the older hidden-price catalog from masking the new list. There is no database migration or prerequisite admin import.

After editing, **Save offers** persists the unified catalog. Future edits, publication choices, and hidden prices in that setting are respected. **Review recommended offers** reloads the defaults into the editor for review; nothing changes publicly until Save.

The recommended list includes:

| Offer | Public price |
| --- | --- |
| Introductory Discovery Call | Free · 20–30 minutes |
| Product Discovery Sprint | Starting at $2,500 per engagement |
| AI Readiness Assessment | Starting at $3,500 per engagement |
| Architecture & Technical Review | Starting at $2,500 per engagement |
| Fractional Technical Product Management | Starting at $3,000 per month |
| Custom Software Engineering | Custom proposal |

Existing legacy engagement-model and service database records remain intact. The contact dropdown uses the published unified offers rather than all service database records, so changing an offer name or publication state also changes the contact choices. A requested `?offer=` is selected automatically; older `?service=` links map to a related published offer. If all offers are unpublished, the contact form retains a general-inquiry option.

Seven historical service slugs (`ai-strategy`, `fractional-tpm`, `solution-architecture`, `enterprise-search`, `ai-audit`, `product-management`, and `product-delivery`) are omitted from public service listings and the sitemap. Their routes resolve to the published current capability. Service Pages in admin labels them as historical aliases. Core service records and other intentionally created services remain editable. The four current capabilities cover technical product management, custom software engineering, AI solutions/automation, and software architecture/advisory; the six offers describe how clients buy those capabilities.

## Edit the page introduction and SEO

Use **Edit page introduction & SEO** in the offer editor, or open `/admin/pages/engagements`. The existing draft, preview, revision, and publication workflow applies to the introduction and SEO. `/admin/pages/pricing` redirects to this editor. Custom engagement metadata is retained; the old default heading “How to Engage” is read as “Engagements & Pricing.”

Use **Edit Homepage** for the homepage section title, introduction, placement, and visibility. Its cards always read the same unified offers as the full page and the contact dropdown. Public menu settings are normalized to a single “Engagements & Pricing” link, including when older saved menus use `/pricing`.

The public page explains written agreements, indicative fees, scope-dependent quotations, bounded retainers, and separately scoped revisions/support. Structured data describes only published services and does not assert fixed prices, reviews, or guaranteed results. No checkout or subscription billing was added.

## Validation

- Lint and production build pass.
- Unit tests cover requested defaults, safe unique IDs, visible-price validation, legacy content, CMS persistence, role restrictions, cache refreshes, saved navigation normalization, publication/price visibility, and escaped structured data.
- `node scripts/smoke-consulting.mjs` against a local production server in `DEMO_MODE=true` checks 16 public routes, all six offer destinations, the `/pricing` redirect, protected admin routes, sitemap, and media authorization.
- No live payment, scheduling submission, email, production database write, migration, push, or deployment is part of this change. Desktop/mobile browser interaction and real authenticated CMS/database saves should be checked in staging before release; native browser interaction could not complete because the browser was being used concurrently.
