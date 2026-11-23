# Media Commands

Part of [CLI Commands](../cli).

Register media files that exist on disk, regenerate missing thumbnails and WebP renditions, and remove generated WebP files.

::: tip IN THE ADMIN PANEL
**[Content → Media](../../content/media)** is the library; **[Settings → Maintenance](../../settings/maintenance)** runs rescans and cleanup. `media:webp-remove` is CLI-only.
:::

## Media

### `media:scan`

Scan the uploads directory and register any files that exist on disk but are not in the media library. Useful after bulk-uploading files via FTP or S3 sync. Missing thumbnail and WebP renditions are regenerated automatically; see [Media Management](../../content/media) for how renditions work.

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

The scanner only registers original images; thumbnails and WebP variants are generated alongside them. See [Media Management](../../content/media#how-thumbnails-are-stored) for details.

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

This command only runs while **Convert images to WebP** is turned **off** in [Settings](../../settings/) → [Content](../../settings/content). If the setting is still enabled the command aborts with an error; turn it off first, run this to clean up existing `.webp` files, then re-enable it if you only wanted to stop future conversions.

**WebP files you uploaded yourself are never touched.**

```bash
php vale media:webp-remove
```

| Option | Description |
|---|---|
| `--dry-run` | Preview without changes: lists each record that *would* be updated and the files that *would* be deleted |

---

