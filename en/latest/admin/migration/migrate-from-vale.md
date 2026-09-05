# Migrating from Vale to Vale

Vale can export its entire site and import it into another Vale instance — useful for moving between servers, creating staging environments, or migrating from a local development setup to production.

::: tip Why Vale makes server moves painless
No voodoo, no downtime guessing games. With **one command** your whole site — content, shop, media, SEO settings — travels between servers with relational integrity intact and links that keep working.
:::

## How It Works

1. **Export** your source site via the admin panel or CLI.
2. **Import** the exported file into your target Vale installation.

The system preserves all relational links (authors, categories, featured images, product associations, etc.) through an **ID remapping engine** that automatically translates source IDs to target IDs during import.

### What Gets Exported

- Posts, Pages, Products, Orders
- Users, Categories, Tags
- SEO metadata and site settings
- Media library entries

## Export

### Via Admin Panel

Go to **Settings → Advanced → Maintenance → Data Portability** and click **Export**. The file downloads automatically.

### Via CLI

```bash
php vale export -o my-site-export.zip
```

See [CLI Export/Import](../system/cli#export-import) for all options (`--type`, `--output`).

## Import

### Via Admin Panel

Go to **Settings → Advanced → Maintenance → Data Portability**, upload your exported JSON or ZIP file, and click **Import**.

### Via CLI

```bash
php vale import --file=my-site-export.zip
```

Use `--dry-run` to preview the import without writing to the database.

::: tip Passwords are preserved
Unlike migrations from other platforms (WordPress, Ghost, etc.), Vale→Vale migration **carries over user password hashes**. Because both sites use the same bcrypt hashing, existing users can sign in with their current passwords — no reset needed. Note that the exported file contains these password hashes, so treat it like any other sensitive data.
:::

## After Import: Fix Base-Path URLs

Moving servers (or into a subdirectory) often changes your site's base path. If your old site lived at `https://old-host.com/vale` and the new one at `/`, or vice versa, embedded links and image paths still point at the old location.

Fix every occurrence in one go with `migrate:urls`:

```bash
# Old path was /vale, new site is at the root
php vale migrate:urls --from=/vale --to=

# Moving from root into a /vale subdirectory
php vale migrate:urls --from= --to=/vale
```

The command rewrites `src` and `href` references across post bodies, product descriptions, menu URLs, SEO canonical URLs, redirects, and newsletter/automation HTML — then clears the cache so the change takes effect immediately. Run it with `--dry-run` first to preview, and use `--yes` to skip the confirmation prompt in scripts.

See [CLI Commands → `migrate:urls`](../system/cli#migrate-urls) for all options.

## See Also

- [Updates & Backups → Data Portability](../system/updates#data-portability)
- [CLI Commands → Export/Import](../system/cli#export-import)
