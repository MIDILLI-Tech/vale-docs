# Editor

Vale features a modern, block-based visual content editor built on **Tiptap**. It allows you to create rich, interactive content without writing any HTML. Type / to open the command menu, or use the toolbar for quick access. Alternatively, [Markdown syntax](https://www.markdownguide.org/basic-syntax/) can also be used.

For content blocks and their settings, see [Editor Blocks](./blocks). For working with media (images, videos, files), see [Editor Media](./media).

---

## Real-Time Collaboration

When collaboration is enabled in **[Settings](../../settings/content#collaboration)**, several admins can edit the same content at the same time. Each participant appears as a colored caret with their name, and text, blocks and image changes are merged live. A presence strip directly above the content shows how many admins are connected plus one colored initial per editor. An admin who opens the same record in a second tab keeps a single entry; the tooltip on that chip shows the tab count, and clicking it jumps to (or follows) your other tab. If the collaboration server cannot be reached, the count is replaced by a small **!** badge — hover it to see why. Editing continues locally and the form still saves normally. Click an editor's initial to jump to their cursor; click it again to follow them as they type, and once more to stop. When they are working in a **Media + Text** block, jump and follow go to that block, because its text column is not part of the shared document.

- It applies to **saved** content: the shared room is tied to the record, so brand-new posts and pages stay single-user until saved once.
- Draft recovery is paused while collaboration is active — a browser-local draft cannot be merged into a shared document. Instead, the editor keeps a local copy of the shared document, so unsaved work survives a reload, a closed tab or an unreachable server. When you come back, a banner offers **Restore changes** or **Discard changes**; the copy is also dropped when the record was saved elsewhere in the meantime. On create screens drafts keep working.
- Saving is unchanged — use the normal save button. A collaborator's changes are only written to the database once someone saves the form.
- If the collaboration server cannot be reached, the editor keeps working locally and the dashboard shows a warning. See [Content Settings](../../settings/content#collaboration) for the server address and shared secret.

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
| 🏁 | Hero | Marketing hero: split layout or centered CTA |
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
|  | Divider | Horizontal rule |
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
| **A** with color |  | Text color (opens color picker) |
| **A** with bg |  | Highlight / background color |
| 🔗 | Ctrl+K | Insert / edit link |
| Tbl | Ctrl+Alt+T | Insert table |
|  | Ctrl+Alt+D | Divider (horizontal rule) |
| {} | Ctrl+Alt+C | Code block |
| ⏎ | Shift+Enter | Hard line break |
| 😊 |  | Emoji picker (50 presets) |
| ⛶ | Shift+F11 | Toggle fullscreen |
| `</>` |  | Toggle HTML source mode |

### Formatting Dropdown (label: **Fmt**)

| Button | Shortcut | Action |
|--------|----------|--------|
| ~~S~~ | Ctrl+Shift+X | Strikethrough |
| `<>` |  | Inline code |
| X₂ |  | Subscript |
| X² |  | Superscript |
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
| 📧 |  | Insert newsletter form |
| 🎠 |  | Insert carousel |
| 🏁 |  | Insert hero |
| 📋 | Ctrl+Alt+F | Insert form |
| 🎟 |  | Insert coupon |
| 🛒 |  | Insert product |
| 🔘 |  | Insert link buttons group |
| 🃏 |  | Insert cards grid |
| 📑 |  | Insert table of contents |
| ↗ |  | Insert redirect |
| 📰 |  | Insert latest posts feed (newsletter only) |
| 🔕 |  | Insert unsubscribe link (newsletter only) |
| 👁 |  | Insert open tracking pixel (newsletter only) |
| ⊡ |  | Insert more break |
| 📄 |  | Insert next page block |
| 👶 |  | Insert child pages |

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
| ⛶ | Merge the selected cells |
| ⧉ | Split the current cell |
| ▦ | Open cell properties |
| ⚙ | Open table properties |
| ✕ | Delete table |

### Tables

Insert a table with **Ctrl+Alt+T** or from the slash menu. With the cursor inside a table, the floating toolbar adds and removes rows and columns, merges and splits cells, and opens the two settings dialogs.

**Table properties** (⚙) configure the table as a whole:

| Field | What it does |
|-------|--------------|
| Border | Size, style and color of the grid, each in its own labeled field. Leaving Size and Color empty keeps the theme's default border (shown as the `Theme default` placeholder). |
| Cell padding | Inner spacing of every cell. |
| Width | Explicit width (`400px`, `50%`). It wins over the column widths produced by dragging a column handle. |
| Alignment | Left, center or right, stored as automatic margins on the table. |
| Header row | Turns the first row into header cells and back. |

Saving only writes the fields you changed. A table keeps the rest of its inline style, so changing the alignment never rewrites its border, padding or width.

**Cell properties** (▦) apply to the selected cell or cell range:

- **Background** — fill color of the cell, with **Clear** to remove it.
- **Text alignment** and **Vertical alignment** — where the content sits inside the cell.

The editor renders tables with the active theme's border, header and spacing defaults, so the layout you see while writing is the layout visitors get.

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


## HTML Mode

Click the **`</>`** button in the toolbar to switch to HTML source mode. Edit the raw HTML directly and switch back to the visual editor at any time.

::: warning NOTE
Embed blocks (forms, carousel, product, newsletter, buttons, cards, hero, and similar) are stored in a special format in HTML mode. When you switch back, they are parsed into visual blocks. Avoid editing them directly. Broken markup may prevent the block from rendering.
:::

See [Developer → Shortcodes](../../../developer/shortcodes) for the full technical reference.

---

## Additional Features

### Fullscreen Mode

Click the ⛶ button in the toolbar or press **Shift+F11** to toggle fullscreen editing mode. This expands the editor to fill the browser window, hiding distractions. Press **Escape** to exit fullscreen or close open dialogs.

### Word & Character Counter

The editor shows a live word and character count below the editing area, updated as you type. If the **Reading Time** setting is enabled in [Content Settings](../../settings/content) → [Blog](../../settings/content#blog), an estimated reading time is also displayed here.

### Unsaved Changes Warning

If you navigate away from a page with unsaved changes, the browser will warn you before leaving. This helps prevent accidental data loss.

### Last Save Information

The header of a saved post or page shows who saved it last and when — for example **Last saved by Jane Doe · Mar 4, 2026 14:05**. The name is the author of the newest revision, recorded just before each save; the time comes from the record itself. With revision history turned off in [Content Settings](../../settings/content#blog), only **Last saved · …** appears. Create screens do not show the line.

### Recovering Unsaved Drafts

The editor keeps a copy of your work in the browser while you type, so a crash, a closed tab or a failed save does not lose it.

- Reopen the same editing screen and the copy is loaded automatically when it still differs from the saved version. A warning above the editor names the field and shows when the copy was stored.
- **Show differences** compares the saved version (rows marked **−**) with the recovered copy (rows marked **+**). Only the words that differ are highlighted, and the counters at the top right add those words up.
- **Discard draft** restores the saved version and deletes the copy. You are asked to confirm first.
- **×** hides the warning but keeps the copy, which returns the next time you open the screen.

The copy stays in this browser. It is not shared with other browsers, devices or users, and two tabs editing the same item overwrite each other's copy.


### Color Picker

The color picker is used throughout the editor for text color, highlight, table borders, and block backgrounds. It offers:

- **Theme Colors**: Swatches for the active theme's configured color variables appear at the top, labeled with their names (e.g. *Primary Color*). These are managed under [Themes → Theme Colors](../../appearance/themes#theme-colors)
- **Custom picker**: Drag inside the saturation/brightness square and along the hue slider to compose any color visually. The target field updates live while dragging
- **21 preset swatches**: Organized in three rows: cool hues, warm hues, and a neutral gray ramp
- **Hex input**: Type a custom hex value (e.g. `ff0000`) and press Enter
- **Remove**: For optional colors (block/table backgrounds), removes the color entirely

Picked colors are stored as hex values inside the content, so existing content keeps its colors even if the theme or its palette changes later.

### Emoji Picker

Click the 😊 button in the toolbar to open the emoji picker. It contains 50 commonly used emojis organized in a grid. Click any emoji to insert it at the cursor position.
