# Updates & Backups

Vale has a built-in update and backup system so you can keep your installation current and recover quickly from any issue. Both live on one page with two tabs, **Updates** and **Backups**, and switching between them is instant.

## Checking for Updates

Open the **Updates** tab from the **Vale Version** card on the dashboard, or by going to **[Settings](../settings/) → [Maintenance](../settings/maintenance) → [Updates & Backups](../settings/maintenance#updates-backups)** and clicking **Go to Updates**. That same panel also has a **Backups** button that opens the other tab directly.

Vale checks a remote update manifest for new releases. Click **Check Now** to force an immediate check outside the scheduled cron window.

If the last check could not reach the update server, the page shows a red notice with the reason and when the failed attempt happened. Your **Last Checked** time only moves forward after a successful check, so a failed attempt never looks like a fresh one. Vale keeps retrying in the background, and **Check Now** starts a new attempt immediately.

::: warning SIGNATURE VERIFICATION: FOR SYSADMINS
When **Enable software updates** is on, Vale verifies release packages by signature before installing. This requires a valid update public key in your `.env` file (the built-in key works for official releases).

If you use a custom update manifest or the key becomes outdated, either update the public key in `.env` from the new release's manifest or disable signature verification (not recommended for production). See the field help in the panel and the deployment docs for the exact variable names.
:::

The **Updates** tab shows:

- Your current installed version
- The latest available version, with the release notes in a collapsible section
- Technical release details, including the download link, checksum, and signature status

## Applying an Update

1. Click **Install update** on the **Updates** tab. Vale will:
   - Download the release package
   - Verify its integrity and signature
   - Create an automatic backup of your current database and files
   - Extract and replace application files
   - Run any new database migrations automatically
   - Clear all caches
2. A progress bar shows what is happening. Keep the tab open until the update finishes; the page then reloads and confirms the new version.

A backup is created automatically before every update. If anything goes wrong, restore it from the **Backups** tab (see [Rollback](#rollback)).

When a release changes the database schema, Vale shows a blue notice above **Install update** ("This update includes database schema changes…"). It is informational: the same automatic backup covers you, and the migrations still run as part of the update.

## Docker Deployments

How updates reach you depends on which Vale image you run:

| Image | **Install update** button | Correct way to update |
|---|---|---|
| `mutable-apache` / `mutable-nginx` | Works normally | Click **Install update** on the Updates tab |
| `latest`, `nginx`, or any version tag (immutable) | Does nothing; the code is baked into the image | Pull the new image and recreate the container |

::: tip Immutable images
The admin panel knows it cannot update itself and says so. Update from a terminal on the server instead:

```bash
docker pull @dockerImage@:latest
docker stop vale && docker rm vale
# then run your usual docker run command again
```

Your content, uploads, themes, and backups live in the mounted volumes, so recreating the container does not touch them. See [Docker Deployment → Updates not persisting in immutable mode](../../developer/deployment/docker#updates-not-persisting-in-immutable-mode) for the full explanation.
:::

## Backups

Everything backup-related is on the **Backups** tab, one click away at the top of the page (the **Go to Updates** / **Backups** buttons under Settings → Maintenance → Software Updates do the same). Switching tabs never reloads the page, and your backups are stored on your own server; nothing is uploaded elsewhere.

### Creating a Backup

Click **Create backup now** to snapshot your database and site files.

- A normal backup includes everything Vale needs to bring the site back, up to and including external libraries and build files.
- Tick **Quick** to leave those external components out. Quick backups are smaller and faster, but a backup taken this way may not be enough to recover from a major update; take a full backup before jumping to a new major version.

### Managing Backups

The list shows every snapshot with its date, the Vale version it was taken from, file count, database size, and total size. When there are no backups yet, Vale reminds you that one can be created manually and that an automatic backup is taken before each update.

For each backup, first choose what you want to work with: **All (files + DB)**, **Files only**, or **Database only**; then use:

- **Download**: save the backup archive to your computer
- **Restore**: put the site back to that snapshot (Vale asks you to confirm first)
- **Delete**: remove the backup to free up disk space (also confirmed)

### Rollback

If an update causes issues, open the **Backups** tab and find the snapshot Vale created automatically just before that update. Choose **All (files + DB)** and click **Restore** to return the site to its previous state.

## Data Portability

Under **[Settings](../settings/) → [Maintenance](../settings/maintenance) → [Data Export / Import](../settings/maintenance#data)**, you can export your entire site for migration to another Vale instance:

- **Export**: Click **Export** to generate a complete JSON snapshot of Posts, Pages, Products, Orders, Users, Categories, Tags, SEO metadata, Settings, Media, Content Types, Menus, Comments, Forms, Coupons, Redirects, Tax Rates, and Membership Plans. The file downloads automatically.
- **Import**: Upload a previously exported JSON or ZIP file to import content. An **ID remapping engine** preserves all relational links (authors, categories, featured images, etc.) between the source and target site. Secret settings (API keys, payment secrets) are skipped unless explicitly included, and media files are not part of the export; copy the uploads directory and rescan media after import.

For large datasets, use the [CLI commands](./cli#export-import) instead of the browser upload.

## Cron-Based Update Checks

Automatic update checks run via the Vale cron job every 24 hours. By default, checks are **on** and auto-installation is **off**; Vale will notify you about new releases but never install anything unless you explicitly enable auto-apply.

Ensure your cron is configured (see [CLI Commands](./cli) for the setup guide).

### Update Settings & Master Switch

Under **[Settings](../settings/) → [Maintenance](../settings/maintenance) → [Updates & Backups](../settings/maintenance#updates-backups)**:

| Setting | Default | Effect |
|---|---|---|
| **Enable software updates** | On | Master switch for the whole update system |
| **Automatic update checks** | On | Check for new releases during each daily cron run |
| **Automatically apply updates** | Off | Install available releases automatically during cron (a backup is created first) |

When the master switch is off, cron never checks for or applies updates, even when running with `--force-update`. This is useful for managed environments where updates are handled outside Vale (e.g., by a package manager or deployment pipeline). Manual checks remain available at any time via **Check Now** on the Updates page or `php vale update:check`.

See [CLI Commands](./cli) for the full cron setup guide.

::: tip SEE ALSO
- [CLI Commands](./cli): `update:check`, `backup:create`, `export`, `import` commands.
- [Settings](../settings/) → [Maintenance](../settings/maintenance): software updates, data tools, cache, and cron.
:::
