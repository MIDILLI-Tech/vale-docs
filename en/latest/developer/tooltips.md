# Tooltips

Vale replaces the browser's native `title` bubble with one styled tooltip, on the site front end and in the admin panel alike. This page covers the two shared assets, the rules that decide which `title` attributes get a bubble, and the theming knobs a custom theme can use.

Site managers and theme designers looking for the visual behavior do not need this page; it is aimed at theme and plugin developers.

## Assets

| File | Role |
|---|---|
| `public/assets/js/vl-tooltip.js` | The engine: one fixed-position bubble, delegated listeners, no build step |
| `public/assets/css/tooltip.css` | Bubble styling, arrow, dark variant and the `--vl-tooltip-*` tokens |
| `resources/views/partials/_tooltip_assets.twig` | The include that loads both (`link` + `defer` script with the CSP nonce) |

The include is already wired into `resources/views/layout.twig` (the `default` theme and everything inheriting the core layout), `themes/dark/templates/layout.twig`, `themes/nova/templates/layout.twig`, `themes/vivid/templates/layout.twig` and `resources/views/admin/layout.twig`.

A theme with its own standalone layout must include the partial inside `<head>` once:

```twig
{% include 'partials/_tooltip_assets.twig' %}
```

Both files are plain, hand-maintained assets: they are deliberately **not** part of the esbuild bundles, in the same way as `media-facade.js` and `media-upload.js`. Editing them needs no rebuild and no cache clear beyond the normal asset cache busting.

## What gets a bubble

Nothing has to be annotated. On first hover or keyboard focus the engine adopts the element: the `title` attribute is moved to `data-vl-tooltip` (so the browser's own bubble never appears) and mirrored to `aria-label` when the element has no other accessible name. Elements rendered later (Alpine `x-show`, editor pickers, injected markup) are picked up automatically because the listeners are delegated on `document`.

Writing `data-vl-tooltip="…"` directly skips the native fallback entirely; useful for icons whose text you never want in a `title`.

| Rule | Effect |
|---|---|
| `data-vl-tooltip-skip` | Element and its subtree keep the native tooltip |
| `data-vl-tooltip-position="top\|bottom\|left\|right"` | Preferred side; see [Placement](#placement) |
| Content scopes | `.prose` (post bodies, page bodies, product descriptions), `.ProseMirror`, `[contenteditable="true"]`, `.vl-editor-content`, `.CodeMirror`, `.cm-editor` are never touched |
| Skipped tags | `iframe`, `abbr`, `option`, `optgroup`, `object`, `embed`, `video`, `audio`, `canvas` keep their native `title` |

The content scopes matter: a `title` inside an article body is part of the saved document, not a UI hint, so the editor preview and the published page both keep the native tooltip. Use `data-vl-tooltip-skip` around any other region whose `title` attributes are content (a custom card partial that renders an author-supplied `title`, for example).

## Placement

By default the bubble sits above the host and flips below when there is no room above. Add `data-vl-tooltip-position` to force a side:

```html
<button type="button" data-vl-tooltip-position="right" title="{{ __('Copy link')|e('js') }}">…</button>
```

`left` and `right` place the bubble beside the host, vertically centred and clamped to the viewport, with the arrow pointing at the host's centre. A side that would leave the viewport is abandoned in favour of the default top/bottom rule, so a fixed side is a preference, not a guarantee.

## Behavior

- 140 ms show delay, 8 px gap from the host, 8 px viewport edge clamp.
- Arrow tracks the host centre through `--vl-tooltip-arrow-x` (top/bottom) or `--vl-tooltip-arrow-y` (left/right).
- The bubble hides on `Escape`, pointer down, scroll, resize, focus loss and pointer leave.
- Keyboard focus only shows it for `:focus-visible`, so mouse clicks do not leave a bubble behind.
- Touch and pen have no hover, so a tap opens the bubble immediately (no 140 ms delay) and a second tap on the same control closes it; tapping elsewhere, scrolling, `Escape` or focus loss also closes it. The tap is never cancelled, so links and buttons still do their job.
- `role="tooltip"` plus `aria-hidden` on the bubble; text always comes from an attribute, never from markup.

## Theming and dark mode

The bubble reads four custom properties, so a theme can retune it without forking the stylesheet:

```css
:root {
  --vl-tooltip-bg: #1f2937;
  --vl-tooltip-text: #f9fafb;
  --vl-tooltip-shadow: 0 8px 22px rgba(17, 24, 39, 0.24);
}
```

`tooltip.css` also defines the inverted set — `--vl-tooltip-bg-dark`, `--vl-tooltip-text-dark`, `--vl-tooltip-shadow-dark` — applied under `.dark`, giving a light bubble with dark text on dark pages. The `dark` and `nova` themes set `class="dark"` on `<html>`, so they get that inversion automatically; `default` and `vivid` are light and keep the dark bubble.

A custom theme that switches to dark mode some other way (a cookie without the `.dark` class, for example) must add the class to `<html>` or override the three `-dark` variables with its own selector:

```css
[data-theme="night"] .vl-tooltip {
  color: #111827;
  background: #e5e7eb;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.55);
}
```

Keep the two layers aligned: values set in `theme.json` are not read by the tooltip, only CSS is.

## Admin panel

The admin UI loads the same assets, so an icon button gets a bubble with no extra markup:

```twig
<button type="button" title="{{ __('Delete') }}" aria-label="{{ __('Delete') }}">…</button>
```

The admin media facade and upload scripts are unaffected: their tiles carry `title` hints like any other control, and clicks on a play badge are handled in the capture phase before the tooltip listener hides the bubble.
