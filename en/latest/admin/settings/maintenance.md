# Maintenance Settings

System-level tools for updates, data portability, scheduled tasks, cache, media, and database optimization.

## Updates & Backups

Vale can automatically check for new releases via the cron job every 24 hours.

- **Enable software updates**: Master switch for the update system. When off, cron will never check for or install updates, even with a forced run. Manual checks from the [Updates & Backups](../system/updates) page remain available. *(On by default)*
- **Automatic update checks**: When cron runs, check for new Vale releases every 24 hours. *(On by default)*
- **Automatically apply updates**: When an update is available, install it automatically during the next cron run. A backup is created first. *(Off by default; disabled unless update checks are on)*

The panel has two buttons: **Go to Updates**, which opens the [Updates & Backups](../system/updates) page (with the available version badge shown if one exists), and **Backups**, which opens that same page with the Backups tab already selected.

:::warning Auto-Apply
Auto-apply will overwrite files and run migrations automatically. Ensure backups are enabled and tested before enabling this option.
:::
## Scheduled Tasks (Cron)

Vale can run scheduled campaigns, automation emails, post/product publishing, and exchange-rate refreshes automatically.

A scheduled publish clears the same page cache as saving the item by hand: the home page, the blog or shop listing, the archives and the item's own page are dropped immediately, so visitors never keep seeing a stale listing until the cache expires.

### Cron Modes

| Mode | Description |
|------|-------------|
| **Disabled** | No automatic scheduling. Run jobs manually or via CLI. |
| **Page-load (pseudo-cron)** | Jobs run after a visitor page request, at most once per interval. No server configuration needed. Not suitable for time-critical tasks. |
| **HTTP endpoint** | An external cron service calls a secure URL to trigger jobs. |

**Run interval** (page-load mode): Every 1, 5, 15, 30, or 60 minutes.

**HTTP endpoint mode** provides:
- A unique cron URL with secret token to call from external services (the panel lists free cron services with one-click links)
- Copy button for the URL
- Secret token regeneration (invalidates the old URL)

The endpoint is rate-limited against token guessing. To keep the secret out of access logs, you may pass it in a request header instead of the query string (see the field help in the panel).

### CLI / SSH (always available)

::: tip FOR SYSADMINS
Run jobs from the terminal, or add the command to the system crontab for every-minute execution. See [CLI Commands](../system/cli) for setup details.
:::

### Manual Run

Click **Run Now** to trigger all jobs immediately. Results show counts for:
- Campaigns sent, automations sent
- Posts published, products published
- Subscriptions reconciled, trials expired
- Abandoned cart emails sent
- Exchange rates updated, update check result

### Last Run

Displays when cron last ran. Updated automatically after manual or scheduled runs.

::: tip External uptime monitoring
Cron only tells you jobs ran, it does not watch the site from the outside. Point an uptime monitor at the health endpoint (`/api/v1/health?deep=1`). See [External Monitoring](../../developer/deployment/docker#external-monitoring) in the deployment docs.
:::

## Cache

Cached database queries, API responses, compiled Twig templates, and HTML pages served to visitors. The total file count and size are computed on demand, click **Count** next to the metric (they are not scanned when the page opens, so a large cache never slows down Settings).

| Action | Description |
|--------|-------------|
| **Clear Page Cache** | Removes all cached HTML files. Next request to each URL regenerates the cache. |
| **Clear Data Cache** | Removes query-result and object caches. Useful after bulk data changes. |
| **Warm Cache** | Pre-compiles the dependency container and Twig templates, then warms the configured view cache. |
| **Rebuild Application Container** | Clears the old application cache used to load services and rebuilds it. Use this when an update has completed but the admin still appears to be running an older version. |

Vale's built-in updater clears caches automatically after a successful update, so you normally do not need to run this manually. If the site still shows old behavior after an update, use **Rebuild Application Container** and restart your PHP setup if script caching is enabled.

::: tip FOR SYSADMINS
The equivalent terminal commands are documented under [CLI Commands](../system/cli).
:::

## Data

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

Choose **JSON** format (always available) or **ZIP**. The download starts immediately.

For a quick product-only export in CSV format, use the **Export CSV** link on any product edit page.

::: tip FOR SYSADMINS
Product-only and full-site exports are also available from the terminal, see [CLI Commands](../system/cli).
:::

### Import

Upload a JSON or ZIP file exported from another Vale instance.

- **Dry Run**: Test what would be imported without actually saving.
- Existing records with the same slug/email are skipped (not overwritten).
- A warning is shown for large datasets, recommending the terminal import instead (see [CLI Commands](../system/cli)).

::: warning
Import will not overwrite existing records with the same slug/email, they will be skipped.
:::

## Cleanup

### Revisions

Old content revisions stored in the database. The revision count loads when you click **Count**: it is not computed on page open.

- **Prune Revisions**: Keep the latest N revisions per item (options: 3, 5, 10, 25, 50) and delete the rest. Applies to all content types, posts, pages, and custom post types. The button shows how many revisions can be pruned keeping the latest 10.

### Database Optimization

Clean up orphaned data and optimize database tables. Each category's count is loaded on demand via its **Count** button (spam/trash comments, orphaned meta, missing/unused media, redirects), heavy scans never run while the Settings page opens.

| Operation | Description |
|-----------|-------------|
| **Delete spam comments** | Permanently removes comments marked as spam |
| **Delete trashed comments** | Permanently removes comments in the trash |
| **Clean orphaned post meta** | Removes metadata entries with no parent post |
| **Delete orphaned media files** | Removes DB records for media files missing on disk |
| **Delete unused media** | Removes media not referenced in any content |
| **Purge old pageviews** | Deletes pageview logs older than N days (configurable) |
| **Optimize database tables** | Reclaims unused space in key tables |

Use **Run all operations** to execute everything at once, or select individual operations.

::: warning Media deletion requires explicit selection
The two media operations (**Delete orphaned media files** / **Delete unused media**) only run when their own checkbox is selected, they are never triggered by leaving the form at its defaults. When they run, the original file plus all generated image variants are removed together with the record.

**Delete orphaned media files** spares records that are still referenced by content, those are reported as kept in the result message. Restore the missing file and the page keeps working; the record is only deleted when nothing references it anymore.

:::

### Clear redirect table

When **Enable SEO System** is on (**[Settings] → [SEO] → General**), an additional action appears below the database optimization form.

| Action | Description |
|--------|-------------|
| **Clear redirect table** | Permanently deletes **all** 301/302 redirect rules stored in the database (automatic and manual). Shows the current rule count. Requires confirmation. |

This is independent of **Run all operations**: it does not run as part of that batch. Use it to reset redirect rules after URL migrations or testing. Automatic redirects will be recreated when slugs or prefixes change again (if automatic redirects are enabled).

::: warning
Clearing the redirect table cannot be undone. Old URLs will stop redirecting until new rules are created.

:::

## Tip

- [SEO Redirects](./seo#redirects), automatic and manual redirect rules.
- [Updates & Backups](../system/updates) for detailed update and backup procedures.
- [CLI Commands](../system/cli) for command-line maintenance.
