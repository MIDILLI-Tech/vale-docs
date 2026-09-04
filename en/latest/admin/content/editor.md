# Editor

Vale features a modern, block-based editor built on **Tiptap**. It allows you to create rich, interactive content without writing any HTML. Type `/` to open the command menu, or use the toolbar for quick access. Alternatively, [Markdown syntax](https://www.markdownguide.org/basic-syntax/) can also be used.

---

## Slash Commands

Type `/` at the start of a new line to open the command menu. All available commands:

| Icon | Command | Description |
|------|---------|-------------|
| ¶ | Paragraph | Plain text paragraph |
| 🖼 | Image | Upload an image or choose from the media library |
| 🔗 | External Media | Insert an image, YouTube, Vimeo, or direct video from URL |
| 📁 | Media Library | Browse and insert from the media library |
| 🎠 | Carousel | Image slider with autoplay and lightbox |
| 📧 | Newsletter Form | Single-input email subscription form |
| 📋 | Form | Embed a custom form by selecting its name |
| 🔘 | Link Buttons | Group of styled call-to-action buttons |
| 🛒 | Product | Embed a product from the shop |
| 🎟 | Coupon | Insert a discount code or dynamic coupon generator |
| 📑 | Table of Contents | Auto-generated TOC from headings |
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
| 😊 | … | Additional emoji, formatting, and special characters |

> Some commands are visibility-gated: **Product** and **Coupon** only appear when Shop is enabled, **Newsletter Form** when Newsletter is enabled, **Form** when Forms are enabled, **Child Pages** only on Page content type, and **More Break** is hidden on Pages and Products. **Latest Posts Feed**, **Subscriber Name Tag**, **Unsubscribe Link**, and **Open Track Tag** only appear when Newsletter is enabled **and** the content type is Newsletter.

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
| ⛶ | — | Toggle fullscreen |
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
| 🖼 | Ctrl+Shift+U | Upload image from your computer |
| 📁 | Ctrl+Alt+M | Open media library |
| 🔗 | Ctrl+Alt+E | Open external media dialog |
| 📧 | — | Insert newsletter form |
| 🎠 | — | Insert carousel |
| 📋 | Ctrl+Alt+F | Insert form |
| 🎟 | — | Insert coupon |
| 🛒 | — | Insert product |
| 🔘 | — | Insert link buttons group |
| 📑 | — | Insert table of contents |
| 📰 | — | Insert latest posts feed (newsletter only) |
| 👤 | — | Insert subscriber name tag (newsletter only) |
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
| Ctrl+Shift+U | Upload image |
| Ctrl+Alt+M | Open media library |
| Ctrl+Alt+E | Open external media dialog |
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
| Shift+Enter | Hard line break |
| Escape | Exit fullscreen / close dialogs |
| Ctrl+S | Save / update post |
| Ctrl+Shift+P | Open preview in a new tab |
| Ctrl+Shift+S | Show published version in a new tab |

---

## Blocks

**Blocks** are rich, embeddable content elements — from carousels and product cards to forms and newsletter signups. Insert them via the slash `/` command or the **Element** toolbar dropdown. They are shortcuts to create dynamic content, which otherwise may need deep HTML or external references to work. Many of the blocks offer additional settings which can be opened by double-clicking the header, or using the ⚙ gear icon. Vale editor has the following blocks:

### Forms

Insert a **Form** via slash `/form` or toolbar `Element > 📋 Insert form`. A dialog lists all available forms — click one to embed it. The block displays the form name and shortcode. Click ✕ to remove.

### Table of Contents

Insert **Table of Contents** via slash `/toc` or toolbar. Use the dropdown to set heading depth (H1 only, H1–H2, or H1–H3). The TOC auto-generates from your headings.

### Child Pages

Insert **Child Pages** via slash `/child` or toolbar (Pages only). A depth selector controls how many levels of sub-pages to show. Click the parent page button to select a different parent.

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
| URL | Link destination |
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

Alignment behaviour: in **vertical** layout each button spans its own row and can be aligned left/center/right across it. In **horizontal** layout the buttons are split into equal-width cells so each button aligns to its own side.

A button can be removed from its tab. Saving always stores the group as `[link_button_group]...[link_button]...[/link_button]`; the legacy single `[link_button]` shortcode still renders on the frontend for backward compatibility.

### Product

Insert a **Product** via slash `/product` or toolbar. The product picker shows a searchable, paginated grid of products. Click the ⚙ gear to configure:

| Setting | Description |
|---------|-------------|
| Show Image | Toggle product image |
| Show Price | Toggle price display |
| Show Description | Toggle short description |
| Background Color | Product block background |
| Refresh from Server | Reload product data from the database |

### Media + Text

Insert **Media + Text** via slash `/media` or toolbar. This creates a two-column layout:

- **Left** or **Right** layout — click ⇄ to swap sides
- **Image area** — click to open the media picker (or use the 🔗 External Media button)
- **Text area** — click to type your content directly

### More Break

Insert **More Break** via slash `/more` or toolbar. This defines the cut-off point for blog listings — content before the break appears in previews, content after is hidden until the reader clicks "Read more".

- The divider shows an editable **label** field (e.g., "Continue reading"). When set, it replaces the default "Read more" text on blog listing cards.
- In HTML mode the break is stored as `<!--more-->` or `<!--more text="..."-->`.
- WordPress `<!--more Keep reading -->` markers are converted to this format automatically during import.

### Next Page

Insert **Next Page** via slash `/next` or toolbar `Element > 📄 Next page block`. This inserts a page break divider that splits long content into multiple pages on the front end — available for posts, pages, and custom content types.

- The divider shows an editable **page title** field (e.g., "Chapter 2"). Titles are optional but recommended — they are used on the previous/next navigation buttons and tooltips.
- In HTML mode the break is stored as `<!--nextpage-->` or `<!--nextpage title="..."-->`.
- On the front end each segment becomes its own page with a pagination bar: previous/next buttons showing page titles, numbered page links (all numbers up to 7 pages; beyond that a compact view with jump menus), and a "Page X of Y" indicator.
- [Table of Contents](#table-of-contents) entries automatically link to the page containing that heading.

### Latest Posts Feed

Insert **Latest Posts Feed** via slash `/latest` or toolbar (Newsletter content type only). Click the ⚙ gear to configure:

| Setting | Description |
|---------|-------------|
| Post Count | Number of posts to include (1–100, default 5) |
| Content Type | Post type to query (Posts + any active custom post type) |
| Category (optional) | Filter by category slug |
| Tags (optional) | Multi-select tags; switches to server-side search when the full list is long |

The block stores `[latest_posts count="5" type="post" category="" tag=""]`. When the newsletter is sent, posts are rendered with inline CSS and dark-mode support.

### Unsubscribe Link

Insert **Unsubscribe Link** via slash `/unsubscribe` or toolbar (Newsletter content type only). This is a simple placeholder — no settings dialog. It stores `[unsubscribe_url]`, which is replaced with the subscriber's personal unsubscribe URL when the campaign is sent.

### Open Tracking Pixel

Insert **Open Tracking Pixel** via slash `/open` or toolbar (Newsletter content type only). This is a simple placeholder — no settings dialog. It stores `[open_pixel]`, which renders an invisible 1×1 tracking `<img>` when open tracking is enabled for the campaign.

---

## Image Handling

### Upload

You can add images in three ways:

1. **Upload**: Via slash `/image`, toolbar `🖼 Upload image`, or `Ctrl+Shift+U` — opens a file picker, uploads the file, and inserts it
2. **Media Library**: Browse existing images via `📁 Media library` or `Ctrl+Alt+M`
3. **External Media**: Paste a URL via `🔗 External Media` or `Ctrl+Alt+E`

### Resize

Select an image in the editor to reveal a **resize handle** at the bottom-right corner. Drag it to resize:

- **Aspect ratio locked** (default): Height auto-calculates to maintain proportions
- **Aspect ratio unlocked**: Width and height are independently adjustable

The resize handle respects the **Maintain aspect ratio** setting from the Image Settings dialog.

### Image Settings

Double-click an image, or click the ⚙ button that appears when an image is selected, to open the **Image Size** dialog:

| Setting | Description |
|---------|-------------|
| Width | Desired width (in px or %) |
| Height | Desired height (in px or %) |
| Unit | Pixels (`px`) or percentage (`%`) |
| Maintain aspect ratio | When checked, changing one dimension auto-updates the other |

---

## Media Library

The **Media Library** browser is accessible from toolbar `📁 Media library`, slash `/media`, or `Ctrl+Alt+M`.

- **Filter**: Switch between Images, Videos, or All files
- **Search**: Type to filter by filename
- **Pagination**: Navigate through pages of results
- **Insert**: Click an image to insert it, or a video to embed it

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
Embed blocks (Forms, Carousel, Product, Newsletter, Link Buttons, TOC, Pages, Video, Latest Posts Feed, Unsubscribe Link, Open Tracking Pixel) are stored as shortcodes or `<div>` wrappers in HTML mode. When you switch back, they are parsed into visual blocks. Be careful when editing these directly — invalid shortcode syntax may cause the block to not render.
:::

See [Developer → Shortcodes](../../developer/shortcodes) for the full list of supported shortcodes and their attributes.

---

## Additional Features

### Fullscreen Mode

Click the ⛶ button in the toolbar or press **Escape** to toggle fullscreen editing mode. This expands the editor to fill the browser window, hiding distractions.

### Word & Character Counter

The editor shows a live word and character count below the editing area, updated as you type. If the **Reading Time** setting is enabled in [Content Settings → Blog](../settings/content#blog), an estimated reading time is also displayed here.

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
