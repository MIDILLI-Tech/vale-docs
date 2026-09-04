# Multi-Language

Vale supports running a fully multilingual site. You can create translated versions of posts, pages, categories, tags, and products, each with its own localized URL. When multi-language content is enabled, site-wide settings, SEO redirects, media metadata, and RSS feeds also respect the configured content languages.

## Enabling Multi-Language Content

Go to **[Settings](../settings/) → [General](../settings/general) → [Features](../settings/general#features)** and toggle **Enable Multi-Language Content** on. Then configure languages and options under **[Settings](../settings/) → [Content](../settings/content) → [Multi-Language](../settings/content#multi-language)** sub-tab.

Configure which languages are available under **Content Languages**. Only selected languages appear in translation dropdowns and language tabs across the admin panel.

A language file existing on the server is not enough: a language becomes part of the site only once you add it here. The locale-prefixed URLs (e.g. `/tr/...`), the language switcher, the `hreflang` links, the per-language RSS feeds and the per-language settings tabs all follow this list. Remove a language and those URLs stop being served.

Optional: enable **Display originals if a translation is not found** to fall back to the default-language version when a translation is missing (applies to content listings, settings, media metadata, and embedded images). When this and **Display language notice for untranslated content** are both enabled, visitors see a notice when content is shown in its original language.

## How It Works

Each piece of content can have one **translation per language**. Translations are independent content entries linked to the original. Vale serves the correct language version based on the detected visitor locale.

When multi-language content is enabled, URLs are prefixed with the language code:

- Default locale: `/my-page` (no prefix, e.g. if default is `en`)
- Secondary locales: `/tr/sayfam`, `/de/meine-seite`

## Supported Content Types & Translatable Areas

| Area | Translatable | Where to edit | Front-end behaviour |
|---|---|---|---|
| Posts | Full content (title, body, excerpt, SEO) | Post editor → **Translations** panel | Served at localized URL for that language |
| Pages | Full content | Page editor → **Translations** panel | Served at localized URL |
| Categories | Name, slug, description | Categories → language + **Translation Of** | Filtered by visitor locale |
| Tags | Name, slug | Tags → language + **Translation Of** | Filtered by visitor locale |
| Products | Full product content | Product editor → **Translations** panel | Shop URLs per language |
| Custom content types | Full content | Same as posts | Route prefix per type |
| Site name | Yes | **[Settings](../settings/) → [General](../settings/general)** language tabs | Twig global (see below) |
| Tagline | Yes | **[Settings](../settings/) → [General](../settings/general)** language tabs | Twig global (see below) |
| Footer copyright | Yes | **[Settings](../settings/) → [General](../settings/general)** language tabs | Twig global (see below) |
| Maintenance message | Yes | **[Settings](../settings/) → [General](../settings/general)** language tabs | Maintenance page for visitor locale |
| Cookie warning text | Yes | **[Settings](../settings/) → [General](../settings/general)** language tabs | Cookie banner text |
| SEO redirects | Per-locale rules | **[Settings](../settings/) → [SEO](../settings/seo) → [Redirects](../settings/seo#redirects)** tabs | 301 rules per language prefix |
| Media alt text | Yes | **Media → Edit** language tabs | Applied when inserting from library; also resolved at render time for embedded uploads |
| Media description | Yes | **Media → Edit** language tabs | Admin search + library notes (not shown to visitors) |
| Blog RSS feeds | Locale-filtered (not translated strings) | **[Settings](../settings/) → [Content](../settings/content) → [Blog](../settings/content#blog)** → RSS Feed | One feed per content language; posts filtered by language |
| Custom content type RSS | Locale-filtered entries (when type has Multi-language support) | **Content Types → Edit** (when RSS support enabled) | One feed per content language when global i18n + type i18n are on; otherwise single feed |
| Editor image captions | Part of post body | Each post translation in the editor | Translate the caption in each language's post body |

### Twig globals for site settings

Translated site-identity values (site name, tagline, footer copyright, cookie warning) are exposed to theme templates as Twig globals that resolve automatically for the visitor's locale. See [Developer → Twig Globals](../../developer/themes/twig-globals#site-configuration) for the full list and usage.

::: tip
Empty translation tabs fall back to the default language when **Display originals if a translation is not found** is enabled.
:::

::: tip
The admin panel language (**[Settings](../settings/) → [General](../settings/general) → Default site language and admin interface language**) is independent of these front-end globals.
:::

### RSS feeds

When **Enable blog RSS feed** is on and multiple content languages are configured, **[Settings](../settings/) → [Content](../settings/content) → [Blog](../settings/content#blog)** lists a separate feed URL per language.

**Custom content types** with **RSS Feed** enabled list feed URLs on the content type edit screen. Per-language feed URLs (with locale prefixes) appear only when **global multi-language content is enabled**, multiple content languages are configured, **and that type has Multi-language support checked**. Otherwise a single feed URL is shown and the feed includes all entries regardless of language.

Example (blog prefix `blog`, languages `en` + `tr`):

- English: `/blog/feed.xml`
- Turkish: `/tr/blog/feed.xml`

Example for a custom type with slug `portfolio` and URL prefix `/d`:

- English: `/d/portfolio/feed.xml`
- Turkish: `/tr/d/portfolio/feed.xml`

### Media alt text on the front-end

Alt text inserted from the media library uses the **post's language** in the editor. On the front-end, embedded upload images resolve alt text from the media library for the **current post's language** at render time, so updating media alt translations applies without re-inserting the image.

**When multi-language content is disabled**, only the main **Alt text** field on the media edit screen is used (the default-locale column). Per-language tabs and the fallback setting do not apply.

**When multi-language is enabled**, the fallback option **Display originals if a translation is not found** (under **[Settings](../settings/) → [Content](../settings/content) → [Multi-Language](../settings/content#multi-language)**) controls media alt behaviour for **non-default** languages:

- **Enabled (default):** If a Turkish alt is missing, the default-language alt from the media library is used.
- **Disabled:** If a Turkish alt is missing, Vale does **not** substitute the default-language alt from the library.

Image **captions** remain in the post HTML and must be translated per post translation. **Title** on the media edit screen is admin-only and is not translated.

## Fallback Content Notice

When both **Enable multi-language content** and **Display originals if a translation is not found** are enabled, you can also enable **Display language notice for untranslated content** ([Settings](../settings/) → [Content](../settings/content) → [Multi-Language](../settings/content#multi-language)).

This shows a banner or popup on the front-end when a visitor views content in its original language because a translation for their locale does not exist.

### Notice behaviour

- **No translation available:** The notice reads *"This [content type] is only available in [language]."*
- **Translation exists but visitor is seeing the original:** The notice reads *"This [content type] is also available in [language]."* with a link to switch to the translated version.
- **Dismissible:** The notice can be closed by the visitor. It is not persisted via cookie or local storage, so it will reappear on subsequent visits.

### Supported content types

The fallback notice applies to:

- Posts and custom post types
- Pages
- Products
- Categories
- Tags
- Forms

### Theme integration

Core templates include a sticky banner automatically. Themes can provide their own presentation; for example, Nova renders a closeable popup in the top-right corner. For custom implementations, see [Theme Development → Fallback Content Notice](../../developer/themes#fallback-content-notice).

## Creating a Translation

### Posts & Pages

1. Open an existing post or page in the editor.
2. In the sidebar panel, find the **Translations** section.
3. Click **Add Translation** and select the target language.
4. A new draft is created for that language. Edit it independently.
5. Both entries are linked; Vale serves the correct version automatically.

### Categories & Tags

1. Go to **Categories** (or **Tags**) and click **New Category** (or **New Tag**).
2. Fill in the translated name and slug.
3. Set the **Language** dropdown to the target language.
4. Set **Translation Of** to link this entry to the original-language category or tag.
5. Save.

### Products

Product translations follow the same flow as posts. Open the product and use the **Translations** panel to add a language variant.

## Language Detection

When multi-language content is enabled, Vale detects the visitor's language from the URL prefix first (e.g. `/tr/sayfam` → Turkish), then from saved preferences and browser settings, falling back to the site default. The full detection order is documented for developers.

## Front-End Language Switcher

If your theme supports multiple languages, a picker will be seen for the users to switch the display language of the site. See [Theme Development → Language Switcher](../../developer/themes#language-switcher) for how to integrate a language switcher into your theme templates.

## Admin Locale

The admin panel language is controlled by the **Default Site and Admin Language** setting in **[Settings](../settings/) → [General](../settings/general)**. During installation the language you pick is saved both as `APP_LOCALE` in `.env` and as the site's default locale, so the admin starts in your language. Changing the setting later also updates the default content language. Either way, this is independent of front-end visitor language detection.

::: tip SEE ALSO
- [Environment Variables](../../developer/env): `APP_LOCALE`.
- [Twig Globals](../../developer/themes/twig-globals): `current_locale`, `supported_locales`, `default_locale`.
- [General Settings](../settings/general): translatable site identity fields.
- [Content Settings](../settings/content): multi-language toggle, content languages, RSS feeds.
- [SEO Settings](../settings/seo): per-locale redirects.
- [Media Management](./media): alt text and description per language.
:::
