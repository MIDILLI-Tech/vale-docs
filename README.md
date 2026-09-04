# Vale Documentation Source

This directory contains the source files for the Vale documentation, built with [VitePress](https://vitepress.dev/).

Access to the documentation on: https://docs.getvale.org/

## License

The Vale documentation is released under the [MIT License](LICENSE). The Vale software itself is licensed under AGPL-3.0.

## Getting Started

To work on the documentation locally, you need Node.js installed.

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run docs:dev
   ```

3. **Build Static Site**:
   ```bash
   npm run docs:build
   ```
   The output will be generated in the `build/` directory.

## Directory Structure

- `.vitepress/`: Configuration files, themes, and assets.
- `en/`: English documentation.
  - `latest/`: **The working copy**. Edit pages here.
  - `vX.Y.Z/`: Version snapshots generated from `latest/` (read-only).
    - `admin/`: Guide for site administrators.
    - `developer/`: Guide for developers and theme creators.
- `ISO-CODE/`: Documentation in other languages.

## How it Works

`latest/` is the **source of truth**. All edits happen in each locale's `latest/` folder.

Version snapshots (`vX.Y.Z/`) are created from `latest/` by `scripts/sync-latest.js` before a release:

```bash
node ./scripts/sync-latest.js --version=0.11.0
```

The script:

1. Copies each locale's `latest/` → `v0.11.0/`.
2. Makes all versioned directories read-only (they must not be edited directly).
3. Updates `CURRENT_VERSION` in `.vitepress/config.js`.

`npm run docs:build` and `npm run docs:dev` call `scripts/sync-latest.js` without a version, so version creation is skipped.

## How to...

### Add a New Version

1. Finish editing the pages in `latest/`.
2. Run `node ./scripts/sync-latest.js --version=0.11.0`.
3. The snapshot is created and `CURRENT_VERSION` is updated automatically.

### Add a New Language

1. Create a new directory for the language (e.g., `de/`).
2. Create a `latest/` subdirectory inside it (e.g., `de/latest/`).
3. Follow the same structure as the `en/latest/` directory.
4. Add the language to `LOCALE_CANDIDATES` in `.vitepress/config.js` if it isn't already listed there.

### Add New Pages

1. Create a new `.md` file in the appropriate locale's `latest/` directory.
2. Add the link to the new page in the `sidebar` configuration in `.vitepress/config.js`.

## Deployment

The documentation is built to `build/` and served from `/vale-docs/` (set via `--base=/vale-docs/` in the `docs:build` script).

- `npm run docs:build`: builds the site and prints the deploy instructions.
- `npm run docs:build-copy`: builds the site and copies `build/` to the web server.

## Checks & Spell Checking

`npm run docs:build` chains every check before building, so a green local build means a green CI run (`.github/workflows/docs.yml`):

| Command | Checks |
| --- | --- |
| `npm run check:anchors` | Internal `#anchor` links point at real headings |
| `npm run check:sidebar` | Sidebar entries point at existing pages |
| `npm run check:spelling` | cspell spellcheck over every `**/*.md` |
| `npm run check:external` | Real external links; run periodically, not on every build (`--strict` in CI) |

`npm run docs:dev` runs the same checks before starting the server, but does not fail on spelling.

### Broken Link Checking

VitePress fails the build when it finds dead internal links. Links to locales that don't have a `latest/` folder yet, plus all version snapshots (e.g. `v0.10.2/`), are excluded via `ignoreDeadLinks` in `.vitepress/config.js`. This is dynamic. Every locale code in `LOCALE_CANDIDATES` without a matching `<code>/latest/` folder is ignored automatically.

### Spell Checking

The dictionary is `cspell.json` at the repository root. It holds a `words` array, sorted case-insensitively, for legitimate names the English dictionaries don't know:

- Inline code spans and fenced code blocks are checked too, so provider names, payment-method values, product names and CLI flags show up as `Unknown word`.
- **Add the real name to `words`**: e.g. `afterpay`, `clearpay`, `twint`, crawler names, brand names.
- **Fix real typos in the page**. A misspelling never goes into the dictionary.
- **Never reword correct text** to satisfy the checker.
