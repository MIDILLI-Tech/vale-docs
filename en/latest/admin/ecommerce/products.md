# Products

Vale provides a comprehensive system for selling physical and digital products, with advanced support for variations, inventory, multilingual content, and external marketplaces.

## Product Types

- **📦 Physical**: Tangible items that require shipping. Shows shipping configuration fields.
- **⬇️ Digital**: Downloadable files. When selected, a **Downloads** panel appears and the shipping type is automatically set to "Digital".

Switch between types using the toggle buttons at the top of the product form.

## Core Product Information

- **Name**: The title of the product.
- **Short Description**: A brief summary, typically shown near the price on the product page.
- **Description**: Detailed product information, powered by the [Editor](../content/editor/index).

## Pricing & Taxes

- **Regular Price**: The standard selling price.
- **Sale Price**: If set, the product will show as "On Sale" with the regular price crossed out.
- **Sale Schedule** (optional): Check this box to set a time window for the sale price. Define **Sale Starts** and **Sale Ends** dates. The sale price is only applied during this window. Leave both dates empty for an always-active sale. Use **Apply Sale Dates to All** to copy the schedule to all variations at once.
- **VAT Mode**:
  - **Use Global**: Inherit tax settings from **[Settings](../settings/) → [Tax](../settings/ecommerce#tax-regime)**.
  - **Custom**: Set a specific percentage for this product.
- **VAT Rate**: Required when VAT mode is Custom.
- **VAT Country Overrides**: Define different tax treatments for specific countries. For each country you can choose **Use Global**, **Custom rate**, or **No VAT**. This allows country-specific pricing, e.g., charging no VAT for non-EU customers while applying full VAT within the EU.

::: tip GLOBAL CAMPAIGNS
For store-wide promotions (e.g., Black Friday, holiday sales), create [Coupons](./coupons) instead of editing individual products. Coupons can apply percentage or fixed discounts across all products or specific categories.
:::

## Inventory

- **SKU**: Unique Stock Keeping Unit for tracking.
- **GTIN / MPN / Brand**: Standard identifiers used for external feeds and SEO. GTIN supports UPC, EAN, JAN, and ISBN.
- **Stock Qty**: The current number of items available. Leave at `0` and use **In Stock** status for unlimited inventory.
- **Stock Status**: *In Stock*, *Out of Stock*, or *On Backorder*.
- **Total Sold**: A manually adjustable counter of units sold. Links to the orders page containing this product.

## Digital Downloads

When the product type is set to **Digital**, a dedicated Downloads panel appears with these options:

### File Source

- **No file configured**: Placeholder for future file setup.
- **Internal file**: Pick one or more files from the **Media Library**. A modal browser with search, pagination, and file type icons lets you select files. Multiple files can be selected per product.
- **External URL**: Provide a direct download URL (must start with `https://` or `http://`). Toggle **Hide URL (Proxy Download)** to keep the final destination link hidden from customers. When proxy download is off, the destination URL (e.g., Dropbox) will be visible in the browser address bar.

### File Limits

- **Download Limit**: How many times a customer can download the file (0 = unlimited).
- **Expiry (days after purchase)**: How many days the download link remains valid (0 = never expires).

## Variations

Variations allow you to offer options like Size, Color, or Material. Click **+ Add Variation** to get started. Use the **Collapse All** / **Expand All** buttons to manage many variations at once.

### Attribute System

Each variation has one or more attribute pairs (Name + Value):

| Example | Name | Value |
|---------|------|-------|
| Single option | Color | Red |
| Dropdown options | Size | S,M,L,XL |
| Free text | Engraving | *(leave value empty)* |

- **Single value** (e.g., "Red"): Creates a fixed option.
- **Comma-separated values** (e.g., "S,M,L,XL"): Creates a dropdown selector on the front-end.
- **Empty value**: Creates a free-text input field on the front-end.

### Variation Fields

Each variation can have independent values for:

| Field | Description |
|-------|-------------|
| **Price** | Override the base product price |
| **Sale Price** | Sale price specific to this variation |
| **Sale Starts / Ends** | Sale schedule dates for this variation. Can be set globally via **Apply Sale Dates to All** |
| **SKU** | Unique SKU for this variation |
| **Stock Qty** | Independent inventory tracking |
| **Image** | A specific image displayed when this variation is selected. Choose from a modal media browser with search |
| **Download Mode** | `Inherit parent`, `Internal file`, `External file`, or `Physical` (no download). Digital variations can have their own files, limits, and expiry settings |
| **Shipping Override** | `Use parent`, `Use global`, `Free`, `Digital`, `Custom cost`, or `Do not ship` |
| **Estimated Delivery Time** | `Use parent`, `Use global settings`, or `Custom estimate` with a **Min** and **Max** range (in days) unique to this variation |
| **Shipping Country Overrides** | Per-country shipping rules for this variation (same options as main product). When **Custom cost** is selected, a **Min** and **Max** delivery estimate can be set per country |
| **Weight** | `Use parent` or `Custom weight` (kg) |
| **Dimensions** | `Use parent` or `Custom` length, width, height (cm) |
| **VAT Override** | `Use parent product`, `Use global`, or `Custom rate` |

### Sorting Variations

Use the drag handle (⠿) to reorder via drag-and-drop. Alternatively, use the arrow buttons to move a variation to the top, up, down, or bottom.

## Upsells & Cross-sells

Increase order value by suggesting related products:

- **Upsells**: Products a customer may also be interested in when viewing this product ("You may also like").
- **Cross-sells**: Products a customer may add to their cart alongside this product ("Frequently bought together").

Both use a search-as-you-type field. Select multiple products. They appear as removable tag-style badges.

## Shipping

The Shipping panel (collapsed by default on new products) controls physical fulfillment:

- **Shipping Class**: `Use global settings`, `Always free`, `Digital` (no shipping), `Custom cost`, or `Do not ship`.
- **Shipping Cost**: Custom shipping price (shown when class is **Custom cost**).
- **Estimated Delivery Time**: Tell customers how long delivery will take. Choose **Use global settings** to inherit the store default, or **Custom estimate** to enter your own **Min** and **Max** range (in days) for this product.
- **Weight (kg)**: Used to calculate shipping rates.
- **Dimensions (cm)**: Length, Width, Height: required by some carriers and marketplaces.
- **Country Overrides**: Adjust the delivery for specific countries. For each country you can set the class to `Use global`, `Free`, `Custom cost`, `Digital`, or `Do not ship`. When **Custom cost** is selected, also set a **Min** and **Max** delivery estimate (in days) just for that country. Useful for offering free shipping domestically while charging internationally.

A short hint below the **Country Overrides** heading, *"Adjust country-specific cost or delivery time"*: reminds you what this section is for.

::: tip WHERE CUSTOMERS SEE THE ESTIMATE
The estimated delivery range (e.g., "Estimated delivery: 3 to 5 days") appears on the **product page**, in the **cart**, on the **checkout** page, and in the **order confirmation** email. The most specific setting wins: a variation's estimate takes priority over its product, the product over the store's per-country rates, and per-country rates over the store default.
:::

## Comments & Voting

Override global comment and rating settings for this product:

- **Comments**: `Use global setting`, `Enabled`, or `Disabled`.
- **Star Ratings**: `Use global setting`, `Enabled`, or `Disabled`.

## Membership Access

When the [Membership](../ecommerce/memberships) module is active, the product editor shows an **Access** card (in the right-hand column) with **Required Membership Tags**. Pick one or more plan tags to restrict purchase of the product:

- Visitors without an active membership holding at least one of the required tags can still open the product page (title, images, description, and price remain visible).
- The **Add to Cart** button is hidden and replaced with a "members only" notice and a link to the membership plans page.
- Direct add-to-cart requests are rejected server-side, so the restriction cannot be bypassed by POSTing to the cart endpoint.

Leave all tags unchecked to keep the product purchasable by everyone.

## External Marketplaces (GMC)
This panel appears only when Google Merchant Center is enabled in settings. It controls how your product appears on Google Shopping, Bing, Meta, Pinterest, and other channels.

- **Exclude from all external marketplaces**: Temporarily removes this product from all feeds without deleting data.
- **Google Product Category**: Browse the official Google taxonomy with a dedicated category browser modal. A global default category can be set in settings.
- **Condition**: *New*, *Refurbished*, or *Used*.
- **Apparel fields** (shown when category is clothing-related): **Gender** (Male/Female/Unisex), **Age Group** (Newborn/Infant/Toddler/Kids/Adult), **Color**, **Size**, **Material**, **Pattern**.
- **Custom Labels 0 to 4**: Five custom text labels used for segmenting products in Google Shopping campaigns.

## Multilingual Products

If multi-language content is enabled, the sidebar shows:

- **Language**: Select the product's language (e.g., English, Turkish, German).
- **Translation Of**: Link this product to an original-language product. A searchable select field lists existing products in other languages. Click 📋 to copy the original's name, description, price, and SKU.
- **Translations Matrix**: A list showing all available languages and whether a translation exists for each. Click **+ Add** to create a new translation, or **Edit** to modify an existing one.

## Sidebar Controls

- **Featured Image**: The primary image shown in the shop listing. Choose from a media browser modal. Can be removed and replaced.
- **Product Gallery**: Add multiple images and videos. A preview shows the current item with Previous/Next navigation and a thumbnail strip (video thumbs show a 🎬 badge with a *Video* label). Click **+ Add** to open a multi-select media browser listing images and videos. Remove individual items with the ✕ button. Drag thumbnails to reorder. The saved order follows the strip. On the storefront, videos play with controls (no autoplay) and pause automatically when you switch slides.
- **Categories**: Check one or more hierarchical shop categories to assign the product.
- **Slug**: URL-friendly identifier. Auto-generated from the title. When editing, changing the slug offers a redirect checkbox (only when redirects are enabled in settings).
- **SEO**: Per-product meta title, description, Open Graph, and canonical URL. See [SEO Settings](../settings/seo).
- **Publish Box**:
  - **Status**: *Draft*, *Published*, *Unlisted*, or *Archived* (offline, kept for bookkeeping).
  - **Set schedule**: On a *Draft* or *Unlisted* product, tick **Set schedule** and pick a future date and time for the product to automatically go live. The list shows a *(Scheduled)* badge until then.
  - **Preview Draft** (Ctrl+Shift+P): Opens a preview of the current draft in a new tab (edit mode only).
  - **Show Active Version** (Ctrl+Shift+S): Opens the published product page (published products only).
  - **Export CSV** Appears below the slug to download this product's full data.

## Export Product

When editing any saved product, an **Export CSV** link appears at the bottom of the **Publish** block in the sidebar. Clicking it downloads a single CSV file containing every field for that product, including pricing, inventory, variations (as JSON), GMC attributes, shipping, VAT, and digital download settings. Use this to back up a product or to create a template row for bulk import.

### Bulk Export from the Product List

Tick one or more products in the list to open the bulk action bar, then click **Export** to download the selected rows in the same full CSV format.

- **Selected products**: the ticked rows are exported.
- **Select all matching**: when the list is filtered and you tick the header checkbox to select all matching products, **Export** downloads every product matching the current filters (across all pages), not just the visible rows.

For a full-catalog export, use the CLI instead: `php vale export:products --output=products.csv`.

## Product Categories

Manage your shop categories under **Products → Categories**. Categories can be nested (a category can have a parent) to build a hierarchy like *Clothing → Men → Shoes*.

- **Name**: The category name shown in the shop sidebar and on filtered listings.
- **Slug**: The URL-friendly version of the name. It's auto-generated as you type but can be manually edited.
- **Description**: A short plain-text summary of the category. When a customer filters the shop by this category, the description appears under the category title at the top of the listing.
- **Parent Category**: Nest this category under another one.

Each row has a **View** button that opens the shop filtered by that category in a new tab, so you can check how it looks to customers.

## Searching the Product List

The search box above the list matches the product **name** and **SKU**. Tick **Also search in content** next to it to also scan the **short description** and **description**. Full-content search scans every record, so it is noticeably slower on large catalogs.

## Import Your Own Catalog

Vale can also import products from its own CSV format. This is useful when you have a spreadsheet of products, want to migrate from another Vale instance without using the full-site JSON export, or need to bulk-edit products outside the admin panel.

### Getting Started

Download the template from **[Settings](../settings/) → [E-Commerce](../settings/ecommerce) → [Import](../settings/ecommerce#import)** tab (or use the **Export CSV** link on any product as a starting point). The template includes two example rows: a simple product and a variable product with two variations.

### CLI

::: tip FOR SYSADMINS
The commands below run in a terminal. If someone else manages hosting for you, forward this section to them.
:::

```bash
php vale import:products --file=products.csv
php vale import:products --file=products.csv --dry-run
php vale import:products --file=products.csv --import-media --update-existing
```

| Option | Description |
|--------|-------------|
| `--file=<path>` | **(Required)** Path to a Vale products CSV file |
| `--import-media` | Download product/variant images from URLs into the media library |
| `--update-existing` | Update products that already exist (matched by slug). Without this flag, existing products are skipped |
| `--dry-run` | Preview the import inside a transaction without writing to the database |

### Admin Panel

Go to **[Settings](../settings/) → [E-Commerce](../settings/ecommerce) → [Import](../settings/ecommerce#import)** tab and use the **Vale Products** card:

1. Download the template to see the required columns and example data.
2. Fill in your products. Only the **name** column is required; all other columns are optional.
3. Upload the CSV and choose whether to download images and whether to update existing products.
4. Click **Import Vale Products CSV**.

### CSV Columns

| Column | Description |
|--------|-------------|
| `name` | Product name (required) |
| `slug` | URL-friendly identifier. Auto-generated from name if left empty |
| `sku` | Stock keeping unit |
| `type` | `simple`, `variable`, or `digital` (default: `simple`) |
| `status` | `draft`, `published`, `unlisted`, `scheduled`, or `trash` (default: `draft`) |
| `language` | Language code (default: `en`) |
| `price` | Regular price |
| `sale_price` | Sale price |
| `sale_price_start` / `sale_price_end` | Sale window (ISO 8601 datetime or empty) |
| `short_description` / `description` | Product summaries |
| `stock_quantity` / `stock_status` | Inventory (`in_stock`, `out_of_stock`, `backorder`) |
| `weight`, `length`, `width`, `height`, `dimensions` | Shipping dimensions |
| `featured_image_id` | Existing media library ID |
| `featured_image_url` | Image URL: downloaded when `--import-media` is used |
| `gallery` | JSON array of image URLs |
| `shipping_class` | `use_global`, `free`, or `custom` |
| `shipping_cost` | Flat shipping cost |
| `shipping_country_overrides` | JSON object of country → cost overrides |
| `vat_mode` / `vat_rate` / `vat_country_overrides` | Tax settings |
| `download_source` | `none`, `internal`, or `external` |
| `download_url` | External download URL |
| `download_limit` / `download_expiry_days` | Digital download constraints |
| `download_files` | JSON array of file URLs to import as download files |
| `meta_title` / `meta_description` | SEO fields |
| `comment_status` / `vote_status` | `use_global`, `enabled`, or `disabled` |
| `total_sold` | Read-only sales counter |
| `gtin`, `mpn`, `brand`, `google_product_category` | Google Merchant Center identifiers |
| `condition`, `gender`, `age_group`, `color`, `size`, `material`, `pattern` | GMC product attributes |
| `custom_label_0` … `custom_label_4` | GMC custom labels |
| `gmc_exclude` | `1` to exclude from GMC feeds |
| `category_ids` | Comma-separated category IDs or slugs (e.g. `5,12` or `shoes,men`) |
| `upsell_ids` / `cross_sell_ids` | Comma-separated product IDs |
| `variations` | JSON array of variation objects (see below) |
| `created_at` / `updated_at` | Timestamps (optional) |

### Variations JSON

The `variations` column contains a JSON array where each object represents one variation (SKU, price, stock, attributes like Color/Size, image, download and shipping overrides). See the template's example row for the exact shape.

### Behavior

- **New products** are created with the provided slug (auto-suffixed if it already exists).
- **Existing products** are skipped unless `--update-existing` is passed. When updating, all editable fields are overwritten, categories and gallery are replaced, and old variations are removed before new ones are inserted.
- **Categories** in `category_ids` are resolved by ID or by slug. Missing slugs are left unmatched (no auto-creation in the generic importer).
- **Images** in `featured_image_url`, `gallery`, and `download_files` are only fetched when `--import-media` is set. URLs to private or loopback addresses are blocked.

## Import Products from Marketplaces

Instead of entering every product by hand, Vale can import your existing catalog from **Shopify**, **Etsy**, **eBay**, or **Amazon** using the command-line importer. Each marketplace importer reads the platform's own export file, creates the products including variations, resolves categories, and can download product images into the media library.

::: tip THE LINK IS IN THE PANEL
Each platform card in [Settings → E-Commerce → Import](../settings/ecommerce#import) has a **Get Export File** link that opens that platform's own export screen. Export the file there, then run the command below.
:::

::: tip FOR SYSADMINS
The importers below run in a terminal. Run with `--dry-run` first to preview. No data is written.
:::

### Getting Started

The importers are CLI commands that run from your Vale project root:

```bash
php vale import:shopify --file=products.csv
php vale import:etsy    --file=listings.csv
php vale import:ebay    --file=listings.csv
php vale import:amazon  --file=inventory.xlsx
```

Run with `--dry-run` first to preview how many products and variants would be imported or skipped. No data is written:

```bash
php vale import:shopify --file=products.csv --dry-run
```

| Option | Description |
|---|---|
| `--file=<path>` | **(Required)** Path to the platform export file (CSV, TSV, or Excel `.xlsx`/`.xlsm`) |
| `--import-media` | Download product/variant images into the media library |
| `--dry-run` | Preview the import without writing to the database (image downloads are skipped) |

**Common behavior:**

- **Status**: Products are created as **Published** when the source listing is active, otherwise as **Draft**.
- **Variations**: Multi-row products become variable products (Shopify handle, eBay item number, Amazon parent/child).
- **Categories**: Shopify (`Type` / `Product Category`), Etsy (`Section`), and eBay category names are matched or created automatically.
- **Media**: Image URLs are fetched only with `--import-media`. For security, requests to private or loopback addresses are blocked.
- **Prices**: Shopify and eBay compare-at / start prices become a **sale price** when they are higher than the selling price.

### Shopify (`import:shopify`)

**Source:** the platform's product export CSV.

| Data | Imported as |
|---|---|
| Title, Body (HTML) | Name, description |
| Option 1/2/3 Name + Value | Variation attributes (e.g. `Color: black`) |
| Variant Price / Compare At Price | Price / sale price |
| Variant Inventory Qty | Stock per variation |
| Variant SKU, Grams, Image | Variation SKU, weight (kg), image |
| Image Src / Position | Featured + gallery images |
| Type / Product Category | Shop category |
| Published | Status (published/draft) |

Rows sharing the same **Handle** are merged into a single variable product. The parent price is the lowest variant price and stock is the sum of all variant quantities.

> Shopify writes the option names (e.g. `Color`) only on the first variant row. Vale carries those names forward, so later values like `white` are still mapped to the correct attribute.

Re-running the command skips products that were already imported.

### Etsy (`import:etsy`)

**Source:** the platform's listings export CSV.

Each listing row becomes a **simple product**:

| Data | Imported as |
|---|---|
| Title, Description | Name, description |
| Price, Quantity | Price, stock |
| SKU | SKU |
| Section | Shop category |
| State (`active`) | Status |
| Image1 … Image10 | Featured + gallery images |

::: warning Etsy variation prices
Etsy listings exports carry a **single price per listing**: there is no per-variation price in the file. All imported variations inherit the listing price. When variations cost different amounts (e.g. one scent or style is more expensive), adjust the per-variation prices in the product editor after import.
:::

### eBay (`import:ebay`)

**Source:** the platform's active-listings export CSV.

Listings are grouped by **Item number**. Rows with an empty SKU or with `Variation details` containing semicolons are treated as the parent; the remaining rows become variations.

| Data | Imported as |
|---|---|
| Title, Description | Name, description |
| Variation details (`Color=Black; Size=XL`) | Variation attributes |
| Start price | Price (per variation) |
| Available quantity | Stock |
| Custom label (SKU) | SKU |
| PicURL / Image URL | Featured + gallery images |
| eBay category 1 name | Shop category |

### Amazon (`import:amazon`)

**Source:** the platform's active-listings inventory report.

Supports **English and German** column headers, and CSV, TSV, and Excel (`.xlsx`/`.xlsm`) reports.

| Data | Imported as |
|---|---|
| Item Name / Artikelname, Description | Name, description |
| Price (Ihr Preis / Listenpreis) | Price |
| Quantity (Menge) | Stock |
| SKU / Seller SKU | SKU |
| Product ID / ASIN | GTIN |
| Main image URL | Featured image |
| Status (active/aktiv) | Status |

**Parent/child variations** are detected automatically via the `Parentage level` column (`Parent`/`Eltern`): the variation theme (e.g. `SizeName/ColorName`) defines the attribute names, and each linked child becomes a variation. Already-imported SKUs are skipped on re-import.

::: tip SEE ALSO
- Manage your [Orders](./orders).
- Create [Coupons](./coupons) for your products.
- Configure [Global Tax & Shipping](../settings/ecommerce).
:::
