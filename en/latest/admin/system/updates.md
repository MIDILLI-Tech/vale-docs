# Updates & Backups

Vale has a built-in update and backup system so you can keep your installation current and recover quickly from any issue.

## Checking for Updates

Go to **Settings → Advanced → Maintenance → Software Updates** (or the **Updates** quick action on the dashboard).

Vale checks a remote update manifest for new releases. Click **Check Now** to force an immediate check outside the scheduled cron window.

The update panel shows:
- Your current installed version
- The latest available version and release notes
- SHA-256 and GPG signature for the release package

## Applying an Update

1. Click **Install update**. Vale will:
   - Download the release package
   - Verify the SHA-256 checksum and GPG signature
   - Create an automatic backup of your current database and media
   - Extract and replace application files
   - Run any new database migrations automatically
   - Clear all caches
2. The admin panel reloads and confirms the new version.

A backup is created automatically before every update. If anything goes wrong, use **Rollback** to restore the previous version (see below).

## Backups

### Creating a Backup
Click **Create Backup Now** to generate a full backup containing:
- Database dump (SQL) — uses a driver-aware snapshot (optimized for both MySQL and SQLite)
- Uploaded media files — packaged as a ZIP archive

Backups are stored locally in the `storage/backups/` directory.

### Managing Backups
The **Backups** list shows all saved snapshots with their date, size, and status. From here you can:
- **Download** — export a backup ZIP to your local machine
- **Restore** — roll back the entire site to that snapshot
- **Delete** — remove a backup to free up disk space

### Rollback
If an update causes issues, click **Rollback** next to the most recent pre-update backup. Vale restores the previous application files and database, returning the site to its prior state.

## Data Portability

Under **Settings → Advanced → Maintenance → Data Portability**, you can export your entire site for migration to another Vale instance:

- **Export** — Click **Export** to generate a complete JSON snapshot of Posts, Pages, Products, Orders, Users, Categories, Tags, SEO metadata, and Settings. The file downloads automatically.
- **Import** — Upload a previously exported JSON or ZIP file to import content. An **ID remapping engine** preserves all relational links (authors, categories, featured images, etc.) between the source and target site.

For large datasets, use the [CLI commands](./cli#export-import):

```bash
php vale export -o site-export.zip
php vale import --file=site-export.zip
```

The system detects whether the `zip` extension is available and adjusts the UI accordingly. Long-running imports are protected against timeout with extended execution limits.

## Cron-Based Update Checks

Automatic update checks run via the Vale cron job every 24 hours. By default, checks are **on** and auto-installation is **off** — Vale will notify you about new releases but never install anything unless you explicitly enable auto-apply.

Ensure your cron is configured correctly:

```bash
* * * * * php /path/to/vale cron:run >> /dev/null 2>&1
```

### Update Settings & Master Switch

Under **Settings → Advanced → Maintenance → Software Updates**:

| Setting | Default | Effect |
|---|---|---|
| **Enable software updates** | On | Master switch for the whole update system |
| **Automatic update checks** | On | Check for new releases during each daily cron run |
| **Automatically apply updates** | Off | Install available releases automatically during cron (a backup is created first) |

When the master switch is off, cron never checks for or applies updates — even when running with `--force-update`. This is useful for managed environments where updates are handled outside Vale (e.g., by a package manager or deployment pipeline). Manual checks remain available at any time via **Check Now** on the Updates page or `php vale update:check`.

See [CLI Commands](./cli) for the full cron setup guide.

::: tip SEE ALSO
- [CLI Commands](./cli) — `update:check`, `backup:create`, `export`, `import` commands.
- [Settings → Advanced](../settings/advanced) — system maintenance options.
:::
