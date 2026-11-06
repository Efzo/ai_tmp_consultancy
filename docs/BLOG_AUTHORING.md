# Writing blog posts with images

The Blog Articles page opens with your post library. Use the status cards to
filter published posts, drafts, or archived posts. Search, category filters, and
sorting help you find a post; longer lists use pages of 20 posts.

Choose **New Post** to open a blank editor, or **Edit** to continue an existing
post. Only one editor is shown at a time. **Back to posts** returns to the library
and asks before discarding unsaved edits. Saving keeps the editor open so you can
continue writing.

1. Add the title, slug, category, and excerpt.
2. Use **Main cover image** to upload the image for the top of the post, blog cards,
   and social previews. Add a useful description. The cover is separate from the
   story and is not inserted into the text automatically.
3. Write in **Write your story**. Put the cursor between the words or paragraphs
   where an image belongs, then choose **Add image** in the writing toolbar.
4. Upload one image with its description and optional caption, or reuse an image
   already uploaded for this article. The image appears at the selected position,
   with a paragraph ready for continued writing.
5. Click an inserted image to reveal **Move image up**, **Move image down**, and
   **Remove from story**. Moving an image changes its position relative to the
   adjacent paragraph, heading, list, or image. Removing it from the story keeps
   the upload available for reuse.
6. Expand **Manage uploaded images** to edit descriptions/captions, reuse an image,
   change the cover, or remove an attachment from the article. Removing an
   attachment here also removes its uses in this article.
7. Review the existing SEO and answer content controls, then save a draft or use
   **Save & publish**. When editing a published post, use **Save & publish** to apply
   a public update; saving it as a draft takes it off the public blog.

To resize writing, select the words or paragraphs and choose **Text size** in the
writing toolbar. Sizes range from 12 px to 48 px and are retained when saving
and publishing. Use the heading control for section headings.

PNG, JPEG, WebP, AVIF, and GIF are supported, up to 10 MB each and 30 attachments
per article. Uploaded files stay in private storage. Only a cover or inline image
referenced by a published article can be served through the public media route.

## Upload implementation and validation

Blog images upload from the browser directly to private Vercel Blob storage,
using an authenticated, short-lived grant restricted to the administrator's
image path, supported content types, and size limit. The raw image bytes do not
pass through the application's function request body. Vercel documents the
[4.5 MB function request limit and client upload approach](https://vercel.com/docs/vercel-blob/client-upload).

Completion verifies the actual stored image's path, private store, content type,
and size before idempotently registering a media record. The signed Blob callback
and authenticated completion request use the same registration logic. Retrying
attachment after a response failure reuses the already uploaded file. Non-JSON
error responses produce readable messages rather than JSON parsing errors.

Automated checks cover cursor placement and surrounding text, paragraph/list
structure, image movement, separate cover/inline actions, a 7 MB direct upload,
attachment retries, invalid responses, and upload authorization/privacy checks.
Production storage credentials and a real production image upload are not tested
by the isolated automated checks.
