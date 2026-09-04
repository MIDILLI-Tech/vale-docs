# Content Settings

Fine-tune how your content is created and optimized. The Content tab is organized into **Media**, **Blog**, **Multi-Language**, and **Advertisement** sub-tabs, in that order.

::: tip NOTE
**Media** is always the first tab. The **Blog**, **Multi-Language**, and **Advertisement** sub-tabs are only visible when their feature is enabled in **Settings → General → Features** (blog, multi-language content, advertisement).
:::

## Blog

Settings for your blog posts and reading experience.

- **Posts per page**: Number of posts displayed per page in blog listings.
- **Enable blog RSS feed**: Publishes an RSS 2.0 feed for blog posts. When multiple content languages are configured, a separate feed URL is shown for each language. See [Locale-Aware RSS Feeds](../content/translations#rss-feeds).
- **Show authors on blog posts**: When enabled, author names are shown for posts in blog listings and on individual post pages.
- **Display also modification date using user's own locale**: When enabled, the last updated date is shown alongside the published date.
- **Display timestamp using user's own locale**: When enabled, the time (hours and minutes) is appended to dates.
- **Show reading time on blog posts**: When enabled, an estimated reading time is shown for posts.
  - **Reading speed (WPM)**: Words per minute used to calculate estimated reading time (default: 200).
- **Show read count on blog posts**: When enabled, the number of views is shown for posts. Views are always counted regardless of this toggle.
  ::: info
  Even when analytics logging is disabled, view counts are still tracked. No IP data is collected — only an anonymous hash for deduplication.
  :::
- **Default post category**: Automatically assigned to new posts when no category is selected.

### Revisions

- **Enable revision history for posts and pages**: When enabled, Vale stores revision history for posts and pages.
  - **Maximum revisions per post**: Set to 0 for unlimited. Older revisions are automatically deleted when the limit is reached.

See the detailed [Revisions guide](../content/revisions) for viewing snapshots, using the diff viewer, restoring versions, deleting revisions, and understanding retention.

## Multi-Language

These settings are only visible when **Enable multi-language content** is turned on in **Settings → General → Features**.

- **Display originals if a translation is not found**: When enabled, missing translations fall back to the default-language version instead of hiding content.
- **Display language notice for untranslated content**: When enabled (requires the above setting), a sticky notice is shown to visitors when content is displayed in its original language.
- **Content Languages**: Choose which languages are available for content and admin language tabs. Only selected languages appear in translation dropdowns.

See [Multi-Language](../content/translations) for creating translations, translatable site settings, locale-aware RSS feeds, and media metadata.

## Advertisement

These settings are only visible when **Enable advertisement** is turned on in **Settings → General → Features**.

- **Advertisement Code**: Paste your HTML/JS ad code here (e.g. AdSense, Bing Ads, etc.).
- **Auto Placement**: Choose where ads are automatically placed:
  - **Manual (Shortcode only)**: Use the `[ad]` shortcode inside your content.
  - **Head (For Auto Ads / Scripts)**: Injected into the `<head>`.
  - **Header (Top of every page)**: Above the main content.
  - **Footer (Bottom of every page)**: Below the main content.
  - **Above Content (Posts & Pages)**: At the start of post/page content.
  - **Below Content (Posts & Pages)**: At the end of post/page content.
  - **Sidebar (Blog & Custom Types)**: In the sidebar area.

Regardless of this setting, you can always use the `[ad]` shortcode inside your content.

## Media

Settings for media uploads, optimization, and storage.

- **Convert images to WebP**: Automatically convert uploaded images to WebP format for better performance. Original files are preserved.
- **Enable Lazy Loading**: Add `loading="lazy"` attribute to images in posts and pages to improve page load speed.
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
