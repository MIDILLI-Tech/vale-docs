# Build Process

Vale's release pipeline (packaging, signing, and CI/CD) is documented in the [Release Process](./releases) guide. This page covers the local asset build and the scripts behind it.

Quick reference:

- **Full release:** `php scripts/orchestrate-release.php --version=x.y.z --tag --changelog --build`
- **Assets only:** `npm install && npm run build`
- **Package only:** see [Release Process → The Build Script](./releases#the-build-script-prepare-release-php)

## Requirements

- **Node.js** 24 or newer: the asset build uses the Tailwind CLI and esbuild
- **npm**
- **~1 GB free RAM** during the build. On a machine with 512 MB, enable a swap file first to avoid an out-of-memory failure while Tailwind and esbuild compile.

## Commands

```bash
npm install     # once, or after dependency changes
npm run build   # production assets (minified)
npm run watch   # rebuild on change while editing themes or the admin UI
```

`npm run build` runs every step in order:

| Script | Tool | Output |
| --- | --- | --- |
| `build:css` | Tailwind CLI, minified | `public/assets/build/app.css` |
| `build:fonts-css` | Tailwind CLI, minified | `public/assets/build/fonts.css`, `fonts-display.css` |
| `build:app-vendor` | esbuild, minified | `public/assets/build/app-vendor.js` |
| `build:js` | esbuild, minified | `public/assets/build/app.js` |
| `build:admin-vendor` | esbuild, minified | `public/assets/build/admin-vendor.js` |
| `build:admin` | esbuild, minified | `public/assets/build/admin.js` |
| `build:editor` | esbuild, minified | `public/assets/build/editor.js` |
| `build:charts` | esbuild, minified | `public/assets/build/charts.js` |
| `build:fonts` | `scripts/copy-fonts.js` | `public/assets/build/files/` |

`npm run watch` runs `watch:css`, `watch:js`, and `watch:editor` concurrently.

## Source Files

| File | Purpose |
| --- | --- |
| `resources/css/app.css` | Tailwind entry point with the `@fontsource` imports |
| `resources/css/fonts.css`, `resources/css/fonts-display.css` | Self-hosted font stacks (Inter, Playfair Display) |
| `resources/js/app.js` | Frontend theme bundle (Alpine.js) |
| `resources/js/app-vendor.js` | Frontend vendor bundle |
| `resources/js/admin.js`, `resources/js/admin-vendor.js` | Admin panel bundles (Alpine.js, collapse, Sortable.js) |
| `resources/js/editor/index.js` | Rich-text editor bundle |
| `resources/js/charts.js` | Chart.js bundle for order reports |
| `tailwind.config.js` | Tailwind configuration (template paths, dark mode, plugins) |
| `scripts/copy-fonts.js` | Copies font files from `node_modules` into the build directory |

## Output Layout

```
public/assets/build/
├── app.css
├── fonts.css
├── fonts-display.css
├── app.js
├── app-vendor.js
├── admin.js
├── admin-vendor.js
├── editor.js
├── charts.js
└── files/          # Inter + Playfair Display woff2 files
```

## Local Assets vs CDN

`ASSETS_USE_CDN` controls whether templates load Tailwind, Alpine.js, and fonts from the compiled files above or from public CDNs. Keep it `false` in production and set it to `true` only while developing themes. See [Environment Variables](./env#assets).

::: tip Release builds
You do not run these commands by hand for a release: `prepare-release.php` runs `npm install` and `npm run build`, so the compiled assets are always bundled in the ZIP. See [Release Process](./releases).
:::
