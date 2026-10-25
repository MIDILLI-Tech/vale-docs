# AGENTS.md — Vale Documentation Repo

Guidelines for AI coding agents working in this repository.

## Golden Rules

- **Only edit `<locale>/latest/`.** Versioned snapshots under language-specific folders (`en/vX.Y.Z/`, `tr/vX.Y.Z/`) are read-only — `scripts/sync-latest.js` sets them to chmod 444. Never edit them by hand.
- Snapshots are created at release time via `node ./scripts/sync-latest.js --version=x.y.z`, which copies each locale's `latest/` → `vX.Y.Z/` and bumps `CURRENT_VERSION` in `.vitepress/config.js`. Plain builds (`npm run docs:build` / `docs:dev`) invoke the script without a version and skip snapshot creation.
- **Never hardcode tool versions in prose.** Use the VARIANTS placeholder system from `.vitepress/config.js` (`@phpVersion@`, `@composerVersion@`, `@nodeVersion@`, `@mysqlVersion@`, `@mariadbVersion@`, `@pgsqlVersion@`). One source of truth keeps every page in sync.
- **Spellcheck is part of the build.** `npm run check:spelling` (cspell) scans every `**/*.md`, inline code spans included. Legitimate product/provider/brand names go into the `words` array in `cspell.json` (sorted case-insensitively); real typos are fixed in the prose — never reword correct text to silence the checker. Details below.

## Source-of-Truth Verification

The Vale application source lives in a sibling repository: `../vale`. If that path does not exist on this machine, ask the user for its location.

Do not write or accept factual claims without verifying them against source:

| Claim type | Verify against |
|---|---|
| CLI commands & flags | `vale` binary / `app/Commands/`, `composer.json` scripts |
| REST endpoints & abilities | `routes/api.php`, API controllers |
| Admin pages & menus | `routes/admin.php` |
| Settings keys | relevant controllers/views |
| Requirements | vale `README.md`, `composer.json` |

Existing text is not proof of correctness — check before extending it.

When unsure where content belongs or what the code actually does, **ask the user instead of inventing**. Never fabricate commands, flags, paths, version numbers, or behavior — an explicit question is always cheaper than a wrong page.

## No Third-Party Links in Docs

Signup pages, API-key pages, import/export screens, CAPTCHA consoles and provider dashboards are **never** documented. Their URLs live in exactly one place: the vale repo's `config/reference-data.php` (`signup_urls`, `import_export_urls`, `captcha_urls`, `mail_drivers`, `sso_providers`, `services`, `geo`, `media_embeds`). The admin UI renders the right link next to the field that needs it.

- **No URLs** for a provider's signup, key, dashboard, console, app-registration or export screen.
- **No navigation paths** into a vendor's UI either (`Shopify Admin → Products → Export`), because the panel links straight there.
- **One generic note instead**, in a `::: tip` box:

```md
::: tip THE LINK IS IN THE PANEL
Every field that needs a key or an export file links straight to the provider, so you can open it and come back with the value in one click.
:::
```

- Do describe the value and where it is stored (API key, domain, CSV file) and keep provider names as plain text. Names are fine; their URLs are not.
- Adding or changing a provider link is a vale-repo change (`reference-data.php`); the docs only need to change if the surrounding steps change.

## Tone & Routing

Admin pages (`en/latest/admin/`) are for non-technical site managers: task-oriented, minimally technical. Terminal/`.env` material goes in `::: tip FOR SYSADMINS` boxes, never plain admin prose. Slugs, storage internals, algorithms, and exact shortcode formats belong in `developer/` pages. One workflow = one source page, others link to it. Full rules: [Documentation Guide → Admin Docs Tone](en/latest/developer/documentation.md#admin-docs-tone) and the `vale-docs` agent skill (canonical copy lives in the vale repo at `.agents/skills/vale-docs/SKILL.md`).

## When to Update Docs

Update documentation in the same change set as the code change:

| Change | Docs to update |
|---|---|
| Admin UI / feature | `en/latest/admin/<matching-page>` |
| REST endpoint | `developer/api.md` |
| CLI command | `admin/cli.md` (+ `composer.json` scripts) |
| Skill added/removed/changed | `developer/agent-skills.md` catalog (per vale `AGENTS.md` §23–§24) |
| Requirement version bump | `config.js` VARIANTS **+ vale README together** |

## Structural Rules

- Every new page MUST be registered twice: in the `sidebar` configuration (correct group) in `.vitepress/config.js` AND linked from its section index (`developer/index.md` or `admin/index.md`). A page missing from the sidebar is an orphan — treat it as a bug.
- Preserve the developer sidebar grouping order: Getting Started · Architecture · Extending Vale · Tooling & Workflow · Ship · Meta.
- Moved or merged pages are never deleted outright — replace them with a redirect stub pointing at the new location (patterns: `developer/cli.md`, `developer/build.md`).

## Translation Policy

- Default scope: update **`en/latest/` only**.
- After content changes, ask the user whether translations should be propagated too.
- Known state: only `en/latest/` exists right now. `.vitepress/config.js` includes a locale only when its `<code>/latest` folder exists, so absent languages never appear in the language bar; same gating applies per locale to the Versions menu (`<code>/vX.Y.Z` snapshot folders).

## Spell Checking (cspell)

The dictionary is `cspell.json` at the repository root. `npm run check:spelling` covers every `**/*.md` — including inline code spans and fenced code blocks — and runs inside `npm run docs:build`, so an unknown word fails the build.

- **Add legitimate names to `words`** — payment provider and payment-method values (`afterpay`, `clearpay`, `twint`), crawler names, brand names, PHP/CLI identifiers. Keep the array sorted case-insensitively.
- **Fix real typos in the prose** — never "solve" a misspelling by adding the misspelling to the dictionary.
- **Never reword correct text** (or swap it for a differently wrapped code span) just to make the checker quiet.
- Both `en` and `en-GB` are enabled, so British spellings are accepted.

## Verification Before Committing

CI (`.github/workflows/docs.yml`) runs spelling → `docs:build` → external links. `npm run docs:build` already chains the first three checks, so run that locally:

| Command | Checks |
|---|---|
| `npm run check:anchors` | Internal `#anchor` links resolve — headings containing `:` slugify to `-` (`import:wordpress` → `#import-wordpress`) |
| `npm run check:sidebar` | Every sidebar entry points at an existing page |
| `npm run check:parens` | Parentheses/brackets balance check across all markdown files |
| `npm run check:spelling` | cspell spellcheck over every `**/*.md` |
| `npm run docs:build` | The checks above + VitePress build (dead internal links fail it) |
| `npm run check:external` | Real external links — run periodically, or in CI with `--strict` (example hosts are skipped via `SKIP_HOSTS` in `scripts/check-external-links.js`) |

Before committing:

1. `npm run docs:build` passes.
2. Markdown relative links resolve — audit `[text](./...)` targets across changed files; expect 0 broken.
3. If requirements changed on the vale side (README/BUILD/docker), those edits belong in the same change set.

## Commit Style

Conventional Commits. Content changes use the `update:` prefix, matching existing history (e.g. `update: document role:list command`).
