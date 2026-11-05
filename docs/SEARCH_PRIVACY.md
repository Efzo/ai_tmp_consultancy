# Search privacy

Private CMS content is protected by authentication. Admin HTML and admin/API responses also carry noindex instructions. Public marketing pages remain indexable; the sitemap contains public routes only.

- Admin pages declare noindex metadata and receive `X-Robots-Tag: noindex, nofollow, nosnippet, noimageindex`.
- Admin and authentication responses use private/no-store caching and no-referrer policy. APIs are excluded from search indexing.
- Requests carrying the draft-preview cookie receive private/no-store and noindex headers, including requests for public page paths.
- Historical `/cv` URLs return HTTP 410 Gone with noindex headers. The two legacy CV PDFs have been deleted from the working tree. `legacy/cv/` and `public/cv/` are ignored to prevent accidentally adding personal CVs back into a deployment. Existing Git history is unchanged.
- Environment files, Git metadata, package manifests, and repository documentation must remain inaccessible over HTTP.

Robots.txt deliberately permits crawlers to request URLs so they can read noindex headers and 410 responses. Robots.txt does not provide access control. Removing the former admin crawl exclusion does not bypass authentication.

## Existing search results

An older CV PDF was found in search results during this review. Its result included personal contact details. Deployment of the protections does not immediately erase an existing search result or third-party copies.

After deployment, verify the former CV URL returns 410. In Google Search Console, use Removals for the old `/cv/` URL prefix if urgent removal is needed. Use URL Inspection to request reprocessing of previously indexed admin/login pages after confirming their noindex headers. Public pages that intentionally publish biography, photos, business contact details, or testimonials remain publicly visible; remove unwanted editorial details through their CMS editors.

Google guidance: https://developers.google.com/search/docs/crawling-indexing/block-indexing and https://developers.google.com/search/docs/crawling-indexing/remove-information

## Canonical sitemap and duplicate URLs

The sitemap URL is `https://www.ojomoefosa.com/sitemap.xml`. It uses the same www origin as page canonical tags, site metadata, structured data, and the robots.txt sitemap declaration.

The sitemap includes current public pages and published service, case-study, and blog records. It omits admin, APIs, CVs, repository docs, `/pricing`, historical service aliases, and the older `/consulting/` landing pages. The Videos page is included. Duplicate URLs are removed. Modification dates use actual record updates where available; unknown dates are omitted instead of marking every page as newly changed on every request.

Historical service aliases and the four old consulting landing pages permanently redirect to their corresponding current service pages. `/pricing` continues to redirect to `/engagements`. Useful replacement content is consolidated through redirects; personal CVs are retired with 410 responses.

### Submit after deployment

1. Confirm the live sitemap opens successfully and lists only `https://www.ojomoefosa.com` URLs. The prepared local changes must be deployed first.
2. In Google Search Console, select the verified domain property for `ojomoefosa.com`, or the URL-prefix property for `https://www.ojomoefosa.com/`. Under **Sitemaps**, submit `https://www.ojomoefosa.com/sitemap.xml`. If that URL was already submitted, its contents are refreshed at the same address.
3. In Bing Webmaster Tools, select the verified website, open **Sitemaps**, and submit the same complete URL. Verify domain ownership if the website has not been added.
4. For urgent removal of the previously indexed CV, use Google Search Console **Removals** and Bing **Block URLs** for the old `/cv/` URL or prefix. Cover the www/non-www variants that appear in results. These tools temporarily hide results; the deployed 410 response provides the permanent removal signal.
5. Use Google **URL Inspection** and Bing **URL Inspection** to check representative current pages and the retired CV URL. Request reprocessing of important changed pages if needed. Allow time for both engines to crawl and update their results.

Sitemap submission helps discovery and does not guarantee indexing or remove old results by itself. On November 5, 2026, Google Search Console showed a submitted temporary-removal request for the prefix `https://ojomoefosa.com/cv/`, with status **Processing request**. The form states that www/non-www and HTTP/HTTPS variants are included. This is a submitted request, not confirmation that the result has already disappeared. No sitemap submission or Bing removal was performed in that session.

References:

- Google sitemap submission: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Bing sitemap submission: https://www.bing.com/webmasters/help/sitemaps-3b5cf6ed
- Bing permanent and temporary removals: https://www.bing.com/webmasters/help/?topicid=37c07477

## Verification

Run the production preview in demo mode, then `node scripts/smoke-privacy.mjs`. It verifies private response headers, authentication redirects, admin noindex metadata, retired CVs, private-file 404s, draft-preview exclusion, public SEO, robots, and sitemap. Run `node scripts/smoke-sitemap.mjs` to verify every listed URL returns 200, has matching canonical metadata, and is indexable, together with permanent legacy redirects and the robots sitemap declaration. The normal automated suite continues to cover authorization and private media access.
