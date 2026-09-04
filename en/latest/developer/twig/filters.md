# Twig Filters

Vale provides custom Twig filters to process content and handle specific data formats.

## `shortcodes`

Processes Vale shortcodes (like forms, TOC, or child pages) within a string of HTML.

::: v-pre
- **Usage**: `{{ page.body|shortcodes(page) }}`
:::
- **Arguments**:
  - `context` (optional): Usually the `Post` or `Page` entity, used to resolve hierarchical context for shortcodes like `[pages]`.

## `changelog`

Formats a raw changelog string by converting Markdown-style headers into bold HTML tags.

::: v-pre
- **Usage**: `{{ version.notes|changelog }}`
:::
- **Behavior**: Converts `### Header` and `## Header` into `<strong>Header</strong>`.

## `read_time`

Calculates and returns the estimated reading time for a string of HTML content.

::: v-pre
- **Usage**: `{{ post.body|read_time }}`
:::
- **Returns**: Human-readable string (e.g. `3 min read`).

## `post_teaser`

Resolves the summary a post shows in listings: the manual excerpt first, then the content before the `<!--more-->` break, then an automatic summary of the first N words of the body.

::: v-pre
- **Usage**: `{{ post|post_teaser }}`
:::
- **Arguments**:
  - `words` (optional): Overrides the **Listing summary length** setting from [Content Settings](../../admin/settings/content#blog).
- **Returns**: An array with `html`, `kind` (`excerpt`, `more`, `auto`, or `empty`) and `label` (the break's custom label, when set). `html` is plain text for the `excerpt` kind and markup for the others, so render it through `partials/_post_card_summary.twig`. The partial escapes the text and runs shortcodes on the `more` teaser.

## `meta_teaser`

Builds the plain-text description used by the `description`, Open Graph and Twitter meta tags.

::: v-pre
- **Usage**: `{{ post|meta_teaser(160) }}`
:::
- **Arguments**:
  - `maxChars` (optional, default `160`): Maximum length, cut at a word boundary with an ellipsis.
- **Behavior**: Prefers the SEO meta description, then the excerpt, then the start of the content (stopping at the `<!--more-->` break). Accepts `Post`, `Page` and `Product` entities.

::: warning IMPORTANT
When adding new Twig filters, you must also register a stub in `CacheWarmCommand::registerTwigStubs()` so the offline cache warm compiler doesn't fail. See the existing stubs in `app/Commands/CacheWarmCommand.php`.
:::

::: tip SEE ALSO
- Learn about [Shortcode syntax](../../admin/content/editor/#slash-commands).
- View [Twig Functions](./functions) for more template helpers.
:::
