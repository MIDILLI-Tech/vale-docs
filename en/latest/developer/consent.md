# Cookie Consent & Click-to-Load Embeds

How Vale resolves a visitor's consent decision, gates injected code, keeps the page cache useful, and renders third-party embeds so nothing reaches a provider before a click.

## Moving parts

| File | Role |
|---|---|
| `config/consent.php` | Cookie name, lifetime and the category catalog (`necessary` is required). |
| `src/Domain/Consent/` | `ConsentState` value object and `ConsentRepositoryInterface`. |
| `src/Application/Consent/ConsentService.php` | Resolves the cookie, decides what is allowed, saves decisions, builds the cache variant. |
| `src/Application/Consent/ConsentTextAdvisor.php` | Finds the categories that actually carry a service and generates honest banner sentences. |
| `app/Middleware/ConsentMiddleware.php` | Publishes the state to Twig and empties gated script globals. |
| `app/Controllers/Front/ConsentController.php` | `POST /consent` (store) and `GET /consent/token` (CSRF token for cached pages). |
| `src/Infrastructure/Persistence/DbalConsentRepository.php` | Appends log rows, prunes expired ones. |
| `resources/views/partials/_consent_banner.twig` | Banner markup, styles and JS — included by all layouts. |

The middleware runs **after** `LocaleMiddleware` (the stack is LIFO), so `$request->getAttribute('locale')` is available and the banner title/text can be read from the localized setting keys.

## The decision cookie

One first-party cookie (`vl_consent` by default, 180 days, `HttpOnly`, `SameSite=Lax`) holds a base64 JSON payload:

```json
{ "v": "1", "c": ["analytics"], "id": "8f3c…" }
```

- `v` is the policy version — a mismatch invalidates the decision and the visitor is asked again.
- `c` lists the accepted optional categories only (`necessary` is implied).
- `id` is a random consent id, used to link log rows. It is never part of the page cache key.

`ConsentService` exposes the resolved state, the offered categories and `isAllowed(string $category)`:

```php
if ($consent->isAllowed('analytics')) {
    // render the analytics snippet
}
```

`isAllowed()` returns `true` for `necessary`, for any category when the module is off, and for categories the visitor accepted. A category the operator has switched off never allows anything.

## Offered categories

`ConsentService::optionalCategories()` intersects three sets:

1. the catalog in `config/consent.php` (minus `necessary`),
2. the `consent_categories` setting (unset means "all available", empty means "none"),
3. `ConsentTextAdvisor::activeCategories()` — categories that have a non-empty custom script (`custom_header_scripts`, `custom_footer_scripts` and their `_category` sibling) or, for marketing, an enabled advertisement code.

A category with no service is never offered, so the banner cannot ask for consent to something that does not exist.

## Gating injected output

`ConsentMiddleware::gateInjectedScripts()` empties the Twig globals instead of editing every theme:

- `custom_header_scripts` / `custom_footer_scripts` are cleared when their `_category` is set and not allowed.
- `advertisement_code` is cleared when `marketing` is not allowed.

Unclassified scripts keep loading, and the admin screen flags them. Spam-protection challenge scripts are intentionally not gated — the admin warning calls that out.

## Banner contract

The banner is rendered server-side and needs these globals, all published by `ConsentMiddleware`: `consent_enabled`, `consent_decided`, `consent_state`, `consent_optional_categories`, `consent_version`, `consent_banner_title`, `consent_banner_text`.

The CSRF token is **not** in the cached HTML. On click the banner calls `GET /consent/token`, then posts to `POST /consent` with `_csrf_token` and `categories[]` (add `revoke=1` to withdraw everything) and reloads the page.

## Page cache

`PageCacheMiddleware` only adds a consent variant to the key when the module is on:

```text
?_consent=<first 12 hex chars of sha256(version|decided|accepted categories[|gpc])>
```

The variant is bounded (2ⁿ + 1 states, never per visitor), so enabling consent does not disable caching. A visitor sending `Sec-GPC: 1` (with **US Privacy Opt-Out** on) gets the `|gpc` variant, which never contains marketing output. `/consent` and `/consent/*` are always excluded, because they answer with a per-session token or set a cookie.

## Global Privacy Control

`ConsentService::setGlobalPrivacyControl(true)` marks the request as opted out of sale/sharing; `isAllowed('marketing')` then returns `false` regardless of the cookie, and `cacheVariant()` appends `|gpc`. `ConsentMiddleware` reads the `Sec-GPC` header only while `consent_us_optout_enabled` is on, so the feature stays opt-in for the operator.

## Click-to-load embeds

`ShortcodeProcessor` never emits a third-party `<iframe>` into content. `[embed]`, card media, hero media, carousel video slides and pasted iframes all render a placeholder button instead:

```html
<div class="vl-video-embed" style="position:relative;padding-bottom:56.25%;…">
  <button type="button" class="vl-embed-gate" data-vl-embed
          data-vl-embed-src="https://www.youtube-nocookie.com/embed/ID"
          aria-label="Load video">…</button>
</div>
```

- `data-vl-embed-src` is the only place the provider URL lives; nothing is requested until a click.
- YouTube URLs are rewritten to `youtube-nocookie.com`, including iframes pasted into old content.
- Embeds already wrapped in `.vl-video-embed` are gated in place; bare iframes get the 16:9 wrapper first.
- The button fills its container, so the same markup works in a card, a hero and a carousel slide.

The click handler is one delegated listener in `resources/views/partials/_embed_gate.twig`; it replaces the button with an `iframe` that keeps the same absolute positioning.

::: warning CUSTOM THEMES
Every layout must include the partial once, next to the consent banner:

```twig
{% include 'partials/_embed_gate.twig' %}
```

Without it the placeholder button stays a button and the embed never loads.
:::

## Third-party comments

Disqus, Giscus and Facebook comments never load on page open. The comments partial wraps the provider markup in a `<template data-vl-comments-template>` inside a `[data-vl-comments-gate]` card; the delegated listener clones the template into the page on click (scripts inserted that way execute) and calls `FB.XFBML.parse()` for Facebook.

The gate lives in both `resources/views/partials/comments.twig` and `themes/nova/templates/partials/comments.twig` — a custom theme with its own comments partial needs the same markup to get the behaviour.

## Captcha consent gate

With **Fallback Spam Protection to Honeypot or Math if the visitor does not consent** enabled, `ConsentMiddleware` binds `CaptchaConsentGate` once per request:

```php
CaptchaConsentGate::configure($gated ? $consent->isAllowed('functional') : null);
```

Rendering and validation both call `CaptchaConsentGate::effectiveType($configured)`, which returns `math` for a declined visitor and the configured provider otherwise. That keeps the challenge that was shown and the challenge that is checked identical. `CaptchaTrait` (login, register, comments, reviews), `FormFrontController` and the newsletter shortcode all go through it, and the math branch validates the hidden honeypot as well.

## Log and retention

`vl_consent_log` stores one row per action:

| Column | Content |
|---|---|
| `consent_id` | Anonymous id from the cookie |
| `action` | `grant`, `update` or `revoke` |
| `categories` | JSON list of accepted categories |
| `policy_version` | Consent version at the time |
| `user_id` | Optional logged-in user |
| `created_at` | Timestamp |

`CronService` calls `pruneOlderThan()` with `consent_log_retention_days` (minimum 30) while the module is enabled.

## Tests

```bash
vendor/bin/phpunit tests/Unit/Application/Consent
vendor/bin/phpunit tests/Unit/Infrastructure/Content/ShortcodeProcessorTest.php
```

The shortcode tests assert that embeds render a gate, that YouTube is rewritten to `youtube-nocookie`, and that unsafe `src` values are left untouched.

::: tip SEE ALSO
- [Page Cache](./page-cache) — cache key components and invalidation.
- [Shortcodes](./shortcodes) — `[embed]`, cards, hero and carousel markup.
- [Admin: Cookie Consent](../admin/settings/consent) — the operator-facing screen.
:::
