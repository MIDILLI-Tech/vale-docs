# Adding a Custom Payment Gateway

Vale's payment layer is built around a single interface, `PaymentGatewayInterface`, plus a few convention-based registration points. Built-in gateways (Stripe, PayPal, Mollie, 2Checkout, Checkout.com) all follow the same pattern. To add a new one (e.g. "FooPay"), you need to touch:

1. `src/Infrastructure/Payment/`: the gateway class
2. `config/reference-data.php`: admin signup URLs and checkout label
3. `config/services.php`: DI factory + controller wiring
4. `resources/views/admin/settings/_ecommerce_payment.twig`: admin config card (+ `PaymentController` registration, see Step 5)
5. `resources/views/shop/checkout.twig`: storefront radio button
6. `routes/web.php`: checkout callback + webhook endpoint (if applicable)

No core business logic changes are required. The checkout flow, order creation, and payment-link generation are all gateway-agnostic once the new class implements the interface and is registered.

## Prerequisites

- A payment provider that supports either **redirect-based** payment (customer approves on provider site, returns to your success/cancel URLs) or **client-secret-based** payment (JavaScript collects card details in-place).
- API credentials: at minimum a **secret key** (server-side) and optionally a **publishable key** (client-side) or **webhook secret** (event notifications).

## Step 1: Implement the interface

Create `src/Infrastructure/Payment/FooPayGateway.php`:

```php
<?php

declare(strict_types=1);

namespace ValeApp\Infrastructure\Payment;

use ValeApp\Domain\Shop\Entity\Order;
use ValeApp\Domain\Shop\Port\PaymentGatewayInterface;

final class FooPayGateway implements PaymentGatewayInterface
{
    public function __construct(
        private readonly string $apiKey,
        private readonly string $webhookSecret = '',
    ) {
    }

    public function getName(): string
    {
        return 'foopay';
    }

    public function createPayment(Order $order): array
    {
        $response = $this->apiRequest('POST', '/v1/charges', [
            'amount'      => (int) round($order->getTotal() * 100),
            'currency'    => strtolower($order->getCurrency()),
            'order_number' => $order->getOrderNumber(),
            'return_url'  => site_url('/checkout/success'),
            'cancel_url'  => site_url('/checkout/cancel'),
        ]);

        return [
            'redirect_url' => (string) ($response['approval_url'] ?? ''),
            'payment_id'   => (string) ($response['id'] ?? ''),
        ];
    }

    public function verifyPayment(string $paymentId): array
    {
        $charge = $this->apiRequest('GET', '/v1/charges/' . rawurlencode($paymentId));

        $status = match ((string) ($charge['status'] ?? '')) {
            'succeeded' => 'paid',
            'failed'    => 'failed',
            'canceled'  => 'cancelled',
            default     => 'pending',
        };

        return [
            'status'         => $status,
            'transaction_id' => (string) ($charge['id'] ?? $paymentId),
        ];
    }

    public function handleWebhook(string $payload, string $signature): ?array
    {
        if ($this->webhookSecret === '' || !$this->isValidSignature($payload, $signature)) {
            return null;
        }

        $event = json_decode($payload, true);
        if (!is_array($event)) {
            return null;
        }

        $type   = (string) ($event['event_type'] ?? '');
        $charge = $event['data']['charge'] ?? null;

        return match ($type) {
            'charge.succeeded' => [
                'event'      => 'payment_succeeded',
                'order_id'   => $charge['metadata']['order_number'] ?? null,
                'status'     => 'paid',
                'payment_id' => (string) ($charge['id'] ?? ''),
            ],
            'charge.failed' => [
                'event'      => 'payment_failed',
                'order_id'   => $charge['metadata']['order_number'] ?? null,
                'status'     => 'failed',
                'payment_id' => (string) ($charge['id'] ?? ''),
            ],
            default => null,
        };
    }

    /** @return array<string,mixed> */
    private function apiRequest(string $method, string $path, array $body = []): array
    {
        $http = \ValeApp\Infrastructure\Payment\HttpTransport::request(
            $method,
            'https://api.foopay.com' . $path,
            ['Authorization: Bearer ' . $this->apiKey, 'Content-Type: application/json'],
            $body === [] ? null : json_encode($body),
            15,
        );

        if (!$http['ok']) {
            throw new \RuntimeException('FooPay HTTP error: ' . $http['error']);
        }

        $result = json_decode($http['body'], true);
        if (!is_array($result) || !empty($result['error'])) {
            $msg = is_array($result['error'] ?? null) ? ($result['error']['message'] ?? 'Unknown error') : ($result['error'] ?? 'Invalid response');
            throw new \RuntimeException('FooPay API error: ' . $msg);
        }

        return $result;
    }

    private function isValidSignature(string $payload, string $signature): bool
    {
        $expected = hash_hmac('sha256', $payload, $this->webhookSecret);
        return hash_equals($expected, $signature);
    }
}
```

### Interface contract

| Method | Returns | Purpose |
|---|---|---|
| `getName()` | `string` | Slug used everywhere: DB `payment_method`, route segments, settings keys. Must be unique. |
| `createPayment(Order)` | `array{redirect_url?:string, client_secret?:string, payment_id:string}` | Either `redirect_url` (hosted checkout) or `client_secret` (embedded SDK). At minimum `payment_id`. |
| `verifyPayment(string)` | `array{status:string, transaction_id:string}` | Polls the provider and maps its status to one of: `paid`, `failed`, `cancelled`, `pending`. |
| `handleWebhook(string, string)` | `?array{event:string, order_id?:string, status?:string, payment_id?:string}` | Decodes a raw webhook payload. Return `null` to ignore. |

Optional extras (see StripeGateway for reference): `refundPayment()`, `createSubscription()`, `cancelSubscription()`, `retrieveCheckoutSession()`. Add them as needed. The admin refund panel already dispatches to gateway-specific methods via `performGatewayRefund()`.

## Step 2: Register in `reference-data.php`

Add an entry under `signup_urls.payment_gateways`:

```php
'signup_urls' => [
    'payment_gateways' => [
        // ... existing gateways ...

        'foopay' => [
            'name'        => 'FooPay',
            'signup_url'  => 'https://foopay.com/signup',
            'api_urls'    => [
                'test' => 'https://sandbox.foopay.com/keys',
                'live' => 'https://dashboard.foopay.com/keys',
            ],
        ],
    ],
    'channels'    => [ /* ... */ ],
    'verification' => [ /* ... */ ],
],
```

The `name` is shown in the admin order-edit payment-method dropdown (via `OrderController::availablePaymentMethods()`). The `signup_url` and `api_urls` are surfaced in the admin Payments settings panel. That is deliberate: provider links live here and are never written into the docs. The slug (`foopay`) must match `getName()` exactly.

## Step 3: Add the DI factory

In `config/services.php`, add a factory for your gateway class:

```php
\ValeApp\Infrastructure\Payment\FooPayGateway::class => factory(function ($c) {
    return new \ValeApp\Infrastructure\Payment\FooPayGateway(
        $c->get(DbalSettingsRepository::class)->get('foopay_api_key', ''),
        $c->get(DbalSettingsRepository::class)->get('foopay_webhook_secret', ''),
    );
}),
```

Settings are read from the database at runtime, so the admin can change keys without editing code.

## Step 4: Wire into controllers

Three controllers need the new gateway injected so they can route payments, generate links, and process webhooks:

**A. `CheckoutController`** (`front`, handles `POST /checkout/pay` and callback routes)

```php
// config/services.php: inside the existing ->constructorParameter('gateways', [...]) block
\ValeApp\App\Controllers\Front\CheckoutController::class => autowire()
    ->constructorParameter('gateways', [
        // ... existing gateways ...
        get(\ValeApp\Infrastructure\Payment\FooPayGateway::class),
    ])
```

**B. `OrderController`** (`admin`, generates payment links, processes refunds)

```php
\ValeApp\App\Controllers\Admin\OrderController::class => autowire()
    // ... existing constructorParameter calls ...
    ->constructorParameter('foopayGateway', get(\ValeApp\Infrastructure\Payment\FooPayGateway::class)),
```

The `OrderController` constructor declares one nullable property per gateway:

```php
private readonly ?FooPayGateway $foopayGateway = null,
```

You must also add the `use` import at the top of `OrderController.php`.

**C. `WebhookController`** (`front`, dispatches inbound webhooks)

```php
\ValeApp\App\Controllers\Front\WebhookController::class => autowire()
    ->constructorParameter('gateways', [
        // ... existing gateways ...
        get(\ValeApp\Infrastructure\Payment\FooPayGateway::class),
    ])
```

`WebhookController` loops through the `$gateways` array and calls `handleWebhook()` on each until one returns non-null. The order doesn't matter.

## Step 5: Admin settings card

Add a gateway card in `resources/views/admin/settings/_ecommerce_payment.twig` (the only admin UI, there is no separate wizard page). Follow the Mollie card as a template. At minimum you need:

- **Card wrapper**: `data-provider-card="foopay"` plus the status badges (`Enabled`/`Disabled`, `Tested`/`Not tested` from `paymentConfig.foopay.tested`, `★ Default` when it is the default)
- **One form** (`id="pay-save-foopay"`, posts to `/admin/payment/save`) with two submit buttons: `Save` and `Save & Test Gateway` (the latter uses `formaction` pointing at `/admin/payment/test`, so both buttons submit the typed values. Never build a second test-only form)
- **Enable switch**: posts to `/admin/payment/toggle` with `provider=foopay`; render it disabled with a "test first" hint until `foopay_tested_ok` is set
- **API key input**: `name="api_key"`
- **Webhook secret input** (if your provider signs webhooks)
- **Sandbox / test mode toggle** (optional)
- **Sign-up link**: <code v-pre>{{ signup_urls.payment_gateways.foopay.signup_url }}</code>
- **Default row**: a `Set Default` button posting to `/admin/payment/default` (disabled until enabled), or a non-clickable `Default Gateway` badge when active

PHP registration is required (keys are persisted per provider, not generically):

- `PaymentController::buildConfig()`: add the `foopay` entry (`enabled` + `tested` keys)
- `PaymentController::PROVIDER_SETTING_KEYS`: add the `foopay` key list
- `PaymentController::persistProvider()`: add the `foopay` branch
- The `in_array(...)` allow-lists in `save`/`toggle`/`setDefault`: add `'foopay'`

`SettingsController` reuses `buildConfig()`, so no changes are needed there.

## Step 6: Storefront checkout block

In `resources/views/shop/checkout.twig`, add a radio button for your gateway (follow the Mollie block at lines 362 to 375):

```twig
{% if foopay_enabled %}
<div class="rounded-xl border ..."
     :class="paymentMethod === 'foopay' ? 'border-...' : 'border-gray-200 ...'">
    <input type="radio" name="payment_method" value="foopay" ...>
    <span class="font-medium text-gray-800 dark:text-gray-200">{{ foopay_label }}</span>
</div>
{% endif %}
```

The `foopay_enabled` and `foopay_label` variables come from `CheckoutController`, which reads `foopay_enabled` and `foopay_label` from the settings table automatically. The controller already iterates all configured gateways. You just need to add the template block so the customer can actually select it.

Also add the "no gateway enabled" fallback at line 417:

```twig
{% if not stripe_enabled and not paypal_enabled and not mollie_enabled and not twocheckout_enabled and not checkoutcom_enabled and not foopay_enabled and not banktransfer_enabled %}
```

## Step 7: Webhook route (if your provider sends events)

In `routes/web.php`, add a route for inbound webhooks:

```php
$g->post('/webhooks/foopay', [WebhookController::class, 'handle'])->setName('webhook.foopay');
```

Register the URL with your provider so they POST to:

```
https://yoursite.com/webhooks/foopay
```

The `WebhookController` already loops through injected gateways and returns `200` automatically for unhandled events. No additional PHP code is needed unless your provider uses a non-standard signature scheme. In that case, add a `foopay` branch inside `WebhookController::handle()`.

## Step 8: Settings keys convention

Vale stores gateway configuration as flat rows in `vl_settings` with keys following this pattern:

```
{slug}_enabled            "1" | "0"
{slug}_label              "Display name on checkout"
{slug}_api_key            "sk_live_..."
{slug}_webhook_secret     "whsec_..."
{slug}_sandbox            "1" | "0"
```

The admin settings page reads these via `$this->settings->get()` and renders the form dynamically. Once the keys exist in the database, the UI works. You don't need to add them to a seeder unless you want demo data.

::: warning WEBHOOK VERIFICATION IS FAIL-CLOSED
Inbound webhooks are only processed when their signature verifies against a configured secret (Stripe HMAC, Checkout.com HMAC, 2Checkout INS hash) or PayPal's `verify-webhook-signature` API (`paypal_webhook_id` setting). Without the secret configured, notifications are rejected and never trusted.
:::

## Minimal end-to-end example

For a fully working but trivially simple gateway (no real API calls, just for testing), see `src/Infrastructure/Payment/` for the existing `LogMailAdapter` pattern, a logging decorator that can be adapted. A "DummyGateway" that redirects to `/checkout/success?status=paid` is useful during integration and requires only Steps 1 to 4 (no webhook, no admin settings block beyond a toggle).

## Checklist

- [ ] `src/Infrastructure/Payment/{Name}Gateway.php` implements all 4 interface methods
- [ ] `config/reference-data.php`: added to `signup_urls.payment_gateways`
- [ ] `config/services.php`: factory + 3 controller constructor arrays updated
- [ ] `OrderController.php`: nullable property + `use` import added
- [ ] `resources/views/admin/settings/_ecommerce_payment.twig`: admin card added
- [ ] `PaymentController::buildConfig()` + allow-lists extended with the new slug
- [ ] `resources/views/shop/checkout.twig`: radio button + no-gateway fallback updated
- [ ] `routes/web.php`: webhook route added (if applicable)
- [ ] `resources/lang/en.json` (+ `tr.json`, `fr.json`): translated label added for the new gateway's admin strings
