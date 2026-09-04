# Product Feeds

Vale can generate product data feeds for major commerce channels, allowing you to list your products on Google Shopping, Meta Ads, TikTok, and more — without any third-party plugin.

## Supported Channels

| Channel | Feed URL |
|---|---|
| **Google Merchant Center** | `/api/v1/feed/google-merchant` |
| **Bing Shopping** | `/api/v1/feed/bing` |
| **Meta (Facebook/Instagram)** | `/api/v1/feed/meta` |
| **Pinterest** | `/api/v1/feed/pinterest` |
| **Idealo** | `/api/v1/feed/idealo` |
| **Shopify** | `/api/v1/feed/shopify` |
| **TikTok** | `/api/v1/feed/tiktok` |
| **Yandex Market** | `/api/v1/feed/yandex-market` |

All feeds are generated in real time from your product catalogue. Submit the URL directly to each platform's merchant tools — no file export or manual upload required.

## Feed Contents

Each feed includes:
- Product ID, title, and description
- Price and currency
- Stock availability status
- Product URL and canonical image
- SKU / MPN / GTIN (if configured on the product)
- Brand and condition
- Product category (Google Merchant Center taxonomy)

Variable products output one row per variation.

## Google Merchant Center Taxonomy

Vale includes a built-in **GMC Taxonomy Browser** to help you select the correct Google product category for each product:

1. Open a product in the admin panel.
2. In the **Product Data** sidebar, click **Browse GMC Categories**.
3. Search or navigate the taxonomy tree and select the matching category.
4. The category ID is saved and included in the Google feed automatically.

## Configuring Feed Access

Feeds are public by default (no authentication required), matching the expectations of all major merchant platforms.

::: tip FOR SYSADMINS
If you need to restrict access, add an IP whitelist at the web server level (Nginx/Apache).
:::

::: tip SEE ALSO
- [Products](./products) — configure GTIN, MPN, and brand fields.
- [Settings](../settings/) → [E-Commerce](../settings/ecommerce) — base currency and inventory settings.
:::
