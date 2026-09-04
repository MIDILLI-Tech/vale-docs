# REST API

Vale provides a JSON REST API for integrating with external applications and generating product feeds.

## Authentication

The API uses **Bearer Token** authentication. You can generate tokens in the Admin panel under **Settings → Advanced → API Tokens**.

Every request must include the `Authorization` header:
```http
Authorization: Bearer YOUR_API_TOKEN
```

Each token carries a comma-separated list of **abilities** (or `*` for everything). Endpoints below list the required ability, e.g. `posts:read`, `posts:write`, `posts:delete`, `pages:*`, `products:*`, `media:*`, `subscribers:*`.

## Endpoints

All API routes are prefixed with `/api/v1`.

### Posts & Pages
- `GET /api/v1/posts`: List published posts. (`posts:read`)
- `GET /api/v1/posts/{slug}`: Get a single post by slug. (`posts:read`)
- `POST /api/v1/posts`: Create a post. (`posts:write`)
- `PUT /api/v1/posts/{id}`: Update a post (partial payloads supported). (`posts:write`)
- `DELETE /api/v1/posts/{id}`: Delete a post. (`posts:delete`)
- `POST|PUT|DELETE /api/v1/pages[/{id}]`: Same operations for pages. (`pages:write` / `pages:delete`)

**Write payload** (all fields optional unless noted):
```json
{
  "title": "Hello World",
  "slug": "hello-world",
  "body": "<p>Content</p>",
  "excerpt": "Short summary",
  "status": "draft | published | scheduled | unlisted | trash",
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
`tags` are created automatically when they do not exist. `featured_image` accepts an existing media ID, an absolute URL (private/internal hosts are blocked), or a base64 data URI.

Creating or updating content fires the `post.created`, `post.updated` and (when published) `post.published` webhook events; deleting fires `post.deleted`.

### Products
- `GET /api/v1/products`: List products (`?status=` filter). (`products:read`)
- `GET /api/v1/products/{slug}`: Get product details. (`products:read`)
- `POST /api/v1/products`: Create a new product. Duplicate SKUs are rejected with `422`. (`products:write`)
- `PUT /api/v1/products/{id}`: Update an existing product. (`products:write`)
- `DELETE /api/v1/products/{id}`: Remove a product. (`products:delete`)
- `POST /api/v1/products/categories`: Create a product category (`{name}`, optional `{slug, description, parent_id}`). Returns the existing category when the slug already exists. (`products:write`)

Product create/update/delete fire the `product.created`, `product.updated` and `product.deleted` webhook events.

Remote images in `featured_image`, `gallery`, variation images and `download_files` accept media IDs, absolute URLs (private/internal hosts are blocked) or base64 data URIs and are imported into the media library automatically.

### Media
- `GET /api/v1/media`: List media files (paginated with `?page=` / `?per_page=`). (`media:read`)
- `POST /api/v1/media`: Import/upload media. (`media:write`)
- `DELETE /api/v1/media/{id}`: Delete a media file. (`media:delete`)

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
- `GET /api/v1/subscribers`: List newsletter subscribers (paginated with `?page=` / `?per_page=`). (`subscribers:read`)
- `GET /api/v1/subscribers/{id}`: Get a single subscriber. (`subscribers:read`)
- `POST /api/v1/subscribers`: Create a subscriber. (`subscribers:write`)
- `PUT /api/v1/subscribers/{id}`: Update a subscriber (partial payloads supported). (`subscribers:write`)
- `DELETE /api/v1/subscribers/{id}`: Delete a subscriber. (`subscribers:delete`)

Creating a subscriber fires the `subscriber.created` webhook event (payload includes `id`, `email`, `name`, `status`, `tier`, `tags`).

**Write payload** (all fields optional unless noted — `email` is required on create):
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
- `GET /api/v1/feed/google-taxonomy`: Browse the Google Merchant Center product taxonomy tree (used by the admin GMC category picker). **Requires authentication** (`posts:read` ability or higher) unlike the public feeds above.

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
