# Shipping


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

## Default Estimated Delivery

Set a store-wide delivery estimate so customers know how long an order typically takes:

| Field | Description |
|-------|-------------|
| **Default Estimated Delivery (min days)** | The fastest delivery time (e.g., 3) |
| **Default Estimated Delivery (max days)** | The slowest delivery time (e.g., 7) |

This range is the fallback used for products and countries without their own estimate. Products, variations, and per-country overrides can all override it. Leaving both fields empty disables the estimate entirely.

## Country-specific Rates

Fine-tune shipping per country. For each country you add, set:

| Field | Description |
|-------|-------------|
| **Country** | ISO 2-letter code (e.g., `DE`) |
| **Rate** | A flat shipping cost that overrides the default rate for that country |
| **Estimated Shipping (Min / Max)** | A delivery estimate (in days) that overrides the default estimate for that country |

Country-specific rates only affect the shipping cost and delivery estimate for orders shipped to that country, other countries keep using the store defaults. See [Products → Shipping](../../ecommerce/products#shipping) for how per-country overrides work at the product and variation level.

## Custom Tracking Carriers

In the **Shipping** sub-tab, you can add your own tracking carriers. Each entry needs a name and a URL template with a tracking-number placeholder.

