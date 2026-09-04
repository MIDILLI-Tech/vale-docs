# Documentation Guide

This guide explains how to write, maintain, and version the Vale documentation.

## License

The Vale documentation is released under the [MIT License](/vale-docs/LICENSE). This applies to the documentation content and the documentation source in the `vale-docs` repository.

Note that the Vale **software** itself is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)** — the documentation and the software are separate works with separate licenses.

Contributions to the documentation are accepted under the MIT License.

## Technology Stack

The documentation is built using [VitePress](https://vitepress.dev/), a modern Vue-powered static site generator.

---

## Local Development

To run the documentation server locally:

1. Navigate to the documentation directory:
   ```bash
   cd vale-docs
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run docs:dev
   ```
   This will start a local server (usually at `http://localhost:5173/docs/`) with hot-reloading.

---

## Writing Documentation

- **Source of Truth**: Always write new documentation or edit existing pages inside the `latest/` folder of each locale (e.g., `en/latest/` or `tr/latest/`).
- **Read-Only Archives**: Do **not** edit versioned directories (like `en/v0.10.2/`) directly. They represent frozen snapshots of past releases and are automatically set to read-only.
- **Markdown**: Use standard Markdown with VitePress features (like custom containers, e.g., `::: tip` or `::: warning`).

---

## Versioning & Release Workflow

Vale documentation supports versioning. The versioning workflow is managed by the `sync-latest.js` script.

### Normal Build / Dev Commands
When running `npm run docs:dev` or `npm run docs:build` normally, the script detects that no version parameter was supplied and exits early, skipping version creation.

::: tip All commands
Run `npm run` without additional arguments to see which commands are available.
:::

::: tip Deploy via npm
Run `npm run docs:build-copy` to build and copy generated files to the server (useful on CI/CD runs).
:::

### Creating a New Version Archive
When a new version of Vale is released, you should freeze the current `latest/` documentation into a versioned archive folder:

1. Run the versioning command with the target version number:
   ```bash
   npm run docs:version -- --version=0.10.3
   ```
   *(Note: You can omit the `v` prefix; the script automatically normalizes it to `v0.10.3`)*

2. What the script does under the hood:
   - Copies `<locale>/latest/` to `<locale>/vX.Y.Z/` (e.g., `en/latest/` -> `en/v0.10.3/`).
   - Recursively marks all versioned directories (`v*.*.*`) as read-only to prevent accidental edits.
   - Updates the `CURRENT_VERSION` constant in `.vitepress/config.js` to the new version.

3. Update the sidebar navigation configuration in `.vitepress/config.js` if the new version has different pages or structural changes.

---

## Tool Version Placeholders

**Never hardcode environment tool versions** (PHP, Node.js, Composer, MySQL, MariaDB, etc.) directly in the markdown. If a tool requirement changes, updating every page one by one is error-prone and versions will drift.

Instead, reference them with placeholder tokens in the `@key@` format. The values are defined in a single place: the `VARIANTS` object at the top of `.vitepress/config.js`.

Supported keys (the **Current value** column auto-resolves from `VARIANTS`, so it never drifts):

| Token | Description | Current value |
| --- | --- | --- |
| `\@phpVersion@` | Minimum PHP version | `@phpVersion@` |
| `\@nodeVersion@` | Minimum Node.js version | `@nodeVersion@` |
| `\@composerVersion@` | Composer version | `@composerVersion@` |
| `\@mysqlVersion@` | MySQL version | `@mysqlVersion@` |
| `\@mariadbVersion@` | MariaDB version | `@mariadbVersion@` |
| `\@pgsqlVersion@` | PostgreSQL version | `@pgsqlVersion@` |

### Usage Rules

- Use the token **everywhere** a version appears: in prose, bullet lists, tables, inline code, and code fences.
- Placeholders are replaced automatically at build time — no build step or plugin configuration is needed per page.
- Do **not** use placeholders for literal sample output (e.g., the exact patch version shown in a `php vale doctor` output example). Only the actual requirements should be templated.
- If a new tool needs templating, add a new key to `VARIANTS` in `.vitepress/config.js`; any `@key@` matching it is replaced automatically.
- To display a token literally (e.g. in documentation about the tokens themselves), escape it with a leading backslash: `\@phpVersion@`.

### Updating a Version

1. Edit the value in the `VARIANTS` object in `.vitepress/config.js`.
2. Run `npm run docs:build`.
3. Every page using the token updates automatically — no markdown changes needed.

Example:

```markdown
- **PHP \@phpVersion@+**
- **Node.js \@nodeVersion@+ & npm**
```

Renders as:

- **PHP 8.3+**
- **Node.js 24+ & npm**

> The [Prerequisites](./prerequisites) page is the canonical reference for all supported tool versions and uses these tokens.
