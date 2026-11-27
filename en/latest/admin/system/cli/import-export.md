# Import and Export Commands

Part of [CLI Commands](../cli).

Move content between Vale installations and import posts, pages, products, media and users from WordPress, Ghost, Shopify, Etsy, eBay and Amazon.

::: tip IN THE ADMIN PANEL
Full-site **Export / Import** lives under **[Settings → Maintenance → Data](../../settings/maintenance#data)**. WordPress, Ghost and marketplace imports are CLI-only because they read local files or a source database; product CSV export is on each product's edit page.
:::

## Import

Vale can import content from WordPress and Ghost (posts, pages, products, media, users, categories, tags, and SEO metadata), and products from Shopify, Etsy, eBay, and Amazon.

### `import:wordpress`

Import content from WordPress. Supports three modes: **WXR (XML) export**, **live database connection**, and **SQL dump file**.

```bash
php vale import:wordpress --file=export.xml                             # WXR mode
php vale import:wordpress --wp-db=wordpress --wp-user=root              # Live DB mode
php vale import:wordpress --db-dump=wordpress.sql                       # SQL dump mode
```

| Option | Description |
|---|---|
| `--file=<path>` | Path to a WordPress WXR (XML) export file |
| `--wp-db=<name>` | WordPress database name (live connection) |
| `--wp-user=<user>` | WordPress database user |
| `--wp-pass=<pass>` | WordPress database password |
| `--wp-host=<host>` | WordPress database host (default: `127.0.0.1`) |
| `--wp-port=<port>` | WordPress database port (default: `3306`) |
| `--wp-prefix=<prefix>` | WordPress table prefix (default: `wp_`) |
| `--db-dump=<path>` | Path to a WordPress SQL dump file |
| `--media-path=<dir>` | Path to `wp-content/uploads` for local media copy |
| `--import-media` | Import media files (requires `--media-path` or `--download-media`) |
| `--download-media` | Download media files from URLs (DB and WXR modes). Thumbnails and WebP variants are generated automatically after the import |
| `--allow-private-hosts` | Allow media downloads from private/internal addresses, required when the source WordPress runs on `localhost` or a LAN IP (refused by default) |
| `--cleanup` | Drop WordPress source tables after import (live DB mode only, with confirmation) |
| `--cleanup-vale` | Drop WP-prefixed tables from Vale's database (auto-runs for `--db-dump`) |
| `--fix-slugs` | Fix non-compliant slugs already in the database (auto-sanitized during import) |
| `--dry-run` | Preview changes without writing to the database |
| `--post-types=<types>` | Comma-separated list of additional post types to import |

**Imported data:** users, categories, tags, custom terms, posts, pages, products, newsletter subscribers (MailPoet), media, SEO metadata (Yoast / Rank Math), post relationships (parent/child).

For a complete walkthrough, see [Migrating from WordPress](../../migration/migrate-from-wordpress).

### `import:ghost`

Import content from a Ghost JSON export file.

```bash
php vale import:ghost --file=ghost.json
php vale import:ghost --file=ghost.json --download-media --ghost-url=https://my-old-blog.com
```

| Option | Description |
|---|---|
| `--file=<path>` | **(Required)** Path to a Ghost JSON export file |
| `--download-media` | Download feature/OG/inline images (including `srcset` responsive variants), register them in the media library and rewrite post HTML to local `/uploads/…` paths |
| `--ghost-url=<url>` | Base URL of the source Ghost site (resolves relative `/content/images/` URLs) |
| `--dry-run` | Preview changes without writing to the database |

**Imported data:** authors, tags, posts (with HTML body, excerpt, feature image, SEO metadata, and publishing dates). With `--download-media`, images are fetched into the media library and thumbnails/WebP variants are generated automatically.

For a complete walkthrough, see [Migrating from Ghost](../../migration/migrate-from-ghost).

### `import:shopify`

Import products from a Shopify product export CSV. Rows sharing the same Shopify **Handle** become variations of one variable product; already imported products are skipped.

```bash
php vale import:shopify --file=products.csv
php vale import:shopify --file=products.csv --dry-run
```

| Option | Description |
|---|---|
| `--file=<path>` | **(Required)** Path to a Shopify products CSV file |
| `--import-media` | Download product/variant images into the media library |
| `--dry-run` | Preview the import without writing to the database (image downloads are skipped) |

### `import:etsy`

Import products from an Etsy listings CSV export. Each listing becomes a simple product.

::: warning
Etsy listings exports carry a **single price per listing**; per-variation prices cannot be imported. Adjust them in the product editor after import when variations differ in price.
:::

```bash
php vale import:etsy --file=listings.csv
php vale import:etsy --file=listings.csv --dry-run
```

| Option | Description |
|---|---|
| `--file=<path>` | **(Required)** Path to an Etsy listings CSV file |
| `--import-media` | Download product images into the media library |
| `--dry-run` | Preview the import without writing to the database (image downloads are skipped) |

### `import:ebay`

Import products from an eBay listings CSV export, grouped by item number with parent/child variation support.

```bash
php vale import:ebay --file=listings.csv
php vale import:ebay --file=listings.csv --dry-run
```

| Option | Description |
|---|---|
| `--file=<path>` | **(Required)** Path to an eBay listings CSV file |
| `--import-media` | Download product/variant images into the media library |
| `--dry-run` | Preview the import without writing to the database (image downloads are skipped) |

### `import:amazon`

Import products from an Amazon inventory report (CSV, TXT, XLSM, or XLSX). Supports English and German headers and parent/child variations; already imported SKUs are skipped.

```bash
php vale import:amazon --file=inventory.xlsx
php vale import:amazon --file=inventory.xlsx --dry-run
```

| Option | Description |
|---|---|
| `--file=<path>` | **(Required)** Path to an Amazon inventory report file |
| `--import-media` | Download product images (if URLs are present in the report) |
| `--dry-run` | Preview the import without writing to the database (image downloads are skipped) |

For all marketplace importers, `--dry-run` runs the full import logic inside a database transaction and rolls it back at the end, so the reported product, variant, and skip counts reflect what a live import would do.

For details on what each importer maps, see [Products → Import Products from Marketplaces](../../ecommerce/products#import-products-from-marketplaces).

### `import:products`

Import products from a Vale product CSV file. Supports all product fields, variations (as JSON), category resolution by ID or slug, and optional image downloads.

```bash
php vale import:products --file=products.csv
php vale import:products --file=products.csv --dry-run
php vale import:products --file=products.csv --import-media --update-existing
```

| Option | Description |
|--------|-------------|
| `--file=<path>` | **(Required)** Path to a Vale products CSV file |
| `--import-media` | Download product/variant images from URLs into the media library |
| `--update-existing` | Update existing products matched by slug instead of skipping them |
| `--dry-run` | Preview the import inside a transaction without writing to the database |

Download the template from **[Settings](../../settings/) → [E-Commerce](../../settings/ecommerce/) → [Import](../../settings/ecommerce/import#import)** tab, or export a single product from the product edit page for a starting point.

### `export:products`

Export products to a CSV file.

```bash
php vale export:products
php vale export:products --output=my-products.csv --status=published
```

| Option | Description |
|--------|-------------|
| `--output` / `-o` | Output file path (default: `products-{date}.csv`) |
| `--status` | Filter by status: `published`, `draft`, or `all` (default: `all`) |
| `--dry-run` | Show how many products match the filters without writing a file |

The CSV includes all product fields plus a `variations` column containing a JSON array of variation objects.

---

## Export / Import

Vale can export its entire site data (Posts, Pages, Products, Orders, Users, Categories, Tags, SEO metadata, Settings, Media, Content Types, Menus, Comments, Forms, Coupons, Redirects, Tax Rates, and Membership Plans) as JSON or ZIP for migration to another Vale instance.

### `export`

Export site data to a file.

```bash
php vale export
```

By default, exports all supported types to a timestamped JSON file (e.g., `export-2026-07-08-120000.json`).

| Option | Description |
|---|---|
| `--type` / `-t` | Export only specific type(s): `pages`, `posts`, `products`, `orders`, `users`, `categories`, `tags`, `seo_meta`, `site_settings`, `media`, `content_types`, `menus`, `comments`, `forms`, `coupons`, `redirects`, `tax_rates`, `membership_plans`. Repeat for multiple types (e.g., `-t pages -t posts`) |
| `--output` / `-o` | Output file path. Use a `.zip` extension to create a ZIP archive instead of a JSON file |
| `--dry-run` | Show the record count per type and the target file without writing anything |
| `--include-secrets` | Include secret settings (API keys, payment secrets) in the export file. By default, secrets are stripped from the export |

### `import`

Import site data from a previously exported file.

```bash
php vale import --file=export.json
php vale import --file=export.zip
```

| Option | Description |
|---|---|
| `--file` | **(Required)** Path to the JSON or ZIP export file |
| `--dry-run` | Preview what would be imported without writing to the database |
| `--include-secrets` | Also import secret settings (API keys, payment secrets). By default, secret settings are skipped and must be re-entered on the target instance |

The import preserves relational integrity via an **ID remapping engine**: source IDs are mapped to target IDs during import so that entity relationships (e.g., post author, featured image, product category) remain intact.

**Import ordering:** content_types → users → media → categories → tags → pages → posts → products → comments → menus → forms → coupons → tax_rates → membership_plans → redirects → orders → seo_meta → site_settings.

::: warning Media files are not included
The export contains media **database rows only**, not the files themselves. After import, copy the uploads directory to the target server and run `php vale media:scan` (or use **Settings → Maintenance → Data → Rescan Media**).
:::

::: tip Secret settings are skipped by default
API keys, payment secrets, SSO credentials, and similar sensitive settings are **not** overwritten on import. Re-enter them on the target instance, or pass `--include-secrets` to import them anyway.
:::

During import, absolute URLs pointing at the old site's domain are automatically rewritten to the target site's domain in post bodies and product descriptions. For base-path moves (e.g. `/vale` → `/`), run `migrate:urls` afterwards.

---

