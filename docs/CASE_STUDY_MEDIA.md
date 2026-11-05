# Case study screenshots and product previews

In **Admin → Project Case Studies**, expand a case study and find **Screenshots & product preview**.

- Enter an image description, then upload a screenshot, or add an existing HTTPS image URL. Uploads use the existing private media storage configuration.
- Add optional captions and edit alt text. Move screenshots up/down to reorder them; the first image is the cover. Up to 20 screenshots can be attached.
- Add a **Public product URL** to display a **Visit product** button.
- Optionally enter an **Embedded preview URL** and enable **Show interactive preview**. Visitors click **Load interactive preview** before the external page loads. Some products prohibit iframe embedding; the new-tab link remains available. Enter a URL, not iframe HTML.
- Click **Save**. To show the study publicly, enable **Published** and select the **Published** status. Draft studies and their managed uploads remain private unless another published page also references those images.

The case study and its media settings save in one transaction. These settings use the existing SiteSetting store; no database migration is needed. Removing an image detaches it from this study. It does not delete the stored asset, and another published page may still reference it.
