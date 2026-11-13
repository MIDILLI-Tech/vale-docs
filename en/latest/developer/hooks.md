# Hooks & Events

Vale provides an **Action** system for reacting to internal events and a **Theme Hook** system for injecting HTML into template slots.

## Injecting the Event Dispatcher

Hooks are managed by `EventDispatcherInterface`. Inject it into your class via the DI container:

```php
use ValeApp\Domain\Shared\Event\EventDispatcherInterface;

class MyPlugin
{
    public function __construct(
        private readonly EventDispatcherInterface $events,
    ) {}

    public function register(): void
    {
        $this->events->addAction('order.paid', [$this, 'onOrderPaid']);
    }

    public function onOrderPaid(\ValeApp\Domain\Shop\Entity\Order $order): void
    {
        // Send a notification, update your CRM, etc.
    }
}
```

Register your listener in `bootstrap/events.php` after the container is built. That file is loaded by both the web bootstrap and the `vale` CLI, so listeners fire for HTTP requests, pseudo-cron and `php vale cron:run` alike. Core listeners for outbound webhooks and page-cache invalidation live there too (`PageCacheInvalidator`), which is why a scheduled publish drops exactly the same cached pages as an admin save.

## Actions

Actions are fire-and-forget: they let you react to an event without returning a value.

```php
// Lower priority numbers run first (default priority is 10)
$events->addAction('order.paid', function (Order $order): void {
    // Notify external CRM
}, priority: 20);
```

## Filters

The `EventDispatcherInterface` also includes `addFilter()` / `applyFilter()` for transforming values through a callback chain. Vale's core does not currently fire any internal filter hooks, but you can use the API to create your own filter hooks in custom extensions:

```php
// Register a filter
$events->addFilter('my_plugin.output', function (string $html): string {
    return $html . '<p>Extra content</p>';
});

// Apply it somewhere in your code
$output = $events->applyFilter('my_plugin.output', $rawHtml);
```

## Theme Hooks

`ThemeManager::addHook()` lets you inject HTML into named slots in the base layout. This is how Vale injects SEO meta tags into the `<head>`.

### Registering a Hook

```php
$themeManager->addHook('head', function (): string {
    return '<link rel="stylesheet" href="/my-plugin.css">';
}, priority: 20);
```

### Available Slots

| Slot name | Where it renders |
|---|---|
| `head` | Inside `<head>`: used for meta tags, stylesheets, preloads |

### Calling in Twig

The base layout already calls <code v-pre>{{ theme_hook('head') }}</code>. You don't need to add it yourself unless you are building a custom layout from scratch:

```twig
<head>
  {{ theme_hook('head') }}
</head>
```

## Core Action Events

All actions pass a typed entity as their first argument.

| Event | Payload | Fired when |
|---|---|---|
| `order.paid` | `Order $order` | Payment confirmed (checkout, webhook, or manual) |
| `order.status_changed` | `Order $order, string $newStatus` | Any order status transition |
| `order.reversed` | `Order $order` | Order cancelled or refunded |
| `order.shipped` | `Order $order` | Tracking number added / status set to shipped |
| `post.created` | `Post $post` | Post/page/CPT saved for the first time |
| `post.published` | `Post $post` | Post first goes live (status → published) |
| `form.submitted` | `array` (form_id, form_name, form_slug, submission_id, fields, ip_address, user_agent, submitted_at) | A frontend form is submitted |
| `user.registered` | `User $user` | New user account created |

::: tip Webhooks vs. Actions
Webhook delivery (outgoing HTTP calls) is already wired to `order.paid`, `order.status_changed`, `post.*`, and `user.registered` internally. Use actions when you need server-side PHP logic instead of (or in addition to) webhooks.
:::

::: tip SEE ALSO
- [Webhooks](./webhooks): configure outgoing HTTP webhooks via the admin panel.
- [Architecture](./architecture/domain): domain model and entity types.
:::
