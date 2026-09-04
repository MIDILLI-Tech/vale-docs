# Migrating from Vale to Vale

Vale can export its entire site and import it into another Vale instance, useful for moving between servers, creating staging environments, or migrating from a local development setup to production.

::: tip Why Vale makes server moves painless
No voodoo, no downtime guessing games. With **one command** your whole site (content, shop, media, SEO settings) travels between servers with relational integrity intact and links that keep working.
:::

## How It Works

1. **Export** your source site via the admin panel or CLI.
2. **Import** the exported file into your target Vale installation.

The system preserves all relational links (authors, categories, featured images, product associations, etc.) automatically during import.

### What Gets Exported

- Posts, Pages, Products, Orders
- Users, Categories, Tags
- SEO metadata and site settings
- Media library entries (database rows only; files must be copied separately, see below)
- Content types, Menus, Comments, Forms, Coupons, Redirects, Tax rates, Membership plans

## Export

### Via Admin Panel

Go to **[Settings](../settings/) → [Maintenance](../settings/maintenance) → [Data Export / Import](../settings/maintenance#data)** and click **Export**. The file downloads automatically.

### Via CLI

```bash
php vale export -o my-site-export.zip
```

See [CLI Export/Import](../system/cli#export-import) for all options (`--type`, `--output`, `--include-secrets`).

::: warning Secret settings are stripped by default
Export files omit secret settings (API keys, payment secrets, SSO credentials) unless you pass `--include-secrets` (CLI) or tick **Include secrets in export file** (admin panel). The same opt-in applies on import (`--include-secrets`), so secrets only transfer when both sides explicitly allow it. Note the file still contains user password hashes; treat it as sensitive data.
:::

## Import

### Via Admin Panel

Go to **[Settings](../settings/) → [Maintenance](../settings/maintenance) → [Data Export / Import](../settings/maintenance#data)**, upload your exported JSON or ZIP file, and click **Import**.

### Via CLI

```bash
php vale import --file=my-site-export.zip
```

Use `--dry-run` to preview the import without writing to the database.

::: warning Media files are not included
The export contains media **database rows only**, not the files themselves. After import, copy the uploads directory to the target server and run `php vale media:scan` (or use **Settings → Maintenance → Data → Rescan Media**).
:::

::: tip Secret settings are skipped by default
API keys, payment secrets, SSO credentials, and similar sensitive settings are **not** overwritten on import. Re-enter them on the target instance, or pass `--include-secrets` to import them anyway:

```bash
php vale import --file=my-site-export.zip --include-secrets
```
:::

::: tip Passwords are preserved
Unlike migrations from other platforms (WordPress, Ghost, etc.), Vale→Vale migration carries over user passwords. Existing users can sign in with their current passwords, with no reset needed. Note that the exported file contains sensitive data, so treat it carefully.
:::

## After Import: URLs

Absolute URLs pointing at the old site's domain are automatically rewritten to the new domain in post bodies and product descriptions during import.

### Fix Base-Path URLs

Moving servers (or into a subdirectory) often changes your site's base path. If your old site lived at `https://old-host.com/vale` and the new one at `/`, or vice versa, embedded links and image paths still point at the old location.

Fix every occurrence in one go with `migrate:urls`:

```bash
# Old path was /vale, new site is at the root
php vale migrate:urls --from=/vale --to=

# Moving from root into a /vale subdirectory
php vale migrate:urls --from= --to=/vale
```

The command rewrites `src` and `href` references across post bodies, product descriptions, menu URLs, SEO canonical URLs, redirects, and newsletter/automation HTML, then clears the cache so the change takes effect immediately. Run it with `--dry-run` first to preview, and use `--yes` to skip the confirmation prompt in scripts.

See [CLI Commands → `migrate:urls`](../system/cli#migrate-urls) for all options.

## See Also

- [Updates & Backups → Data Portability](../system/updates#data-portability)
- [CLI Commands → Export/Import](../system/cli#export-import)
