# Content Settings

Fine-tune how your content is created and optimized. The Content tab is organized into **Media**, **Blog**, **Multi-Language**, and **Advertisement** sub-tabs.

::: tip NOTE
**Media** is always visible. The **Blog**, **Multi-Language**, and **Advertisement** sub-tabs are only visible when their feature is enabled in **[Settings](./) → [General](./general) → [Features](./general#features)** (blog, multi-language content, advertisement).
:::

## Blog

Settings for your blog posts and reading experience.

- **Posts per page**: Number of posts displayed per page in blog listings.
- **Enable blog RSS feed**: Publishes an RSS 2.0 feed for blog posts at `/blog/feed.xml`. When multiple content languages are configured, a separate feed URL is shown for each language. See [Locale-Aware RSS Feeds](../content/translations#rss-feeds).
  - **Filter by category or tag**: Append `?category=slug-or-name` and/or `?tag=slug-or-name` to any feed URL to include only matching posts, e.g. `/blog/feed.xml?category=vale&tag=news`. Both filters narrow the result (AND). Works on custom content type feeds too (e.g. `/portfolio/feed.xml?tag=featured`).
- **Show authors on blog posts**: When enabled, author names are shown for posts in blog listings and on individual post pages.
- **Display also modification date using user's own locale**: When enabled, the last updated date is shown alongside the published date.
- **Display timestamp using user's own locale**: When enabled, the time (hours and minutes) is appended to dates.
- **Show reading time on blog posts**: When enabled, an estimated reading time is shown for posts.
- **Show read count on blog posts**: When enabled, the number of views is shown for posts. Views are counted even when the display is off.
  ::: info
  View counts are tracked even when [analytics](../marketing/analytics) logging is disabled.
  :::
- **Default post category**: Automatically assigned to new posts when no category is selected.

### Revisions

- **Enable revision history for posts and pages**: When enabled, Vale stores revision history for posts and pages.
  - **Maximum revisions per post**: Set to 0 for unlimited. Older revisions are automatically deleted when the limit is reached.

See the detailed [Revisions guide](../content/revisions) for viewing snapshots, using the diff viewer, restoring versions, deleting revisions, and understanding retention.

## Multi-Language

These settings are only visible when **Enable multi-language content** is turned on in **[Settings](../settings/) → [General](../settings/general) → [Features](../settings/general#features)**.

- **Display originals if a translation is not found**: When enabled, missing translations fall back to the default-language version instead of hiding content. Useful e.g., when some part of your website is still not completely translated.
- **Display language notice for untranslated content**: When enabled (requires the above setting), a sticky notice is shown to visitors when content is displayed in its original language.
- **Content Languages**: Choose which languages are available for content and admin language tabs. Only selected languages appear in translation dropdowns. Only the languages supported by the Vale are visible.

See [Multi-Language](../content/translations) for creating translations, translatable site settings, locale-aware RSS feeds, and media metadata.

## Advertisement

These settings are only visible when **Enable advertisement** is turned on in **[Settings](../settings/) → [General](../settings/general) → [Features](../settings/general#features)**.

- **Advertisement Code**: Paste your HTML/JS ad code here (e.g. AdSense, Bing Ads, etc.).
- **Auto Placement**: Choose where ads are automatically placed:
  - **Manual (Shortcode only)**: Use the `[ad]` shortcode inside your content.
  - **Head (For Auto Ads / Scripts)**: Injected into the `<head>`.
  - **Header (Top of every page)**: Above the main content.
  - **Footer (Bottom of every page)**: Below the main content.
  - **Above Content (Posts & Pages)**: At the start of post/page content.
  - **Below Content (Posts & Pages)**: At the end of post/page content.
  - **Sidebar (Blog & Custom Types)**: In the sidebar area.

::: tip
Regardless of this setting, you can always use the `[ad]` shortcode inside your content.
:::

## Media

Settings for media uploads, optimization, and storage.

- **Convert images to WebP**: Automatically create WebP copies of uploaded images for better performance.
- **Enable Lazy Loading**: Load images only when they scroll into view, to improve page speed.
- **Create year/month folders for uploads**: When enabled, uploads are stored in `uploads/YYYY/MM/`. When disabled, files are placed directly in `uploads/`.
- **Use original file name after upload**: Upload files using their original name instead of a random name.
- **Maximum file size (MB)**: Set to 0 to use server settings.
- **Maximum files per upload**: Set to 0 to use server settings.
- **Maximum batch size (MB)**: Total size cap for a multi-file upload batch. Set to 0 to use server settings.

::: tip SEE ALSO
- Guide to using the [Editor](../content/editor).
- Managing your [Media Library](../content/media).
- [Multi-Language](../content/translations) — content languages, RSS feeds, and translatable settings.
:::
