# Multi-Language

Vale supports running a fully multilingual site. You can create translated versions of posts, pages, categories, tags, and products, each with its own localized URL. When multi-language content is enabled, site-wide settings, SEO redirects, media metadata, and RSS feeds also respect the configured content languages.

## Enabling Multi-Language Content

Go to **Settings → General → Features** and toggle **Enable Multi-Language Content** on. Then configure languages and options under **Settings → Content → Multi-Language** sub-tab.

Configure which languages are available under **Content Languages**. Only selected languages appear in translation dropdowns and language tabs across the admin panel.

Optional: enable **Display originals if a translation is not found** to fall back to the default-language version when a translation is missing (applies to content listings, settings, media metadata, and embedded images). When this and **Display language notice for untranslated content** are both enabled, visitors see a notice when content is shown in its original language. See [Developer Guide → Demo Seeder](../../developer/#demo-seeder) for the default multi-language configuration applied during development setup.

## How It Works

Each piece of content can have one **translation per language**. Translations are independent content entries linked to the original. Vale serves the correct language version based on the detected visitor locale.

When multi-language content is enabled, URLs are prefixed with the language code:

- Default locale: `/my-page` (no prefix — e.g., if default is `en`)
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
| Site name | Yes | **Settings → General** language tabs | Twig global — see below |
| Tagline | Yes | **Settings → General** language tabs | Twig global — see below |
| Footer copyright | Yes | **Settings → General** language tabs | Twig global — see below |
| Maintenance message | Yes | **Settings → General** language tabs | Maintenance page for visitor locale |
| Cookie warning text | Yes | **Settings → General** language tabs | Cookie banner text |
| SEO redirects | Per-locale rules | **Settings → SEO → Redirects** tabs | 301 rules per language prefix |
| Media alt text | Yes | **Media → Edit** language tabs | Applied when inserting from library; also resolved at render time for embedded uploads |
| Media description | Yes | **Media → Edit** language tabs | Admin search + library notes (not shown to visitors) |
| Blog RSS feeds | Locale-filtered (not translated strings) | **Settings → Content → Blog** → RSS Feed | One feed per content language; posts filtered by language |
| Custom content type RSS | Locale-filtered entries (when type has Multi-language support) | **Content Types → Edit** (when RSS support enabled) | One feed per content language when global i18n + type i18n are on; otherwise single feed |
| Editor image captions | Part of post body | Each post translation in the editor | Translate the caption in each language's post body |

### Twig globals for site settings

Use these in theme templates (values resolve automatically for the visitor's locale):

| Setting | Twig global |
|---|---|
| Site name | <code v-pre>{{ site_name }}</code> |
| Tagline | <code v-pre>{{ site_tagline }}</code> |
| Footer copyright | <code v-pre>{{ footer_copyright }}</code> |
| Cookie warning | <code v-pre>{{ cookie_warning_text }}</code> |

Non-default languages are stored with a locale suffix (e.g. `site_tagline_tr`). Empty translation tabs fall back to the default language when **Display originals if a translation is not found** is enabled.

The admin panel language (**Settings → General → Default site language and admin interface language**) is independent of these front-end globals.

### RSS feeds

When **Enable blog RSS feed** is on and multiple content languages are configured, **Settings → Content → Blog** lists a separate feed URL per language.

**Custom content types** with **RSS Feed** enabled list feed URLs on the content type edit screen. Per-language feed URLs (with locale prefixes) appear only when **global multi-language content is enabled**, multiple content languages are configured, **and that type has Multi-language support checked**. Otherwise a single feed URL is shown and the feed includes all entries regardless of language.

Each locale-specific feed includes only entries in that language. Item links use localized URLs, the `<language>` tag matches the feed locale, and shortcodes are stripped from feed bodies. Example (blog prefix `blog`, languages `en` + `tr`):

- English: `/blog/feed.xml`
- Turkish: `/tr/blog/feed.xml`

Example for a custom type with slug `portfolio` and URL prefix `/d`:

- English: `/d/portfolio/feed.xml`
- Turkish: `/tr/d/portfolio/feed.xml`

### Media alt text on the front-end

Alt text inserted from the media library uses the **post's language** in the editor. On the front-end, embedded upload images (`/uploads/…`) resolve alt text from the media library for the **current post's language** at render time — so updating media alt translations applies without re-inserting the image.

**When multi-language content is disabled**, only the main **Alt text** field on the media edit screen is used (the default-locale column). Per-language tabs and the fallback setting do not apply.

**When multi-language is enabled**, the fallback option **Display originals if a translation is not found** (under **Settings → Content → Multi-Language**) controls media alt behaviour for **non-default** languages:

- **Enabled (default):** If a Turkish alt is missing, the default-language alt from the media library is used.
- **Disabled:** If a Turkish alt is missing, Vale does **not** substitute the default-language alt from the library. The `<img>` tag keeps whatever `alt` attribute is already in the post HTML (usually what was inserted in the editor). If that attribute is empty, the image is rendered without alt text — it is **not** hidden from the page.

Image **captions** remain in the post HTML and must be translated per post translation. **Title** on the media edit screen is admin-only and is not translated.

## Fallback Content Notice

When both **Enable multi-language content** and **Display originals if a translation is not found** are enabled, you can also enable **Display language notice for untranslated content** (Settings → Content → Multi-Language).

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

Core templates include a sticky banner automatically. Themes can provide their own presentation — for example, Nova renders a closeable popup in the top-right corner. Themes that override templates can use the `_fallback_notice.twig` partial or check the `is_fallback_lang`, `content_language`, and `has_translation_in_current_locale` template variables.

## Creating a Translation

### Posts & Pages

1. Open an existing post or page in the editor.
2. In the sidebar panel, find the **Translations** section.
3. Click **Add Translation** and select the target language.
4. A new draft is created for that language — edit it independently.
5. Both entries are linked; Vale serves the correct version automatically.

### Categories & Tags

1. Go to **Categories** (or **Tags**) and click **New Category** (or **New Tag**).
2. Fill in the translated name and slug.
3. Set the **Language** dropdown to the target language.
4. Set **Translation Of** to link this entry to the original-language category or tag.
5. Save.

### Products

Product translations follow the same flow as posts — open the product, use the **Translations** panel to add a language variant.

## Language Detection

When multi-language content is enabled, Vale detects the visitor's locale in this order:

1. **URL path prefix** — e.g., `/tr/blog-post` → Turkish
2. **`?lang=` query parameter** — overrides all other detection and saves a cookie
3. **User session preference** — if the logged-in user has a saved locale
4. **Cookie `vl_locale`** — set when a visitor previously used `?lang=`
5. **`Accept-Language` HTTP header** — browser's declared preference
6. **Site default locale** — fallback, set in **Settings → General**

## Front-End Language Switcher

See [Theme Development → Language Switcher](../../developer/themes#language-switcher) for how to integrate a language switcher into your theme templates.

## Admin Locale

The admin panel language is controlled by the **Locale** setting in **Settings → General** (or `APP_LOCALE` in `.env` as the install-time default). This is independent of front-end visitor language detection.

::: tip SEE ALSO
- [Environment Variables](../../developer/env) — `APP_LOCALE`.
- [Twig Globals](../../developer/themes/twig-globals) — `current_locale`, `supported_locales`, `default_locale`.
- [General Settings](../settings/general) — translatable site identity fields.
- [Content Settings](../settings/content) — multi-language toggle, content languages, RSS feeds.
- [SEO Settings](../settings/seo) — per-locale redirects.
- [Media Management](./media) — alt text and description per language.
:::
