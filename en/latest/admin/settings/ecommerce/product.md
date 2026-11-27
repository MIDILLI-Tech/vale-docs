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

## Sales & Inventory Display

| Setting | Description |
|---------|-------------|
| **Show sold count** | Displays "X sold" when at least one unit has been sold |
| **Always show remaining stock count** | Shows "X in stock" when stock is tracked. Hidden when the low-stock warning displays |
| **Enable low stock warning** | Shows a warning on the product page when stock is low |
| **Low stock threshold** | The quantity at which the warning triggers (default: 2). Also sends a notification email to admin |

