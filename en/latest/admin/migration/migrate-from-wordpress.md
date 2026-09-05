# Migrating from WordPress

Move your entire WordPress site to Vale — posts, pages, products, users, SEO settings, and more. The `import:wordpress` command supports WXR XML exports, direct database connection, and SQL dump files.

::: tip Moving from WordPress?
Vale handles the essentials — **SEO, JSON-LD, e-commerce, newsletters, and memberships** — built in and ready to use, so you can spend less time managing plugins and more time on your site, without a single premium plugin.
:::

## What Gets Imported

### WordPress → Vale

| WordPress | Vale |
|---|---|
| Posts, pages, media, categories, tags, users | Imported with their relationships intact |
| WooCommerce products, orders | Products, orders, categories |
| Yoast / Rank Math SEO meta | SEO metadata, canonical URLs, Open Graph / Twitter cards |
| MailPoet subscribers | Newsletter subscribers |
| Polylang translations | Multi-language content relationships |

Vale's ID remapping engine preserves relational integrity, and automatic 301 redirects keep your old URLs working.

## Supported WordPress Plugins

Vale's importer works with popular WordPress plugins out of the box:

- [WooCommerce](https://woocommerce.com/) — Products, categories, tags, orders, order items
- [Yoast SEO](https://yoast.com/wordpress/plugins/seo/) — Meta title, description, Open Graph, Twitter card, canonical URL, robots, focus keyword
- [Rank Math](https://rankmath.com/) — Same SEO fields as Yoast
- [MailPoet](https://www.mailpoet.com/) — Newsletter subscribers
- [Polylang](https://polylang.pro/) — Post, page, product, and category translation relationships

See the detailed tables below for what gets imported from each plugin.

## What Gets Imported

### WXR Mode (`--file=export.xml`)

| Data | Source | Destination |
|---|---|---|
| Users | XML `<wp:author>` | `vl_users` |
| Categories | XML `<category domain="category">` | `vl_categories` |
| Tags | XML `<category domain="post_tag">` | `vl_tags` |
| Custom taxonomies | XML `<category>` | `vl_categories` / `vl_content_types` |
| Posts | XML `<item>` (post_type = post) | `vl_posts` |
| Pages | XML `<item>` (post_type = page) | `vl_posts` |
| Products (WooCommerce) | XML `<item>` (post_type = product) + meta | `vl_products` |
| Custom post types | XML `<item>` | `vl_posts` (with content type) |
| Media (references only) | XML `<item>` (post_type = attachment) | `vl_media` |
| SEO metadata | XML `<wp:postmeta>` (Yoast / Rank Math) | `vl_posts` (meta_title, meta_description) + `vl_seo_meta` (OG, Twitter, canonical, robots, focus keyword) |
| Parent/child relationships | XML `<wp:post_parent>` | `vl_posts.parent_id` |
| Comments | XML `<wp:comment>` | `vl_comments` |
| Term relationships | XML `<category>` per item | `vl_post_categories`, `vl_post_tags`, `vl_product_to_categories` |
| Polylang translations | XML `<wp:postmeta>` (`_pll_strings_translations`) | `translation_of` column on posts/products/categories |
| Store settings | XML `<wp:option>` | `vl_settings` (`shop_country`, `currency`) |

### DB Mode (`--wp-db=...` or `--db-dump=...`)

| Data | Source | Destination |
|---|---|---|
| Users | `wp_users` | `vl_users` |
| Categories | `wp_terms` + `wp_term_taxonomy` | `vl_categories` |
| Tags | `wp_terms` + `wp_term_taxonomy` | `vl_tags` |
| Custom taxonomies | `wp_terms` + `wp_term_taxonomy` | `vl_categories` + `vl_content_types` |
| Posts / Pages / CPTs | `wp_posts` | `vl_posts` |
| Products (WooCommerce) | `wp_posts` + `wp_postmeta` | `vl_products` |
| Media / attachments | `wp_posts` + filesystem | `vl_media` + `public/uploads/` |
| Newsletter subscribers | `wp_mailpoet_subscribers` | `vl_subscribers` |
| SEO metadata | `wp_postmeta` (Yoast / Rank Math) | `vl_seo_meta` (meta_title, meta_description, og_title, og_description, og_image_id, twitter_card_type, canonical_url, robots, focus_keyword) |
| Parent/child relationships | `wp_posts.post_parent` | `vl_posts.parent_id` |
| Comments | `wp_comments` | `vl_comments` |
| Orders (WooCommerce) | `wp_wc_orders` / `shop_order` + meta | `vl_orders` + `vl_order_items` |
| Term relationships | `wp_term_relationships` | `vl_post_categories`, `vl_post_tags`, `vl_product_to_categories` |
| Store settings | `wp_options` (`woocommerce_default_country`, `woocommerce_currency`, `woocommerce_store_address*`, `woocommerce_store_city`, `woocommerce_store_postcode`) + `woocommerce_specific_allowed_countries` | `vl_settings` (`shop_country`, `currency`, `shop_address_1`, `shop_address_2`, `shop_city`, `shop_postcode`, `shipping_countries`) |
| Polylang translations | `wp_term_taxonomy` (`post_translations`, `term_translations`) | `translation_of` column on posts/products/categories |

## Method 1: WXR Export

WordPress's built-in export tool generates a WXR (WordPress eXtended RSS) XML file containing content, metadata, and comments.

### Step 1 — Export from WordPress

1. Go to **Tools → Export** in your WordPress admin.
2. Choose **All content** and click **Download Export File**.
3. Save the `.xml` file.

### Step 2 — Import into Vale

```bash
php vale import:wordpress --file=export.xml
```

### WXR Limitations

WXR mode does **not** import:
- Newsletter subscribers (MailPoet)
- WooCommerce orders or order items
- Media files (only media records are created; use `--download-media` to fetch files)

### Dry Run

Preview what will be imported without writing anything:

```bash
php vale import:wordpress --file=export.xml --dry-run
```

## Method 2: Direct Database Connection

Import directly from a live WordPress database.

```bash
php vale import:wordpress \
  --wp-db=wordpress \
  --wp-user=root \
  --wp-pass=secret \
  --wp-host=127.0.0.1 \
  --wp-prefix=wp_
```

To copy media files from the WordPress uploads directory:

```bash
php vale import:wordpress \
  --wp-db=wordpress \
  --wp-user=root \
  --import-media \
  --media-path=/var/www/wp/wp-content/uploads
```

Or download media from URLs instead:

```bash
php vale import:wordpress \
  --wp-db=wordpress \
  --wp-user=root \
  --download-media
```

After the import finishes, thumbnails and WebP variants are generated automatically for all imported media records (WebP only when conversion is enabled under Settings → Content). You can also regenerate them any time with `php vale media:scan`.

## Method 3: SQL Dump File

Import from a WordPress SQL dump file (e.g., from phpMyAdmin or `mysqldump`). The dump is loaded into Vale's database first, then processed. Gzipped dumps (`.sql.gz`) are supported.

```bash
php vale import:wordpress --db-dump=wordpress.sql
php vale import:wordpress --db-dump=wordpress.sql.gz
```

::: warning
SQL dump import requires a MySQL destination database. SQLite is not supported for this mode.
:::

### Automatic Cleanup

After importing from a SQL dump, WordPress tables are automatically removed from Vale's database when `--cleanup` is used. The command uses a snapshot taken before the dump load to identify and drop only the tables introduced by the import, leaving existing Vale tables untouched:

```bash
php vale import:wordpress --db-dump=wordpress.sql --cleanup
```

## All Options

| Option | Description |
|---|---|
| `--file=<path>` | Path to a WXR (XML) export file |
| `--type=<db\|wxr>` | Force import type (auto-detected from options) |
| `--wp-db=<name>` | WordPress database name |
| `--wp-user=<user>` | WordPress database user |
| `--wp-pass=<pass>` | WordPress database password |
| `--wp-host=<host>` | Database host (default: `127.0.0.1`) |
| `--wp-port=<port>` | Database port (default: `3306`) |
| `--wp-prefix=<prefix>` | WordPress table prefix (default: `wp_`) |
| `--db-dump=<path>` | Path to a SQL dump file (supports `.gz`) |
| `--media-path=<dir>` | Path to `wp-content/uploads` for local copy |
| `--import-media` | Import media files (DB mode) |
| `--download-media` | Download media from URLs (DB + WXR mode) |
| `--cleanup` | Drop WordPress tables from the source database after import |
| `--cleanup-vale` | Drop WP tables from Vale's own database (leftover cleanup) |
| `--fix-slugs` | Fix non-compliant slugs already in the database (auto-sanitized during import) |
| `--dry-run` | Preview changes without writing |
| `--post-types=<types>` | Extra post types to import (comma-separated) |

## Post-Import Tasks

### Fixing Slugs

Slugs are sanitized automatically during import (lowercased, special characters removed). `--fix-slugs` is only needed to repair slugs that already exist in the database from a previous import or manual entry:

```bash
php vale import:wordpress --fix-slugs
```

This scans all slug columns (`vl_posts`, `vl_products`, `vl_categories`, `vl_tags`, `vl_product_categories`) and sanitizes any invalid slugs.

### Cleaning Up WordPress Tables

After a DB dump import, WordPress tables are **automatically removed** from Vale's database. No flag is needed.

```bash
php vale import:wordpress --db-dump=wordpress.sql
# WP tables are cleaned up automatically
```

For live DB mode (`--wp-db`), use `--cleanup` to drop the original WordPress tables (with confirmation).

### Dropping Source Tables (Live DB)

When using `--wp-db`, you can drop the original WordPress tables after a successful import:

```bash
php vale import:wordpress --wp-db=wordpress --wp-user=root --cleanup
```

Vale will prompt for confirmation before dropping tables from the live database.

## Tips

- Always run with `--dry-run` first to verify what will be imported.
- WXR mode is best for smaller sites or when you only have an XML export. DB mode is more complete (orders, newsletter subscribers, full media import).
- Large media libraries may take time to download. Use `--download-media` only when needed.
- WooCommerce product SKUs, prices, stock status, and sale prices are imported from post meta.
- WooCommerce store settings are imported into Vale's settings automatically: store address (`shop_address_1`, `shop_address_2`), city, postcode, country (extracted from `country:state` format, e.g., `DE:DE-RP` → `DE`), and currency. When WooCommerce is configured to sell to specific countries, those are imported as Vale's `shipping_countries` setting (comma-separated country codes).
- Polylang translation relationships (posts, pages, products, categories) are resolved automatically and linked via the `translation_of` field.
- SEO metadata from both Yoast and Rank Math is supported, including meta title, meta description, Open Graph (title, description, image), Twitter card type, canonical URL, robots meta, and focus keyword.
- Comments on posts, pages, and WooCommerce products are imported into `vl_comments`. Duplicate comments (same email + date) are skipped on re-import.
- WooCommerce orders are imported into `vl_orders` with their line items (DB mode only). Both the modern `wp_wc_orders` table and legacy `shop_order` post types are supported. Duplicate orders (same order number) are skipped on re-import.
- Term relationships (post-to-category, post-to-tag, product-to-category) are imported in both modes. Duplicate relationships are skipped on re-import.
- User passwords are **not migrated**. Each imported user is assigned a random password and the `subscriber` role. Users must reset their password via the **Forgot password** link on the login page (or an admin can do it via `php vale user:reset-password`) before they can sign in.
- When using `--dry-run` with `--db-dump`, the SQL dump is loaded into Vale's database and all import operations run inside a transaction that is rolled back at the end — no permanent changes are made.
- SQL dump files can be gzipped (`.sql.gz`) for faster transfers and smaller file sizes.
- The `--cleanup` flag safely removes only the WordPress tables introduced by the import, preserving existing Vale tables.
