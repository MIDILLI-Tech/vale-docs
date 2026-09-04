# REST API

Vale provides a JSON REST API for integrating with external applications and generating product feeds.

## Authentication

The API uses **Bearer Token** authentication. You can generate tokens in the Admin panel under **Settings → Advanced → API Tokens**.

Every request must include the `Authorization` header:
```http
Authorization: Bearer YOUR_API_TOKEN
```

Each token carries a comma-separated list of **abilities** (or `*` for everything). Abilities follow the `verb:resource` convention (e.g. `read:posts`, `write:products`, `delete:subscribers`). Endpoints below list the required ability.

## Endpoints

All API routes are prefixed with `/api/v1`.

### Posts & Pages
- `GET /api/v1/posts`: List published posts. (`read:posts`)
- `GET /api/v1/posts/{slug}`: Get a single post by slug. (`read:posts`)
- `POST /api/v1/posts`: Create a post. (`write:posts`)
- `PUT /api/v1/posts/{id}`: Update a post (partial payloads supported). (`write:posts`)
- `DELETE /api/v1/posts/{id}`: Delete a post. (`delete:posts`)
- `POST|PUT|DELETE /api/v1/pages[/{id}]`: Same operations for pages. (`write:pages` / `delete:pages`)

**Write payload** (all fields optional unless noted):
```json
{
  "title": "Hello World",
  "slug": "hello-world",
  "body": "<p>Content</p>",
  "excerpt": "Short summary",
  "status": "draft | published | unlisted | archived | trash",
  "published_at": "2026-01-31T10:30",
  "language": "en",
  "author_id": 1,
  "featured_image": "https://example.com/img.jpg | data:image/png;base64,… | <media id>",
  "categories": [1, 2],
  "tags": ["news", "linux"],
  "meta_title": "SEO title",
  "meta_description": "SEO description"
}
```
`tags` are created automatically when they do not exist. `featured_image` accepts an existing media ID, an absolute URL (private/internal hosts are blocked), or a base64 data URI. A future `published_at` marks the item as scheduled (shown with a *Scheduled* badge in lists). There is no separate scheduled status to choose.

Creating or updating content fires the `post.created`, `post.updated` and (when published) `post.published` webhook events; deleting fires `post.deleted`.

### Products
- `GET /api/v1/products`: List products. (`read:products`)
- `GET /api/v1/products/{slug}`: Get product details by slug. (`read:products`)
- `GET /api/v1/products/id/{id}`: Get product details by numeric ID. (`read:products`)
- `POST /api/v1/products`: Create a new product. `name` is required; duplicate SKUs are rejected with `422`. (`write:products`)
- `PUT /api/v1/products/{id}`: Update an existing product (partial payloads supported). (`write:products`)
- `DELETE /api/v1/products/{id}`: Remove a product. (`delete:products`)
- `POST /api/v1/products/categories`: Create a product category (`{name}`, optional `{slug, description, parent_id}`). Returns the existing category when the slug already exists. (`write:products`)

**List filters** (`GET /api/v1/products`): `?status=` (default `published`), `?sku=` (exact match), `?search=` (name + SKU, case-insensitive), `?type=` (`simple | variable | digital`), `?on_sale=1` (active sale window), plus `?page=` / `?per_page=` (max 100).

**Write payload** (all fields optional unless noted, `name` is required on create):

```json
{
  "name": "Basic T-Shirt",
  "sku": "TSHIRT-001",
  "status": "draft | published | unlisted | scheduled | trash",
  "type": "simple | variable | digital",
  "price": 19.99,
  "sale_price": 16.99,
  "sale_price_start": "2026-12-01T00:00:00+00:00",
  "sale_price_end": "2026-12-31T23:59:59+00:00",
  "stock_quantity": 12,
  "stock_status": "in_stock | out_of_stock | on_backorder",
  "categories": ["t-shirts"],
  "upsell_ids": [9, 10],
  "cross_sell_ids": [11],
  "weight": 0.4,
  "dimensions": "30 x 20 x 5",
  "shipping_class": "controller"
}
```

Notes:
- `stock_status` also accepts WooCommerce spellings (`onbackorder`, `backorder`, `notify` → `on_backorder`).
- `dimensions` accepts a string or a `{length, width, height}` object (normalized to `"L x W x H"`).
- `variations[]` entries accept `sku, attributes, price, sale_price, sale_price_start/end, stock_quantity, stock_status, image, download_files, ...` (same normalization applies).
- The response echoes `upsell_ids`, `cross_sell_ids`, `sale_price_start/end` (ATOM) and a computed `on_sale` flag, per product and per variation.

Product create/update/delete fire the `product.created`, `product.updated` and `product.deleted` webhook events (see [Webhooks](./webhooks#product-events)).

**Images (no migration needed):** `featured_image`, every `gallery[]` entry, variation `image` and `download_files` entries all accept the same three shapes and are always imported into the media library (upload settings such as the mime whitelist and size limits apply; private/internal hosts are blocked):

- existing media ID: `"featured_image": "123"`
- absolute URL (downloaded and stored locally): `"featured_image": "https://example.com/photo.jpg"`
- base64: data-URI or bare payload: `"featured_image": "data:image/jpeg;base64,..."` or `"featured_image": "<raw base64…>"`

There is no hotlink/external-URL mode: the product only stores the resulting media ID. A provided-but-unimportable image value fails loudly with `422` instead of being silently dropped (e.g. unreachable URL, invalid base64, blocked host).

**Full create example** (`POST /api/v1/products`):

```bash
curl -s -X POST https://example.com/api/v1/products \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Basic T-Shirt",
    "sku": "TSHIRT-001",
    "status": "published",
    "type": "variable",
    "price": 19.99,
    "stock_status": "in_stock",
    "categories": ["t-shirts"],
    "featured_image": "https://example.com/photos/tshirt.jpg",
    "gallery": ["124", "https://example.com/photos/tshirt-back.jpg"],
    "variations": [
      {
        "sku": "TSHIRT-001-RED-M",
        "attributes": {"Color": "Red", "Size": "M"},
        "price": 19.99,
        "stock_quantity": 12,
        "stock_status": "in_stock"
      },
      {
        "sku": "TSHIRT-001-BLUE-L",
        "attributes": {"Color": "Blue", "Size": "L"},
        "price": 21.99,
        "sale_price": 19.99,
        "stock_quantity": 0,
        "stock_status": "out_of_stock",
        "image": "125"
      }
    ]
  }'
```

**Response (`201`, truncated):**

```json
{
  "message": "Product created",
  "data": {
    "id": 7,
    "slug": "basic-t-shirt",
    "name": "Basic T-Shirt",
    "sku": "TSHIRT-001",
    "type": "variable",
    "price": 19.99,
    "status": "published",
    "featured_image_url": "https://example.com/uploads/2026/10/tshirt.jpg",
    "gallery": ["https://example.com/uploads/2026/10/g1.jpg"],
    "variations": [
      {
        "id": 11,
        "sku": "TSHIRT-001-RED-M",
        "attributes": {"Color": "Red", "Size": "M"},
        "price": 19.99,
        "sale_price": null,
        "stock_quantity": 12,
        "stock_status": "in_stock",
        "image_url": null
      }
    ]
  }
}
```

Tip: uploading the image first via `POST /api/v1/media` (`{"url": "…"}` or `{"base64": "…", "name": "photo.jpg"}`) and passing the returned media `id` avoids re-downloading the same file for every product/variation.

### Orders
- `GET /api/v1/orders`: List orders (paginated). (`read:orders`)
- `GET /api/v1/orders/{id}`: Get order details by numeric ID (safe subset: status, totals, payment method, timestamps, customer email and items, but no billing address and no payment token). (`read:orders`)
- `GET /api/v1/orders/{id}/notes`: List the order's notes (`type=note` timeline entries). (`read:orders`)
- `POST /api/v1/orders/{id}/notes`: Add an order note. The note appears in the admin order detail timeline (Order Notes) with the added-by name `API`. (`write:orders`)
- `DELETE /api/v1/orders/{id}/notes/{noteId}`: Delete one of the order's notes. Only `type=note` entries can be deleted. It returns `404` for system/event log rows. (`write:orders`)
- `POST /api/v1/orders`: Create a manual/offline order (see below). (`write:orders`)
- `PUT /api/v1/orders/{id}`: Update an order: status, carrier/tracking, customer note, inline note (see below). (`write:orders`)

**Note payload:**
```json
{ "note": "Sent License Key: LUMI-ABC-123" }
```

An empty (whitespace-only) note is rejected with `422`; unknown order IDs return `404`. Notes are limited to 5000 characters.

Orders are otherwise exposed via [webhooks](./webhooks#order-events) (`order.paid`, `order.status_changed`). To resolve an ordered item back to its product, use `GET /api/v1/products/id/{product_id}` (or `?sku=`).

**List filters** (`GET /api/v1/orders`): `?status=`, `?search=` (order number, billing, coupon), `?from=` / `?to=` (creation date, `Y-m-d`), `?updated_since=` (date or datetime, for incremental sync), `?coupon_code=`, `?product_id=`, plus `?page=` / `?per_page=` (max 100).

---

**Manual order creation** (`POST /api/v1/orders`)

Creates an offline order, mirroring the admin **Create Order** screen. All prices for catalog items are resolved **server-side** from the current product/variation prices (sale windows honored). The total is always computed server-side and never taken from the payload:

```json
{
  "billing": {
    "first_name": "Ada", "last_name": "Lovelace",
    "email": "ada@example.com", "phone": "+90…",
    "address_1": "…", "address_2": "", "city": "…", "state": "…",
    "postcode": "…", "country": "TR"
  },
  "items": [
    { "product_id": 7, "qty": 2 },
    { "sku": "LUMI-PRO-RED", "variation_id": 11, "variation": { "Color": "Red" }, "qty": 1 },
    { "name": "Custom engraving", "price": 25.00, "sku": "ENGRAVE", "qty": 1 }
  ],
  "shipping": 10.00,
  "discount": 5.00,
  "coupon_code": "SAVE10",
  "currency": "EUR",
  "status": "pending",
  "payment_method": "banktransfer",
  "customer_note": "Gift wrap please.",
  "transaction_id": "…",
  "note": "Order taken by phone.",
  "shipping_address": {
    "first_name": "…", "last_name": "…", "company": "", "address_1": "…", "address_2": "",
    "city": "…", "state": "…", "postcode": "…", "country": "TR", "phone": "…"
  }
}
```

Rules:
- `billing.first_name` and `billing.email` (valid format) are required; `items` must contain at least one line.
- Each item needs `qty` (default `1`). Reference a product via `product_id` **or** `sku`, and then `name`, `price` and `sku` are filled from the catalog when omitted. An explicit `price` overrides the catalog price (negotiated manual orders). Items **without** a product reference are custom lines and require both `name` and `price`.
- `variation_id` requires a product reference; an unknown variation fails with `422` (no silent fallback). The optional `variation` object overrides the stored variation attributes and is persisted as the item's `variation_data`.
- `shipping` and `discount` are non-negative amounts entered by the operator. `coupon_code` is validated and consumed exactly like the admin form.
- `payment_method` accepts **offline methods only**: `cash`, `manual`, `banktransfer`. Orders paid through a gateway must be created by checkout.
- `status` is any of `pending, processing, on-hold, shipped, completed, refund_requested, refund_rejected, refunded, cancelled`. Creating an order directly in a paid status sets `paid_at` and fires the `order.paid` event (stock decrement and subscriber tagging included, same as admin).
- Totals are stored VAT-inclusive: `total = subtotal + shipping − discount`. Manual orders carry no automatic tax extraction.
- A `201` response returns the serialized order (plus the `note` text when one was supplied).

**Order updates** (`PUT /api/v1/orders/{id}`)

Partial update of the operator-controlled fields. Protected fields (`subtotal`, `shipping`, `discount`, `total`, `tax`, `items`, `billing`, `shipping_address`, `currency`, `payment_method`, `user_id`) are rejected with `422`. Amounts and addresses are never editable over the API.

```json
{
  "status": "shipped",
  "carrier": "dhl",
  "tracking_number": "JD014600003812345678",
  "notify_customer": true,
  "customer_note": "Leave at the door.",
  "note": "Shipped via DHL Express."
}
```

- `status` transitions run the full admin side-effect chain: `paid_at` bookkeeping, coupon usage sync, download revocation on cancellations/refunds, the `order.status_changed`, `order.paid` and `order.reversed` events, subscriber tagging and subscription cancellation. API and admin behavior never diverge.
- `carrier` + `tracking_number` update the shipment and fire `order.shipped`; with `notify_customer: true` the tracking email is sent (same mail as the admin form).
- `customer_note` replaces the order's customer-facing note; `note` adds a timeline entry attributed to `API`.

**Example: adding a note after a webhook-driven fulfillment (e.g. license key issuance)**

```bash
curl -s -X POST https://example.com/api/v1/orders/42/notes \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"note": "Sent License Key: LUMI-ABC-123"}'
```

Response (`201`):
```json
{
  "data": {
    "order_id": 42,
    "note": "Sent License Key: LUMI-ABC-123",
    "added_by": "API"
  }
}
```

**Example: creating a manual (phone) order**

```bash
curl -s -X POST https://example.com/api/v1/orders \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "billing": { "first_name": "Ada", "email": "ada@example.com", "country": "TR" },
    "items": [ { "product_id": 7, "qty": 2 } ],
    "shipping": 10,
    "payment_method": "banktransfer",
    "note": "Order taken by phone."
  }'
```

**Example: verifying the order before writing back**

```bash
curl -s https://example.com/api/v1/orders/42 \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

```json
{
  "data": {
    "id": 42,
    "order_number": "VL-1001",
    "status": "processing",
    "currency": "EUR",
    "subtotal": 49,
    "total": 49,
    "payment_method": "stripe",
    "paid_at": "2026-10-01T10:00:00+00:00",
    "created_at": "2026-10-01T09:59:00+00:00",
    "customer_email": "buyer@example.com",
    "items": [
      { "product_id": 7, "variation_id": null, "name": "LumiFind Pro", "sku": "LUMI-PRO", "quantity": 1 }
    ]
  }
}
```

### Media
- `GET /api/v1/media`: List media files (paginated with `?page=` / `?per_page=`). (`read:media`)
- `POST /api/v1/media`: Import/upload media. (`write:media`)
- `DELETE /api/v1/media/{id}`: Delete a media file. (`delete:media`)

**Upload options:**

Send JSON:
```json
{ "url": "https://example.com/photo.jpg" }
```
```json
{ "base64": "data:image/png;base64,…", "name": "photo.png" }
```
…or a multipart form with one or more files in the `files[]` field (subject to the same size/count limits as the admin uploader).

### Subscribers
- `GET /api/v1/subscribers`: List newsletter subscribers (paginated with `?page=` / `?per_page=`). (`read:subscribers`)
- `GET /api/v1/subscribers/{id}`: Get a single subscriber. (`read:subscribers`)
- `POST /api/v1/subscribers`: Create a subscriber. (`write:subscribers`)
- `PUT /api/v1/subscribers/{id}`: Update a subscriber (partial payloads supported). (`write:subscribers`)
- `DELETE /api/v1/subscribers/{id}`: Delete a subscriber. (`delete:subscribers`)

Creating a subscriber fires the `subscriber.created` webhook event (payload includes `id`, `email`, `name`, `status`, `tier`, `tags`).

**Write payload** (all fields optional unless noted, `email` is required on create):
```json
{
  "email": "john@example.com",
  "name": "John",
  "tags": ["newsletter", "vip"],
  "tier": "free | pro | premium",
  "status": "active | pending | confirmed | unsubscribe",
  "skip_optin": false
}
```

By default new subscribers are created in `pending` status (double opt-in). Set `skip_optin: true` during creation to immediately create/confirm the subscriber in `active` status and bypass the opt-in email flow.

### Product Feeds
Vale generates real-time feeds for external marketplaces. These do not require authentication if the feed is enabled in your settings.

- `GET /api/v1/feed/google-merchant`: Google Merchant Center XML.
- `GET /api/v1/feed/bing`: Bing Shopping.
- `GET /api/v1/feed/meta`: Meta (Facebook/Instagram) Catalog.
- `GET /api/v1/feed/pinterest`: Pinterest Catalog.
- `GET /api/v1/feed/tiktok`: TikTok Shop.
- `GET /api/v1/feed/idealo`: Idealo price-comparison export.
- `GET /api/v1/feed/shopify`: Shopify-compatible product export.
- `GET /api/v1/feed/yandex-market`: Yandex Market YML feed.

### Google Taxonomy Browser
- `GET /api/v1/feed/google-taxonomy`: Browse the Google Merchant Center product taxonomy tree (used by the admin GMC category picker). **Requires any valid API token** (authentication only; no specific ability) unlike the public feeds above.

### Forms
- `POST /api/form/{slug}`: Submit a form from an external site. Ability is optional. See [Admin → Forms → External Form Submissions](../admin/forms#external-form-submissions). With a `submit:forms` token the request bypasses domain and registered-user/membership-tag restrictions; without a token it is validated against the form's **Allowed Domains** list.

### Health Check
- `GET /api/v1/health`: Returns current system status and version. No authentication required.

## Response Format

Success responses return JSON. Lists are typically paginated:
```json
{
  "data": [...],
  "meta": {
    "total": 42,
    "page": 1,
    "per_page": 15,
    "total_pages": 3
  }
}
```

Validation failures return `422` with per-field messages:
```json
{
  "error": "Validation failed",
  "errors": { "title": "Title is required." }
}
```

Other errors use standard HTTP status codes:
```json
{
  "error": "Resource not found"
}
```
