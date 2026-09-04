# Maintenance Settings

System-level tools for updates, data portability, scheduled tasks, cache, media, and database optimization.

## Software Updates

Vale can automatically check for new releases via the cron job every 24 hours.

- **Enable software updates**: Master switch for the update system. When off, cron will never check for or install updates — even with a forced run. Manual checks from the [Updates](../system/updates) page remain available. *(On by default)*
- **Automatic update checks**: When cron runs, check for new Vale releases every 24 hours. *(On by default)*
- **Automatically apply updates**: When an update is available, install it automatically during the next cron run. A backup is created first. *(Off by default; disabled unless update checks are on)*

A **Go to Updates** button links to the [Updates](../system/updates) page, showing the available version badge if one exists.

::: warning Auto-Apply
Auto-apply will overwrite files and run migrations automatically. Ensure backups are enabled and tested before enabling this option.
:::

## Data Export / Import

Export your site content to a JSON file or import it from another Vale instance.

### Export

Select the content types to include:

| Type | Description |
|------|-------------|
| Pages, Posts, Products, Orders, Users | Core content |
| Categories, Tags | Taxonomies |
| SEO Meta | Per-content SEO data |
| Site Settings | Configuration values |
| Media | Uploaded files |

Choose **JSON** format (always available) or **ZIP** (requires `ext-zip` PHP extension). The download starts immediately.

For a quick product-only export in CSV format, use the **Export CSV** link on any product edit page, or run:

```bash
php vale export:products
```

### Import

Upload a JSON or ZIP file exported from another Vale instance:

- **Dry Run**: Test what would be imported without actually saving.
- Existing records with the same slug/email are skipped (not overwritten).
- A warning is shown for large datasets, recommending the CLI tool:

```bash
php vale import --file=your-file.json
```

::: warning
Import will not overwrite existing records with the same slug/email — they will be skipped.
:::

## Scheduled Tasks (Cron)

Vale can run scheduled campaigns, automation emails, post/product publishing, and exchange-rate refreshes automatically.

### Cron Modes

| Mode | Description |
|------|-------------|
| **Disabled** | No automatic scheduling. Run jobs manually or via CLI. |
| **Page-load (pseudo-cron)** | Jobs run after a visitor page request, at most once per interval. No server configuration needed. Not suitable for time-critical tasks. |
| **HTTP endpoint** | An external cron service calls a secure URL to trigger jobs. |

**Run interval** (page-load mode): Every 1, 5, 15, 30, or 60 minutes.

**HTTP endpoint mode** provides:
- A unique cron URL with secret token to call from external services (e.g., cron-job.org, EasyCron)
- Copy button for the URL
- Secret token regeneration (invalidates the old URL)

The endpoint is rate-limited against token guessing. To keep the secret out of access logs and `Referer` headers, you may pass it in a header instead of the query string:

```
Authorization: Bearer <cron_secret>
X-Cron-Token: <cron_secret>
```

**CLI / SSH** (always available):
```bash
php vale cron:run
```
Add to system crontab: `* * * * * php /var/www/php vale cron:run >> /var/log/vl-cron.log 2>&1`

### Manual Run

Click **Run Now** to trigger all jobs immediately. Results show counts for:
- Campaigns sent, automations sent
- Posts published, products published
- Subscriptions reconciled, trials expired
- Abandoned cart emails sent
- Exchange rates updated, update check result

### Last Run

Displays when cron last ran. Updated automatically after manual or scheduled runs.

## Cache

Cached database queries, API responses, compiled Twig templates, and HTML pages served to visitors. Shows total file count and size.

| Action | Description |
|--------|-------------|
| **Clear Page Cache** | Removes all cached HTML files. Next request to each URL regenerates the cache. |
| **Clear Data Cache** | Removes query-result and object caches. Useful after bulk data changes. |
| **Warm Cache** | Pre-compiles the dependency container and Twig templates, then warms the configured view cache. |
| **Rebuild Application Container** | Clears the old application cache used to load services and rebuilds it. Use this when an update has completed but the admin still appears to be running an older version. |

The compiled dependency container is stored separately from page, data, and Twig caches. Clearing those caches does not remove an outdated container. The rebuild action is intentionally combined into one operation so the container is not left empty between requests.

Vale's built-in updater clears the page, data, Twig, and application caches automatically after a successful update, so you normally do not need to run this manually. If the site still shows old behavior after an update, use **Rebuild Application Container** and restart Apache or PHP-FPM if PHP OPcache is enabled.

The equivalent CLI commands are:

```bash
php vale cache:clear container
php vale cache:warm container
```

## Media

Scan the upload directory for unregistered files and add them to the media library.

- **Rescan Media**: Scans for new files and registers them. The scan is also self-healing — existing media records are checked for missing size thumbnails, and when [Convert images to WebP](./content#media-optimization) is enabled, missing WebP conversions and their size variants are generated. Records whose original file is missing on disk are skipped.
- **Do not organize files**: When checked, files are not moved into date-based folders.

Results show scan completion status and a summary (`X scanned, Y added, Z updated`).

## Revisions

Old content revisions stored in the database. Shows current revision count.

- **Prune Revisions**: Keep the latest N revisions per post (options: 3, 5, 10, 25, 50) and delete the rest.

## Database Optimization

Clean up orphaned data and optimize database tables. Shows counts for each category.

| Operation | Description |
|-----------|-------------|
| **Delete spam comments** | Permanently removes comments marked as spam |
| **Delete trashed comments** | Permanently removes comments in the trash |
| **Clean orphaned post meta** | Removes metadata entries with no parent post |
| **Delete orphaned media files** | Removes DB records for media files missing on disk |
| **Delete unused media** | Removes media not referenced in any content |
| **Purge old pageviews** | Deletes pageview logs older than N days (configurable) |
| **Optimize database tables** | Runs `OPTIMIZE TABLE` on key tables (MySQL) or `VACUUM` (PostgreSQL/SQLite) |

Use **Run all operations** to execute everything at once, or select individual operations.

::: warning Media deletion requires explicit selection
The two media operations (**Delete orphaned media files** / **Delete unused media**) only run when their own checkbox is selected — they are never triggered by leaving the form at its defaults. When they run, the original file **plus every generated variant** (`-small`, `-medium`, `-large`, WebP copies) is removed together with the record.

**Delete orphaned media files** spares records that are still referenced by content — those are reported as `kept (still referenced by content — restore the files)` in the result message. Restore the missing file and the page keeps working; the record is only deleted when nothing references it anymore.
:::

### Clear redirect table

When **Enable SEO System** is on (**Settings → SEO → General**), an additional action appears below the database optimization form:

| Action | Description |
|--------|-------------|
| **Clear redirect table** | Permanently deletes **all** 301/302 redirect rules stored in the database (automatic and manual). Shows the current rule count. Requires confirmation. |

This is independent of **Run all operations** — it does not run as part of that batch. Use it to reset redirect rules after URL migrations or testing. Automatic redirects will be recreated when slugs or prefixes change again (if automatic redirects are enabled).

::: warning
Clearing the redirect table cannot be undone. Old URLs will stop redirecting until new rules are created.
:::

::: tip SEE ALSO
- [SEO Redirects](./seo#redirects) — automatic and manual redirect rules.
- [Updates & Backups](../system/updates) for detailed update and backup procedures.
- [CLI Commands](../system/cli) for command-line maintenance.
:::
