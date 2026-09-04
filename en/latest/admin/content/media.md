# Media Management

The Media Library is where you manage all uploaded files, including images, documents, and videos.

## Uploading Files

- **Drag and Drop**: Simply drag files into the Media panel.
- **Batch Upload**: Upload multiple files at once.
- **Image Optimization**: Vale automatically generates thumbnails and strips EXIF data for privacy and performance.
- **Supported formats**: images (`jpg`, `png`, `gif`, `webp`, `avif`, `svg`), video (`mp4`, `mkv`), audio (`mp3`), documents (`pdf`, `txt`, `rtf`, `docx`, `xlsx`), archives (`zip`, `rar`, `7z`, `gz`, `tar`, `bz2`), subtitles (`srt`, `sub`, `vtt`). Executable and server-side extensions (`php`, `html`, `exe`, …) are rejected in code regardless of configuration. Note that Safari/Firefox cannot play MKV video in the browser.

::: tip SubRip files are converted to WebVTT
Browsers only accept **WebVTT** in `<track>`, so uploaded `.srt` and `.sub` files are converted automatically at ingest: the file is rewritten as `.vtt` and stored (and served) under the `.vtt` name. Nothing to do manually — upload the SubRip file you have.
:::

::: tip FOR SYSADMINS — upload size limits
If uploads fail with "file too large", the limit comes from the server, not Vale. Docker images ship with **128 MB** by default; for other setups check `upload_max_filesize` / `post_max_size` and your web server's body-size setting.
:::

## Uploading From Pickers

Every media picker — **Featured Image**, **OG Image**, the product **Gallery**, download-file pickers (product and variation) and the editor's media library — accepts **drag and drop** directly inside the dialog. A progress bar shows the upload status. Afterwards:

- **single-choice pickers** (featured/OG image, variation image) attach the first uploaded file automatically;
- **multi-choice pickers** (product gallery) add all uploaded files to the selection;
- download-file pickers attach the uploaded files to the product or targeted variation.

If you drop more files while an upload is still running, they are queued and upload next. If some files are rejected (wrong type for that picker, or too large), a message lists which ones failed while the rest upload normally.

Uploading requires the **media upload** permission; without it, dropping files shows an explicit message.

## Using Media in Content

While editing a post or page, you can:
- Browse the media library to insert existing images.
- Upload new images, videos, or files directly from the editor.
- Set a **Featured Image** for posts to be used in listings and social shares.

When multi-language content is enabled, the editor media picker uses **alt text** for the content's current language (from the **Language** field in the sidebar). See [Translatable Media Metadata](./translations#media-alt-text-on-the-front-end).

## Previewing Videos, Audio & Documents

Files that cannot be shown as a photo — videos, audio, PDFs, Office documents, and archives — appear with a type-aware tile instead of a thumbnail:

- **Videos and audio files** show a play (or music) badge. Clicking it loads the player right inside the tile — nothing is downloaded before that, so a library page full of videos stays fast. Playing never selects the file or opens its details by accident.
- **PDFs, documents, and archives** show a colored type icon: PDF in red, archives in amber, Word documents in blue, spreadsheets in green, presentations in orange, audio in purple.
- The **Media → Edit** page goes further: videos and audio get a full player with controls (the first frame loads automatically), and PDF-style files get an **Open file** button that opens the file in a new tab.
- The same previews are used in every media picker — the editor media library and the product gallery picker.

## Alt Text & Description

Open any file via **Media → Edit** to set metadata:

| Field | Purpose |
|---|---|
| **Title** | Admin-only label for organizing files (not shown to visitors) |
| **Alt Text** | Accessibility text inserted into `<img alt="…">` when picking from the library |
| **Description** | Internal notes; included in media library search |

When multiple content languages are configured, **Alt Text** and **Description** show language tabs (same pattern as SEO redirects). Translations are optional — empty tabs fall back to the default language when fallback is enabled.

Media library search matches the filename, title, and both the default-language and **all translated** alt text / description values in one pass — a search term in any configured language finds the file, regardless of the language currently used in the admin.

When browsing the media library from the editor or content forms (e.g. choosing a **Featured Image**, **OG Image**, or gallery image), hovering over a thumbnail shows its **Description** as a tooltip when one is set. If a file name is truncated in the picker grid, hovering over the name shows the full name.

## Finding Unused Media

Media files that are not referenced anywhere — not as a featured image, not in a product gallery, and not embedded in any content body — can be found via the **Find Unused Media** button on the Media page.

This opens a separate view listing all unused files with their type, size, and path.

Unused media can also be cleaned up in bulk from **[Settings](../settings/) → [Maintenance](../settings/maintenance) → [Database Optimization](../settings/maintenance#database-optimization)** using the "Delete unused media" checkbox.

::: tip FOR SYSADMINS
The same cleanup is available from the terminal — see [CLI Commands](../system/cli#database) for `db:optimize`. Technical reference: thumbnail and WebP renditions are stored as derived files of the original record (`MediaUploadService`, `ImageProcessor`), and `media:scan` only registers originals while regenerating missing renditions.
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

These options are available under **[Settings](../settings/) → [Content](../settings/content) → [Media](../settings/content#media)** sub-tab:

| Setting | Description |
|---------|-------------|
| **WebP Conversion** | Automatically generate a WebP copy of uploaded images, including WebP size variants. Featured images and blog thumbnails are served as WebP whenever a rendition exists. See [Content Settings](../settings/content) → [Media](../settings/content#media). |
| **Year/Month Folders** | Store uploads in `uploads/YYYY/MM/` directories. |
| **Original Filename** | Keep the original filename instead of generating a hashed one. |
| **Conflict Mode** | When a file with the same name exists: rename (suffix) or overwrite. |


### How Thumbnails Are Stored

Thumbnails are derived files of the original image (small, medium, large, plus WebP variants when conversion is enabled). Deleting a media record removes the original and all its variants, so no manual cleanup is needed.

::: tip SEE ALSO — developer reference
File layout, rendition regeneration, and scan behavior live in the codebase (`MediaUploadService`, `ImageProcessor`) and the [CLI Commands](../system/cli) reference for `media:scan`.
:::
