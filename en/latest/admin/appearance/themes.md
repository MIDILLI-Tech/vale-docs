# Themes

Customize the look and feel of your storefront using the built-in theme manager.

## Managing Themes

Go to **Appearance > Themes** to view, activate, and configure themes.

- **Active Theme**: The theme currently used to render your site.
- **Theme Previews**: Visual representation of available themes.
- **Activation**: Click "Activate" to switch themes instantly.

## Theme Colors

Each theme exposes a set of CSS color variables that you can override without touching any code. Open **Appearance > Themes** and click **Colors** on a theme card.

### Color Variables

| Variable | Label | Purpose |
|---|---|---|
| `--theme-primary` | Primary Color | Buttons, links, key accents |
| `--theme-primary-hover` | Primary Hover | Hover state of primary elements |
| `--theme-secondary` | Secondary Color | Secondary buttons / surfaces |
| `--theme-secondary-hover` | Secondary Hover | Hover state of secondary elements |
| `--theme-bg` | Background Color | Page background |
| `--theme-surface` | Card / Container Background | Cards, boxes, sidebars inside `<main>` |
| `--theme-text` | Text Color | Base body text color |
| `--theme-text-muted` | Muted Text Color | Secondary text: dates, excerpts, captions |
| `--theme-header-bg` | Header Background | Site header bar |
| `--theme-footer-bg` | Footer Background | Site footer (and footer ad container) |
| `--theme-nav-bg` | Navigation Bar Background | Dedicated navigation/menu strip (themes with a separate nav bar) |
| `--theme-hero-bg` | Hero Gradient / Background | Hero banner area |
| `--theme-accent` | Accent / Highlight Color | Highlights, badges, small accents |
| `--theme-border` | Border / Divider Color | Borders and dividers |

Themes only offer the variables they declare in their `theme.json` (see [Theme Development → Color Variables](../../developer/themes#color-variables)); if a theme defines none, the ten defaults above are offered.

### Editing Colors

- Use the color picker or type a hex value (e.g. `#a30000`) in each field.
- **Hero Gradient / Background** also accepts CSS gradients and `rgb()/rgba()/hsl()` values, e.g. `linear-gradient(135deg, #059669 0%, #0891b2 100%)`. Other fields accept hex and `rgb()/rgba()` values too.
- The color picker swatch always shows a solid preview: for non-hex values (like gradients) it falls back to black; type or paste the full value in the text field instead.
- The circular arrow icon next to a field reverts that single variable to the theme default.
- The **Live Preview** panel on the right renders a mock header, hero, buttons and card with your current values. Hover the buttons to test hover colors.
- Click **Save Colors** to apply. Saved values are injected site-wide as CSS variables and override the theme defaults on every frontend page.
- While custom colors are active, a **Custom Colors Active** badge is shown and **Reset to Default Colors** (next to the save button) removes all overrides after confirmation.
- Changes take effect immediately; if you don't see them, clear the page cache (**CLI:** `php vale cache:clear`).
- **Theme colors also apply to transactional emails**: the same variables are used for email buttons, backgrounds, borders, and text (see [Mail → Templates → Email Colors](../settings/mail#email-color-settings)). Enable "Use theme colors for emails" in the mail Templates sub-tab and your emails will automatically match your website's color scheme.

## Editing Templates

You can edit theme templates directly from the admin panel. Go to **Appearance > Themes** and click **Edit Templates** on any theme card.

The editor sidebar shows three categories:

- **Main Templates**: Core layout files
- **Page Templates**: Templates in `page-templates/` directory, which can be used while creating pages.
- **Custom Content Templates**: Auto-generated templates for your active Custom Content Types (CCTs). Each CCT may get its own template file (`{cct-slug}.twig`) in the theme's `templates/` folder. See more [here](#custom-content-templates).

::: warning SYSTEM TEMPLATES IN BUNDLED THEMES ARE REPLACED ON UPDATE
`default`, `dark`, `nova` and `vivid` ship with Vale, so a new version replaces the template files that belong to the theme — that is how theme fixes and new front-end features arrive. The editor shows this warning when you open one of those system templates; edits to them are lost on the next update. Custom page/CPT templates you create in a bundled theme are not protected either: they normally survive, but a future release with the same filename can overwrite them. Create a **child theme** that inherits the bundled one (`"parent": "dark"` in its `theme.json`) and customize the copy. Themes you built or uploaded yourself are never part of an update package, so they are safe.
:::

### Deleting Page Templates

Custom page templates can be deleted directly from the editor sidebar. Each page template in the list shows a delete button (trash icon) next to it.

- **Core templates** (shipped with Vale or the parent theme) cannot be deleted. The button is greyed out with a tooltip explaining why.
- **In-use templates**: if a page is currently assigned to a template, it also cannot be deleted. The tooltip indicates the template is in use.
- **Unused custom templates** show an active delete button. Clicking it prompts for confirmation before removing the file.

::: tip NOTE
Only the file is deleted. If a page was previously assigned to a deleted template, it falls back to the theme's default page template.
:::

### Custom Content Templates

If you have Custom Content Types defined in **Content Types**, the editor shows a **Custom Content Templates** section.

- Existing CCT templates are listed here.
- If no templates exist yet, the section shows **No templates found**.
- Use the **New Template for** dropdown to pick a CCT and create its template file instantly.
- The **Extend post.twig** checkbox (checked by default) controls the seed content:
  - **Checked**: The new file extends `post.twig`, so it stays tiny and automatically inherits future updates to `post.twig` / the active theme.
  - **Unchecked**: The new file receives a full copy of `post.twig` so you can freely redesign the template without inheritance constraints.

### Descriptions

If a template file contains a `{# DESCRIPTION: ... #}` comment on the first line, that text will be shown in the sidebar instead of the filename.

### Placeholders 
The editor provides quick-insert buttons for common placeholders:

::: v-pre
- `{{ site_name }}`
- `{{ site_url }}`


Additional placeholders are available when editing page templates. When editing a **Custom Content Template**, the placeholder chips switch to show post variables and any custom fields defined for that content type (e.g. `{{ post.title }}`, `{{ post.body }}`, `{{ field_name }}`).

#### Short-form field placeholders

Custom field placeholders can be written in **short form**: just the field name inside double braces, e.g. `{{ field_name }}`. When you save a **Custom Content Template**, short-form placeholders are automatically expanded to the long form `{{ post.getMetaValue('field_name', '') }}`, which is what Twig needs to resolve the value at render time. Long-form placeholders work too and are stored exactly as you write them.
:::

::: tip SHORT FORM IN CONTENT BODIES
The short form <code v-pre>{{ field_name }}</code> can also be used inside **post/content body text** (not just templates). There it is resolved at render time by the shortcode processor; see [Custom Content Types → Custom Field Placeholders](../content/content-types#custom-field-placeholders). Do **not** use the long form <code v-pre>{{ post.getMetaValue('field_name', '') }}</code> inside body text; it is only valid inside `.twig` template files.
:::

### Saving

Click Save Changes or press <kbd>Ctrl + S</kbd> to save.
If the theme directory is not writable, the editor will show a Read Only badge and editing will be disabled.
::: tip NOTE
You can also edit non-active theme templates. Use the Preview button to see changes on the frontend without activating the theme.
:::
::: warning NOTE
Direct template editing is intended for small tweaks. For larger changes, edit the files in your theme directory using a code editor.
:::

## Menu Locations

Themes define specific areas where menus can be displayed (e.g., "Primary Navigation", "Footer"). You can assign menus to these locations in **Appearance > Menus**. Read more on menus [here](menus).

::: warning NOTE
If you switch themes, you may need to re-assign your menus to the locations defined by the new theme.
:::
