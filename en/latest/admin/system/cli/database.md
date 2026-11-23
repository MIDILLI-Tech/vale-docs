# Database Commands

Part of [CLI Commands](../cli).

Create and seed the schema, reset a development database, rewrite stored URLs after a move, and reclaim table space.

::: tip IN THE ADMIN PANEL
**Optimize database tables** is under **[Settings → Maintenance → Cleanup](../../settings/maintenance#cleanup)**. Migrations run automatically during installation and updates; `migrate`, `db:seed`, `db:reset` and `migrate:urls` are CLI-only.
:::

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

