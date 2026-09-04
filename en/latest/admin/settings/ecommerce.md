# E-Commerce Settings

Configure your online store's core operations, from payments to global shipping. The E-Commerce tab has eight sub-tabs: **Shop**, **Product**, **Currency**, **Shipping**, **Payment**, **Checkout**, **Legal**, and **Import**.

::: tip SHOP & SUBSCRIPTION TOGGLES
The on/off switches for **Shop** and **Subscriptions** live in **[Settings](./) → [General](./general) → [Features](./general#features)**.
:::

## Shop

### Company Identity

Used on invoices, order confirmations, and legal documents:

| Field | Description |
|-------|-------------|
| **Company Name** | Your business name |
| **VAT Number** | Tax registration number |
| **Shop Email** | Contact email for order-related communication |
| **Shop Phone** | Contact phone number |
| **Address Line 1 & 2** | Street address |
| **City** | City |
| **State / Region** | State or region |
| **Postcode** | Postal code |
| **Country** | Country |

### Tax Regime

- **Normal VAT**: Standard VAT applies. Shows the Default VAT Rate field and Country Tax Rates.
- **No Tax (0%)**: No VAT applied. Requires a **Zero Tax Reason** for invoices/checkout.

**Default VAT Rate (%)**: The baseline rate (e.g., 19%). Used when no country-specific override exists.

**Zero Tax Reason**: Required legal explanation when VAT is 0% (e.g., "Small business regulation §19 UStG").

### Country Tax Rates

Set per-country tax rules. Countries not listed use the **Other Countries** fallback row.

| Setting | Description |
|---------|-------------|
| **Use Global** | Inherits the company country rate |
| **Normal VAT** | Apply a custom rate (enter the percentage) |
| **No Tax** | No VAT, requires a zero tax reason |

Click **+ Add Country** to add more countries. Use ✕ to remove a country row (the fallback row cannot be removed).

### Channel Manager

Enable or disable product feeds for external marketplaces. Each channel provides a feed URL to submit to the marketplace. Use the **All / None / Invert** quick buttons to manage multiple channels at once.

| Channel | Feed Type |
|---------|-----------|
| **Google Merchant Center** | `{site_url}/api/v1/feed/google-merchant` |
| **Bing Merchant Center** | `{site_url}/api/v1/feed/bing` |
| **Meta (Facebook / Instagram)** | `{site_url}/api/v1/feed/meta` |
| **Pinterest** | `{site_url}/api/v1/feed/pinterest` |
| **Idealo** | `{site_url}/api/v1/feed/idealo` (CSV) |
| **TikTok Shop** | `{site_url}/api/v1/feed/tiktok` |
| **Shopify RSS Feed** | `{site_url}/api/v1/feed/shopify` (RSS 2.0) |
| **Yandex Market** | `{site_url}/api/v1/feed/yandex-market` (YML) |

**Default Google Product Category**: Browse the official Google taxonomy with a category browser modal. Products use this category when "Use global" is selected in their GMC panel.

## Product

### Product Reviews

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

### Cancellation & Refund Settings

| Setting | Description |
|---------|-------------|
| **Accept Refunds & Cancellations** | Master toggle. When disabled, refund request options are completely hidden across the frontend. |
| **Refund Request Window (Days)** | The number of days from order placement during which customers can submit cancellation or refund requests (1 to 365, default 14). Shown only when refunds are enabled. |
| **Auto-accept digital refunds if file has not been downloaded** | Automatically approves refund requests for digital orders if the customer has zero downloads. For external URL downloads, enable "Hide URL / Proxy" on the product so the real link is hidden and access can be tracked. |

### Sales & Inventory Display

| Setting | Description |
|---------|-------------|
| **Show sold count** | Displays "X sold" when at least one unit has been sold |
| **Always show remaining stock count** | Shows "X in stock" when stock is tracked. Hidden when the low-stock warning displays |
| **Enable low stock warning** | Shows a warning on the product page when stock is low |
| **Low stock threshold** | The quantity at which the warning triggers (default: 2). Also sends a notification email to admin |

## Currency

### Default Currency

The base currency for prices and orders (e.g., USD, EUR, TRY). All orders are recorded in this currency regardless of the displayed currency.

### Additional Currencies

Select extra currencies customers can switch to. Uses a multi-select token interface. Leave empty for default currency only.

### Blocked Currencies

Select currencies to always block, even if they appear in additional currencies.

### Exchange Rates

Configure automatic rate conversion when multiple currencies are enabled:

**Rate Provider**:

| Provider | API Key Required | Notes |
|----------|------------------|-------|
| **None (no conversion)** | None | All prices shown in base currency only |
| **Frankfurter** | No | Free, 220+ currencies, blended daily rates from 100+ central banks, no quotas |
| **Open Exchange Rates** | Yes | Free plan: 1,000 requests/month (USD base) |
| **ExchangeRate-API** | Yes | Free plan: 1,500 requests/month (any base) |

**Cache Duration (hours)**: How long to keep cached rates before fetching again. Default: 24 hours.

Click **Refresh Rates Now** to force an immediate sync without reloading the page, the result appears inline below the button. The last updated time and base currency are shown.

When cron is disabled, a warning suggests enabling it in **Maintenance → Scheduled Tasks** for automatic refreshes.

## Shipping

- **Enable shipping**: Master toggle for shipping rates and calculation on the storefront.
- **Shipping Mode**: Define how shipping is calculated:
  - **Flat rate**: fixed cost per order.
  - **Always free**: no shipping cost.
  - **Free above order threshold**: orders at or above the threshold ship free.
  - **Weight-based**: cost from the weight tiers table.
  - **Highest item rate**: uses the highest matching weight tier for any item in the order.
- **Flat Rate**: The fixed per-order cost (also used by free-above-threshold mode).
- **Free Shipping Threshold**: Orders equal to or above this amount ship free.
- **Default Rate (over all weight tiers)**: Fallback rate when the order weight exceeds all weight tiers.
- **Weight-based Rates**: Weight tiers sorted ascending (e.g. up to 1 kg → $5, up to 5 kg → $10). Used in weight-based and highest-item-rate modes.
- **Additional Countries**: Countries you ship to beyond the company country. Leave empty to allow the company country only.
- **Blocked Countries**: Countries to always block, even if listed in additional countries.

### Default Estimated Delivery

Set a store-wide delivery estimate so customers know how long an order typically takes:

| Field | Description |
|-------|-------------|
| **Default Estimated Delivery (min days)** | The fastest delivery time (e.g., 3) |
| **Default Estimated Delivery (max days)** | The slowest delivery time (e.g., 7) |

This range is the fallback used for products and countries without their own estimate. Products, variations, and per-country overrides can all override it. Leaving both fields empty disables the estimate entirely.

### Country-specific Rates

Fine-tune shipping per country. For each country you add, set:

| Field | Description |
|-------|-------------|
| **Country** | ISO 2-letter code (e.g., `DE`) |
| **Rate** | A flat shipping cost that overrides the default rate for that country |
| **Estimated Shipping (Min / Max)** | A delivery estimate (in days) that overrides the default estimate for that country |

Country-specific rates only affect the shipping cost and delivery estimate for orders shipped to that country, other countries keep using the store defaults. See [Products → Shipping](../ecommerce/products#shipping) for how per-country overrides work at the product and variation level.

### Custom Tracking Carriers

In the **Shipping** sub-tab, you can add your own tracking carriers. Each entry needs a name and a URL template with a tracking-number placeholder.

## Payment

Vale supports multiple payment providers. Each gateway gets its own card with a status badge (`Tested` / `Not tested`) and an enable switch. All enabled methods are offered at checkout; the default is pre-selected.

| Gateway | Notes |
|---------|-------|
| **Stripe** | Card processing, Apple Pay, Google Pay |
| **PayPal** | Standard checkout and subscription billing |
| **Mollie** | Popular in the Netherlands and across Europe |
| **2Checkout** | Global payments with multi-currency support |
| **Checkout.com** | Enterprise-grade card processing |
| **Bank Transfer** | Manual payment instructions shown at checkout; orders stay in *pending* until you mark them paid. Supports a configurable transfer deadline (**max days**) and admin-generated instruction links, see [Orders](../ecommerce/orders#payment-links-bank-transfer) |

To configure a gateway:

1. Open its card, enter your API keys, and click **Save & Test Gateway**. A successful test saves the values and enables the provider automatically. (Bank Transfer needs no test, fill in the required bank details and click **Save**, then switch it on manually.)
2. Optionally click **Set Default** to make it the pre-selected method at checkout. The button stays disabled until the provider is enabled.

The switch in a card header stays locked with a hint until the provider is tested (online gateways) or the required fields are filled in (Bank Transfer).

### Stripe Payment Methods

The **Payment Methods** field controls which methods Stripe offers at checkout. Pick one of three modes:

| Mode | What it does |
|------|--------------|
| **Automatic** (recommended) | Stripe decides dynamically from your Stripe Dashboard settings, based on the buyer's country and the order currency. May include local methods such as iDEAL. |
| **Card only** | Only card payments, Visa, Mastercard, Amex, plus Apple Pay / Google Pay wherever the customer's device supports them. |
| **Custom** | Only the methods you tick are offered. |

In **Custom** mode the method list is read from your own Stripe account (its default payment method configuration), so you only see methods your account could actually accept. The first load makes one call to Stripe; the result is cached for six hours and the **↻ Refresh** button re-reads it on demand.

If Stripe cannot be reached yet, for example, before you have saved a secret key, a short default list is shown instead and a note under the list says so. Anything missing from the list can still be typed into the **Other method type** box using the exact Stripe `payment_method_types` value (for example `twint`).

Ticking every listed method is equivalent to **Automatic**, so use **Custom** to narrow the list. The value is saved as a comma-separated list; **Automatic** saves an empty value and **Card only** saves `card`.

::: warning METHOD AVAILABILITY
Stripe only offers a method when your account country, the buyer's country and the order currency all support it **and** it is enabled in your Stripe Dashboard. Selecting a method your account cannot accept makes Stripe reject the payment at checkout. When unsure, keep **Automatic**.
:::

Selections you saved earlier are never removed automatically. If a method is no longer available on your account, its chip turns amber and a warning appears under the list, remove the chip if you no longer need it.

### PayPal Webhook ID

PayPal subscription webhooks are only processed when they can be verified against a **Webhook ID**. Without it, incoming PayPal notifications are rejected.

To get the ID:

1. Open your provider's developer dashboard via the quick access link in the settings panel under **Live** (or **Sandbox**).
2. In the **Webhooks** section, add a webhook with the URL shown in the settings panel and subscribe to the listed subscription events.
3. Copy the displayed **Webhook ID** and paste it into **PayPal → Webhook ID**.

::: warning SANDBOX VS LIVE
Sandbox and Live each have their own webhook IDs. The ID must come from the same environment as the **Sandbox mode** checkbox, otherwise every webhook fails verification.
:::

If a webhook already exists for your site, you don't need to create a new one, copy its ID from the dashboard list instead.

::: tip
All enabled gateways are offered at checkout, the **default** is simply pre-selected. Test the connection first (online providers), then enable, then optionally set as default.
:::

## Checkout

### Guest Checkout

Allow customers to checkout without creating an account. When disabled, customers must log in before checking out.

### Buy Now Button

Display an additional **Buy Now** button on product pages, directly below the **Add to Cart** button. When clicked, the product is added to the cart and the customer is redirected straight to checkout (skipping the cart page). The button is only shown for in-stock products and follows the same variation/quantity rules as **Add to Cart**.

| Setting | Description |
|---------|-------------|
| **Enable "Buy Now" button** | Master toggle. Requires the Shop feature to be enabled. Default: off. |

### Checkout Form

Configure which billing fields are displayed and which are mandatory:

| Field | Display | Mandatory |
|-------|---------|-----------|
| **First Name** | ✓ | ✓ |
| **Last Name** | ✓ | ✓ |
| **Email** | ✓ | ✓ |
| **Phone** | ✓ | optional |
| **Country** | ✓ | ✓ |
| **Address** | ✓ | ✓ |
| **City** | ✓ | ✓ |
| **State / Region** | ✓ | optional |
| **Postcode** | ✓ | ✓ |
| **Order Notes** | ✓ | optional |

When a field is hidden (Display unchecked), the Mandatory checkbox is automatically disabled.

### Additional Form Fields

If the Form Builder is enabled, select an additional form to be appended at checkout. The form fields appear under "Additional Information" on the checkout page. See [Using Forms in Checkout](../forms#using-forms-in-checkout) for setup steps and how checkout form submissions are handled.

### Abandoned Cart Recovery

Send reminder emails to logged-in users who left items in their cart:

| Setting | Description |
|---------|-------------|
| **Enable abandoned cart emails** | Master toggle |
| **Delay (hours)** | Hours after cart is abandoned before sending first reminder (default: 2) |
| **Max reminders** | Maximum number of reminders to send (default: 3) |
| **Reminder interval (hours)** | Hours between subsequent reminders (default: 24) |

### Tax Display

Controls how tax appears in checkout and order summary views:

- **Show VAT included + breakdown**: Shows total with VAT and an itemized breakdown.
- **Show VAT included only**: Shows the total with VAT included, no breakdown.

## Legal

Select existing pages to link as policy documents. These appear on the checkout page and in order confirmation emails.

| Setting | Description |
|---------|-------------|
| **Return Policy Page** | Return/refund policy page |
| **Privacy Policy Page** | Privacy policy page |
| **Terms & Conditions Page** | Terms and conditions page |

Click **Create a new page →** to open the page editor in a new tab.

::: warning Legal Compliance
Check your local regulations to comply with legal requirements for online stores. An additional **Imprint (Legal Notice)** page may be mandatory in some jurisdictions.
:::

## Import

The **Import** sub-tab lets you bring products into your shop from external platforms or from a Vale CSV export.

### Marketplace Imports

Four platform-specific cards handle Shopify, Etsy, eBay, and Amazon exports. Each card accepts the platform's own CSV/Excel file, maps its columns to Vale product fields, and links straight to that platform's export screen. See [Products → Import Products from Marketplaces](../ecommerce/products#import-products-from-marketplaces) for the full reference.

### Vale Products

Use the **Vale Products** card to import your own product catalog from a CSV file that uses Vale's native column format.

- **Download Template**: Get a CSV with all available columns and two example rows (one simple product, one variable product with variations).
- **Import Media**: When checked, image URLs in `featured_image_url`, `gallery`, and `download_files` are downloaded into the media library.
- **Update Existing**: When checked, products that already exist (matched by slug) are updated instead of skipped.

For the complete column reference, variation format, and CLI equivalent, see [Products → Import Your Own Catalog](../ecommerce/products#import-your-own-catalog).

::: tip FOR SYSADMINS
The same import is available from the terminal, see the CLI section in [Products → Import Your Own Catalog](../ecommerce/products#import-your-own-catalog).
:::

::: tip SEE ALSO
- Detailed guide on managing [Products](../ecommerce/products).
- Learn how to handle [Orders](../ecommerce/orders).
- Create discount [Coupons](../ecommerce/coupons).
- Configure recurring plans in [Membership](./membership).
- Configure captcha API keys in [Privacy & Security](./privacy).
:::
