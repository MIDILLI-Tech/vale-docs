# Media Management

The Media Library is where you manage all uploaded files, including images, documents, and videos.

## Uploading Files

- **Drag and Drop**: Simply drag files into the Media panel.
- **Batch Upload**: Upload multiple files at once.
- **Image Optimization**: Vale automatically generates thumbnails and strips EXIF data for privacy and performance.

::: tip Upload Size Limits
Docker images ship with a default upload limit of **128 MB** (configured in `docker/php.ini` and `docker/nginx.conf`). For non-Docker setups, upload size is determined by your server's `upload_max_filesize` and `post_max_size` PHP settings, and your web server's `client_max_body_size` (Nginx) or equivalent.
:::

## Using Media in Content

While editing a post or page, you can:
- Browse the media library to insert existing images.
- Upload new images directly from the editor.
- Set a **Featured Image** for posts to be used in listings and social shares.

When multi-language content is enabled, the editor media picker uses **alt text** for the content's current language (from the **Language** field in the sidebar). See [Translatable Media Metadata](./translations#media-alt-text-on-the-front-end).

## Alt Text & Description

Open any file via **Media → Edit** to set metadata:

| Field | Purpose |
|---|---|
| **Title** | Admin-only label for organizing files (not shown to visitors) |
| **Alt Text** | Accessibility text inserted into `<img alt="…">` when picking from the library |
| **Description** | Internal notes; included in media library search |

When multiple content languages are configured, **Alt Text** and **Description** show language tabs (same pattern as SEO redirects). Translations are optional — empty tabs fall back to the default language when fallback is enabled.

Media library search matches filename, title, default-language fields, and translated alt/description values.

## Finding Unused Media

Media files that are not referenced anywhere — not as a featured image, not in a product gallery, and not embedded in any content body — can be found via the **Find Unused Media** button on the Media page.

This opens a separate view listing all unused files with their type, size, and path.

Unused media can also be cleaned up in bulk from **Settings → Maintenance → Database Optimization** using the "Delete unused media" checkbox, or via CLI:

```bash
php vale db:optimize --orphaned-media-unused
```

::: warning
Unused media detection checks both database foreign keys (featured images, product images, downloads) and content body HTML. Files embedded via `<img>` tags in posts, products, newsletters, and automations are considered "in use."
:::

## Image Optimization

Vale automatically generates thumbnails (small, medium, large) and strips EXIF data for privacy and performance.

## Thumbnails

Images are automatically resized to three sizes on upload: `small` (150×150), `medium` (300×300), and `large` (1024×1024). Thumbnails are stored alongside the original file.

### Switching Thumbnail Size in the Editor

When editing content, double-click an image or click the blue ⚙ button that appears when the image is selected. The **Image Size** dialog includes a **Thumbnail Size** dropdown where you can switch between:

- **Original** — full resolution (default when inserting)
- **Large** (1024×1024)
- **Medium** (300×300)
- **Small** (150×150)

This lets you serve smaller image versions where high resolution is not needed.

## Upload Settings

These options are available under **Settings → Content → Media** sub-tab:

| Setting | Description |
|---------|-------------|
| **WebP Conversion** | Automatically generate a WebP copy of uploaded images, including WebP size variants. Featured images and blog thumbnails are served as WebP whenever a rendition exists. See [Content Settings → Media](../settings/content#media). |
| **Year/Month Folders** | Store uploads in `uploads/YYYY/MM/` directories. |
| **Original Filename** | Keep the original filename instead of generating a hashed one. |
| **Conflict Mode** | When a file with the same name exists: rename (suffix) or overwrite. |


### How Thumbnails Are Stored

Thumbnails are **not** separate database records. When an image is uploaded or scanned, the system:

1. Adds a single row to the `media` table for the original file.
2. Generates thumbnail files on disk next to the original (e.g. `kamil-small.png`, `kamil-medium.png`, `kamil-large.png`).
3. Stores the thumbnail paths as a JSON object in the `thumbnails` column of the parent row.

Example `thumbnails` column value:

```json
{
  "small": "2026/07/kamil-small.png",
  "medium": "2026/07/kamil-medium.png",
  "large": "2026/07/kamil-large.png",
  "webp": "2026/07/kamil.webp",
  "webp_small": "2026/07/kamil-small.webp",
  "webp_medium": "2026/07/kamil-medium.webp",
  "webp_large": "2026/07/kamil-large.webp"
}
```

The `webp*` keys are only present when **Convert images to WebP** was enabled for that upload.

This means thumbnail files on disk are **not** individually tracked in the media library. Deleting a media record (admin UI or explicit `db:optimize --orphaned-media-*` flags) removes the original **and every variant file listed in `thumbnails`**, so no manual cleanup is needed.

### Media Scan and Thumbnails

When running `php vale media:scan` or the **Rescan Media** button from Settings → Maintenance, the scanner skips thumbnail files (files ending in `-small`, `-medium`, `-large`) automatically. Only original files are registered. Thumbnails are generated as a side effect of adding the original file.

The scan is also **self-healing**: it checks every registered image for missing size thumbnails and regenerates them. With WebP conversion enabled it also creates missing `.webp` conversions and `webp_small` / `webp_medium` / `webp_large` variants. Records whose original file is missing on disk are left untouched.

A bare `.webp` file whose original is gone is treated as an orphaned conversion and is not re-registered as its own media record. The detection looks for evidence that the file was a conversion — a same-base record with another extension in the database, or variant sibling files (`-small` / `-medium` / `-large`) still next to it — and applies **regardless of the WebP setting**. A standalone `.webp` upload without any such evidence is always registered normally.
