# Theme Development

Vale features a flexible theme system that supports inheritance, custom hooks, dynamic menus, and page templates.

## Creating a Theme

Themes live in the `themes/` directory. Each theme is a directory containing at least a `theme.json` file. If an image named `theme.jpg`, `theme.png`, or `theme.webp` is found, it will be used as a thumbnail on admin page.

### `theme.json` Reference

This file defines your theme's metadata and capabilities.

```json
{
  "name": "My Custom Theme",
  "version": "1.0.0",
  "author": "Your Name",
  "license": "License, e.g. MIT",
  "parent": "default",
  "menus": {
    "primary": "Primary Navigation",
    "footer": "Footer Menu"
  },
  "colors": {
    "header": "gray-50",
    "gradient": false
  },
  "color_variables": {
    "--theme-primary": { "label": "Primary Color", "default": "#111827" },
    "--theme-surface": { "label": "Card / Container Background", "default": "#ffffff" }
  }
}
```

If your theme has a screenshot, place it as `theme.jpg`, `theme.png`, or `theme.webp` in the theme root. It will be displayed in the admin themes list and as a thumbnail in the grid.

- **`name`**: The display name of your theme.
- **`version`**: Semantic versioning for your theme.
- **`author`**: Your name or company.
- **`license`**: The license of the theme.
- **`parent`** (optional): The slug of another theme to inherit templates from.
- **`menus`** (optional): An object mapping menu keys to human-readable labels. These keys become available as Twig globals (e.g., `menu_primary`).
- **`colors`** (optional): Visual settings for admin theme preview.
  - `header`: Background color class (e.g., `gray-50`, `gray-800`)
  - `gradient`: Set to `true` to enable gradient background
  - `gradient_from`: Starting gradient color (required if `gradient` is true)
  - `gradient_to`: Ending gradient color (required if `gradient` is true)
- **`color_variables`** (optional): Customizable CSS color variables offered in the admin **Theme Colors** editor — see [Color Variables](#color-variables).

## Color Variables

The `color_variables` key in `theme.json` declares which CSS custom properties site administrators can override from **Appearance > Themes > Colors** without touching your templates.

### Schema

Each entry maps a CSS variable name to a display label and a default value:

```json
{
  "color_variables": {
    "--theme-primary":       { "label": "Primary Color",                "default": "#111827" },
    "--theme-primary-hover": { "label": "Primary Hover",                "default": "#374151" },
    "--theme-secondary":     { "label": "Secondary Color",              "default": "#f3f4f6" },
    "--theme-secondary-hover": { "label": "Secondary Hover",            "default": "#e5e7eb" },
    "--theme-bg":            { "label": "Background Color",             "default": "#f9fafb" },
    "--theme-surface":       { "label": "Card / Container Background",  "default": "#ffffff" },
    "--theme-text":            { "label": "Text Color",                   "default": "#111827" },
    "--theme-text-muted":      { "label": "Muted Text Color",             "default": "#4b5563" },
    "--theme-header-bg":       { "label": "Header Background",            "default": "#ffffff" },
    "--theme-footer-bg":       { "label": "Footer Background",            "default": "#ffffff" },
    "--theme-nav-bg":          { "label": "Navigation Bar Background",    "default": "#047857" },
    "--theme-hero-bg":       { "label": "Hero Gradient / Background",   "default": "#111827" },
    "--theme-accent":        { "label": "Accent / Highlight Color",     "default": "#2563eb" },
    "--theme-border":        { "label": "Border / Divider Color",       "default": "#e5e7eb" }
  }
}
```

If a theme declares no `color_variables`, Vale falls back to this exact ten-variable schema.

### How Overrides Are Applied

Saved colors are stored per theme (setting `theme_{slug}_colors`) and injected into every frontend page as a `<style>` block via the `head` theme hook:

```html
<style>
    :root, html.dark {
        --theme-primary: #596c97;
        --theme-surface: #a30000;
    }
</style>
```

This block is rendered **after** your layout's own `<style>` blocks, so saved values always win over the defaults you define on `:root`. Values are validated by `ValeApp\Infrastructure\Theme\ColorValueValidator` and accept hex (`#rgb`, `#rrggbb`, `#rrggbbaa`), functional notations (`rgb()`, `rgba()`, `hsl()`, `hsla()`) and CSS gradients (`linear-gradient()`, `radial-gradient()`). Anything else — including braces, quotes or semicolons — is rejected, so the injected `<style>` block cannot be broken out of. Theme previews (`preview_theme` session value) use the previewed theme's saved palette.

::: tip GRADIENT DEFAULTS
Declare gradient defaults directly in `theme.json` (e.g. `"default": "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"`). Bind them with the `background` shorthand (not `background-color`) so both solid colors and gradients work: `.vl-hero { background: var(--theme-hero-bg); }`.
:::

### Consuming the Variables in Your Theme

Declaring variables is only half the job — your CSS must actually reference them:

```css
:root {
    --theme-surface: #ffffff;
    --theme-text-muted: #4b5563;
}

/* Map utility classes used by shared templates to the variables */
main .bg-white   { background-color: var(--theme-surface) !important; }
main .bg-gray-50 { background-color: var(--theme-bg) !important; }

.btn-primary { background-color: var(--theme-primary); color: #fff; }
.btn-primary:hover { background-color: var(--theme-primary-hover); }
```

::: tip CARD BACKGROUNDS
Shared templates render cards with generic utilities like `bg-white`. Map them inside `<main>` (as above) so page background (`--theme-bg`) and card surfaces (`--theme-surface`) can be styled independently while headers/footers stay under your control. See the bundled `default`, `nova`, `dark` and `vivid` themes for working examples.
:::

::: tip TEXT UTILITY REMAPPING
The core layout ships an opt-in layer that remaps common Tailwind text/border utilities (`text-gray-900`, `text-gray-500`, …) to `var(--theme-text)` / `var(--theme-text-muted)` / `var(--theme-border)` inside `<main>`. It only activates when a `<body class="vl-custom-colors">` marker is present — the core and vivid layouts add it automatically when custom colors are saved for the active theme, keeping uncustomized sites pixel-identical to before.
:::

## Template Structure

Vale uses Twig for templating. Themes can override any core view by mimicking its path. The most common files are:
- `layout.twig`: The base wrapper for your site.
- `index.twig`: The homepage.
- `post.twig`: Single post view.
- `page.twig`: Single page view.
- `shop/index.twig`: Product listing page.
- `shop/product.twig`: Single product detail page.

## Dynamic Menus

When you define menu locations in your `theme.json`, Vale automatically registers two Twig globals for each location:
1. `menu_{key}`: A flat list of all menu items (including children).
2. `menu_{key}_groups`: A structured array for complex, multi-menu layouts.

### Rendering a Menu
To render the `primary` menu, you can use the following Twig code:

```twig
<nav>
  <ul>
    {% for item in menu_primary %}
      {# Only render top-level items #}
      {% if not item.parentId %}
        <li>
          <a href="{{ item.url }}">{{ item.label }}</a>

          {# Check for children #}
          {% set children = menu_primary|filter(v => v.parentId == item.id) %}
          {% if children|length > 0 %}
            <ul class="dropdown">
              {% for child in children %}
                <li><a href="{{ child.url }}">{{ child.label }}</a></li>
              {% endfor %}
            </ul>
          {% endif %}
        </li>
      {% endif %}
    {% endfor %}
  </ul>
</nav>
```

## Page Templates

You can provide custom layouts for Pages that site administrators can select from a dropdown.

### Creating a Template
1. Create a `page-templates/` directory inside your theme folder.
2. Add a `.twig` file (e.g., `full-width.twig`).
3. (Optional) Provide a description for the admin panel using a special Twig comment on the first line.

**Example `themes/my-theme/page-templates/full-width.twig`:**
```twig
{# DESCRIPTION: A full-width layout without a sidebar. #}
<div class="max-w-full px-4">
    <h1>{{ page.title }}</h1>
    <div class="prose">
        {{ page.body|shortcodes(page)|raw }}
    </div>
</div>
```

## Theme Inheritance

Inheritance allows you to build upon existing themes. If your theme specifies a `parent`, Vale will look for templates in this order:
1. Your theme directory.
2. The parent theme directory.
3. The core `resources/views/` directory.

## Language Switcher

When [Multi-Language Content](../admin/content/translations) is enabled, Vale makes three globals available in every template:

| Global | Type | Description |
|---|---|---|
| `current_locale` | `string` | The active locale code, e.g. `en`, `tr` |
| `default_locale` | `string` | The site's default locale |
| `supported_locales` | `array` | Map of `code => label` for all enabled locales |

Include the built-in switcher partial anywhere in your layout to get a `setLanguage(lang)` JavaScript helper function:

```twig
{% include 'partials/_language_switcher_js.twig' %}
```

Then call it from any button or dropdown:

```twig
{% if supported_locales|length > 1 %}
  <div class="lang-switcher">
    {% for code, label in supported_locales %}
      <button onclick="setLanguage('{{ code }}')">{{ label }}</button>
    {% endfor %}
  </div>
{% endif %}
```

The helper uses `seo_state.translations` to redirect to the translated URL when a translation exists for the current page, or constructs the locale-prefixed URL otherwise.

To conditionally show locale-specific content in a template:

```twig
{% if current_locale == 'tr' %}
  <p>Türkçe içerik</p>
{% endif %}
```

## Assets

We recommend using the built-in asset system (Tailwind & esbuild) as described in `BUILD.md`. Use the `asset()` helper to generate URLs for your theme's static files:

```twig
<link rel="stylesheet" href="{{ asset('css/custom.css') }}">
```

::: tip SEE ALSO
- Complete list of [Twig Globals](./themes/twig-globals).
- Comprehensive [Twig Reference](./twig/functions).
:::
