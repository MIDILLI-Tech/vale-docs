# Custom Content Types

Custom Content Types (CCTs) let you create distinct content categories beyond the built-in **Posts** and **Pages** — for example, a portfolio, a knowledge base, press releases, or job listings.

## Creating a Content Type

Go to **Content Types → Add New** and fill in:

| Field | Description |
|---|---|
| **Name** | Human-readable label shown in the admin sidebar (e.g. `Portfolio`) |
| **Slug** | URL-safe type identifier (e.g. `portfolio`). Used in public URLs and the database |
| **Description** | Optional note shown only in the admin panel |
| **URL Prefix** | Optional namespace before the type slug (e.g. `d` → `/d/portfolio/my-item`). Leave empty for `/{type-slug}/my-item` |
| **Icon** | Sidebar icon for this type in the admin panel |
| **Supports** | Feature toggles for each entry of this type (see below) |
| **Custom Fields** | Extra metadata fields (text, number, select, image, etc.) |

## Supports

When creating or editing a custom content type, **Supports** controls which post-like features are available for entries of that type:

| Support | What it enables |
|---|---|
| **Author** | Author attribution on entries |
| **Categories** | Category taxonomy |
| **Comments** | Visitor comments |
| **Editor** | Rich text (Vale Editor) body |
| **Excerpt** | Short summary field |
| **Read Count** | Show view count on the front end (enabled by default for new types) |
| **Multi-language** | Translation linking (only shown when **Enable Multi-Language Content** is turned on in **[Settings](../settings/) → [General](../settings/general) → [Features](../settings/general#features)**) |
| **Revisions** | Edit history with diff view |
| **RSS Feed** | Public RSS 2.0 feed for this type (see below) |
| **Scheduled replacement** | Allow entries to take over another entry's URL on schedule ([campaign swaps](./pages#scheduled-expiry-campaign-swaps)) |
| **SEO** | Meta title, description, Open Graph, canonical (disabled in the form when global SEO is off under **[Settings](../settings/) → [SEO](../settings/seo)**) |
| **Tags** | Tag taxonomy |
| **Thumbnail** | Featured image |

Uncheck a support to hide that feature from the editor and front-end for this type only.

## RSS feeds

Enable **RSS Feed** under Supports to publish an RSS 2.0 feed for this content type at:

```
/{type-slug}/feed.xml
```

With an optional URL prefix `/d`:

```
/d/{type-slug}/feed.xml
```

Examples: `/portfolio/feed.xml`, `/d/portfolio/feed.xml`, `/secondcpt/feed.xml`.

When **multi-language content** is enabled and multiple content languages are configured **and this type has Multi-language support enabled**, each language gets its own feed URL (with the locale prefix on non-default languages). The content type edit screen lists all URLs when RSS is enabled. Each feed lists only entries in that language. See [Locale-Aware RSS Feeds](./translations#rss-feeds).

If **Multi-language** is unchecked for this type, a single RSS feed URL is shown and the feed includes all entries regardless of language.

Filter any feed by category or tag with `?category=slug-or-name` and/or `?tag=slug-or-name` (both narrow the result), e.g. `/portfolio/feed.xml?tag=featured`.

## Managing Content

Once a content type is created, it appears in the admin sidebar as its own section with full CRUD support — create, edit, publish, schedule, and delete entries just like posts.

Content types support:
- The same **rich editor** as posts (Vale Editor with slash commands)
- **Categories and tags** (shared taxonomies or dedicated ones)
- **SEO fields** — meta title, description, Open Graph, canonical URL
- **Scheduling** — publish immediately or at a future date/time
- **Revisions** — full history with diff view

## Cloning a Content Type

Use the **Clone** action in the content type list to duplicate an existing type and its configuration as a starting point.

## Templates for Content Types

To have a perfect layout for your custom content, you can use the template editor and create your own template for the current theme. The editor will also list the available placeholders and custom fields for easier creation.

::: tip SEE ALSO
[Custom Content Templates](../appearance/themes#custom-content-templates) to see how to create one.
:::

## Front-End URLs

Each custom content type has a **type slug** (e.g. `portfolio`, `secondcpt`). Public URLs always include that slug.

| URL Prefix | Archive | Item | RSS feed |
|---|---|---|---|
| *(empty)* | `/portfolio` | `/portfolio/my-item` | `/portfolio/feed.xml` |
| `/d` | `/d/portfolio` | `/d/portfolio/my-item` | `/d/portfolio/feed.xml` |

Multiple types stay separate because each has its own type slug — even when they share the same prefix (`/d/portfolio` vs `/d/secondcpt`).

Changing the prefix or slug can create automatic redirects from the old addresses to the new ones (when automatic redirects are enabled in [SEO settings](../settings/seo#redirects)).

RSS feeds use `feed.xml`. See [RSS feeds](#rss-feeds) above.

## Custom Fields Layout

Custom fields in the CPT builder support the same multi-column layout as the form builder. Each field card has a **width selector**:

| Width | Columns |
|-------|---------|
| **100%** | Full width (default) |
| **50%** | Half width — two fields side by side |
| **33%** | One third — three fields per row |
| **25%** | One quarter — four fields per row |

The builder uses responsive flex wrapping with minimum width enforcement, so cards never squeeze below a usable size. The column layout is reflected both in the admin editor and in the front-end entry form when the CPT uses forms.

## Custom Field Placeholders

When editing an entry, the editor lists your custom fields as clickable chips. Clicking a chip inserts the placeholder into the content body at the cursor position. It is replaced with the field's value when the page is displayed. Unknown field names are left as-is.

::: warning NOTE
Theme files use a longer placeholder format — do not paste that into the content body, as it will be shown literally. In the editor body, always use the short chip format.
:::

::: tip SEE ALSO
- [Posts](./posts) — built-in post management.
- [Shortcodes](../../developer/shortcodes) — full shortcode reference.
:::
