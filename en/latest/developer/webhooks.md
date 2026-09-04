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

## Testing

The **Test** button in **Settings → Advanced → Webhooks** fires one delivery **per subscribed event**, each with its own sample payload and `X-VL-Event` header. Results show per-event status so you can validate each event in isolation. You can also test against a form with live values without saving the webhook first.

Placeholders like `{{tags}}` or `{{items}}` (array values) are JSON-encoded inside the body template so the rendered body stays valid JSON.

::: tip SEE ALSO
- [Hooks & Events](./hooks) — server-side PHP event listeners for the same events.
- [REST API](./api) — pull-based alternative to webhooks.
:::
