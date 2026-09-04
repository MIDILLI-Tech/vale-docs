# Release Process

This document covers the full Vale release workflow: generating changelogs from conventional commits, tagging, building the ZIP package, and publishing GitHub Releases.

---

## The Orchestration Script

Vale includes a release orchestrator that ties together changelog generation, git tagging, and the release package build into a single command.

The script is located at `scripts/orchestrate-release.php`.

### Quick Start

```bash
# Full release: changelog + tag + build
php scripts/orchestrate-release.php --version=0.10.4 --tag --changelog --build

# With custom release notes
php scripts/orchestrate-release.php \
  --version=0.10.4 \
  --tag \
  --changelog \
  --build \
  --description="Major order system refactor with tax calculation fixes"
```

---

## Flags

| Flag | Description |
|------|-------------|
| `--version=x.y.z` | Release version (required unless `version.php` exists) |
| `--tag` | Create annotated git tag `vX.Y.Z` and push it |
| `--changelog` | Generate changelog from conventional commits since the last tag |
| `--build` | Run `prepare-release.php` to build the release ZIP |
| `--description="text"` | Custom release notes inserted at the top of the changelog entry |
| `--force` | Overwrite an existing version section or tag |
| `--dry-run` | Show the plan without making any changes |
| `--include-vendor` | (passed to `prepare-release.php`) Bundle `vendor/` in the ZIP |
| `--compress` | (passed to `prepare-release.php`) Enable DEFLATE compression |

---

## How It Works

### 1. Changelog Generation (`--changelog`)

The script reads all commits since the last git tag, parses them as [Conventional Commits](https://www.conventionalcommits.org/), and groups them into Keep-a-Changelog sections:

| Conventional Prefix | Section |
|---------------------|---------|
| `feat:`, `add:` | Added |
| `fix:` | Fixed |
| `security:` | Security |
| `perf:` | Performance |
| `refactor:`, `chore:` | Changed |
| `docs:` | Documentation |
| `test:` | Testing |
| `deprecate:` | Deprecated |
| `remove:` | Removed |

Commits with `style:`, `ci:`, or `build:` prefixes are excluded from the changelog.

If you provide `--description`, it is inserted as a paragraph at the top of the new version section, before the grouped commits.

**Example output in `CHANGELOG.md`:**
```markdown
## [0.10.4] - 2026-08-21

Major order system refactor with tax calculation fixes.

### Added
- add: commit message convention to AGENTS.md and pre-commit hook
- feat: new orchestrate-release script for automated changelog and tagging

### Fixed
- fix: resolve order total calculation with discounts
```

### 2. Git Tag (`--tag`)

Creates an annotated git tag `vX.Y.Z` with the version and description in the tag message. If `--changelog` was also used, the `CHANGELOG.md` is committed first with a `chore: release x.y.z` message.

### 3. Build (`--build`)

Delegates to `scripts/prepare-release.php` with the resolved version, `--include-vendor`, and `--compress` flags. This produces:
- `dist/vale-X.Y.Z.zip`: the release package
- `dist/manifest-X.Y.Z.json`: the auto-update manifest
- `dist/changelog-X.Y.Z.md`: standalone changelog for GitHub Release body
- `dist/vale-agents-X.Y.Z.zip`: AI agent skills pack (built only when `.agents/` exists; see [Agent Skills](./agent-skills))
- `dist/vale-integration-skills-X.Y.Z.zip`: the `vale-integrate` skill alone, for handing the REST API / Webhook integration workflow to an external developer (built only when `.agents/skills/vale-integrate/` exists)

The main release ZIP always excludes developer/AI tooling (`.agents/`, `AGENTS.md`, tests, CI config, and any local `*.env` file except `.env.example`). Attach both packs as additional GitHub release assets. The workflow's `dist/vale-*.zip` glob picks them up automatically.

### 4. Update Manifest Fields

`dist/manifest-X.Y.Z.json` carries the fields the updater reads:

| Field | Meaning |
|---|---|
| `version`, `released_at`, `changelog` | Release identity and notes shown in the admin panel |
| `min_php` | Minimum PHP version, taken from `config/reference-data.php`; the highest of the manifest value and the installed configuration is enforced |
| `min_extensions` | List of required PHP extensions, derived from `config/reference-data.php` (`requirements.required_extensions`) - the installer refuses to apply the update unless every extension in the union of the manifest and the installed configuration is loaded. Recommended extensions are deliberately excluded |
| `download_url`, `sha256` | Package location and checksum (the URL is rewritten by the release workflow) |
| `signatures`, `signature_message` | Ed25519 signature of `sha256:<hash>`, present only when a signing key is available |
| `requires_migration` | Set by `prepare-release.php` when `database/migrations/` differs from the previous release tag. It drives the "database schema changes" notice in the admin update screen. It never gates the migration itself: the updater always runs `phinx migrate` after copying files |

Detection uses `git tag` (highest tag below the released version) and compares the working tree, so locally prepared releases see uncommitted and untracked migration files too. When git cannot answer (no tags, shallow checkout), the flag defaults to `false` and the script prints a warning. Pass `--requires-migration` to force it on, `--no-requires-migration` to force it off. Both flags are also forwarded by `orchestrate-release.php`.

---

## Full Release Workflows

### Local Release (Recommended)

```bash
# 1. Make sure all commits are pushed
git push origin master

# 2. Run the orchestrator
php scripts/orchestrate-release.php \
  --version=0.10.4 \
  --tag \
  --changelog \
  --build \
  --description="Brief summary of what changed in this release"
```

This will:
1. Generate the changelog from your conventional commits
2. Commit `CHANGELOG.md` with `chore: release 0.10.4`
3. Create and push the `v0.10.4` tag
4. Build the release ZIP and manifest

### Dry Run

```bash
php scripts/orchestrate-release.php \
  --version=0.10.4 \
  --changelog \
  --dry-run
```

Shows what would be generated without touching any files.

### CI/CD: Manual Trigger

Use the **Build & Release (Manual)** workflow in GitHub Actions. It accepts:
- **Tag**: the release tag (e.g. `v0.10.4`)
- **Description**: optional release notes
- **Also publish the Docker images**: `yes` (default) or `no`

The workflow runs `orchestrate-release.php` with `--changelog --build` and creates a GitHub Release with the generated changelog. With the Docker option set to `yes` it also publishes the images for that version in the **same** run. See [Docker Registry Publishing](./deployment/docker-registry#ci-workflows). A tag created here uses the default `GITHUB_TOKEN`, which cannot start another workflow on its own, so the images are published from this run instead of by `docker-publish.yml`'s tag trigger.

### CI/CD: Tag Push

Push a tag to trigger the automated pipeline:

```bash
git tag -a v0.10.4 -m "Release 0.10.4"
git push origin v0.10.4
```

The `.github/workflows/release.yml` workflow builds the package and creates the GitHub Release.

---

## First-Time Setup

### Ed25519 Signing Key

To sign releases for the auto-update pipeline:

```bash
# Generate a keypair
php scripts/prepare-release.php --generate-key

# Add the private key to CI secrets as UPDATE_PRIVATE_KEY_ED25519
# Add the public key to every installation's .env as UPDATE_PUBLIC_KEY_ED25519
```

### Git Hooks Path

Ensure the pre-commit hook is active:

```bash
git config core.hooksPath .githooks
```

This enforces conventional commit messages and secret scanning before every commit.

---

## The Build Script (`prepare-release.php`)

For advanced use cases (custom output directory, key override, dependency updates), use `prepare-release.php` directly:

```bash
php scripts/prepare-release.php \
  --version=0.10.4 \
  --output=dist \
  --compress \
  --include-vendor \
  --update-deps \
  --private-key=<base64_key>
```

See the script's `--help` output or source for all available flags.

### What Goes Into the Release ZIP

```
vale-X.Y.Z/
├── index.php              # Front controller
├── vale                   # CLI binary
├── version.php            # Baked-in version string
├── public/
│   ├── index.php
│   ├── assets/            # Compiled CSS/JS
│   └── ...
├── src/                   # PHP source
├── app/                   # Controllers, Middleware, Commands
├── config/                # Configuration files
├── themes/                # Default themes
├── database/              # Migrations + seeds
├── vendor/                # PHP dependencies (if --include-vendor)
├── .env.example
└── ...
```

Excluded by default: `.git/`, `node_modules/`, `tests/`, `storage/`, `.env*` (only `.env.example` ships), `scripts/`, `.github/`, `docker/`, AI-agent tooling (`.agents/`, `AGENTS.md`), IDE files, and local cache artifacts.

During the build, `prepare-release.php` updates:
- `version.php` (root)
- `README.md` version badge

These are baked into the release ZIP and used by the auto-update system.
