# AGENTS.md — Vale Documentation Repo

Guidelines for AI coding agents working in this repository.

## Golden Rules

- **Only edit `<locale>/latest/`.** Versioned snapshots under language-specific folders (`en/vX.Y.Z/`, `tr/vX.Y.Z/`) are read-only — `sync-latest.js` sets them to chmod 444. Never edit them by hand.
- Snapshots are created at release time via `node ./sync-latest.js --version=x.y.z`, which copies each locale's `latest/` → `vX.Y.Z/` and bumps `CURRENT_VERSION` in `.vitepress/config.js`. Plain builds (`npm run docs:build` / `docs:dev`) invoke the script without a version and skip snapshot creation.
- **Never hardcode tool versions in prose.** Use the VARIANTS placeholder system from `.vitepress/config.js` (`@phpVersion@`, `@composerVersion@`, `@nodeVersion@`, `@mysqlVersion@`, `@mariadbVersion@`, `@pgsqlVersion@`). One source of truth keeps every page in sync.

## Source-of-Truth Verification

The Vale application source lives in a sibling repository: `../vale`. If that path does not exist on this machine, ask the user for its location.

Do not write or accept factual claims without verifying them against source:

| Claim type | Verify against |
|---|---|
| CLI commands & flags | `vale` binary / `app/Commands/`, `composer.json` scripts |
| REST endpoints & abilities | `routes/api.php`, API controllers |
| Admin pages & menus | `routes/admin.php` |
| Settings keys | relevant controllers/views |
| Requirements | vale `README.md`, `BUILD.md`, `composer.json` |

Existing text is not proof of correctness — check before extending it.

When unsure where content belongs or what the code actually does, **ask the user instead of inventing**. Never fabricate commands, flags, paths, version numbers, or behavior — an explicit question is always cheaper than a wrong page.

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
| Requirement version bump | `config.js` VARIANTS **+ vale README + BUILD.md together** |

## Structural Rules

- Every new page MUST be registered twice: in the `sidebar` configuration (correct group) in `.vitepress/config.js` AND linked from its section index (`developer/index.md` or `admin/index.md`). A page missing from the sidebar is an orphan — treat it as a bug.
- Preserve the developer sidebar grouping order: Getting Started · Architecture · Extending Vale · Tooling & Workflow · Ship · Meta.
- Moved or merged pages are never deleted outright — replace them with a redirect stub pointing at the new location (patterns: `developer/cli.md`, `developer/build.md`).

## Translation Policy

- Default scope: update **`en/latest/` only**.
- After content changes, ask the user whether translations should be propagated too.
- Known state: only `en/latest/` exists right now. `.vitepress/config.js` includes a locale only when its `<code>/latest` folder exists, so absent languages never appear in the language bar; same gating applies per locale to the Versions menu (`<code>/vX.Y.Z` snapshot folders).

## Verification Before Committing

1. `npm run docs:build` passes. VitePress fails the build on dead internal links; `ignoreDeadLinks` in `.vitepress/config.js` is built dynamically — it excludes locales without a `latest/` folder plus all frozen version snapshots.
2. `npm run check:external` passes (or only fails on known-flaky hosts). It checks real external links across `latest/` pages; example hosts are skipped via `SKIP_HOSTS` in `scripts/check-external-links.js`. Run it periodically, not on every build.
2. Markdown relative links resolve — audit `](./...)` targets across changed files; expect 0 broken.
3. If requirements changed on the vale side (README/BUILD/docker), those edits belong in the same change set.

## Commit Style

Conventional Commits. Content changes use the `update:` prefix, matching existing history (e.g. `update: document role:list command`).
