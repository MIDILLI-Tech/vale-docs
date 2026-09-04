# Editor Media

This page covers adding and working with media in the Vale Editor. For the editor overview, see [Editor](./index). For content blocks, see [Editor Blocks](./blocks).

## Adding Media

You can add media in three ways:

1. **Upload**: Via slash `/upload`, toolbar `🖼 Upload`, or `Ctrl+Shift+U`. This opens a file picker, uploads the file, and inserts it. Images keep their thumbnail sizes; videos are inserted as video blocks; documents and archives (PDF, Office documents, archives, subtitles, MP3) are inserted as file links (see [File Links](#file-links)). A toast shows the file name and a live progress bar while uploading, and reports failures with the reason.

   ::: tip Re-uploading the same file
   The editor does not check whether a file already exists in your media library, so there is no "file already exists" warning. The upload simply adds another copy (with original filenames enabled, the copy is named `file-1.ext`). Existing files are never overwritten. To reuse the copy you already have, pick it from the **Media Library** instead.
   :::
2. **Drag and Drop**: Drag from your computer a supported file and drop in the editor where you want to place the file in. If you have the upload rights, it will be uploaded and inserted automatically.
3. **Media Library**: Browse existing images, videos, and files via `📁 Media library` or `Ctrl+Alt+M`
4. **External Media**: Paste a URL via `🔗 External Media` or `Ctrl+Alt+E`. Images, YouTube, Vimeo, and direct MP4/WebM/OGG files are supported

### Video blocks

Videos inserted by any route become a single **Video** block. Double-click its header or click ⚙ to change the source, paste raw embed HTML, or set the width: **Full width**, **75%**, **50%**, or **Custom…** (any CSS value such as `400px` or `60%`). Narrower widths are centred. Videos always keep a 16:9 aspect ratio; there is no drag handle.

**Subtitles:** external embeds (YouTube, Vimeo) use the platform's own caption button; nothing needs to be attached. For self-hosted videos, upload your `.vtt` file (SubRip `.srt`/`.sub` files are converted to WebVTT automatically on upload.

::: tip Video embedding code with subtitles
See [Media](../media)) and paste an embed with a `<track>` element pointing at it in the video settings. The viewer then gets the standard caption button, and a **CC** badge in the top-right corner signals that captions are available. See [Developer → Media](../../../developer/media#subtitle-cc-badge-transform) for the exact embed format and how the badge is rendered.
:::

## Resizing Images

Select an image in the editor to reveal a **resize handle** at the bottom-right corner. Drag it to resize:

- **Aspect ratio locked** (default): Height auto-calculates to maintain proportions
- **Aspect ratio unlocked**: Width and height are independently adjustable

The resize handle respects the **Maintain aspect ratio** setting from the Image Settings dialog. Only standalone images can be resized. Images inside composite blocks (carousel, media + text, product) are managed by their own block UI.

## Image Settings

Double-click an image, or click the ⚙ button that appears when an image is selected, to open the **Image Size** dialog:

| Setting | Description |
|---------|-------------|
| Image URL | The current image address. Edit it to point at a different file, which is handy when an image breaks because the file was moved or renamed. |
| Width | Desired width (in px or %) |
| Height | Desired height (in px or %) |
| Maintain aspect ratio | When checked, changing one dimension auto-updates the other |
| Unit | Pixels (`px`) or percentage (`%`) |
| Size | Thumbnail size for media library images: Full, Large (1024), Medium (300), Small (150). Only shown for images picked from the media library. |
| Rounded | Corner rounding in px (0 to 50) |
| Caption | Text shown below the image |
| Lightbox | When checked, visitors can click the image to view it enlarged |

---

## Media Library

The **Media Library** browser is accessible from toolbar `📁 Media library`, slash `/media`, or `Ctrl+Alt+M`.

- **Filter**: Switch between Images, Videos, Files (PDF, Office documents, RAR/7-ZIP archives, subtitles, TXT, audio), or All Types
- **Search**: Type to filter by filename
- **Pagination**: Navigate through pages of results
- **Insert**: Click an image to insert it, a video to embed it, or a file to insert it as a link
- **Preview**: Videos and audio files show a play (or music) badge. Click it to play inside the picker without inserting anything; nothing is downloaded until then. Clicking the card itself still inserts the file. PDFs, Office documents, and archives show a type-colored icon.
- **Upload**: Drag and drop files directly into the dialog to upload them (requires the media upload permission). After the upload the list refreshes and the first uploaded file is inserted automatically.

### File Links

Picking a file (PDF, Office documents, RAR/7-ZIP archives, subtitles, TXT, audio) from the **Files** filter in the media library, from **All Types**, or by uploading it directly opens the **Insert File Link** dialog:

1. The selected file is shown with its icon and size
2. **Link text** is prefilled with the file name. Edit it to whatever should be clickable in the content
3. **Open in new tab** is checked by default; uncheck it to open in the same tab
4. Click **Insert**. The file is inserted as a plain text link

Cancel closes the dialog without inserting anything.

### External Media Dialog

The **External Media** dialog (`🔗 External Media`, `Ctrl+Alt+E`, or slash `/external`) allows inserting media from any URL:

1. Paste a URL into the input field
2. A **live preview** appears after a short delay
3. Click **Select Media** to insert

The dialog automatically detects the URL type:

| URL Pattern | Result |
|-------------|--------|
| `.jpg`, `.png`, `.gif`, `.webp`, `.svg` | Inserted as an image |
| `.mp4`, `.webm`, `.ogg`, `.mov` | Embedded as a video |
| `youtube.com/watch?v=` or `youtu.be/` | Embedded as YouTube iframe |
| `vimeo.com/` followed by a number | Embedded as Vimeo iframe |
| Anything else | Treated as a generic link (wrapped in a video embed) |

> The External Media dialog is also available within the **Carousel** and **Media + Text** media browsers, with a context-appropriate button label.

---
