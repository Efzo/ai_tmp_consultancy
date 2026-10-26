# Website Manager: where to find everything

Open `/admin` and sign in. Start with **What would you like to do?**, or choose **Where to Edit** for a searchable guide and a page-by-page list of available controls.

| Menu group | Destinations | Use it for |
| --- | --- | --- |
| Start Here | Overview; Where to Edit | Common tasks, business totals, and finding the correct editor |
| Website Content | Edit Homepage; Edit About; Website Pages; Project Case Studies; Blog Articles; Videos; Client Testimonials; Images & Files | Text, project stories, articles, approved feedback, and uploads |
| Services & Pricing | Service Pages; Ways to Work Together; Offers & Pricing | Your capabilities, how clients hire you, offer inclusions, and optional prices |
| Client Inquiries | Project Inquiries; Booking Setup | Contact-form messages and calendar configuration |
| Website Settings | Menu Links; Search & Social Sharing; Contact & Site Settings; Traffic & Conversions | Shared links/contact information, search appearance, and measurement setup |
| Access & Activity | Admin Users & Roles; Security Settings; Change History | Administrator permissions, security status, and recorded actions |

## Similar names explained

- **Service Pages** describes what you do and the deliverables clients receive.
- **Ways to Work Together** describes the engagement format: discovery, engineering, or fractional leadership.
- **Offers & Pricing** packages work into offers and controls whether prices are shown.
- **Project Inquiries** contains messages submitted by potential clients. **Booking Setup** checks the calendar connection; actual appointments remain in the calendar provider.
- **Menu Links** changes the top public navigation. **Footer Links**, within Contact & Site Settings, changes links at the bottom of the site.
- **Edit Homepage** is the former Page Builder entry. It edits the homepage, including FAQs and section visibility.

## Settings organization

Contact & Site Settings has direct links to contact details, inquiry budget choices, footer links, trust logos, and connection indicators. Budget choices qualify inquiries; they do not set offer prices. Initial catalog setup is under a separate expandable section in Where to Edit, and additional text settings are under Advanced when present.

## Edit About and other website pages

Open **Website Content → Edit About**, or visit `/admin/pages/about`. You can edit the headline, biography paragraphs, expertise, experience highlights, certifications, profile image, alt text, and search metadata. Add, remove, and reorder list entries using the form controls.

**Website Pages** (`/admin/pages`) contains connected editors for About, How I Work, Contact, Booking, Privacy, Terms, and the introductions on Services, Engagements, Pricing, Case Studies, Blog, and Videos. Where to Edit links to both the page introduction editor and the specialized record editor when appropriate.

1. **Save draft** saves privately; visitors continue to see the last published version.
2. **Save & Preview** saves a draft and opens an authenticated preview on the public route. A preview banner offers Back to editor and Exit preview.
3. **Save & Publish** makes the saved content and metadata public.
4. **Restore as draft** creates a new draft from a saved revision without replacing the public version.

The homepage editor also supports Save & Preview. Public content snapshots and metadata use the existing Page, PageVersion, and SiteSetting infrastructure. No database migration is required. Existing About records are preserved and their original published copy remains visible during draft editing. PostgreSQL must be configured and demo mode disabled to persist edits.

Contact form fields and validation still work through the existing form; the Contact Page editor controls editorial copy and button labels. Shared email/availability and budget choices remain in Contact & Site Settings. Booking page copy and the calendar URL are editable in Website Pages; Booking Setup remains the connection guide. Approved legal text can be entered through the legal-page editors without changing code.

Existing admin URLs, authentication, database records, publication workflows, and forms are retained. Content editing requires the existing database and service configuration. The sidebar can collapse on desktop; each icon has an accessible name and tooltip. On mobile, use the menu button and close button; Escape also closes the menu.

## Validation

Lint, TypeScript, the production build, and the automated suite are checked for the page connections. Integration tests exercise the actual save, publish, preview-read, metadata, revision-restore, and public About renderer with isolated in-memory persistence. They cover all 12 new page schemas, legacy content preservation, stale-edit conflicts, permissions, and transaction rollback. Existing inquiry/authentication/media tests remain in place. Local HTTP checks use an isolated demo session and do not write production data. Browser visual testing and real external-provider delivery require a connected browser and configured services.
