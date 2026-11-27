# Product


## Product Reviews

| Setting | Description |
|---------|-------------|
| **Enable product reviews** | Shoppers can write reviews for products |
| **Allow users to edit/remove their own reviews** | Logged-in users can edit and delete their own reviews |
| **Show verified badge next to reviews from verified buyers** | Displays a "Verified Purchase" badge |
| **Users must be logged in to review** | Only allow logged-in users to submit reviews |
| **Only allow verified buyers to review** | Only users who purchased the product can review (appears when login is required) |
| **Enable star ratings on product pages** | 5-star rating system (per-product override available) |
| **Hold product reviews for moderation** | Guest reviews require manual approval; logged-in users are auto-approved |

**Review Captcha**: Select the captcha type for review submissions:
- None, Math question, hCaptcha, Google reCAPTCHA v3, Cloudflare Turnstile, Honeypot

::: warning
If a captcha type requiring API keys is selected but not configured, a warning is shown. Configure API keys in **Privacy & Security → Captcha API Keys**.
:::

## Cancellation & Refund Settings

| Setting | Description |
|---------|-------------|
| **Accept Refunds & Cancellations** | Master toggle. When disabled, refund request options are completely hidden across the frontend. |
| **Refund Request Window (Days)** | The number of days from order placement during which customers can submit cancellation or refund requests (1 to 365, default 14). Shown only when refunds are enabled. |
| **Auto-accept digital refunds if file has not been downloaded** | Automatically approves refund requests for digital orders if the customer has zero downloads. For external URL downloads, enable "Hide URL / Proxy" on the product so the real link is hidden and access can be tracked. |

## Warranty

**Shop-wide warranty (months)** sets the warranty duration shown on product pages. Enter the number of months in the field (up to 1200); it is a free number rather than a preset list, so country-specific terms such as 11 or 18 months are fine. **0** hides the warranty line — the statutory liability for defects applies regardless.

The value appears in the **Additional information** tab of the product page. It is a default, not a lock:

- The product editor's compliance section can override it per product (an empty field inherits the shop value, `0` hides the line for that product).
- Each variation can override the product the same way.
- When variations differ, the product page lists every distinct duration, so a customer never sees a warranty that does not apply to the variation they picked.

Keep the statement factual: a guarantee that promises more than the law requires becomes a contractual promise you have to honour. The legal checklist under [Legal & Compliance](./../compliance) covers the shop-wide text shown at checkout.

## Sales & Inventory Display

| Setting | Description |
|---------|-------------|
| **Show sold count** | Displays "X sold" when at least one unit has been sold |
| **Always show remaining stock count** | Shows "X in stock" when stock is tracked. Hidden when the low-stock warning displays |
| **Enable low stock warning** | Shows a warning on the product page when stock is low |
| **Low stock threshold** | The quantity at which the warning triggers (default: 2). Also sends a notification email to admin |

