# Webhooks

Vale fires outgoing HTTP POST requests to your endpoints when internal events occur. Configure webhooks in **Settings → Advanced → Webhooks**.

## Available Events

| Event | Fired when |
|---|---|
| `order.paid` | Payment confirmed (checkout, payment gateway callback, or manual) |
| `order.status_changed` | Any order status transition |
| `post.created` | A post, page, or custom content type is created (any status) |
| `post.published` | A post first goes live |
| `post.updated` | An existing published post is saved |
| `product.created` | A product is created |
| `product.updated` | An existing product is updated |
| `product.deleted` | A product is deleted |
| `user.registered` | A new user account is created |
| `form.submitted` | An external or internal form has been submitted |
| `subscriber.created` | A new newsletter subscriber is added |

## Request Format

Every webhook is a `POST` request with a JSON body and the following headers:

```
Content-Type: application/json
X-VL-Event: order.paid
X-VL-Signature: sha256=<hex>   (only if a secret is configured)
```

## Payload Signing

If you set a **Secret** on a webhook, Vale signs every request:

```
X-VL-Signature: sha256=<HMAC-SHA256 hex of raw JSON body>
```

This is the same signing scheme used by GitHub and Stripe. Verify it on your server:

```php
$signature = hash_hmac('sha256', $rawBody, $secret);
$expected  = 'sha256=' . $signature;
hash_equals($expected, $_SERVER['HTTP_X_VL_SIGNATURE']); // true if valid
```

## Delivery Behaviour

- Delivery is **synchronous and fire-and-forget** — errors are logged but never thrown to the calling request.
- **Private / local IP addresses** are blocked as delivery targets (SSRF protection).
- There is no automatic retry on failure. If reliability is critical, use a queue service as the target URL.

## Order events

`order.paid` fires when payment is confirmed — at checkout, via a payment-gateway callback, or when an admin moves the order into a paid status (`processing`, `shipped`, `completed`). A failed payment that is retried later fires `order.paid` at the moment it succeeds. `order.status_changed` fires on every status transition and adds `new_status`.

**Payload (`data`) for `order.paid`:**

```json
{
  "order_id": 67,
  "order_number": "ORD-DEMO0001",
  "order_status": "completed",
  "order_total": "7.00",
  "currency": "EUR",
  "order_customer_email": "john.doe@example.com",
  "order_customer_name": "John Doe",
  "items": [
    {
      "product_id": 21,
      "name": "LumiFind - AI-Powered Local Semantic File Search",
      "sku": "LUMI-TRIAL",
      "price": 6.99,
      "qty": 1,
      "subtotal": 6.99,
      "variation_id": 35,
      "variation_data": "{\"edition\":\"5-day Trial Pro Edition\"}"
    }
  ]
}
```

Notes:
- `sku` is the variation SKU when the item is a variation, otherwise the parent product SKU (empty if neither is set).
- `variation_id` is present only for variation items; `variation_data` carries the merged variation attributes as a JSON string (absent when empty).
- `order.status_changed` sends the same shape plus `"new_status": "<target status>"`.
- To look up a product from an item, use `GET /api/v1/products/id/{product_id}`. To write results back to the order (e.g. an issued license key note), use `POST /api/v1/orders/{id}/notes` (`write:orders`) — see the [REST API reference](./api#orders).

## Testing

The **Test** button in **Settings → Advanced → Webhooks** fires one delivery **per subscribed event**, each with its own sample payload and `X-VL-Event` header. Results show per-event status so you can validate each event in isolation. You can also test against a form with live values without saving the webhook first.

Placeholders like <code v-pre>{{tags}}</code> or <code v-pre>{{items}}</code> (array values) are JSON-encoded inside the body template so the rendered body stays valid JSON.

## Product events

`product.created` and `product.updated` dispatch **one delivery per product** — creating 3 products fires 3 separate requests, each carrying only that product. (For the items of a single order, see `order.paid` / `order.status_changed`, whose payload contains an `items` array with `product_id` / `variation_id` / `qty`.) `product.deleted` carries only `{id, sku, slug}`.

**Payload (`data`) for `product.created` / `product.updated`:**

```json
{
  "product_id": 7,
  "product_name": "Basic T-Shirt",
  "product_slug": "basic-t-shirt",
  "product_sku": "TSHIRT-001",
  "product_status": "published",
  "product_price": 19.99,
  "product_sale_price": null,
  "product_stock": 34,
  "variations": [
    {
      "id": 11,
      "sku": "TSHIRT-001-RED-M",
      "attributes": {"Color": "Red", "Size": "M"},
      "price": 19.99,
      "sale_price": null,
      "stock_quantity": 12,
      "stock_status": "in_stock"
    },
    {
      "id": 12,
      "sku": "TSHIRT-001-BLUE-L",
      "attributes": {"Color": "Blue", "Size": "L"},
      "price": 21.99,
      "sale_price": 19.99,
      "stock_quantity": 0,
      "stock_status": "out_of_stock"
    }
  ]
}
```

There are deliberately no image or file fields in this payload — SKUs, attributes, prices and stock only.

**Body Template:** only top-level <code v-pre>{{key}}</code> placeholders are supported (regex `/\{\{(\w+)\}\}/` — no dot-notation, so <code v-pre>{{variation.sku}}</code> stays literal). Use <code v-pre>{{variations}}</code> to embed the whole array; like <code v-pre>{{items}}</code> / <code v-pre>{{tags}}</code>, array values are JSON-encoded so the rendered body stays valid JSON:

```json
{"sku": "{{product_sku}}", "variations": {{variations}}}
```

::: tip SEE ALSO
- [Hooks & Events](./hooks) — server-side PHP event listeners for the same events.
- [REST API](./api) — pull-based alternative to webhooks.
:::
