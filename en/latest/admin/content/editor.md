# Editor

Vale features a modern, block-based editor built on **Tiptap**. It allows you to create rich, interactive content without writing any HTML. Type `/` to open the command menu, or use the toolbar for quick access. Alternatively, [Markdown syntax](https://www.markdownguide.org/basic-syntax/) can also be used.

---

## Slash Commands

Type `/` at the start of a new line to open the command menu. All available commands:

| Icon | Command | Description |
|------|---------|-------------|
| ¶ | Paragraph | Plain text paragraph |
| 🖼 | Upload | Upload an image, video, or file from your device |
| 🔗 | External Media | Insert an image, YouTube, Vimeo, or direct video from URL |
| 📁 | Media Library | Browse and insert images, videos, or file links from the media library |
| 🎠 | Carousel | Image slider with autoplay and lightbox |
| 📧 | Newsletter Form | Single-input email subscription form |
| 📋 | Form | Embed a custom form by selecting its name |
| 🔘 | Link Buttons | Group of styled call-to-action buttons |
| 🃏 | Cards | Responsive grid of image cards |
| 🏁 | Hero | Marketing hero — split layout or centered CTA |
| 🛒 | Product | Embed a product from the shop |
| 🎟 | Coupon | Insert a discount code or dynamic coupon generator |
| 📑 | Table of Contents | Auto-generated TOC from headings |
| ↗ | Redirect | Timed redirect to another URL |
| 📰 | Latest Posts Feed | Dynamic recent posts feed for newsletters (newsletter only) |
| 👤 | Subscriber Name Tag | Insert subscriber name with fallback (newsletter only) |
| 🔕 | Unsubscribe Link | Insert unsubscribe URL tag (newsletter only) |
| 👁 | Open Track Tag | Insert email open tracking pixel tag (newsletter only) |
| 👶 | Child Pages | List sub-pages of the current page (Pages only) |
| 🖼 | Media + Text | Side-by-side layout with image and text |
| H1 | Heading 1 | Large section heading |
| H2 | Heading 2 | Medium section heading |
| H3 | Heading 3 | Small section heading |
| ❝ | Quote | Add a blockquote |
| • | Bullet List | Unordered list |
| 1. | Numbered List | Ordered list |
| Table | Table | Insert a customizable table |
| `</>` | Code Block | Syntax-highlighted code |
| 🔗 | Link | Insert or edit a link |
| ⬪ / ⫻ / ⬫ | Align Left / Center / Right | Text alignment |
| — | Divider | Horizontal rule |
| ⏎ | Hard Break | Line break |
| ⊡ | More Break | Blog listing cut-off point |
| 📄 | Next Page | Page break / pagination divider |
| ↕ | Spacer | Invisible spacing block |
| 😊 | … | Additional emoji, formatting, and special characters |

> Some commands are visibility-gated: **Product** only appears when Shop is enabled, **Coupon** when Shop/Membership is enabled (slash command: Newsletter content type only), **Newsletter Form** when Newsletter is enabled, **Form** when Forms are enabled, **Child Pages** only on Page content type, and **More Break** is hidden on Pages and Products. **Latest Posts Feed**, **Subscriber Name Tag**, **Unsubscribe Link**, and **Open Track Tag** only appear when Newsletter is enabled **and** the content type is Newsletter.

---

## Toolbar

### Primary Toolbar

| Button | Shortcut | Action |
|--------|----------|--------|
| ↩ | Ctrl+Z | Undo |
| ↪ | Ctrl+Y | Redo |
| **B** | Ctrl+B | Bold |
| *I* | Ctrl+I | Italic |
| <u>U</u> | Ctrl+U | Underline |
| **A** with color | — | Text color (opens color picker) |
| **A** with bg | — | Highlight / background color |
| 🔗 | Ctrl+K | Insert / edit link |
| Tbl | Ctrl+Alt+T | Insert table |
| — | Ctrl+Alt+D | Divider (horizontal rule) |
| {} | Ctrl+Alt+C | Code block |
| ⏎ | Shift+Enter | Hard line break |
| 😊 | — | Emoji picker (50 presets) |
| ⛶ | Shift+F11 | Toggle fullscreen |
| `</>` | — | Toggle HTML source mode |

### Formatting Dropdown (label: **Fmt**)

| Button | Shortcut | Action |
|--------|----------|--------|
| ~~S~~ | Ctrl+Shift+X | Strikethrough |
| `<>` | — | Inline code |
| X₂ | — | Subscript |
| X² | — | Superscript |
| • | Ctrl+Shift+8 | Bullet list |
| 1. | Ctrl+Shift+7 | Numbered list |
| ❝ | Ctrl+Shift+B | Blockquote |

### Heading Dropdown (label: **H**)

| Button | Shortcut | Action |
|--------|----------|--------|
| H1 | Ctrl+Alt+1 | Heading 1 |
| H2 | Ctrl+Alt+2 | Heading 2 |
| H3 | Ctrl+Alt+3 | Heading 3 |

### Alignment Dropdown (label: **Align**)

| Button | Shortcut | Action |
|--------|----------|--------|
| Left align | Ctrl+Shift+L | Align left |
| Center align | Ctrl+Shift+E | Align center |
| Right align | Ctrl+Shift+R | Align right |

### Element Dropdown (label: **Element**)

| Button | Shortcut | Action |
|--------|----------|--------|
| 🖼 | Ctrl+Shift+U | Upload an image, video, or file from your computer |
| 📁 | Ctrl+Alt+M | Open media library |
| 🔗 | Ctrl+Alt+V | Open external media dialog |
| 📧 | — | Insert newsletter form |
| 🎠 | — | Insert carousel |
| 🏁 | — | Insert hero |
| 📋 | Ctrl+Alt+F | Insert form |
| 🎟 | — | Insert coupon |
| 🛒 | — | Insert product |
| 🔘 | — | Insert link buttons group |
| 🃏 | — | Insert cards grid |
| 📑 | — | Insert table of contents |
| ↗ | — | Insert redirect |
| 📰 | — | Insert latest posts feed (newsletter only) |
| 🔕 | — | Insert unsubscribe link (newsletter only) |
| 👁 | — | Insert open tracking pixel (newsletter only) |
| ⊡ | — | Insert more break |
| 📄 | — | Insert next page block |
| 👶 | — | Insert child pages |

### Bubble Menus

When you select text, a floating toolbar appears with **Bold**, *Italic*, <u>Underline</u>, and 🔗 Link.

When your cursor is inside a table, a floating toolbar appears with:

| Button | Action |
|--------|--------|
| ⊞↑ | Add row above |
| ⊞↓ | Add row below |
| ⊟ | Delete row |
| ⊞← | Add column left |
| ⊞→ | Add column right |
| ◫ | Delete column |
| ⚙ | Open table properties |
| ✕ | Delete table |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| Ctrl+B | Bold |
| Ctrl+I | Italic |
| Ctrl+U | Underline |
| Ctrl+K | Insert / edit link |
| Ctrl+Shift+U | Upload image, video, or file |
| Ctrl+Alt+M | Open media library |
| Ctrl+Alt+V | Open external media dialog |
| Ctrl+Alt+F | Open form picker |
| Ctrl+Alt+T | Insert table |
| Ctrl+Alt+D | Insert divider |
| Ctrl+Alt+C | Code block |
| Ctrl+Alt+1 / 2 / 3 | Heading 1 / 2 / 3 |
| Ctrl+Shift+7 | Numbered list |
| Ctrl+Shift+8 | Bullet list |
| Ctrl+Shift+B | Blockquote |
| Ctrl+Shift+L | Align left |
| Ctrl+Shift+E | Align center |
| Ctrl+Shift+R | Align right |
| Ctrl+Shift+X | Strikethrough |
| Ctrl+Shift+D | Duplicate selected block |
| Shift+Enter | Hard line break |
| Escape | Exit fullscreen / close dialogs |
| Ctrl+S | Save / update post |
| Ctrl+Shift+P | Open preview in a new tab |
| Ctrl+Shift+S | Show published version in a new tab |

---

## Blocks

**Blocks** are rich, embeddable content elements — from carousels and product cards to forms and newsletter signups. Insert them via the slash `/` command or the **Element** toolbar dropdown. They are shortcuts to create dynamic content, which otherwise may need deep HTML or external references to work. Many of the blocks offer additional settings which can be opened by double-clicking the header, or using the ⚙ gear icon. Every block header also has a ⧉ button that duplicates the block with identical content right below it (or press **Ctrl+Shift+D** on the selected block). Vale editor has the following blocks:

### Forms

Insert a **Form** via slash `/form` or toolbar `Element > 📋 Insert form`. A dialog lists all available forms — click one to embed it. The block displays the form name and shortcode. Click ✕ to remove.

### Table of Contents

Insert **Table of Contents** via slash `/toc` or toolbar. Use the dropdown to set heading depth (H1 only, H1–H2, or H1–H3). The TOC auto-generates from your headings.

### Child Pages

Insert **Child Pages** via slash `/child` or toolbar (Pages only). A depth selector controls how many levels of sub-pages to show. Click the parent page button to select a different parent.

### Redirect

Insert a **Redirect** via slash `/redirect` or toolbar `Element > ↗ Insert redirect`. Inserting the block opens its settings modal immediately:

| Setting | Description |
|---------|-------------|
| Target URL | Two tabs — **External URL** for any address, or **Internal Content** to search the site (posts, pages, products, and standard links like Homepage or Shop). Internal picks stay live when URLs change. |
| Delay | Preset dropdown: **Instant**, **3 / 5 / 10 / 30 seconds**, or **Custom...** (up to 300 s) |

The block preview shows the URL and the delay. With a delay, visitors see a notice with a countdown plus a manual link; with Instant they are redirected immediately.

::: tip MULTIPLE REDIRECT BLOCKS
If a page contains several Redirect blocks, only the **first** one navigates; the others render as informational notices with a clickable link. Each notice keeps its own live countdown, and every Redirect block in the editor shows a warning badge so the setup is never a surprise.
:::

### External Media

Insert an image or video via **External Media** dialog (see [Media Library](#media-library) below). Videos appear as interactive iframe or `<video>` elements. Supported sources: YouTube, Vimeo, and direct MP4/WebM/OGG files. Images are supported from any website as long as direct linking is possible.

### Newsletter Form

Insert a quick **Newsletter Form** via slash `/newsletter` or toolbar. Click the ⚙ gear to configure placeholder text, button text, privacy page, and auto-tag subscribers. To create more complex newsletter forms see [Forms](../forms).

### Carousel

Insert a **Carousel** via slash `/carousel` or toolbar. This opens a full visual builder inside the editor:

- **Add images**: Click the empty state or the **+** button to open the media browser
- **External Media**: Use the 🔗 button in the media browser to add images from URL
- **Reorder**: Drag and drop images to rearrange
- **Remove**: Hover over an image and click ✕

Click the ⚙ gear to configure:

| Setting | Description |
|---------|-------------|
| Autoplay | Auto-advance slides |
| Slide Duration | Milliseconds per slide (default: 5000) |
| Show Arrows | Previous / Next navigation arrows |
| Show Dots | Dot indicators |
| Pause Button | Pause/resume autoplay |
| Image Fit | Cover (default), Contain, Fill, None, Scale Down |
| Height | Carousel height (default: `200px`). Accepts any CSS value: `300px`, `50vh`, etc. |
| Transition | Slide transition animation: Fade (default), Slide Left, Slide Right, Slide Up, Zoom, None |
| Lightbox | Click image to view full-size |
| Background Color | Carousel background |

### Link Buttons

Insert a **Link Buttons** group via slash `/link-buttons` or toolbar `Element > 🔘 Insert link buttons`. This creates a group that holds one or more styled call-to-action buttons.

Each group starts with a single button. Click the + in the group header to add more, or the ⋮/gear to open the group's tabbed settings dialog — one tab per button, labelled with that button's inline text (e.g. **Button 1**, **Button 2**).
If your cursor is inside a button's text, the dialog opens on that button's tab — press **Ctrl+K** while editing a button to jump straight to its settings.

Group-level settings:

| Setting | Description |
|---------|-------------|
| Layout | **Stacked (vertical)** — buttons one below the other (default), or **Side by side (horizontal)** — buttons in a row |
| Gap | Spacing between buttons (in px) |
| Add button | Adds a new button (a new settings tab appears) |
| Current button | The tabbed dialog highlights the active button being edited |

Per-button settings (each tab):

| Setting | Description |
|---------|-------------|
| Button text | Editable inline — click the button text and type |
| URL | Link destination — **External URL** tab for any address, **Internal Content** tab to search posts, pages and products (plus homepage, shop, cart, checkout and membership links when shop is enabled) |
| Open in new tab | Opens link in a new browser tab |
| Background Color | Button background color |
| Text Color | Button text color |
| Border Width | Border thickness (e.g., `0px`, `2px`) |
| Border Style | Solid, dashed, dotted, none |
| Border Color | Border color |
| Border Radius | Corner rounding (e.g., `4px`) |
| Padding | Inner spacing (e.g., `10px 20px`) |
| Alignment | Left, center, or right |
| Full Width | Stretch button to fill its container |

### Cards

Insert a **Cards** grid via slash `/cards` or toolbar `Element > 🃏 Insert cards grid`. This creates a responsive grid of image cards — a group that holds any number of cards with equal widths.

Each group starts with a single card. Click the + in the group header to add more; each card has its own ↑/↓ reorder and ✕ delete controls, and the ⚙ gear opens the group's tabbed settings dialog — one tab per card, labelled with that card's title. If your cursor is inside a card's title or description, the dialog opens on that card's tab. Deleting the last card removes the whole group.

The card title and description are editable inline — click the text and type, toolbar formatting (bold, italic, links) works on both. Click the 🖼 button on a card to pick an image from the media library (or enter an external URL); hover the image and click ✕ to remove it.

Group-level settings:

| Setting | Description |
|---------|-------------|
| Cards Background | Default background color for all cards |
| Corner Rounding | `0`, `4px`, `8px`, `12px` (default), `16px`, `24px` |
| Text Alignment | Left, center (default), or right — title and description alignment |
| Group Alignment | Left, center (default), or right — position of the grid when Group Width is narrower than full width |
| Gap | Spacing between cards (in px, default `12`) |
| Group Width | Grid width: percent (`50%`), pixels (`800px`), or `auto` for full width (default) |
| Lightbox | When checked, clicking a card image opens it enlarged in a lightbox overlay |

Per-card settings (each tab):

| Setting | Description |
|---------|-------------|
| Image | Preview with media-library picker, direct URL field, and remove button |
| Link | Whole-card link with **External URL** / **Internal Content** tabs — pick internal content from the searchable list or paste an external address (same picker as link buttons; empty for no link) |
| Target | Same window or new tab |
| Card Background | Per-card override (empty inherits the group background) |

### Hero

Insert a **Hero** section via slash `/hero`. A hero is a large introductory banner — ideal for landing pages, campaign pages, or section openers. It comes in two variants, switchable from the block header or the ⚙ settings dialog:

- **Split Hero** — heading, text, and buttons beside a media column (image or carousel)
- **CTA Card** — centered heading, text, and buttons on a card, without a media column

The heading and subtitle are edited inline — click the text and type. Toolbar formatting (bold, italic, links, text color) and alignment work on both.

Click the ⚙ gear to configure:

| Setting | Description |
|---------|-------------|
| Variants | **Split Hero** or **CTA Card** (switching to CTA hides the media options) |
| Hero Media (split only) | **Single Image** — pick from the media library or paste a URL (with **Image Fit**: cover, contain, fill, none, or scale-down), or **Carousel** — a full image slider with its own autoplay, transition, and height settings |
| Image Alt Text | Accessibility description of the image |
| Enable Lightbox | When checked, visitors can click the image to view it enlarged |
| Media Side | Show the media on the **right** or **left** of the text |
| Corner Badge | Small label overlapping the media corner (e.g. `Since 2024`), with customizable background and text colors (defaults to the theme accent) |
| Section Background | Theme-tinted gradient (default) or any custom color |
| Shadow | Soft (default), None, Small, Medium, Large, or Extra large — applied under the whole section (and the card in the CTA variant) |
| Shadow Color | Custom shadow color (default black) |
| Rounded | Corner rounding from `0px` to `32px` |
| Width | Section width: percent (`50%`), pixels (`800px`), or `auto` for full width |

Up to two call-to-action buttons (**Primary Button** and **Secondary Button**), each with:

| Setting | Description |
|---------|-------------|
| Button Label | Button text, also editable inline |
| URL | Link destination — pick an internal page or paste an external address |
| Target | Same window or new tab |
| Style | **Primary** (theme accent fill) or **Secondary** (outline) |
| Button Color | Custom background (empty keeps the theme style) |
| Button Text Color | Custom label color (empty keeps the default) |

Frontend behaviour: the split layout shows text and media **side by side on desktop** and **stacks them on mobile** — no extra configuration needed.

### Product

Insert a **Product** via slash `/product` or toolbar. The product picker shows a searchable, paginated grid of products with live prices. Click a product to select it — if the product has variations, a **Variation** dropdown appears below the grid. Choose a specific variation (e.g. "128 GB / USB 3.0") or leave it on **All variations (price range)** to display the min–max price range on the front end.

Click the ⚙ gear on the block to configure:

| Setting | Description |
|---------|-------------|
| Show Image | Toggle product image |
| Show Price | Toggle price display |
| Show Description | Toggle short description |
| Background Color | Product block background |
| Variation | Select a specific variation or "All variations (price range)" (only shown when the product has variations) |
| Change Product | Opens the product picker again to select a different product |

**Live data — no snapshots.** The block stores only the product ID (and optional variation ID). Name, price, image, and description are **always fetched live** from the shop when the page or editor loads. If the price, sale status, or image changes in the shop, the block updates automatically — no refresh button needed.

**Sale prices** are shown with the original price struck through. **Unavailable products** (draft, scheduled, expired, or out of stock) display a "Not publicly available" badge.

**Frontend link:** When a specific variation is selected, the "View product" link includes the variation attributes as query parameters (e.g. `/shop/product-name?capacity=128+GB&color=Red`), taking the visitor directly to that variation.

### Media + Text

Insert **Media + Text** via slash `/media` or toolbar. This creates a two-column layout:

- **Left** or **Right** layout — click ⇄ to swap sides
- **Image area** — click to open the media picker (or use the 🔗 External Media button)
- **Text area** — click to type your content directly
- **Width** — click the ⚙ gear (or double-click the block header) to limit the block width (`50%`, `800px`, or `auto` for full width)

### More Break

Insert **More Break** via slash `/more` or toolbar. This defines the cut-off point for blog listings — content before the break appears in previews, content after is hidden until the reader clicks "Read more".

- The divider shows an editable **label** field (e.g., "Continue reading"). When set, it replaces the default "Read more" text on blog listing cards.

### Next Page

Insert **Next Page** via slash `/next` or toolbar `Element > 📄 Next page block`. This inserts a page break divider that splits long content into multiple pages on the front end — available for posts, pages, and custom content types.

- The divider shows an editable **page title** field (e.g., "Chapter 2"). Titles are optional but recommended — they are used on the previous/next navigation buttons and tooltips.

### Latest Posts Feed

Insert **Latest Posts Feed** via slash `/latest` or toolbar (Newsletter content type only). Click the ⚙ gear to configure:

| Setting | Description |
|---------|-------------|
| Post Count | Number of posts to include (1–100, default 5) |
| Content Type | Post type to query (Posts + any active custom post type) |
| Category (optional) | Filter by category slug |
| Tags (optional) | Multi-select tags; switches to server-side search when the full list is long |

The block is rendered automatically when the newsletter is sent, with inline styling and dark-mode support.

### Unsubscribe Link

Insert **Unsubscribe Link** via slash `/unsubscribe` or toolbar (Newsletter content type only). This is a simple placeholder — no settings dialog. It is replaced with each subscriber's personal unsubscribe URL when the campaign is sent.

### Open Tracking Pixel

Insert **Open Tracking Pixel** via slash `/open` or toolbar (Newsletter content type only). This is a simple placeholder — no settings dialog. It renders an invisible tracking image when open tracking is enabled for the campaign.

---

## Adding Media

You can add media in three ways:

1. **Upload**: Via slash `/upload`, toolbar `🖼 Upload`, or `Ctrl+Shift+U` — opens a file picker, uploads the file, and inserts it. Images keep their thumbnail sizes; videos are inserted as video blocks; documents and archives (PDF, Office documents, archives, subtitles, MP3) are inserted as file links (see [File Links](#file-links)). A toast shows the file name and a live progress bar while uploading, and reports failures with the reason.

   ::: tip Re-uploading the same file
   The editor does not check whether a file already exists in your media library, so there is no "file already exists" warning — the upload simply adds another copy (with original filenames enabled, the copy is named `file-1.ext`). Existing files are never overwritten. To reuse the copy you already have, pick it from the **Media Library** instead.
   :::
2. **Media Library**: Browse existing images, videos, and files via `📁 Media library` or `Ctrl+Alt+M`
3. **External Media**: Paste a URL via `🔗 External Media` or `Ctrl+Alt+E` — images, YouTube, Vimeo, and direct MP4/WebM/OGG files are supported

### Video blocks

Videos inserted by any route become a single **Video** block. Double-click its header or click ⚙ to change the source, paste raw embed HTML, or set the width — **Full width**, **75%**, **50%**, or **Custom…** (any CSS value such as `400px` or `60%`). Narrower widths are centred. Videos always keep a 16:9 aspect ratio; there is no drag handle.

**Subtitles:** external embeds (YouTube, Vimeo) use the platform's own caption button — nothing to attach. For self-hosted videos, upload your `.vtt` file (SubRip `.srt`/`.sub` files are converted to WebVTT automatically on upload), then open the video settings and paste the embed HTML with a `<track>` element pointing at it:

```html
<video src="https://example.com/uploads/lesson.mp4" controls style="width:100%">
  <track src="/uploads/lesson-tr.vtt" kind="subtitles" srclang="tr" label="Türkçe" default>
</video>
```

The viewer then gets the standard caption button in the player. A **CC** badge in the top-right corner of the video signals that captions are available (hover shows a translated note), and the badge never blocks the player's own controls.

## Resizing Images

Select an image in the editor to reveal a **resize handle** at the bottom-right corner. Drag it to resize:

- **Aspect ratio locked** (default): Height auto-calculates to maintain proportions
- **Aspect ratio unlocked**: Width and height are independently adjustable

The resize handle respects the **Maintain aspect ratio** setting from the Image Settings dialog. Only standalone images can be resized — images inside composite blocks (carousel, media + text, product) are managed by their own block UI.

## Image Settings

Double-click an image, or click the ⚙ button that appears when an image is selected, to open the **Image Size** dialog:

| Setting | Description |
|---------|-------------|
| Image URL | The current image address. Edit it to point at a different file — handy when an image breaks because the file was moved or renamed. |
| Width | Desired width (in px or %) |
| Height | Desired height (in px or %) |
| Maintain aspect ratio | When checked, changing one dimension auto-updates the other |
| Unit | Pixels (`px`) or percentage (`%`) |
| Size | Thumbnail size for media library images: Full, Large (1024), Medium (300), Small (150). Only shown for images picked from the media library. |
| Rounded | Corner rounding in px (0–50) |
| Caption | Text shown below the image |
| Lightbox | When checked, visitors can click the image to view it enlarged |

---

## Media Library

The **Media Library** browser is accessible from toolbar `📁 Media library`, slash `/media`, or `Ctrl+Alt+M`.

- **Filter**: Switch between Images, Videos, Files (PDF, Office documents, RAR/7-ZIP archives, subtitles, TXT, audio), or All Types
- **Search**: Type to filter by filename
- **Pagination**: Navigate through pages of results
- **Insert**: Click an image to insert it, a video to embed it, or a file to insert it as a link
- **Preview**: Videos and audio files show a play (or music) badge — click it to play inside the picker without inserting anything; nothing is downloaded until then. Clicking the card itself still inserts the file. PDFs, Office documents, and archives show a type-colored icon.
- **Upload**: Drag and drop files directly into the dialog to upload them (requires the media upload permission). After the upload the list refreshes and the first uploaded file is inserted automatically.

### File Links

Picking a file (PDF, Office documents, RAR/7-ZIP archives, subtitles, TXT, audio) — from the **Files** filter in the media library, from **All Types**, or by uploading it directly — opens the **Insert File Link** dialog:

1. The selected file is shown with its icon and size
2. **Link text** is prefilled with the file name — edit it to whatever should be clickable in the content
3. **Open in new tab** is checked by default; uncheck it to open in the same tab
4. Click **Insert** — the file is inserted as a plain text link (`<a href="...">`)

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

## Tables

Insert a table via slash `/table`, toolbar `Tbl`, or `Ctrl+Alt+T`. The default table is 3×3 with a header row.

### Table Properties

Click ⚙ on the table bubble menu to open **Table Properties**:

| Setting | Description |
|---------|-------------|
| Border Width | Border thickness (e.g., `1px`, `2px`) |
| Border Style | Solid, dashed, dotted |
| Border Color | Color picker with hex input |
| Cell Padding | Padding inside cells (e.g., `8px`) |
| Width | Table width (e.g., `100%`) |
| Alignment | Default, Center, or Right |
| Header Row | Toggle header row on/off |

### Table Controls

A floating bubble menu appears when your cursor is inside a table, letting you add or delete rows and columns, open properties, or delete the entire table.

---

## HTML Mode

Click the **`</>`** button in the toolbar to switch to HTML source mode. Edit the raw HTML directly and switch back to the visual editor at any time.

::: warning NOTE
Embed blocks (forms, carousel, product, newsletter, buttons, cards, hero, and similar) are stored in a special format in HTML mode. When you switch back, they are parsed into visual blocks. Avoid editing them directly — broken markup may prevent the block from rendering.
:::

See [Developer → Shortcodes](../../developer/shortcodes) for the full technical reference.

---

## Additional Features

### Fullscreen Mode

Click the ⛶ button in the toolbar or press **Shift+F11** to toggle fullscreen editing mode. This expands the editor to fill the browser window, hiding distractions. Press **Escape** to exit fullscreen or close open dialogs.

### Word & Character Counter

The editor shows a live word and character count below the editing area, updated as you type. If the **Reading Time** setting is enabled in [Content Settings](../settings/content) → [Blog](../settings/content#blog), an estimated reading time is also displayed here.

### Unsaved Changes Warning

If you navigate away from a page with unsaved changes, the browser will warn you before leaving. This helps prevent accidental data loss.

### Color Picker

The color picker is used throughout the editor for text color, highlight, table borders, and block backgrounds. It offers:

- **Theme Colors**: Swatches for the active theme's configured color variables appear at the top, labeled with their names (e.g. *Primary Color*). These are managed under [Themes → Theme Colors](../appearance/themes#theme-colors)
- **Custom picker**: Drag inside the saturation/brightness square and along the hue slider to compose any color visually — the target field updates live while dragging
- **21 preset swatches**: Organized in three rows — cool hues, warm hues, and a neutral gray ramp
- **Hex input**: Type a custom hex value (e.g. `ff0000`) and press Enter
- **Remove**: For optional colors (block/table backgrounds), removes the color entirely

Picked colors are stored as hex values inside the content, so existing content keeps its colors even if the theme or its palette changes later.

### Emoji Picker

Click the 😊 button in the toolbar to open the emoji picker. It contains 50 commonly used emojis organized in a grid. Click any emoji to insert it at the cursor position.
