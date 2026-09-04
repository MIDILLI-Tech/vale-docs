# Email Color System

Transactional emails use **flat hex color variables** (not CSS custom properties) injected directly into the Twig context. This is because the majority of email clients strip inline `<style>` blocks or ignore CSS custom properties.

## Architecture

### Color Resolution in `MailService`

`ValeApp\Application\Mail\MailService` centralizes color resolution through two methods:

#### `getEmailColorContext(): array<string, string>`

Returns a map of CSS variable names (`--theme-*`) to their resolved values. Two modes:

- **Theme colors mode** (`mail_use_theme_colors = 1`, default): Reads the active theme's saved overrides via `ThemeManager::resolveColorVariables()`, merging `theme_{slug}_colors` JSON settings with the schema defaults from `theme.json`.
- **Custom email colors mode** (`mail_use_theme_colors = 0`): Reads `mail_color_*` settings keys. These are dynamically generated from the active theme's `color_variables` schema (see below), so **any new color variable added to theme.json is automatically available** without code changes.

#### `getEmailFlatColors(): array<string, string>`

Transforms the `--theme-*` keys into `email_*` flat variables for use in Twig templates. Each `--theme-{key}` becomes `email_{key}`:

| CSS Variable      | Template Variable   |
|---|---|
| `--theme-primary`         | `email_primary`         |
| `--theme-primary-hover`   | `email_primary_hover`   |
| `--theme-accent`          | `email_accent`          |
| `--theme-bg`              | `email_bg`              |
| `--theme-surface`         | `email_surface`         |
| `--theme-text`            | `email_text`            |
| `--theme-text-muted`      | `email_text_muted`      |
| `--theme-border`          | `email_border`          |
| *(any theme.json var)*    | `email_{var_name}`      |

### Template Usage

Email templates reference flat variables directly:

```twig
<button style="background: {{ email_primary }};">Click me</button>
<p style="color: {{ email_text_muted }};">Fine print</p>
```

`MailService::sendTemplate()` merges `getEmailFlatColors()` into the Twig context alongside `site_name`, `vl_email_colors`, and caller-provided data.

## Dynamic Schema Mapping

Both `MailService::getEmailColorContext()` and `SettingsController` call `ThemeManager::getColorVariablesSchema($themeSlug)` to discover all available color variables. When a theme defines **new** `color_variables` in its `theme.json`:

1. `getColorVariablesSchema()` returns them with their `label` and `default` values
2. Each becomes `mail_color_{varName}` in settings (e.g., `--theme-primary` → `mail_color_primary`)
3. The Email Colors panel in **Settings → Mail → Templates** dynamically renders a picker for each variable
4. `getEmailFlatColors()` automatically exposes `email_{varName}` to all templates

No hardcoded lists exist. The system is fully data-driven from `theme.json`.

## Settings Keys

| Key Prefix | Mode | Source |
|---|---|---|
| `mail_use_theme_colors` | Both | Boolean flag (`1` = theme mode, `0` = custom) |
| `theme_{slug}_colors` | Theme mode | JSON map of `--var` → hex (managed by Themes → Colors) |
| `mail_color_{var}` | Custom mode | Individual hex values (managed by Settings → Mail → Templates) |

## Preview Endpoint

`MailController::preview()` renders any email template with mock data + current color context at `/admin/mail/preview/{template}`. It's designed for iframe embedding in the preview modal.

## Theme Palette Swatches on the Frontend

The **VL_THEME_COLORS** global (set by `FlashMiddleware`) contains the resolved theme color variables. Clicking the swatch in the Email Colors panel opens a palette of swatches from `VL_THEME_COLORS` **below the swatch**. The click handler calls `preventDefault()` so the native picker does not open on top of it. Picking a swatch writes the value into both the hex field and the swatch. A **Custom** button inside the palette hands over to the browser's native color picker via `showPicker()` (falling back to `click()`) for arbitrary colors.
