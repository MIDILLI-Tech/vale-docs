# CLI Commands

::: tip AI AGENTS
Using an AI coding agent? Load the [`vale-cli-command`](../../developer/agent-skills) skill for the command skeleton, loader registration, `--dry-run`, and tests.
:::

Vale includes a powerful Symfony Console CLI for database management, cache, backups, cron, updates, users, and media operations.

## Running Commands

From the root of your Vale installation:

```bash
php vale <command> [arguments] [options]
```

List all available commands:
```bash
php vale list
```

Get detailed help for any command:
```bash
php vale help <command>
```

::: tip Docker Shortcut
Inside a Vale Docker container, `vale <command>` is a shortcut for `php vale <command>`: the images ship a `vale` wrapper binary. Inside docker, it also offers auto-completion, so you can use e.g. `vale d` and press TAB to complete `vale doctor`. This shortcut **only exists in the Docker images**; on a regular VPS or shared host, always use `php vale <command>`.

Docker commands run as `www-data`, the same user as the web server, so nothing the CLI writes (database journals, caches, logs, backups) ends up owned by root and locks the site out of its own storage.
:::

---

## Health

### `doctor`

Check system health: PHP version, environment configuration (with APP_KEY encrypt/decrypt roundtrip validation), encrypted settings integrity, database connection and pending migrations, required PHP extensions, and writable directory permissions.

```bash
php vale doctor
```

Output example:
```
Vale Doctor
===========

PHP
✅ PHP 8.3.12

Environment
✅ .env file
✅ APP_KEY valid (encrypt/decrypt roundtrip OK)
✅ APP_URL configured
✅ Application installed (storage/installed.lock)
✅ APP_ENV = production, APP_DEBUG = false
⚠️ APP_URL uses HTTPS (http://example.com)
✅ Disk space: 245.60 GB free

Encrypted Settings
✅ All encrypted settings readable

Database
✅ Connected (pdo_mysql)

Migrations
✅ All migrations applied (42)

PHP Extensions
✅ pdo_mysql (required)
✅ pdo_pgsql (recommended)
✅ pdo_sqlite (required)
✅ mbstring (required)
 ...

Directory Permissions
✅ storage/
✅ storage/logs/
✅ storage/cache/
 ...

Results: 33 passed, 2 warnings, 0 failed
```

The summary separates three categories:
- **passed (✅)**: Everything OK
- **warnings (⚠️)**: Non-blocking issues (e.g., recommended extension missing, no HTTPS in dev)
- **failed (❌)**: Blocking issues (e.g., missing `.env` file, no DB connection, required extension missing)

::: tip APP_KEY roundtrip
The doctor command validates APP_KEY by encrypting and decrypting a test value using the XChaCha20-Poly1305 algorithm. A failed roundtrip indicates a corrupt or modified key.
:::

::: warning Production Debug Mode
If `APP_ENV=production` and `APP_DEBUG=true`, the doctor shows a warning: detailed error pages expose sensitive information. Always set `APP_DEBUG=false` in production.
:::

::: tip Pending Migrations
If there are migration files in `database/migrations/` that haven't been applied yet, the doctor lists them as pending. Run `php vale migrate` to apply them.
:::

---

## Security

### `key:generate`

Generate a new `APP_KEY` and display all settings that must be re-entered after the change. The command outputs the new key but does **not** modify `.env`; you must update it manually.

```bash
php vale key:generate
```

Output example:
```
New APP_KEY generated:

  APP_KEY=a1b2c3d4e5f6...

WARNING: Changing APP_KEY will break all encrypted settings.

You must manually update the APP_KEY in your .env file:

  1. Open .env in a text editor
  2. Replace the existing APP_KEY value with the key above
  3. Save the file

After updating .env, re-enter the following settings in the admin panel:

Payment gateways:
  - stripe_secret_key
  - stripe_webhook_secret
  - paypal_client_secret
  - mollie_api_key
  ...

Mail services:
  - mail_smtp_pass
  - mailgun_secret_key
  - sendgrid_api_key
  ...

SSO providers:
  - All sso_*_client_secret values (Google, GitHub, etc.)

2FA:
  - All users with 2FA enabled will need to set up again
  - Users who cannot log in can use the emergency password reset

After re-entering settings, run:

  php vale doctor
```

::: warning When to use
Only run this command if your `APP_KEY` is lost or compromised. Changing the key requires re-entering all encrypted settings (payment gateways, mail services, SSO providers, and 2FA). If `ENCRYPT_PII=true`, encrypted **order and customer addresses** become permanently unreadable and cannot be re-entered. See [Troubleshooting: Lost APP_KEY](./troubleshooting#lost-or-changed-app-key) for detailed recovery steps.
:::

---

## Database

### `migrate`

Run pending database migrations. On a normal migration run, Vale also applies the safe initial seed (roles, permissions, default settings, and content types). Demo/sample data is never included automatically.

```bash
php vale migrate
```

| Option | Description |
|---|---|
| `--status` / `-s` | Show migration status (which have run, which are pending) |
| `--rollback` / `-r` | Roll back the most recent migration batch |
| `--fake` / `-f` | Record migrations as applied without executing them (for imported databases) |
| `--dry-run` | Preview without running migrations |

### `db:seed`

Seed the database with default data (roles, permissions, default settings, and content types). This command does not add sample/demo data unless `--demo` is specified.

```bash
php vale db:seed
```

| Option | Description |
|---|---|
| `--dry-run` | Preview without running seeders |
| `--demo` | Add sample users, content, products, orders, and coupons |
| `--force` | Allow seeding when `APP_ENV=production` |

`db:seed` is protected in production. Add `--force` only when you intentionally want to seed a production database. Use `--demo` for a test or demo installation; it adds sample users, content, products, orders, and coupons.

```bash
php vale db:seed --demo
php vale db:seed --demo --force
php vale db:seed --dry-run
```

### `db:reset`

Reset selected parts of the database. This is destructive, so take a backup first.

```bash
# Without flags: choose the components to reset interactively
php vale db:reset

php vale db:reset --contents --dry-run
php vale db:reset --contents
php vale db:reset --full --confirm --seed
```

When run without flags, Vale interactively asks which components to reset (content, settings, users, or a full reset). `--confirm` only skips the final confirmation step after the selection; for automation and scripts, it is safer to provide an explicit reset flag.

| Option | Description |
|---|---|
| `--contents` | Clear posts, pages, products, orders, coupons, forms, and subscribers |
| `--settings` | Clear site settings |
| `--users` | Clear users and role assignments |
| `--full` | Drop all tables, rerun migrations, and reset users/settings |
| `--dry-run` | Preview without changing the database |
| `--confirm` / `-y` | Skip the confirmation prompt |
| `--force` | Allow the reset when `APP_ENV=production` |
| `--seed` | Run the default seeder after resetting |
| `--demo` | Run the demo seeder after resetting |

Never run a production reset without checking the backup and reset scope.

### `migrate:urls`

Migrate URLs in database content when `APP_URL` changes or external URLs need replacing. Two modes are available:

**Base-path mode (default):** Scans a fixed set of content columns (post bodies, product descriptions, menu URLs, SEO canonical URLs, redirects, newsletter/automation HTML) for old basepath references and replaces them.

**Full URL mode (`--full-migration`):** Scans **all** string/text columns across the entire database and performs a direct string replacement. This is useful when migrating external links (e.g. changing `https://old-domain.com` to `https://new-domain.com`).

```bash
# Base-path mode
php vale migrate:urls --from=/old --to=/new
php vale migrate:urls --from= --to=/vale     # From root to subdirectory
php vale migrate:urls --from=/vale --to=      # From subdirectory to root

# Full URL mode (requires --full-migration flag)
php vale migrate:urls --from=https://old.com --to=https://new.com --full-migration --dry-run
php vale migrate:urls --from=https://old.com --to=https://new.com --full-migration -y
```

| Option | Description |
|---|---|
| `--from=<url>` | **(Required)** Old URL or basepath (e.g. `/vale`, `https://old.com`) |
| `--to=<url>` | **(Required)** New URL or basepath (e.g. `/cms`, `https://new.com`) |
| `--full-migration` | **Required** when `--from` or `--to` contains `http://` or `https://`. Enables full URL replacement mode which scans all text columns across the database |
| `--dry-run` | Preview changes without updating the database |
| `--yes` / `-y` | Skip confirmation prompt |

::: warning Full URL mode is broad
`--full-migration` scans every string, text, and JSON column in the database. Always run with `--dry-run` first to review the scope of changes before applying them.
:::

### `db:optimize`

Prune old data and run `OPTIMIZE TABLE` to reclaim space and improve query performance.

```bash
php vale db:optimize [options]
```

| Option | Description |
|---|---|
| `--all` / `-a` | Run all optimisation tasks |
| `--revisions` / `-r [=N]` | Prune revisions, keeping the N most recent per item (default: 10) |
| `--content-type` / `-c <slug>` | Limit revision pruning to one content type (e.g. `--content-type=post`); omit to prune all types. Unknown slugs quietly prune nothing |
| `--spam` / `-s` | Delete spam comments |
| `--trash` / `-t` | Permanently delete trashed content |
| `--orphaned-meta` / `-m` | Remove orphaned meta records |
| `--orphaned-media-files` | Delete media records where the physical file is missing on disk |
| `--orphaned-media-unused` | Delete media records not referenced in any content (also deletes the file) |
| `--pageviews` / `-p [=N]` | Delete pageview logs older than N days |
| `--optimize-tables` / `-o` | Run `OPTIMIZE TABLE` on all key tables |
| `--dry-run` | Preview what would be deleted without making changes |

::: warning Media deletion is explicit-only
The two media options (`--orphaned-media-files` and `--orphaned-media-unused`) are **never** executed by a default or `--all` run; you must pass each flag explicitly. When triggered, both options remove the original file plus all generated variants.

`--orphaned-media-files` additionally **spares records that are still referenced by content**. Those are listed as kept instead: restore the missing file and the page keeps working; the record is only deleted when nothing references it anymore.
:::

---

## Cache

### `cache:clear`

Clear application caches.

```bash
php vale cache:clear [type]
```

`type` can be: `pages`, `data`, `views`, `container`, or `all` (default: `all`)

| Type | Clears |
|---|---|
| `pages` | Full-page HTML cache (files + PageCache object flush) |
| `data` | Query-result and object caches |
| `views` | Compiled Twig templates |
| `container` | Compiled DI container |
| `all` | Everything above |

When clearing `pages` or `all`, the command also flushes the `PageCache` object in addition to deleting cached HTML files. This ensures the in-memory state is consistent with the filesystem.

A manual clear is the fallback, not the normal path: content changes invalidate the affected pages on their own. The full list of invalidation surfaces is documented under [Page Cache](../../developer/page-cache).

Options: `--dry-run`

### `cache:warm`

Pre-generate caches for faster first-page-load in production.

```bash
php vale cache:warm [type]
```

`type` can be: `container`, `views`, or `all` (default: `all`)

Options: `--dry-run`

---

## Plugins

Site-specific drop-in extensions living in `content/plugins/` and `content/mu-plugins/`. See [Plugins](../../developer/plugins) for the manifest format and the available extension points.

### `plugin:list`

Lists every installed plugin with its version, required Vale version, activation state and last recorded error.

```bash
php vale plugin:list
```

### `plugin:enable`

Activates an installed plugin. Refuses plugins whose directory or manifest is missing, or whose `requires_vale` / `requires_php` does not match this installation.

```bash
php vale plugin:enable acme-tax
php vale plugin:enable acme-tax --dry-run
```

### `plugin:disable`

Deactivates a plugin without deleting its files or its settings. This also works when a broken plugin keeps the admin panel from opening.

```bash
php vale plugin:disable acme-tax
```

### `plugin:migrate`

Runs the pending database migrations a plugin ships in `content/plugins/<slug>/migrations/`. Migrations also run automatically when a plugin is activated and on every cron run; use this command after deploying updated plugin files, or to retry a failed migration.

```bash
php vale plugin:migrate --dry-run      # list pending migrations
php vale plugin:migrate                # every enabled plugin
php vale plugin:migrate acme-tax       # one plugin
```

A failing migration is reported with its file name and stays pending, so you can fix it and run the command again.

If a migration declares a `down` step, it can be reverted:

```bash
php vale plugin:migrate --rollback acme-tax --dry-run   # show what would be reverted
php vale plugin:migrate --rollback acme-tax             # newest migration only
php vale plugin:migrate --rollback --all acme-tax       # every applied migration, newest first
```

Rollback is always explicit — deactivating a plugin keeps its tables. A migration without a `down` step cannot be reverted automatically and stays recorded.

To switch off **every** plugin at once — including must-use drop-ins — create `content/plugins/.disabled`, or start the process with `VL_DISABLE_PLUGINS=1`. Remove the file (or the variable) to re-enable them.

---

## Backups

### `backup:create`

Create a full backup (database dump + media files).

```bash
php vale backup:create
```

| Option | Description |
|---|---|
| `--quick` | Skip `vendor/` and `node_modules/` to speed up the backup |
| `--dry-run` | Show what would be backed up without writing files |

### `backup:list`

List all available backups with their date and size.

```bash
php vale backup:list
```

### `backup:delete`

Delete a specific backup.

```bash
php vale backup:delete <backup>
```

`<backup>` is the backup name or path. Options: `--dry-run`

### `backup:restore-all`

Restore a full backup (files + database).

```bash
php vale backup:restore-all [backup]
```

The backup name or directory is optional; if omitted, Vale uses the most recent backup. Use `--dry-run` to preview the restore.

### `backup:restore-db`

Restore only the database from a backup.

```bash
php vale backup:restore-db [backup]
```

### `backup:restore-files`

Restore only the uploaded media files from a backup.

```bash
php vale backup:restore-files [backup]
```

::: tip Automated backups
Schedule `backup:create` via cron for automatic protection. Combine with `--quick` for frequent lightweight snapshots and a weekly full backup without `--quick`. Store backups off-server (S3, Dropbox) for disaster recovery.
:::

---

## Updates

### `update:check`

Check the remote update manifest for a new Vale version.

```bash
php vale update:check
```

| Option | Description |
|---|---|
| `--apply` | Download and apply the update if one is available |
| `--force` | Apply the update even if no newer version is found |
| `--backup` | Create a full backup of the current installation (without applying an update) |
| `--rollback[=DIR]` | Roll back to the backup in DIR (or the most recent backup) |

::: tip
A backup is created automatically when you use `--apply`. Use `--backup` only if you want an extra manual snapshot before running the update.
:::

---

## Users

### `user:create`

Create a new user. Supports both interactive and non-interactive modes:

```bash
# Interactive
php vale user:create

# Non-interactive (CI/CD, scripts)
php vale user:create --name="John Doe" --email=john@example.com --password=secret --role=admin
```

| Option | Description |
|---|---|
| `--name` | User name |
| `--email` | User email |
| `--password` | User password |
| `--role` | User role: super_admin, admin, editor, author, subscriber (default: admin) |
| `--dry-run` | Show what would be created without writing to the database |

### `user:activate`

Activate or deactivate a user account. Omitting `--email` prompts for it interactively.

```bash
# Activate (default)
php vale user:activate --email=user@example.com

# Deactivate
php vale user:activate --email=user@example.com --deactivate

# Interactive: the command asks for the email
php vale user:activate
```

| Option | Description |
|---|---|
| `--email` | User email address (prompted interactively when omitted) |
| `--deactivate` | Deactivate instead of activate |
| `--dry-run` | Show what would change without updating the database |

### `user:set-role`

Replace all existing roles for a user with a single role.

```bash
php vale user:set-role --email=user@example.com --role=editor
```

| Option | Description |
| |---|
| `--email` | User email address |
| `--role` | Role slug (e.g. super_admin, admin, editor, author, subscriber) |
| `--dry-run` | Show which role would be assigned without writing to the database |

### `user:reset-password`

Reset a user's password.

```bash
php vale user:reset-password [--email=<email>]
```

Options: `--dry-run` (validates the new password and shows the target user without changing anything)

### `user:delete`

Delete a user by email.

```bash
# Interactive (asks for confirmation)
php vale user:delete

# Using email
php vale user:delete --email=user@example.com

# Permanent delete
php vale user:delete --email=user@example.com --force
```

| Option | Description |
|---|---|
| `--email` | User email address |
| `--force` | Permanently delete without confirmation |
| `--dry-run` | Show whether the user would be permanently deleted or anonymized, without changing anything |

::: tip Default behavior
Without `--force`, the account is **anonymized** (name becomes "Deleted User", email is replaced with a random address, and all personal data is cleared). The user's order history is preserved. This is the same behavior as the "Delete Account" option in the front-end account settings.
:::

::: warning Hard delete
Use `--force` only when you want to permanently remove the user and all associated data without keeping any records.
:::

::: tip CLI-created users are verified
Users created with `user:create` are automatically marked **active** and **email-verified**, so they can log in immediately; no verification email is sent.
:::

### `role:list`

List all roles with user and permission counts. Useful for finding valid role slugs before running `user:create --role=...` or `user:set-role`.

```bash
php vale role:list
```

```text
+----+--------------+--------------+--------+-------+-------------+-------------------------------+
| ID | Slug         | Name         | System | Users | Permissions | Description                   |
+----+--------------+--------------+--------+-------+-------------+-------------------------------+
| 1  | super_admin  | Super Admin  | yes    | 1     | 30          | Full system access            |
| 2  | admin        | Admin        | yes    | 0     | 30          | Site administration           |
| 3  | editor       | Editor       | yes    | 0     | 0           | Content management            |
| ...                                                                            |
+----+--------------+--------------+--------+-------+-------------+-------------------------------+
```

---

## Media

### `media:scan`

Scan the uploads directory and register any files that exist on disk but are not in the media library. Useful after bulk-uploading files via FTP or S3 sync. Missing thumbnail and WebP renditions are regenerated automatically; see [Media Management](../content/media) for how renditions work.

```bash
php vale media:scan
```

| Option | Description |
|---|---|
| `--user` / `-u` | ID of the user to assign as the owner of the scanned files. Optional — when omitted, the first `super_admin` is used, then the first `admin`, then the oldest user account |
| `--dry-run` | Preview without changes: lists files that *would* be added and records that *would* be updated (missing variants detected) |
| `--no-organize` | Do **not** move files into `YYYY/MM/` folders; register them at their current location (including the `uploads/` root) so existing paths are never changed |

**Who owns a scanned file:** every media record stores an owner (`media.user_id`, a required foreign key to the user table), so Vale always needs an existing account to attach the file to. Without `--user` it resolves one automatically in the order above; pass `--user=<id>` to attribute a bulk upload to a specific person. When the site has no user account at all, the command stops with an error instead of inserting rows it cannot own. The importers follow the same rule for the media they create.

**File organisation:**

- Files placed inside an existing subdirectory (e.g. `uploads/myFolder/foto.jpg`) stay in place; only their database record is created.
- Files placed directly in the root of `uploads/` (e.g. `uploads/foto.jpg`) are automatically moved into a `YYYY/MM/` subdirectory (e.g. `uploads/2026/07/foto.jpg`) to prevent flat accumulation, similar to how WordPress organises uploads on import.
- Use `--no-organize` to skip all moving. Each file is registered exactly where it is found on disk, including the root. This is useful when you have already arranged your files manually (or rely on external symlinks/syncs) and only want to register them in the media library without altering any paths. Thumbnails are still generated next to each file.

**Thumbnail handling:**

The scanner only registers original images; thumbnails and WebP variants are generated alongside them. See [Media Management](../content/media#how-thumbnails-are-stored) for details.

**WebP handling:**

- When **Convert images to WebP** is enabled, each registered image also gets WebP renditions.
- A standalone `.webp` file whose original is gone is treated as an orphaned conversion and is *not* re-registered as its own media record.

```bash
php vale media:scan --user=1 --no-organize
```

```bash
php vale media:scan --dry-run
```

### `media:webp-remove`

Remove the auto-generated WebP renditions created by the CMS, falling every image back to its original format.

This command only runs while **Convert images to WebP** is turned **off** in [Settings](../settings/) → [Content](../settings/content). If the setting is still enabled the command aborts with an error; turn it off first, run this to clean up existing `.webp` files, then re-enable it if you only wanted to stop future conversions.

**WebP files you uploaded yourself are never touched.**

```bash
php vale media:webp-remove
```

| Option | Description |
|---|---|
| `--dry-run` | Preview without changes: lists each record that *would* be updated and the files that *would* be deleted |

---

## Import

Vale can import content from WordPress and Ghost (posts, pages, products, media, users, categories, tags, and SEO metadata), and products from Shopify, Etsy, eBay, and Amazon.

### `import:wordpress`

Import content from WordPress. Supports three modes: **WXR (XML) export**, **live database connection**, and **SQL dump file**.

```bash
php vale import:wordpress --file=export.xml                             # WXR mode
php vale import:wordpress --wp-db=wordpress --wp-user=root              # Live DB mode
php vale import:wordpress --db-dump=wordpress.sql                       # SQL dump mode
```

| Option | Description |
|---|---|
| `--file=<path>` | Path to a WordPress WXR (XML) export file |
| `--wp-db=<name>` | WordPress database name (live connection) |
| `--wp-user=<user>` | WordPress database user |
| `--wp-pass=<pass>` | WordPress database password |
| `--wp-host=<host>` | WordPress database host (default: `127.0.0.1`) |
| `--wp-port=<port>` | WordPress database port (default: `3306`) |
| `--wp-prefix=<prefix>` | WordPress table prefix (default: `wp_`) |
| `--db-dump=<path>` | Path to a WordPress SQL dump file |
| `--media-path=<dir>` | Path to `wp-content/uploads` for local media copy |
| `--import-media` | Import media files (requires `--media-path` or `--download-media`) |
| `--download-media` | Download media files from URLs (DB and WXR modes). Thumbnails and WebP variants are generated automatically after the import |
| `--allow-private-hosts` | Allow media downloads from private/internal addresses, required when the source WordPress runs on `localhost` or a LAN IP (refused by default) |
| `--cleanup` | Drop WordPress source tables after import (live DB mode only, with confirmation) |
| `--cleanup-vale` | Drop WP-prefixed tables from Vale's database (auto-runs for `--db-dump`) |
| `--fix-slugs` | Fix non-compliant slugs already in the database (auto-sanitized during import) |
| `--dry-run` | Preview changes without writing to the database |
| `--post-types=<types>` | Comma-separated list of additional post types to import |

**Imported data:** users, categories, tags, custom terms, posts, pages, products, newsletter subscribers (MailPoet), media, SEO metadata (Yoast / Rank Math), post relationships (parent/child).

For a complete walkthrough, see [Migrating from WordPress](../migration/migrate-from-wordpress).

### `import:ghost`

Import content from a Ghost JSON export file.

```bash
php vale import:ghost --file=ghost.json
php vale import:ghost --file=ghost.json --download-media --ghost-url=https://my-old-blog.com
```

| Option | Description |
|---|---|
| `--file=<path>` | **(Required)** Path to a Ghost JSON export file |
| `--download-media` | Download feature/OG/inline images (including `srcset` responsive variants), register them in the media library and rewrite post HTML to local `/uploads/…` paths |
| `--ghost-url=<url>` | Base URL of the source Ghost site (resolves relative `/content/images/` URLs) |
| `--dry-run` | Preview changes without writing to the database |

**Imported data:** authors, tags, posts (with HTML body, excerpt, feature image, SEO metadata, and publishing dates). With `--download-media`, images are fetched into the media library and thumbnails/WebP variants are generated automatically.

For a complete walkthrough, see [Migrating from Ghost](../migration/migrate-from-ghost).

### `import:shopify`

Import products from a Shopify product export CSV. Rows sharing the same Shopify **Handle** become variations of one variable product; already imported products are skipped.

```bash
php vale import:shopify --file=products.csv
php vale import:shopify --file=products.csv --dry-run
```

| Option | Description |
|---|---|
| `--file=<path>` | **(Required)** Path to a Shopify products CSV file |
| `--import-media` | Download product/variant images into the media library |
| `--dry-run` | Preview the import without writing to the database (image downloads are skipped) |

### `import:etsy`

Import products from an Etsy listings CSV export. Each listing becomes a simple product.

::: warning
Etsy listings exports carry a **single price per listing**; per-variation prices cannot be imported. Adjust them in the product editor after import when variations differ in price.
:::

```bash
php vale import:etsy --file=listings.csv
php vale import:etsy --file=listings.csv --dry-run
```

| Option | Description |
|---|---|
| `--file=<path>` | **(Required)** Path to an Etsy listings CSV file |
| `--import-media` | Download product images into the media library |
| `--dry-run` | Preview the import without writing to the database (image downloads are skipped) |

### `import:ebay`

Import products from an eBay listings CSV export, grouped by item number with parent/child variation support.

```bash
php vale import:ebay --file=listings.csv
php vale import:ebay --file=listings.csv --dry-run
```

| Option | Description |
|---|---|
| `--file=<path>` | **(Required)** Path to an eBay listings CSV file |
| `--import-media` | Download product/variant images into the media library |
| `--dry-run` | Preview the import without writing to the database (image downloads are skipped) |

### `import:amazon`

Import products from an Amazon inventory report (CSV, TXT, XLSM, or XLSX). Supports English and German headers and parent/child variations; already imported SKUs are skipped.

```bash
php vale import:amazon --file=inventory.xlsx
php vale import:amazon --file=inventory.xlsx --dry-run
```

| Option | Description |
|---|---|
| `--file=<path>` | **(Required)** Path to an Amazon inventory report file |
| `--import-media` | Download product images (if URLs are present in the report) |
| `--dry-run` | Preview the import without writing to the database (image downloads are skipped) |

For all marketplace importers, `--dry-run` runs the full import logic inside a database transaction and rolls it back at the end, so the reported product, variant, and skip counts reflect what a live import would do.

For details on what each importer maps, see [Products → Import Products from Marketplaces](../ecommerce/products#import-products-from-marketplaces).

### `import:products`

Import products from a Vale product CSV file. Supports all product fields, variations (as JSON), category resolution by ID or slug, and optional image downloads.

```bash
php vale import:products --file=products.csv
php vale import:products --file=products.csv --dry-run
php vale import:products --file=products.csv --import-media --update-existing
```

| Option | Description |
|--------|-------------|
| `--file=<path>` | **(Required)** Path to a Vale products CSV file |
| `--import-media` | Download product/variant images from URLs into the media library |
| `--update-existing` | Update existing products matched by slug instead of skipping them |
| `--dry-run` | Preview the import inside a transaction without writing to the database |

Download the template from **[Settings](../settings/) → [E-Commerce](../settings/ecommerce) → [Import](../settings/ecommerce#import)** tab, or export a single product from the product edit page for a starting point.

### `export:products`

Export products to a CSV file.

```bash
php vale export:products
php vale export:products --output=my-products.csv --status=published
```

| Option | Description |
|--------|-------------|
| `--output` / `-o` | Output file path (default: `products-{date}.csv`) |
| `--status` | Filter by status: `published`, `draft`, or `all` (default: `all`) |
| `--dry-run` | Show how many products match the filters without writing a file |

The CSV includes all product fields plus a `variations` column containing a JSON array of variation objects.

---

## Export / Import

Vale can export its entire site data (Posts, Pages, Products, Orders, Users, Categories, Tags, SEO metadata, Settings, Media, Content Types, Menus, Comments, Forms, Coupons, Redirects, Tax Rates, and Membership Plans) as JSON or ZIP for migration to another Vale instance.

### `export`

Export site data to a file.

```bash
php vale export
```

By default, exports all supported types to a timestamped JSON file (e.g., `export-2026-07-08-120000.json`).

| Option | Description |
|---|---|
| `--type` / `-t` | Export only specific type(s): `pages`, `posts`, `products`, `orders`, `users`, `categories`, `tags`, `seo_meta`, `site_settings`, `media`, `content_types`, `menus`, `comments`, `forms`, `coupons`, `redirects`, `tax_rates`, `membership_plans`. Repeat for multiple types (e.g., `-t pages -t posts`) |
| `--output` / `-o` | Output file path. Use a `.zip` extension to create a ZIP archive instead of a JSON file |
| `--dry-run` | Show the record count per type and the target file without writing anything |
| `--include-secrets` | Include secret settings (API keys, payment secrets) in the export file. By default, secrets are stripped from the export |

### `import`

Import site data from a previously exported file.

```bash
php vale import --file=export.json
php vale import --file=export.zip
```

| Option | Description |
|---|---|
| `--file` | **(Required)** Path to the JSON or ZIP export file |
| `--dry-run` | Preview what would be imported without writing to the database |
| `--include-secrets` | Also import secret settings (API keys, payment secrets). By default, secret settings are skipped and must be re-entered on the target instance |

The import preserves relational integrity via an **ID remapping engine**: source IDs are mapped to target IDs during import so that entity relationships (e.g., post author, featured image, product category) remain intact.

**Import ordering:** content_types → users → media → categories → tags → pages → posts → products → comments → menus → forms → coupons → tax_rates → membership_plans → redirects → orders → seo_meta → site_settings.

::: warning Media files are not included
The export contains media **database rows only**, not the files themselves. After import, copy the uploads directory to the target server and run `php vale media:scan` (or use **Settings → Maintenance → Data → Rescan Media**).
:::

::: tip Secret settings are skipped by default
API keys, payment secrets, SSO credentials, and similar sensitive settings are **not** overwritten on import. Re-enter them on the target instance, or pass `--include-secrets` to import them anyway.
:::

During import, absolute URLs pointing at the old site's domain are automatically rewritten to the target site's domain in post bodies and product descriptions. For base-path moves (e.g. `/vale` → `/`), run `migrate:urls` afterwards.

---

## Cron

### `cron:run`

Run all scheduled background tasks. Set this up as a system cron job; it must run every minute.

```bash
php vale cron:run
```

**System crontab entry:**
```bash
* * * * * php /var/www/vale/vale cron:run >> /dev/null 2>&1
```

Tasks dispatched by cron:
- Scheduled post and product publishing
- Post/page expiry and scheduled URL swaps (`posts_expired` / `swaps_processed` in the run summary)
- Newsletter campaign sending (one batch chunk per campaign per run; see below)
- Automation step processing
- Abandoned cart recovery emails
- Subscription reconciliation and trial expiry
- Exchange rate refresh
- Analytics data retention pruning
- Update manifest check

Newsletter campaigns send in chunks: each `cron:run` picks up every `queued`/`processing` campaign and dispatches a single chunk sized by **Settings → Mail → Max Batch Chunk Size** (capped per driver). Large lists therefore complete over multiple minute-cycles, and the `campaigns_sent` counter in the run summary counts processed chunks, not finished campaigns.

::: tip FEATURE FLAGS
Each task only runs when its feature is enabled: `blog_enabled` (scheduled posts), `shop_enabled` (scheduled products, exchange rates, abandoned carts), `newsletter_enabled` (campaigns & automations), `subscriptions_enabled` (reconciliation, trial expiry), and `analytics_enabled` (retention pruning). These feature flags correspond to the toggles in **[Settings](../settings/) → [General](../settings/general) → [Features](../settings/general#features)**. The update check additionally respects the **Enable software updates** master switch in [Settings](../settings/) → [Maintenance](../settings/maintenance#updates-backups): when it is off, no automatic checks or auto-applies happen, even with `--force-update`.
:::

| Option | Description |
|---|---|
| `--force-rates` | Force an exchange rate refresh regardless of schedule (still requires shop + a configured FX provider) |
| `--force-update` | Force an update manifest check regardless of schedule (ignored when the **Enable software updates** master switch is off) |
| `--clean-cache` | Run cache pruning as part of this cron run |
| `--prune-revisions[=N]` | Prune old revisions across **all** content types: posts, pages and custom post types, keeping the latest N per item (default: 10) |
| `--dry-run` | Preview due jobs without executing them; shows how many campaigns, automation emails, scheduled posts/products are pending, plus cache and revision counts when the corresponding flags are passed |

::: tip SEE ALSO
[Updates & Backups](./updates): GUI-based backup and update management.
- [Settings](../settings/) → [Maintenance](../settings/maintenance): system updates, backups tooling, cache and cron.
:::
