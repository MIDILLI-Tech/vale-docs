# Twig Functions

Vale injects several helper functions into Twig to assist with translation, security, and URL generation.

## `__`

Translates a string based on the active locale.

::: v-pre
- **Usage**: `{{ __('Welcome to :name', {':name': site_name}) }}`
:::
- **Arguments**:
  - `key` (string): The translation key.
  - `replacements` (array, optional): Key-value pairs for placeholders in the string. Keys must include the placeholder prefix (`:name`, `%d`), matching the translation file.

## `csrf_field`

Generates a hidden HTML input containing the CSRF token. Required for all forms.

- **Usage**:
  ```twig
  <form method="POST">
    {{ csrf_field() }}
  </form>
  ```

## `csrf_token`

Returns the raw CSRF token string. Useful for custom JavaScript implementations.

::: v-pre
- **Usage**: `<meta name="csrf-token" content="{{ csrf_token() }}">`
:::

## `theme_hook`

Executes a theme-defined hook point, allowing plugins or the core to inject content.

::: v-pre
- **Usage**: `{{ theme_hook('before_content') }}`
:::

## `url`

Generates a full URL relative to the site's base path. Correctly handles installations in subdirectories.

::: v-pre
- **Usage**: `<a href="{{ url('/blog') }}">Blog</a>`
:::

## `asset`

Generates a versioned URL for local assets. Appends a `?v=` timestamp based on the file's last modified time for cache busting.

::: v-pre
- **Usage**: `<link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">`
:::

## `env`

Exposes the PHP `env()` helper, allowing you to read environment variables from `.env`.

- **Usage**: `{% if env('APP_DEBUG') %}...{% endif %}`

## `vale_version`

Returns the current version of the Vale platform (defined in `version.php`).

::: v-pre
- **Usage**: `<span>Powered by Vale v{{ vale_version() }}</span>`
:::

## `resolveIcon`

Resolves a Heroicon name to its SVG path string. Used in admin dashboards and menus.

::: v-pre
- **Usage**: `{{ resolveIcon(ct.icon) }}`
:::
- **Arguments**:
  - `name` (string): Heroicon name (e.g. `document-text`, `cog`).

::: warning IMPORTANT
When adding new Twig functions, you must also register a stub in `CacheWarmCommand::registerTwigStubs()` so the offline cache warm compiler doesn't fail. See the existing stubs in `app/Commands/CacheWarmCommand.php`.
:::

::: tip SEE ALSO
- View [Twig Filters](./filters) for content processing.
- List of [Global Variables](../themes/twig-globals) available in templates.
:::
