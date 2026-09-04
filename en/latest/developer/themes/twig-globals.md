# Twig Globals

Vale injects a comprehensive set of global variables and functions into the Twig environment. These allow you to access site settings, environment state, and dynamic content from any template.

## Site Configuration

These variables are derived from your **General Settings**:

::: v-pre
- `{{ site_name }}`: The name of the site.
- `{{ site_tagline }}`: The site's slogan or subtitle.
- `{{ site_logo }}`: The absolute URL to the site's logo.
- `{{ site_url }}`: The base URL of the site (e.g., `https://example.com`).
- `{{ base_path }}`: The subdirectory path (e.g., `/cms`) if Vale is not installed at the root.
- `{{ footer_copyright }}`: Custom copyright text.
- `{{ cookie_warning_enabled }}`: Returns `'1'` if enabled.
- `{{ cookie_warning_text }}`: The text for the consent banner.
:::

## SEO Globals

::: v-pre
- `{{ seo_title_separator }}`: The string used to separate page titles (default: ` — `).
- `{{ seo_home_description }}`: Global meta description for the homepage.
- `{{ seo_search_engine_visibility }}`: Returns `'0'` if search engines are discouraged.
- `{{ seo_noindex_archives }}`: Returns `'1'` if archives should be hidden from search.
:::

## Environment & State

::: v-pre
- `{{ APP_ENV }}`: Current environment (`production` or `dev`).
- `{{ APP_DEBUG }}`: Boolean indicating if debug mode is active.
- `{{ assets_use_cdn }}`: Boolean indicating if assets are loaded from CDNs.
- `{{ shop_enabled }}`: Boolean indicating if e-commerce features are active.
- `{{ user_language_choice }}`: Boolean indicating if the frontend language switcher is enabled.
- `{{ current_locale() }}`: Returns the active language code (e.g., `en`, `tr`).
- `{{ supported_locales }}`: An array of all enabled languages (`code => label`).
- `{{ active_theme }}`: The slug of the currently active theme.
- `{{ theme_meta }}`: The full content of the active theme's `theme.json`.
:::

## Dynamic Content

::: v-pre
- `{{ menu_{key} }}`: Flat list of items for a specific menu location (e.g., `menu_primary`).
- `{{ menu_{key}_groups }}`: Structured array for multi-menu layouts.
- `{{ sidebar_categories }}`: List of categories with post counts.
- `{{ sidebar_tags }}`: List of tags used in published posts.
- `{{ sidebar_recent_posts }}`: The 5 most recent blog posts.
:::

## Helper Functions

::: v-pre
- `{{ __('key', {replacements}) }}`: Translates a string.
- `{{ url('/path') }}`: Generates a full URL relative to the base path.
- `{{ asset('/path/to/asset') }}`: Generates a versioned URL for local assets.
- `{{ csrf_field() }}`: Generates a hidden CSRF input for forms.
- `{{ theme_hook('hook_name') }}`: Executes a theme hook.
- `{{ vale_version() }}`: Returns the current version string.
:::

::: tip SEE ALSO
- Detailed guide on [Twig Functions](../twig/functions).
- Detailed guide on [Twig Filters](../twig/filters).
:::
