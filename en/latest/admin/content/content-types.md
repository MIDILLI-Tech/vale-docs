# Custom Content Types

Custom Content Types (CCTs) let you create distinct content categories beyond the built-in **Posts** and **Pages**, such as a portfolio, a knowledge base, press releases, or job listings.

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

The **Slug** is filled in from the name while you create the type. If you leave it empty, Vale generates it from the name when you save, so `Custom Content` becomes `custom-content`. Slugs only use lowercase letters, numbers and hyphens; names with accented or non-Latin characters can produce a shortened address, so type the slug yourself when you want a specific one.

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

Once a content type is created, it appears in the admin sidebar as its own section with full CRUD support: create, edit, publish, schedule, and delete entries just like posts.

Content types support:
- The same **rich editor** as posts (Vale Editor with slash commands)
- **Categories and tags** (shared taxonomies or dedicated ones)
- **SEO fields**: meta title, description, Open Graph, canonical URL
- **Scheduling**: publish immediately or at a future date/time
- **Revisions**: full history with diff view

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

Multiple types stay separate because each has its own type slug, even when they share the same prefix (`/d/portfolio` vs `/d/secondcpt`).

Changing the prefix or slug can create automatic redirects from the old addresses to the new ones (when automatic redirects are enabled in [SEO settings](../settings/seo#redirects)).

RSS feeds use `feed.xml`. See [RSS feeds](#rss-feeds) above.

## Custom Fields

Custom fields add extra pieces of information to the entries of a type. Use them for anything the main editor is not meant to hold: a portfolio's client and year, a book's cover and page count, a listing's address and status.

Custom fields are available for **custom content types** only. The built-in Posts and Pages screens do not show the Custom Fields card.

### Adding a field

Open **Content Types**, then edit (or create) a type. In the **Custom Fields** card click **+ Add Field** and fill in:

| Setting | What it does |
|---|---|
| **Type** | What the author fills in — see [Field types](#field-types) below |
| **Label** | The text shown above the field in the entry form, e.g. `Website` |
| **Name (key)** | Short identifier used in placeholders. It is generated from the label (`Website` → `website`); keep it lowercase, with letters, numbers and underscores, and make it unique within the type |
| **Width** | How much of the form row the field takes: **100%** (full width, default), **50%** (two per row), **33%** (three per row) or **25%** (four per row). Cards wrap on narrow screens instead of shrinking |
| **Options** | Shows up only for **Select** — one choice per line |
| **Required** | Tick it to make the field mandatory: the entry cannot be saved without a value. For a **Checkbox**, mandatory means it must be ticked |

Click **Update** to save the type. The new field appears on the entry form right away, and required fields are marked with a red asterisk next to their label. Values already saved under an existing key stay stored; renaming the key after entries exist hides the old value, so enter it again under the new key.

### Field types

| Type | The author sees | Notes | Handy for |
|---|---|---|---|
| **Text** | Single-line box | Any short text | Website, Client, Reference code |
| **Phone** | Phone box | Opens the phone keyboard on mobile; the number is stored as typed | Contact number, Support line |
| **Number** | Number box | Digits only | Year, Page count, Price |
| **Date** | Date picker | Stored as a date | Release date, Event date |
| **Textarea** | Multi-line box | Line breaks are kept and shortcodes inside the value are processed | Address, Description, Notes |
| **Select** | Dropdown | Choices come from **Options**, one per line | Condition, Format, Genre |
| **Checkbox** | Tick box | Shown as Yes/No on the front end | In stock, Featured |
| **Image** | Media library picker | Stores the chosen media item and displays the image | Cover image, Portrait, Logo |

### Filling in values

Create or edit an entry of that type. The **Additional Information** panel below the content editor lists every custom field with its label. Fill in what you need, then save as usual — the values are loaded back automatically the next time you edit the entry. Values belong to the entry itself: a translation is a separate entry, so fill in its fields there as well.

### Showing the values on the site

There are three places a value can appear. Pick one or combine them.

#### Automatic "Details" box (default theme)

With the default theme, entries of a type that has custom fields get a box under the content that lists every field with its label and value. Images are displayed, checkboxes read Yes/No, text areas keep their line breaks, and selects show their chosen option. The **Dark** theme inherits this box. The **Nova** and **Vivid** themes do not include it — use one of the options below there.

#### Custom Field Placeholders

When editing an entry, expand **Custom Field Shortcodes** just above the content editor. It lists your fields as clickable chips. Click a chip to insert the placeholder at the cursor position, for example `{{ website }}`. When the page is displayed, the placeholder is replaced with that entry's value. Unknown field names are left exactly as written.

The preview button replaces the placeholders with the values currently in the form, so you can check them before saving. The bracket form `[field name="website"]` works too. A value that contains only a number is treated as a media item and rendered as an image — that is how **Image** fields display in body text, so for plain numbers (years, prices) use the Details box or a template instead.

::: warning NOTE
Theme files use a longer placeholder format. Do not paste that into the content body, as it will be shown literally. In the editor body, always use the short chip format.
:::

#### In a custom content template

When you create or edit a **Custom Content Template**, the placeholder chips list your fields in short form, e.g. `{{ website }}`. On save the short form is expanded to the longer form Twig needs, so both the chip and the expanded version work in template files. See [Custom Content Templates](../appearance/themes#custom-content-templates).

### Example: a Portfolio type

| Label | Name (key) | Type | Options |
|---|---|---|---|
| Client | `client` | Text | |
| Website | `website` | Text | |
| Year | `year` | Number | |
| Delivered | `delivered` | Date | |
| Services | `services` | Select | `Design` / `Development` / `Both` |
| Featured | `featured` | Checkbox | |
| Cover | `cover` | Image | |

With the default theme, every portfolio entry then shows a Details box with these values. To place the website link inside the text, type it where you want it and click the `{{ website }}` chip there.

::: tip SEE ALSO
- [Posts](./posts): built-in post management.
- [Shortcodes](../../developer/shortcodes): full shortcode reference.
:::
