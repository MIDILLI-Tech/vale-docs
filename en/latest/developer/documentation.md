# Documentation Guide

::: tip AI AGENTS
Using an AI coding agent? Load the [`vale-docs`](./agent-skills) skill to route content to the admin or developer guide and verify claims against the codebase.
:::

This guide explains how to write, maintain, and version the Vale documentation.

## License

The Vale documentation is released under the [MIT License](/vale-docs/LICENSE). This applies to the documentation content and the documentation source in the `vale-docs` repository.

Note that the Vale **software** itself is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**: the documentation and the software are separate works with separate licenses.

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

## Quality Checks

Every check runs inside `npm run docs:build`: a green local build means a green CI run (`.github/workflows/docs.yml`):

| Command | Checks |
| --- | --- |
| `npm run check:anchors` | Internal `#anchor` links point at real headings. Note that `:` slugifies to `-` (`import:wordpress` → `#import-wordpress`) |
| `npm run check:sidebar` | Sidebar entries point at existing pages |
| `npm run check:spelling` | cspell spellcheck over every `**/*.md` |
| `npm run check:external` | Real external links: run periodically, not on every build (`--strict` in CI); example hosts are skipped via `SKIP_HOSTS` |

`npm run docs:dev` runs the same checks before starting the local server, but reports spelling as a warning instead of failing.

### Spell Checking

The dictionary is `cspell.json` at the repository root: a `words` array, sorted case-insensitively, holding legitimate names the English dictionaries do not know.

- Inline code spans and fenced code blocks are checked too, so provider names, product names, payment-method values and CLI flags appear as `Unknown word`.
- **Add the real name to `words`**: for example `afterpay`, `clearpay`, `twint`, crawler names, brand names, function names.
- **Fix real typos in the page**: a misspelling never goes into the dictionary.
- **Never reword correct text** to satisfy the checker; the checker adapts to the content, not the other way round.

---

## Versioning & Release Workflow

Vale documentation supports versioning. The versioning workflow is managed by the `scripts/sync-latest.js` script.

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
| `\@gitRepo@` | Canonical GitHub repository URL | `@gitRepo@` |
| `\@dockerImage@` | Docker Hub image name for pull/run examples | `@dockerImage@` |

### Usage Rules

- Use the token **everywhere** a version appears: in prose, bullet lists, tables, inline code, and code fences.
- Placeholders are replaced automatically at build time: no build step or plugin configuration is needed per page.
- Do **not** use placeholders for literal sample output (e.g., the exact patch version shown in a `php vale doctor` output example). Only the actual requirements should be templated.
- If a new tool needs templating, add a new key to `VARIANTS` in `.vitepress/config.js`; any `@key@` matching it is replaced automatically.
- To display a token literally (e.g. in documentation about the tokens themselves), escape it with a leading backslash: `\@phpVersion@`.

### Updating a Version

1. Edit the value in the `VARIANTS` object in `.vitepress/config.js`.
2. Run `npm run docs:build`.
3. Every page using the token updates automatically: no markdown changes needed.

Example:

```markdown
- **PHP \@phpVersion@+**
- **Node.js \@nodeVersion@+ & npm**
```

Renders as:

- **PHP @phpVersion@+**
- **Node.js @nodeVersion@+ & npm**

> The [Prerequisites](./prerequisites) page is the canonical reference for all supported tool versions and uses these tokens.

---

## Admin Docs Tone

Admin-guide pages (`en/latest/admin/`) are written for **non-technical site managers**. Keep them task-oriented and minimally technical:

- **Minimal technical detail, maximal task clarity**: describe what to click and what happens, not how it works internally. When in doubt, cut the mechanism and keep the action plus its result.

- **No permission slugs** (`posts.edit`, `roles.manage`): describe the capability in plain words and link to [Users & Roles](../admin/users#roles-permissions). Slug-level detail belongs in [Security: RBAC](../admin/../developer/security/#role-based-access-control-rbac).
- **No storage internals**: no table/column names, no JSON value examples, no verification algorithms. If developers need it, put it in the matching `developer/` page and link there.
- **No exact code formats** for shortcodes/placeholders in admin pages: describe what the block does and link to the [shortcode reference](./shortcodes). Searchable option lists (AI crawler names, payment methods, ad placements) are the exception: keep them, they are lookup keys.
- **Terminal commands go in `FOR SYSADMINS` boxes**: `::: tip FOR SYSADMINS` with a "forward this to your host" line. Never delete them; separate the audience instead.
- **Single source per workflow**: e.g. 2FA lives in [Users & Roles](../admin/users#two-factor-authentication-2fa); `settings.md` and `registration.md` link there instead of repeating it.
- **Build placeholders stay**: `@phpVersion@`-style tokens and placeholder images/screenshots are replaced at build/release time; do not "fix" them into hardcoded values.

---

## Adding a New Language

Language support is folder-driven: no config edits needed for the basics:

1. Create `<code>/latest/` (two-letter code, e.g. `de/latest/`) and translate the pages into it.
2. `.vitepress/config.js` picks the locale up automatically: the language bar entry, sidebar, and nav appear once the folder exists, and disappear again if it is removed. The Versions menu is gated per locale the same way (`<code>/vX.Y.Z` snapshot folders).
3. If the code is not in the `LOCALE_CANDIDATES` list in `config.js`, add it there (label + code): otherwise the folder is ignored.
4. For fully localized navigation titles, promote the locale to a hand-written block like `tr` in `config.js`; otherwise sidebar/nav titles fall back to English.
5. Version snapshots (`npm run docs:version`) cover every locale that has a `latest/` folder.
6. Search, anchor checks, and sidebar checks cover every locale the same way. Search is scoped to the visitor's language (a German page returns only German results) and to the current guide (admin vs developer); versioned snapshots (`vX.Y.Z`) never appear in results, in any language. Note that `scripts/check-sidebar.js` validates strictly once the folder exists, so only create a new locale folder when the translation is complete enough to link cleanly.
