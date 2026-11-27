# Shop


## Company Identity

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

## Tax Regime

- **Normal VAT**: Standard VAT applies. Shows the Default VAT Rate field and Country Tax Rates.
- **No Tax (0%)**: No VAT applied. Requires a **Zero Tax Reason** for invoices/checkout.

**Default VAT Rate (%)**: The baseline rate (e.g., 19%). Used when no country-specific override exists.

**Zero Tax Reason**: Required legal explanation when VAT is 0% (e.g., "Small business regulation §19 UStG").

## Country Tax Rates

Set per-country tax rules. Countries not listed use the **Other Countries** fallback row.

| Setting | Description |
|---------|-------------|
| **Use Global** | Inherits the company country rate |
| **Normal VAT** | Apply a custom rate (enter the percentage) |
| **No Tax** | No VAT, requires a zero tax reason |

Click **+ Add Country** to add more countries. Use ✕ to remove a country row (the fallback row cannot be removed).

## B2B Sales & Reverse Charge

Vale can sell to consumers, businesses, or both. When a business customer in another EU member state enters a valid VAT number, the order is invoiced without VAT under the reverse-charge rule (Article 196, EU Directive 2006/112/EC).

### Who do you sell to?

| Option | Effect on checkout |
|--------|--------------------|
| **Consumers only (B2C)** | Default. No company or VAT number fields are shown. |
| **Businesses only (B2B)** | Adds the business-purchase option with company name and VAT number fields. |
| **Consumers and businesses (B2C + B2B)** | Keeps consumer checkout and adds the business-purchase option. |

The choice only controls what the checkout offers. It never changes existing orders or product prices.

### Validate EU VAT numbers with VIES

On by default. VIES is the European Commission's VAT number validation service.

When a customer ticks **I am buying as a business**, Vale asks for:

- **Company Name** — required for business orders
- **VAT Number** — include the country code (for example `DE123456789`)

Vale checks the number before the order is placed:

| Situation | Result |
|-----------|--------|
| Valid VAT number, customer in a different EU country, shop in the EU | VAT is removed (reverse charge) |
| Valid VAT number, customer in the same country as the shop | Normal VAT is charged |
| Invalid VAT number | Checkout shows an error. The customer must correct it or untick the business option. |
| VIES is unreachable | VAT is charged and a warning is shown; the order can still be completed |
| VAT number outside the EU | Not validated online; VAT is charged with a warning |
| Validation switched off | No online check; VAT is charged with a warning |

When VIES returns a real name, Vale compares it with the checkout company name after ignoring case, punctuation and common legal suffixes (`GmbH`, `Ltd`, `S.A.` and similar). A clear difference shows an amber warning but does not block the order or reverse charge.

::: warning
Set **Company Identity → Country** correctly. It decides whether a sale is domestic or cross-border, so a wrong shop country can charge VAT when reverse charge should apply (or the other way around).
:::

### Prices and invoices

Product prices are entered and displayed gross (VAT included). For a reverse-charge order Vale removes the VAT embedded in each line, the shipping and the discount, so the invoice shows:

- net unit prices, subtotal, shipping and discount
- **VAT (reverse charge) 0.00** instead of the included-VAT amount
- the legal note citing Article 196, EU Directive 2006/112/EC

The company name and VAT number are printed in the invoice **Bill To** block and shown on the admin order page. The order confirmation email repeats the reverse-charge notice.

### Setup checklist

1. Set the shop country under **Company Identity**.
2. Choose **Who do you sell to?**.
3. Keep **Validate EU VAT numbers with VIES** on unless you deliberately invoice all business orders with VAT.
4. Place a test business order with your own VAT number and check the invoice and confirmation email.
5. Confirm that a domestic business order still shows VAT.

::: tip FOR SYSADMINS
The checkout contacts the European Commission's VIES service over HTTPS. If outbound access to `ec.europa.eu` is blocked, customers can still order: Vale charges VAT and shows the fallback warning instead of failing the checkout. The endpoint can be changed in `config/reference-data.php` under `vat_validation.vies_endpoint`.
:::

## Channel Manager

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

