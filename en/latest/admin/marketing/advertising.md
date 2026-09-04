# Advertising

Integrate third-party advertising and tracking scripts into your Vale site without modifying theme files.

## Advertisement Settings

Go to **[Settings](../settings/) → [Content](../settings/content) → [Advertisement](../settings/content#advertisement)** sub-tab to configure ad placements:

| Setting | Description |
|---|---|
| **Enable advertisement** | Toggle ad slots and the `[ad]` shortcode on or off. This toggle is located in **[Settings](../settings/) → [General](../settings/general) → [Features](../settings/general#features)**. |
| **Advertisement code** | Paste your ad script or HTML (e.g., Google AdSense, Bing Ads). |
| **Placement** | Choose where the ad code should appear: |

- **Manual (Shortcode only)** — ads only appear where you insert `[ad]` in post/page content.
- **Head (For Auto Ads / Scripts)** — injects the code before `</head>`.
- **Header (Top of every page)** — injects the code at the top of the page layout.
- **Footer (Bottom of every page)** — injects the code at the bottom of the page layout.
- **Above Content (Posts & Pages)** — injects the code above the main content area.
- **Below Content (Posts & Pages)** — injects the code below the main content area.
- **Sidebar (Blog & Custom Types)** — injects the code inside the sidebar on blog and custom post type archives.

## Shortcode

Use the `[ad]` shortcode inside any post, page, or custom post type content to insert your ad code manually:

```text
[ad]
```

When **Placement** is set to **Manual**, this is the only way ads appear. When a global placement is selected, the shortcode is redundant but still works.

::: tip SEE ALSO
- [Developer → Shortcodes](../../developer/shortcodes) — full `[ad]` reference and all other supported shortcodes.
:::

## AI Crawler Control

Vale can block AI training crawlers via `robots.txt` and a dedicated `ai-robots.txt` endpoint. See [Settings](../settings/) → [SEO](../settings/seo) → [AI Crawler Control](../settings/seo#ai-crawler-control) for the full crawler list and details.

## SEO & Meta

Per-page advertising tracking (e.g., page-specific conversion pixels) can be added through the **SEO** panel on each post, page, or product using the **Custom Head Code** field.

## Product Feeds for Ad Platforms

To run dynamic product ads on Meta, Pinterest, TikTok, or Google Shopping, submit your product feed URLs to each platform's catalogue manager:

| Platform | Feed URL |
|---|---|
| Meta (Facebook/Instagram) | `/api/v1/feed/meta` |
| Pinterest | `/api/v1/feed/pinterest` |
| TikTok | `/api/v1/feed/tiktok` |
| Google Shopping | `/api/v1/feed/google-merchant` |

See [Product Feeds](../ecommerce/product-feeds) for the full feed reference.

::: tip SEE ALSO
- [Product Feeds](../ecommerce/product-feeds) — all supported commerce channel feeds.
- [Settings](../settings/) → [SEO](../settings/seo) — sitemap, robots.txt, and AI crawler settings.
- [Settings](../settings/) → [Content](../settings/content) → [Advertisement](../settings/content#advertisement) — ad placement and shortcode configuration.
:::
