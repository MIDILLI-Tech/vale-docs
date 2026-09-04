# Admin Settings Architecture

This document describes the internal structure of the Vale admin Settings page for developers who need to add or modify settings sections.

## Overview

The Settings page lives under `resources/views/admin/settings/` and is rendered by `app/Controllers/Admin/SettingsController.php`. It uses a **tab → sub-tab → form** hierarchy where each sub-tab has its own `<form>` with `_group` and `_subtab` hidden inputs.

## Template Structure

### Entry Point

- `index.twig` — top-level tab buttons (`#settings-tabs`) + includes all tab panels + floating save bar + `_scripts.twig`
- `_scripts.twig` — all JS: `activateTab`, `activateSubTab`, `activateGeneralTab`, `activateContentTab`, etc.

### Tab Panels

Each top-level tab is a `<div id="tab-<name>" class="tab-panel hidden">`:

| Panel ID | Source File | Notes |
|----------|-----------|-------|
| `tab-general` | `_general.twig` | Contains sub-tabs: Site, Features |
| `tab-content` | `_content.twig` | Contains sub-tabs: Blog, Multi-Language, Advertisement, Media |
| `tab-seo` | `_seo.twig` | Contains sub-tabs |
| `tab-discussion` | `_discussion.twig` | Single form, no sub-tabs |
| `tab-privacy` | `_privacy.twig` | Single form, no sub-tabs |
| `tab-analytics` | `_analytics.twig` | Single form, no sub-tabs |
| `tab-maintenance` | `_maintenance.twig` | Single form, no sub-tabs |
| `tab-ecommerce` | `_ecommerce.twig` | Contains sub-tabs: Shop, Checkout, etc. |
| `tab-mail` | `_mail.twig` | Contains sub-tabs: Setup, Templates, Notifications |
| `tab-registration` | `_registration.twig` | Single form, no sub-tabs |
| `tab-advanced` | `_advanced.twig` | Contains sub-tabs: API Tokens, Webhooks, Scripts |

### Sub-Tab Pattern

Sub-tabs follow the same pattern as top-level tabs:

```twig
{# Container #}
<div id="tab-<tabname>" class="tab-panel hidden">
    {# Sub-tab nav #}
    <div class="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex gap-4 overflow-x-auto">
            <button type="button" data-subtab="sub1" class="<tabname>-tab-btn ...">Label 1</button>
            <button type="button" data-subtab="sub2" class="<tabname>-tab-btn ...">Label 2</button>
        </nav>
    </div>

    {# Sub-tab panels #}
    {{ include('admin/settings/_<tabname>_<sub1>.twig') }}
    {{ include('admin/settings/_<tabname>_<sub2>.twig') }}
</div>
```

### Sub-Tab Panel Partial

Each sub-tab panel is a separate file with its own `<form>`:

```twig
{# _<tabname>_<subtab>.twig #}
<div id="<tabname>-tab-<subtab>" class="<tabname>-tab-panel hidden">
    <form method="post" action="{{ url('/admin/settings') }}" class="...">
        {{ csrf_field() }}
        <input type="hidden" name="_METHOD" value="PUT">
        <input type="hidden" name="_group" value="<tabname>">
        <input type="hidden" name="_subtab" value="<subtab>">

        {# settings fields... #}
    </form>
</div>
```

## Form Submission

### Floating Save Bar

The floating save bar (`#floating-save-bar`) in `index.twig` submits the **active settings form** — the form with `_group`/`_subtab` hidden inputs in the currently visible panel.

The JS logic in `_scripts.twig`:

1. `getSettingsForm()` finds the visible sub-panel and returns the first `<form>` containing `_group`/`_subtab` inputs.
2. `updateFloatingSaveBar()` updates the button state (disabled when no changes, enabled when dirty).
3. Floating button click → `form.submit()` with explicit dirty reset.

**Important**: `form.submit()` (JS method) does **not** fire the `submit` event, so the click handler manually resets `vlDirty` flags before calling it.

### Dirty Tracking

Each settings form is wired with `wireDirtyTracking()`:

- Takes a baseline snapshot on init (60ms + 500ms delays for editor mounts).
- Polls every 500ms via `setInterval(checkDirty, 500)` to catch editor/token changes.
- Sets `form.dataset.vlDirty = '1'` when changed, `'0'` when clean.
- `syncAnyDirty()` aggregates across all forms into `anyDirty`.
- `beforeunload` warns if `anyDirty` is true.
- `jumpToFirstDirtyTab()` navigates back to the dirty form if the user cancels the leave warning.

### No Inline Save Buttons

Fixed inline Save buttons inside forms have been removed. The floating save bar is the only save mechanism. Action forms (payment test, webhook add, etc.) are exempt — they keep their own submit buttons because they don't carry `_group`/`_subtab`.

## Feature Toggles

Feature toggles live in **General → Features** and control which admin tabs and sub-tabs are visible:

| Setting Key | Alpine Store Key | Controls |
|-------------|-----------------|----------|
| `blog_enabled` | `blog` | Content › Blog |
| `pages_enabled` | `pages` | Pages sidebar |
| `newsletter_enabled` | `newsletter` | Newsletter sidebar |
| `form_builder_enabled` | `formBuilder` | Forms sidebar |
| `custom_content_types_enabled` | `cpt` | Content Types sidebar |
| `multi_language_content` | `mlc` | Content › Multi-Language |
| `advertisement_enabled` | `ads` | Content › Advertisement |
| `shop_enabled` | `shop` | E-Commerce tab |
| `subscriptions_enabled` | `subscriptions` | Orders & Membership sidebar |
| `registration_enabled` | `registration` | Registration tab |
| `seo_enabled` | `seo` | SEO tab |
| `analytics_enabled` | `analytics` | Analytics tab |

### Alpine Store

The `vlFeatures` store is defined in `_scripts.twig` inside `alpine:init`:

```js
Alpine.store('vlFeatures', {
    blog: {{ settings.blog_enabled|default('1') == '1' ? 'true' : 'false' }},
    pages: {{ settings.pages_enabled|default('1') == '1' ? 'true' : 'false' }},
    // ... all feature flags
});
```

### Dynamic Tab Visibility

Tab buttons use `x-show="$store.vlFeatures.<key>" x-cloak` to hide when disabled. The `activateTab()` function in `_scripts.twig` checks `btn.offsetParent === null` and falls back to `general` if the target tab is hidden.

### Fallback When Active Tab Is Hidden

Both top-level tabs and Content sub-tabs have `$watch` logic: if a feature toggle is turned off while its tab/sub-tab is active, navigation falls back to the nearest enabled sibling (General for top-level, Blog for Content sub-tabs).

```js
// Example from _content.twig
this.$watch('$store.vlFeatures.mlc', function(v) {
    if (!v && self.isContentSubtabActive('mlc')) {
        window.vlSettingsNav.activateContentTab('blog');
    }
});
```

## Adding a New Settings Tab

1. Create `_<tabname>.twig` with the sub-tab container or single form.
2. Add the include in `index.twig`.
3. Add `activate<tabname>Tab()` in `_scripts.twig` (or reuse `activateSubTab` directly).
4. Expose it on `window.vlSettingsNav`.
5. Wire click listeners, default activation, URL `?subtab=` restore, search `goTo()` and `subtabLabel()`.
6. If the tab should be feature-gated, add `x-show` to the button and a `$watch` fallback.
7. Update `getSettingsForm()` and `activeSubTabButton()` if the tab has sub-panels.

## Adding a New Settings Field

Use the `vl.attrs` macro from `admin/macros/vl-setting.twig`:

```twig
<div {{ vl.attrs('content', __('Label'), 'setting_key', 'blog', __('Section'), 'keyword1 keyword2') }}>
    <label class="...">{{ __('Label') }}</label>
    <input type="text" name="setting_key" value="{{ settings.setting_key|default('') }}">
</div>
```

Parameters:
- `tab` — top-level tab name (e.g. `content`, `general`)
- `label` — translatable label
- `key` — settings key (used for search + storage)
- `subtab` — sub-tab name (empty string if no sub-tabs)
- `section` — section heading for search breadcrumbs
- `keywords` — space-separated search keywords
- `id` — optional DOM id for search result linking

## Controller

`SettingsController::update()` is group-agnostic: it reads `_group` and `_subtab` from the request body, strips them, and saves all remaining keys by name. No PHP changes are needed when adding new settings fields or sub-tabs — the controller automatically picks them up.

After saving, the controller redirects to `?tab=<group>&subtab=<subtab>` so the user lands back on the same tab.

## Sidebar Navigation

`FlashMiddleware` dynamically hides sidebar nav items based on feature toggles. When a feature is disabled, its related nav group or item is removed from the menu. See `FlashMiddleware::buildAdminNav()` for the current logic.

## Translations

All user-facing strings use `__('...')`. When adding new strings:
1. Use `composer translations` to extract missing keys.
2. Add translations to `resources/lang/en.json` and `resources/lang/tr.json`.
3. For editor JavaScript strings, add them to `window.LP_I18N` in `admin/layout.twig` and use `tjs()` in editor JS.
