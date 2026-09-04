# Migrating from WordPress

Move your entire WordPress site to Vale: posts, pages, products, users, SEO settings, and more. The `import:wordpress` command supports WXR XML exports, direct database connection, and SQL dump files.

::: tip Moving from WordPress?
Vale handles the essentials, **SEO, JSON-LD, e-commerce, newsletters, and memberships**, built in and ready to use, so you can spend less time managing plugins and more time on your site, without a single premium plugin.
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
| Navigation menus | `vl_menus` + `vl_menu_items` (location unassigned; set per theme) |

Vale's ID remapping engine preserves relational integrity, and automatic 301 redirects keep your old URLs working.

## Supported WordPress Plugins

Vale's importer works with popular WordPress plugins out of the box:

- [WooCommerce](https://woocommerce.com/): Products, categories, tags, orders, order items
- [Yoast SEO](https://yoast.com/wordpress/plugins/seo/): Meta title, description, Open Graph, Twitter card, canonical URL, robots, focus keyword
- [Rank Math](https://rankmath.com/): Same SEO fields as Yoast
- [MailPoet](https://www.mailpoet.com/): Newsletter subscribers
- [Polylang](https://polylang.pro/): Post, page, product, and category translation relationships

See the detailed tables below for what gets imported from each plugin.

## What Gets Imported (by mode)

- **WXR mode** (`--file=export.xml`): users, categories, tags, posts, pages, products + variations, media references, SEO metadata, comments, menus, and store settings. Limitations: no newsletter subscribers, no WooCommerce orders, media files by reference only (use `--download-media` to fetch).
- **DB mode** (`--wp-db=...` or `--db-dump=...`): everything above plus WooCommerce orders, newsletter subscribers (MailPoet), full media import, and complete store settings.

The full column-level mapping reference lives in [CLI Commands](../system/cli#import-wordpress). Vale's ID remapping preserves relational integrity, and automatic redirects keep old URLs working.

### Navigation Menus

Navigation menus are imported in both WXR and DB modes. Menu locations vary by theme, so assign them after import under **Appearance → Menus**. Items whose target cannot be resolved are kept as custom links with the original URL.

## Interactive Import

Running `import:wordpress` **without any module or source flags** on an interactive terminal starts a guided wizard:

1. **Source**: WXR file, SQL dump, or a live WordPress database (host, port, database, user, password, and table prefix are asked when needed). Providing a source flag (`--file`, `--db-dump`, `--wp-db`) skips this question. When the source is a SQL dump, the WordPress tables it introduces are removed automatically once the import finishes.
2. **Modules**: pick one or more: **All**, **Users**, **Content** (posts, pages, terms, comments), **WooCommerce** (products, variations, orders), **Subscribers**, **SEO**.
3. **Media**: import from a local `--media-path`, download from URLs, or skip.
4. **Digital product files**: download WooCommerce digital files into the media library or keep external URLs (asked when WooCommerce is selected).
5. **Dry run**: confirm whether to preview without writing anything.

::: tip Docker users
The `--media-path` must be visible **inside the container**, not on your host. A host path like `/home/user/www/wp-content/uploads` fails validation with `Media path (--media-path) must be a valid directory` because it doesn't exist in the container's filesystem. Either copy the directory in first (needs console access):

```bash
docker cp /home/user/www/wp-content/uploads <container>:/tmp/wp-uploads
# then enter /tmp/wp-uploads at the media prompt
```

or mount it as a volume and enter the container-side path (e.g. `/mnt/wp-uploads`).
:::

Passing `--all` (or a specific module flag) together with your source skips the wizard and keeps the non-interactive behaviour, useful for scripts and CI. The wizard never runs in non-interactive contexts.

## Method 1: WXR Export

WordPress's built-in export tool generates a WXR (WordPress eXtended RSS) XML file containing content, metadata, and comments.

### Step 1: Export from WordPress

1. Go to **Tools → Export** in your WordPress admin.
2. Choose **All content** and click **Download Export File**.
3. Save the `.xml` file.

### Step 2: Import into Vale

```bash
php vale import:wordpress --file=export.xml
```

### WXR Limitations

WXR mode does **not** import:
- Newsletter subscribers (MailPoet)
- WooCommerce orders or order items
- Media files (only media records are created; use `--download-media` to fetch files)

::: tip Works with any database
WXR import works whether Vale itself runs on MySQL or SQLite; it only reads the XML file.
:::

### Dry Run

Preview what will be imported without writing anything:

```bash
php vale import:wordpress --file=export.xml --dry-run
```

## Method 2: Direct Database Connection

Import directly from a live WordPress database. Since Vale connects to WordPress separately, this works whether Vale itself runs on MySQL or SQLite.

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

After the import finishes, thumbnails and WebP variants are generated automatically for all imported media records (WebP only when conversion is enabled under [Settings](../settings/) → [Content](../settings/content)). You can also regenerate them any time with `php vale media:scan`.

::: tip Importing from a local WordPress (localhost or LAN)
Media downloads are **refused for private/internal addresses** (`localhost`, `127.0.0.1`, `192.168.x.x`, …) unless you opt in, so imported URLs cannot be pointed at internal services. When the source WordPress itself runs on your machine or your local network, add `--allow-private-hosts`:

```bash
php vale import:wordpress --wp-db=wordpress --wp-user=root --download-media --allow-private-hosts
```

URLs skipped this way are listed under **Skipped Media Downloads** at the end of the run.
:::

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

After importing from a SQL dump, the WordPress tables introduced by the import are **automatically removed** from Vale's database, with no flag needed. The command uses a snapshot taken before the dump load, so it drops only the tables the import added and leaves existing Vale tables untouched:

```bash
php vale import:wordpress --db-dump=wordpress.sql
```

To keep the WordPress tables afterwards (e.g. for inspection), opt out with `--keep-wp-tables`:

```bash
php vale import:wordpress --db-dump=wordpress.sql --keep-wp-tables
```

## WooCommerce Digital Products

WooCommerce products (and variations) marked as **virtual** and/or **downloadable** are imported as Vale digital products, with download limits, expiry, and files carried over.

::: tip Variable products: digital flag follows the variations
WooCommerce keeps the Virtual / Downloadable flags on the **variation** rows; the parent row often looks physical. Vale follows the variations: when **every** variation is virtual/downloadable, the parent is imported as digital too. Mixed products keep the parent as-is; checkout resolves shipping per variation line.
:::

::: tip Variable products: digital flag follows the variations
WooCommerce keeps the **Virtual / Downloadable** flags on the **variation** rows of a variable product; the parent row often stays `_virtual=no`, which is why a variable software product can look physical in WordPress itself. Vale follows the variations: when **every** variation of a product is virtual and/or downloadable, the parent product is also imported with `shipping_class='digital'` (storefront digital badge and download UI included). Products with a mix of digital and physical variations keep the parent class as-is; checkout resolves shipping per variation line.
:::

### Download file storage (`--download-product-files`)

Pass `--download-product-files` to fetch the digital product/variation download files into Vale's media library instead of keeping external URLs. Attachment media is handled separately via `--download-media`, as described under [Method 2](#method-2-direct-database-connection).

```bash
php vale import:wordpress --db-dump=wordpress.sql --woocommerce --download-product-files
```

With `--download-product-files`:
- Each product/variation file is **downloaded into the media library** and linked via `vl_product_download_files` (products) / `vl_product_variation_download_files` (variations). **Multiple files per product are supported.**
- `download_source` is set to **`internal`**.
- If a file fails to download it is skipped, reported at the end, and the remaining files are still processed.

Without `--download-product-files`, or when no file could be downloaded:
- `download_source` is set to **`external`** and the **first** download URL is stored as `download_url`. Multiple-file external download is not supported, so any additional files are skipped and reported.

A summary report is printed at the end of the import listing each digital product/variation and what was done with its download files.

### Upsells and cross-sells

WooCommerce upsell and cross-sell relationships are imported in both WXR and DB modes and linked automatically after all products exist. The storefront renders them automatically: cross-sells on the cart page and upsells on the product page.

::: tip Tip
Upsell/cross-sell linking only applies to WooCommerce products (`--woocommerce` or `--all`). Running `--posts` alone skips products, so no relationships are created.
:::

::: tip Digital products need `--woocommerce`
Importing WooCommerce products (and therefore digital products) is a DB-mode operation; use `--woocommerce` (or `--all`). Pass the source via `--wp-db=...` or `--db-dump=...`.
:::

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
| `--media-path=<dir>` | Path to `wp-content/uploads` for local copy (with `--import-media`) |
| `--import-media` | Import WordPress attachment media from a local `--media-path` (DB mode) |
| `--download-media` | Download WordPress attachment media from URLs (DB + WXR mode) |
| `--allow-private-hosts` | Allow media downloads from private/internal addresses, required when the source WordPress runs on `localhost` or a LAN IP (refused by default) |
| `--download-product-files` | Download WooCommerce digital product/variation files into the media library (DB + WXR mode) |
| `--cleanup` | Drop WordPress tables from a live source database (`--wp-db`) after import, with confirmation |
| `--cleanup-vale` | Drop WP tables from Vale's own database (leftover cleanup) |
| `--keep-wp-tables` | Keep WordPress tables in Vale's database after a dump import (default: removed automatically) |
| `--all` | Import all modules (skips the interactive wizard) |
| `--posts` | Import posts, pages, terms, comments, and SEO |
| `--woocommerce` | Import WooCommerce products, categories, variations, orders, and SEO |
| `--users` | Import users/authors |
| `--subscribers` | Import newsletter subscribers |
| `--seo` | Import SEO metadata |
| `--fix-slugs` | Fix non-compliant slugs already in the database (auto-sanitized during import) |
| `--dry-run` | Preview changes without writing |
| `--post-types=<types>` | Extra post types to import (comma-separated) |
| `--dry-run` | Preview changes without writing |

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

::: tip Security: imported users start locked
Imported users come **deactivated** and with a **random password**; they cannot sign in until they are activated and have set a real password (via the **Forgot password** link on the login page, or by an admin):

```bash
# Activate the imported user
php vale user:activate user@example.com

# Set a new password
php vale user:reset-password user@example.com
```

See [CLI reference](../system/cli.md#user-activate) or run `php vale user:activate --help` for all options.
:::

- Always run with `--dry-run` first to verify what will be imported.
- WXR mode is best for smaller sites or when you only have an XML export. DB mode is more complete (orders, newsletter subscribers, full media import).
- Large media libraries may take time to download. Use `--download-media` only when needed.
- WooCommerce product SKUs, prices, stock status, and sale prices are imported from post meta.
- WooCommerce virtual/downloadable products and variations are imported as digital products (`shipping_class='digital'`), with `_download_limit`, `_download_expiry`, and download files copied across. See [WooCommerce Digital Products](#woocommerce-digital-products).
- WooCommerce store settings are imported into Vale's settings automatically: store address (`shop_address_1`, `shop_address_2`), city, postcode, country (extracted from `country:state` format, e.g., `DE:DE-RP` → `DE`), and currency. When WooCommerce is configured to sell to specific countries, those are imported as Vale's `shipping_countries` setting (comma-separated country codes).
- Polylang translation relationships (posts, pages, products, categories) are resolved automatically and linked via the `translation_of` field.
- SEO metadata from both Yoast and Rank Math is supported, including meta title, meta description, Open Graph (title, description, image), Twitter card type, canonical URL, robots meta, and focus keyword.
- Comments on posts, pages, and WooCommerce products are imported into `vl_comments`. Duplicate comments (same email + date) are skipped on re-import.
- WooCommerce orders are imported into `vl_orders` with their line items (DB mode only). Both the modern `wp_wc_orders` table and legacy `shop_order` post types are supported. Duplicate orders (same order number) are skipped on re-import.
- Order **dates** are preserved from WooCommerce (`date_created_gmt` / `post_date`), not the import time.
- **Coupon codes** are imported from WooCommerce (`_coupon_codes` meta or `wc_order_items`), not a hash placeholder.
- Term relationships (post-to-category, post-to-tag, product-to-category) are imported in both modes. Duplicate relationships are skipped on re-import.
- User passwords are **not migrated**. Each imported user is assigned a random password and the `subscriber` role; see the tip above. Users must reset their password via the **Forgot password** link on the login page (or an admin can do it via `php vale user:reset-password`) before they can sign in.
- When using `--dry-run` with `--db-dump`, the SQL dump is loaded into Vale's database and all import operations run inside a transaction that is rolled back at the end; no permanent changes are made.
- SQL dump files can be gzipped (`.sql.gz`) for faster transfers and smaller file sizes.
- The `--cleanup` flag safely removes only the WordPress tables introduced by the import, preserving existing Vale tables.
