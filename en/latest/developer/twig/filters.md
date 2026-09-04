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

::: warning IMPORTANT
When adding new Twig filters, you must also register a stub in `CacheWarmCommand::registerTwigStubs()` so the offline cache warm compiler doesn't fail. See the existing stubs in `app/Commands/CacheWarmCommand.php`.
:::

::: tip SEE ALSO
- Learn about [Shortcode syntax](../../admin/content/editor#slash-commands).
- View [Twig Functions](./functions) for more template helpers.
:::
