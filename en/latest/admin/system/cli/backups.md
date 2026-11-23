# Backup Commands

Part of [CLI Commands](../cli).

Create, list, download, delete and restore full or partial backups of the database and site files.

::: tip IN THE ADMIN PANEL
**[System → Updates & Backups → Backups](../updates#backups)** (also reachable from **[Settings → Maintenance → Updates & Backups](../../settings/maintenance#updates-backups)**) creates, downloads, deletes and restores backups.
:::

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

