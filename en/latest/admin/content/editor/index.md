# Editor

Vale features a modern, block-based editor built on **Tiptap**. It allows you to create rich, interactive content without writing any HTML. Type / to open the command menu, or use the toolbar for quick access. Alternatively, [Markdown syntax](https://www.markdownguide.org/basic-syntax/) can also be used.

For content blocks and their settings, see [Editor Blocks](./blocks). For working with media (images, videos, files), see [Editor Media](./media).

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
