# Posts

Vale's post management gives you a distraction-free block editor, scheduling and expiry, full revision history, and built-in SEO — everything a blog or news section needs, without a single plugin.

::: tip From draft to front page in minutes
Write in the visual [Editor](./editor), schedule for the perfect moment or set an expiry for time-sensitive stories, and let Vale handle slugs, sitemaps, and social previews automatically.
:::

## The Post Editor

When you go to **Posts → Add New**, you'll see a two-column interface designed for focused writing and easy configuration.

### Main Column

- **Title**: The headline of your post.
- **Slug**: The URL-friendly version of your title. It's auto-generated as you type but can be manually edited.
- **Content**: The heart of your post. Powered by the [Editor](./editor), it supports rich formatting, media, and interactive blocks.
- **Excerpt**: A short summary of your post. This is often used in blog listings or social media previews.

### Sidebar (The Settings Panel)

The right sidebar contains all the metadata and publishing controls:

- **Publish Box**:
  - **Status**: *Draft*, *Published*, *Unlisted* (hidden from listings), or *Archived* (offline, kept for bookkeeping). *Published* and *Unlisted* require publishing rights — without them you can only save drafts, and those statuses are hidden from the list filter (see [Users & Roles](../users#publish-permissions)).
  - **Set schedule**: On a *Draft* or *Unlisted* post, tick **Set schedule** and pick a **Publish date & time** to take it live automatically — the list shows a *(Scheduled)* badge until go-live. There is no separate *Scheduled* status to pick. Scheduling counts as publishing, so it needs the same publishing rights.
  - **Expiry date & time**: Optional. A published or unlisted post whose expiry time passes moves to the *Expired* status automatically (offline, kept for re-publishing).
  - **Comments**: Toggle comments *Open*, *Closed*, or *Use Global* settings.
  - **Revisions**: Access previous snapshots of your post to compare or restore them.
  - **Preview** (Ctrl+Shift+P): Open a live preview of your post in a new tab.
  - **Show Active Version** (Ctrl+Shift+S): Open the published version of your post in a new tab (published posts only).
- **Categories**: Select one or more hierarchical categories.
- **Tags**: Add descriptive tags. Start typing to see suggestions or create new ones by pressing Enter.
- **SEO Panel**: Customize how your post appears in search engines and on social media.
- **Read Count**: Display view count on the front end when enabled in **[Settings](../settings/) → [Content](../settings/content) → [Blog](../settings/content#blog) → Show read count on blog posts**.

### Reordering Sidebar Panels

All sidebar panels (Publish Box, Categories, Tags, SEO, etc.) can be reordered to suit your workflow. Hover over a panel to reveal the grip handle (**⠿**) on the left, then drag to reposition. You can also use the arrow buttons (**⇈ ↑ ↓ ⇊**) in the top-right corner of each panel for precise control.

Panel order is saved per user in your browser. If you clear browser data or switch browsers, the layout resets to defaults.

## Searching the Post List

The search box above the list matches the **title**, **excerpt**, and **slug**. Tick **Also search in content** next to it to include the full post body — handy when you remember a sentence but not the title. Full-content search scans every record, so it is noticeably slower on large catalogs. The same search behavior applies to pages and custom content types.

## Categories

Manage your blog categories under **Posts → Categories**. Categories can be nested (a category can have a parent) and are ordered with the **Sort Order** field.

- **Name**: The category name shown to visitors.
- **Slug**: The URL-friendly version of the name. It's auto-generated as you type but can be manually edited.
- **Description**: A short plain-text summary of the category. It appears under the category title on the public category archive page — useful for both visitors and search engines.
- **Parent Category**: Nest this category under another one to build a hierarchy.
- **Sort Order**: Controls the display order.

Each row has a **View** button that opens the public category page in a new tab, so you can check how it looks to visitors. If you run custom content types with category support, use the content-type filter at the top to switch between them.

::: tip SEE ALSO
- See the [Editor](./editor).
- Scheduled URL swaps (campaign pages that take over another page's address) are described under [Pages](./pages#scheduled-expiry-campaign-swaps). For posts and custom types they appear when the type enables the **Scheduled replacement** support (see [Content Types](./content-types#supports)).
- Configure global [Comment Settings](../settings/discussion#comment-system).
- Set up [SEO Defaults](../settings/seo#meta-defaults).
:::
