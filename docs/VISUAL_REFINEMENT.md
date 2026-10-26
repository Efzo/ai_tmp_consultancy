# Public website visual refinement

The existing navy and blue identity is retained, with a quieter editorial layout and consistent typography.

- Inter Variable is bundled in `public/fonts` and loaded with `next/font/local`. One variable file covers normal text weights, with font swapping and adjusted fallback metrics. Builds and visitors do not depend on a remote font service.
- Font source: https://github.com/rsms/inter/blob/master/docs/font-files/InterVariable.woff2. The original SIL Open Font License and copyright notice are included as `public/fonts/Inter-LICENSE.txt`. Downloaded 2026-10-26.
- Public headings use responsive sizes, balanced wrapping, and comfortable line heights. Body copy has consistent reading rhythm and stronger muted-text contrast.
- Public section spacing follows shared responsive tokens. Service capabilities, numbered problems, process steps, project work, engagements, and FAQs use different layouts so the homepage is easier to scan.
- The hero is aligned to the left, with less visual decoration and clearer actions. An approved profile image from the About editor appears automatically when provided. No stock portrait or fabricated project screenshot is introduced.
- Featured work uses the first actual CMS case image when present. Without an image, it shows a clearly textual case-study reading guide.
- Four current service capabilities are featured on the homepage; other published records remain accessible through View all services. Existing CMS records are not changed or removed.
- Glass effects are concentrated in navigation. Other cards and panels use quiet borders and surfaces. Primary buttons use a darker blue with white text; links and secondary accents have separate readable theme colours.
- Navigation switches to a compact menu below desktop widths and for unusually long CMS menus. It includes current-page indication, touch targets, outside-click dismissal, and Escape handling.
- Light mode uses theme-aware surfaces, borders, and accent colours. Reduced-motion and keyboard-focus styles remain in place.

CMS content, publication, forms, and database records are preserved. Layout changes are in code; existing page text, section visibility, images, and page SEO continue to use their connected editors.

## Validation

- Lint, TypeScript, production build, all 31 existing tests, and `git diff --check` passed.
- The final production preview returned successful responses for 18 public routes. It displayed four featured capabilities and retained protected admin access.
- Verified Next.js emits a font preload in the HTTP Link header, the generated font-face uses `font-display: swap`, the self-hosted WOFF2 asset is served successfully, and the license is available. No Google Fonts browser request is needed.
- Reviewed the homepage and About page in dark mode and Contact in light mode in Chrome. Phone-specific visual review was not completed; responsive CSS and the compact-navigation behavior were implemented, but no full mobile visual pass is claimed.
- Calculated contrast for the main colour pairs: primary button 5.74:1, dark body text 9.29:1, dark accent 8.24:1, light body text 5.88:1, light accent 5.80:1. These are colour-pair checks, not a full accessibility certification.

No production data, deployment settings, or database schema was changed. No push or deployment was performed.
