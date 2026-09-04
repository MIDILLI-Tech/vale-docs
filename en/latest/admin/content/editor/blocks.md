# Editor Blocks

::: tip AI AGENTS
Using an AI coding agent? Load the [`vale-editor-block`](../../../developer/agent-skills) skill for a new TipTap block, settings dialog, converter, styles, and toolbar registration.
:::

This page covers the content blocks available in the Vale Editor and their settings. For the editor overview, toolbar, and keyboard shortcuts, see [Editor](./index). For working with media (images, videos, files), see [Editor Media](./media).

## Blocks

**Blocks** are rich, embeddable content elements, from carousels and product cards to forms and newsletter signups. Insert them via the slash `/` command or the **Element** toolbar dropdown. They are shortcuts to create dynamic content, which otherwise may need deep HTML or external references to work. Many of the blocks offer additional settings which can be opened by double-clicking the header, or using the ⚙ gear icon. Every block header also has a ⧉ button that duplicates the block with identical content right below it (or press **Ctrl+Shift+D** on the selected block). Vale editor has the following blocks:

### Forms

Insert a **Form** via slash `/form` or toolbar `Element > 📋 Insert form`. A dialog lists all available forms. Click one to embed it. The block displays the form name and shortcode. Click ✕ to remove.

### Table of Contents

Insert **Table of Contents** via slash `/toc` or toolbar. Use the dropdown to set heading depth (H1 only, H1 and H2, or H1 through H3). The TOC auto-generates from your headings.

### Child Pages

Insert **Child Pages** via slash `/child` or toolbar (Pages only). A depth selector controls how many levels of sub-pages to show. Click the parent page button to select a different parent.

### Redirect

Insert a **Redirect** via slash `/redirect` or toolbar `Element > ↗ Insert redirect`. Inserting the block opens its settings modal immediately:

| Setting | Description |
|---------|-------------|
| Target URL | Two tabs: **External URL** for any address, or **Internal Content** to search the site (posts, pages, products, and standard links like Homepage or Shop). Internal picks stay live when URLs change. |
| Delay | Preset dropdown: **Instant**, **3 / 5 / 10 / 30 seconds**, or **Custom...** (up to 300 s) |

The block preview shows the URL and the delay. With a delay, visitors see a notice with a countdown plus a manual link; with Instant they are redirected immediately.

::: tip MULTIPLE REDIRECT BLOCKS
If a page contains several Redirect blocks, only the **first** one navigates; the others render as informational notices with a clickable link. Each notice keeps its own live countdown, and every Redirect block in the editor shows a warning badge so the setup is never a surprise.
:::

### External Media

Insert an image or video via **External Media** dialog (see [Media Library](./media#media-library) below). Videos appear as interactive iframe or `<video>` elements. Supported sources: YouTube, Vimeo, and direct MP4/WebM/OGG files. Images are supported from any website as long as direct linking is possible.

### Newsletter Form

Insert a quick **Newsletter Form** via slash `/newsletter` or toolbar. Click the ⚙ gear to configure placeholder text, button text, privacy page, and auto-tag subscribers. To create more complex newsletter forms see [Forms](../../forms).

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

Each group starts with a single button. Click the + in the group header to add more, or the ⚙ (gear) to open the group's tabbed settings dialog: one tab per button, labelled with that button's inline text (e.g. **Button 1**, **Button 2**).
If your cursor is inside a button's text, the dialog opens on that button's tab. Press **Ctrl+K** while editing a button to jump straight to its settings.

Group-level settings:

| Setting | Description |
|---------|-------------|
| Layout | **Stacked (vertical)**: buttons one below the other (default), or **Side by side (horizontal)**: buttons in a row |
| Gap | Spacing between buttons (in px) |
| Add button | Adds a new button (a new settings tab appears) |
| Current button | The tabbed dialog highlights the active button being edited |

Per-button settings (each tab):

| Setting | Description |
|---------|-------------|
| Button text | Editable inline: click the button text and type |
| URL | Link destination: **External URL** tab for any address, **Internal Content** tab to search posts, pages and products (plus homepage, shop, cart, checkout and membership links when shop is enabled) |
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

Insert a **Cards** grid via slash `/cards` or toolbar `Element > 🃏 Insert cards grid`. This creates a responsive grid of image or video cards - a group that holds any number of cards with equal widths.

Each group starts with a single card. Click the + in the group header to add more; each card has its own ↑/↓ reorder and ✕ delete controls, and the ⚙ gear opens the group's tabbed settings dialog, with one tab per card, labelled with that card's title. If your cursor is inside a card's title or description, the dialog opens on that card's tab. Deleting the last card removes the whole group.

The card title and description are editable inline. Click the text and type, and toolbar formatting (bold, italic, links) works on both. Click the 🖼 button on a card to pick an image or video from the media library (or enter an external URL). Hover the image and click ✕ to remove it.

Group-level settings:

| Setting | Description |
|---------|-------------|
| Cards Background | Default background color for all cards |
| Corner Rounding | `0`, `4px`, `8px`, `12px` (default), `16px`, `24px` |
| Text Alignment | Left, center (default), or right: title and description alignment |
| Group Alignment | Left, center (default), or right: position of the grid when Group Width is narrower than full width |
| Gap | Spacing between cards (in px, default `12`) |
| Group Width | Grid width: percent (`50%`), pixels (`800px`), or `auto` for full width (default) |
| Lightbox | When checked, clicking a card image opens it enlarged in a lightbox overlay |

Per-card settings (each tab):

| Setting | Description |
|---------|-------------|
| Image | Preview with media-library picker, direct URL field, and remove button |
| Link | Whole-card link with **External URL** / **Internal Content** tabs: pick internal content from the searchable list or paste an external address (same picker as link buttons; empty for no link) |
| Target | Same window or new tab |
| Card Background | Per-card override (empty inherits the group background) |

### Hero

Insert a **Hero** section via slash `/hero`. A hero is a large introductory banner, ideal for landing pages, campaign pages, or section openers. It comes in two variants, switchable from the block header or the ⚙ settings dialog:

- **Split Hero**: heading, text, and buttons beside a media column (image or carousel)
- **CTA Card**: centered heading, text, and buttons on a card, without a media column

The heading and subtitle are edited inline. Click the text and type. Toolbar formatting (bold, italic, links, text color) and alignment work on both.

Click the ⚙ gear to configure:

| Setting | Description |
|---------|-------------|
| Variants | **Split Hero** or **CTA Card** (switching to CTA hides the media options) |
| Hero Media (split only) | **Single Image**: pick from the media library or paste a URL (with **Image Fit**: cover, contain, fill, none, or scale-down), or **Carousel**: a full image slider with its own autoplay, transition, and height settings |
| Image Alt Text | Accessibility description of the image |
| Enable Lightbox | When checked, visitors can click the image to view it enlarged |
| Media Side | Show the media on the **right** or **left** of the text |
| Corner Badge | Small label overlapping the media corner (e.g. `Since 2024`), with customizable background and text colors (defaults to the theme accent) |
| Section Background | Theme-tinted gradient (default) or any custom color |
| Shadow | Soft (default), None, Small, Medium, Large, or Extra large: applied under the whole section (and the card in the CTA variant) |
| Shadow Color | Custom shadow color (default black) |
| Rounded | Corner rounding from `0px` to `32px` |
| Width | Section width: percent (`50%`), pixels (`800px`), or `auto` for full width |

Up to two call-to-action buttons (**Primary Button** and **Secondary Button**), each with:

| Setting | Description |
|---------|-------------|
| Button Label | Button text, also editable inline |
| URL | Link destination: pick an internal page or paste an external address |
| Target | Same window or new tab |
| Style | **Primary** (theme accent fill) or **Secondary** (outline) |
| Button Color | Custom background (empty keeps the theme style) |
| Button Text Color | Custom label color (empty keeps the default) |

Frontend behaviour: the split layout shows text and media **side by side on desktop** and **stacks them on mobile**. No extra configuration is needed.

### Product

Insert a **Product** via slash `/product` or toolbar. The product picker shows a searchable, paginated grid of products with live prices. Click a product to select it. If the product has variations, a **Variation** dropdown appears below the grid. Choose a specific variation (e.g. "128 GB / USB 3.0") or leave it on **All variations (price range)** to display the full price range on the front end.

Click the ⚙ gear on the block to configure:

| Setting | Description |
|---------|-------------|
| Show Image | Toggle product image |
| Show Price | Toggle price display |
| Show Description | Toggle short description |
| Background Color | Product block background |
| Variation | Select a specific variation or "All variations (price range)" (only shown when the product has variations) |
| Change Product | Opens the product picker again to select a different product |

**Live data: no snapshots.** The block stores only the product ID (and optional variation ID). Name, price, image, and description are **always fetched live** from the shop when the page or editor loads. If the price, sale status, or image changes in the shop, the block updates automatically. No refresh button is needed.

**Sale prices** are shown with the original price struck through. **Unavailable products** (draft, scheduled, expired, or out of stock) display a "Not publicly available" badge.

**Frontend link:** When a specific variation is selected, the "View product" link includes the variation attributes as query parameters (e.g. `/shop/product-name?capacity=128+GB&color=Red`), taking the visitor directly to that variation.

### Media + Text

Insert **Media + Text** via slash `/media` or toolbar. This creates a two-column layout:

- **Left** or **Right** layout: click ⇄ to swap sides
- **Image area**: click to open the media picker (or use the 🔗 External Media button)
- **Text area**: click to type your content directly
- **Width**: click the ⚙ gear (or double-click the block header) to limit the block width (`50%`, `800px`, or `auto` for full width)

### More Break

Insert **More Break** via slash `/more` or toolbar. This defines the cut-off point for blog listings. Content before the break appears in previews, and content after is hidden until the reader clicks "Read more".

- The divider shows an editable **label** field (e.g., "Continue reading"). When set, it replaces the default "Read more" text on blog listing cards.
- A post without a More Break falls back to its **Excerpt**, and then to an automatic summary of the first words of the content. Both the excerpt and the automatic summary are used for the RSS item description and the meta description too. The summary length is set by **Listing summary length** in [Content Settings](../../settings/content#blog).

### Next Page

Insert **Next Page** via slash `/next` or toolbar `Element > 📄 Next page block`. This inserts a page break divider that splits long content into multiple pages on the front end. Available for posts, pages, and custom content types.

- The divider shows an editable **page title** field (e.g., "Chapter 2"). Titles are optional but recommended, and they are used on the previous/next navigation buttons and tooltips.

### Latest Posts Feed

Insert **Latest Posts Feed** via slash `/latest` or toolbar (Newsletter content type only). Click the ⚙ gear to configure:

| Setting | Description |
|---------|-------------|
| Post Count | Number of posts to include (1 to 100, default 5) |
| Content Type | Post type to query (Posts + any active custom post type) |
| Category (optional) | Filter by category slug |
| Tags (optional) | Multi-select tags; switches to server-side search when the full list is long |

The block is rendered automatically when the newsletter is sent, with inline styling and dark-mode support.

### Unsubscribe Link

Insert **Unsubscribe Link** via slash `/unsubscribe` or toolbar (Newsletter content type only). This is a simple placeholder with no settings dialog. It is replaced with each subscriber's personal unsubscribe URL when the campaign is sent.

### Open Tracking Pixel

Insert **Open Tracking Pixel** via slash `/open` or toolbar (Newsletter content type only). This is a simple placeholder with no settings dialog. It renders an invisible tracking image when open tracking is enabled for the campaign.

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
