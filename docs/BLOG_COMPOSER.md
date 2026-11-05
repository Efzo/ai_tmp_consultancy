# Blog composer: images, SEO, and answer content

Open **Admin → Blog Articles**. Both new articles and existing articles have the same composer.

## Images

Select up to 10 PNG, JPEG, WebP, AVIF, or GIF images at once (10 MB each; up to 30 attachments per article). Edit the generated descriptions into meaningful alt text and add optional captions. Position the cursor in the article and choose **Insert in article**, or choose **Use as cover** for the article, blog index, and social sharing preview. Removing an image detaches it and removes its inline occurrences; the underlying stored asset is retained.

Images use the existing authenticated upload and private Blob storage configuration. Draft and unused uploads cannot be fetched publicly. Images referenced by a published article's content or cover become public and may be indexed. Unpublishing or detaching removes that public reference; another published page can still reference the same image.

## Search and answer content

- Edit the search title and description independently of the article heading and excerpt. The preview shows the intended snippet; search engines can choose other text.
- Set the author name and article topics/tags.
- Add a short answer/key takeaway, displayed as **At a glance**.
- Add optional reader questions and answers, displayed visibly below the article. Use headings and the **Add link** toolbar button to cite supporting sources.
- Canonical URLs, Open Graph/Twitter previews, BlogPosting and breadcrumb structured data are generated automatically. Publishing, archiving, deleting, and saving refresh public routes and the sitemap. Republish dates preserve the original publication date.

These fields support useful, clearly structured content. They do not guarantee indexing, rankings, rich results, or AI citations. Google states that normal SEO fundamentals apply to its AI search features; there is no additional special schema requirement. Q&A content is visible editorial content and does not claim FAQ rich-result eligibility.

## Save and publish

**Save draft** keeps the current article private. Saving an existing published article as a draft also removes it from the public blog. Use **Save & publish** to apply a public update. Image attachments, SEO fields, answer content, and article content save together. Existing articles without these settings retain defaults. No Prisma migration is required: the existing BlogPost and SiteSetting stores are used.

References: [Google AI search guidance](https://developers.google.com/search/docs/appearance/ai-features), [Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article).
