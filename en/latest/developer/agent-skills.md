# Agent Skills (AI-Assisted Development)

Vale ships a set of reusable **agent skills**: self-contained workflow definitions that AI coding assistants (OpenCode, Claude Code, and other Claude-compatible agents) discover automatically in your working copy and load on demand. Instead of repeating integration instructions by hand, you ask the agent for an outcome; the skill guides it through questions, generates skeleton code following Vale's conventions, and verifies the result.

## Where Skills Live

Skills are stored one folder per skill inside the repository:

```
.agents/
└── skills/
    ├── vale-payment-gateway/SKILL.md
    ├── vale-theme/SKILL.md
    └── ...
```

The folder name must match the skill `name` declared in `SKILL.md` frontmatter. Both `.agents/skills/` (tool-agnostic) and AGENTS.md at the repository root are picked up by compatible agents without any configuration.

## Available Skills

| Skill | What it produces |
|---|---|
| `vale-env-check` | Goal-driven environment readiness report (PHP/extensions, Composer, Node, `.env`, vendor, DB, migrations, assets) with exact fix commands |
| `vale-payment-gateway` | Full payment gateway integration: gateway class implementing `PaymentGatewayInterface`, DI factory, controller wiring, admin settings block, checkout radio, webhook route |
| `vale-theme` | Theme scaffold under `themes/<slug>/`: `theme.json`, layout/content templates, menus, `--theme-*` color variables, dark-mode handling |
| `vale-api-endpoint` | New `/api/v1` resource: API controller with the standard JSON envelope, routes with ability middleware, test skeleton |
| `vale-cli-command` | New `php vale <cmd>` Symfony Console command: `app/Commands/` skeleton, `vale` loader registration, optional DI, `--dry-run`, dummy-data test with rollback, cli.md docs |
| `vale-webhook` | Signature-verified webhook receiver (consumer) or a new outbound event wired into `OutboundWebhookService` (producer) |
| `vale-shortcode` | New `[tag]` shortcode in `ShortcodeProcessor` with attribute parsing and safe HTML output |
| `vale-mail-driver` | Mail transport adapter implementing `MailInterface` plus factory registration and admin option |
| `vale-migration` | Phinx migration with prefix-aware table names and MySQL/PostgreSQL/SQLite compatibility rules |
| `vale-translations` | Translation extraction/sync/prune workflow plus correct `__()` / `tjs()` usage |
| `vale-docs` | Route docs content to Admin vs Developer guide: audience-first questions, sibling-code verification, tone conventions |

## How to Use

Ask naturally: the agent picks the matching skill from its description:

> "Add FooPay as a payment provider"
> "Create a theme called Aurora based on default"
> "Expose coupons over the REST API"

You can also invoke explicitly:

> "Use the vale-migration skill to add an order_meta table"

Every skill starts with a **mandatory interactive phase**: it asks clarifying questions first (provider name? redirect or embedded flow? which operations?), then generates only what your answers require. Answer the questions (do not skip them), and you get a working starting point instead of generic boilerplate.

::: tip
Skills are instructions, not scripts. Everything they generate lands as normal files in your project that you can review, adjust, and commit.
:::

## Anatomy of a Skill

Each `SKILL.md` follows the same shape:

1. **Frontmatter:** `name` and a precise `description` (with USE FOR / DO NOT USE FOR hints) so agents select the right skill.
2. **Context map:** verified file paths, interfaces, and conventions the workflow touches.
3. **Interactive phase:** required questions before any code is written.
4. **Generation steps:** inline skeleton templates matching repository patterns (`declare(strict_types=1)`, namespaces, DI wiring, dark-mode variants).
5. **Verification:** syntax checks, lint commands, tests, and a completion checklist.

## Maintenance Rules

Two-way sync keeps skills trustworthy:

- **Code → Skill:** When a change alters a pattern a skill covers (e.g. checkout flow, API envelope, mail factory), update the matching `SKILL.md` in the same change set. The full change-area mapping lives in `AGENTS.md`, sections 23 and 24.
- **Skill → Docs:** When a skill is added, renamed, removed, or its purpose changes, update this page so the catalog above stays accurate.

Treat stale skills like stale documentation: worse than none.

::: warning ADDING A NEW SKILL
Create a new folder under `.agents/skills/<name>/SKILL.md` (lowercase-hyphen name matching the folder), follow the five-part anatomy above, add it to the catalog table here and to the lists in `AGENTS.md` (§23 catalog, §24 maintenance rule), then mention it in your pull request description.
:::

## Shipping

::: tip THIRD-PARTY AUDIT SKILL
Vale does not bundle a security-audit skill. For local, opt-in audits, install Cloudflare's `security-audit-skill` globally. See [Security](./security/#security-audit-skill-optional).
:::

The main release ZIP excludes developer/AI tooling (`.agents/`, `AGENTS.md`). Releases additionally carry a small **`vale-agents-X.Y.Z.zip`** asset containing both, built automatically when they exist. Extract it at the root of a working copy to install the skills on non-git deployments.

::: tip SEE ALSO
- [Release Process](./releases): where the agents pack artifact comes from.
- [Contributing](./contributing): coding standards the generated skeletons follow.
:::
