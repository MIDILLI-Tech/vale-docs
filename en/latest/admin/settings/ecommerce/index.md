# E-Commerce Settings

The E-Commerce tab controls the store behind your catalog: who can buy, how tax is calculated, which currencies and payment methods are offered, how shipping is priced, and what the checkout collects. It has seven sub-tabs, one page per sub-tab in this section:

- **[Shop](./shop)** — company identity, tax regime and country rates, B2B reverse charge, marketplace feeds.
- **[Product](./product)** — reviews, refund rules, sold-count and stock display.
- **[Currency](./currency)** — default and additional currencies, exchange-rate providers.
- **[Shipping](./shipping)** — shipping modes, rates, delivery estimates, tracking carriers.
- **[Payment](./payment)** — gateways, Stripe payment methods, PayPal webhooks.
- **[Checkout](./checkout)** — guest checkout, Buy Now, checkout fields, abandoned carts, tax display.
- **[Import](./import)** — marketplace and Vale CSV product imports.

Legal pages and consumer-rights features live in their own top-level tab, **[Legal & Compliance](../compliance)**.

::: tip SHOP & SUBSCRIPTION TOGGLES
The on/off switches for **Shop** and **Subscriptions** live in **[Settings](../) → [General](../general) → [Features](../general#features)**.
:::

## Before you configure the store

1. Fill in **Shop → Company Identity** first. It supplies the invoice header, the company country that decides domestic vs cross-border tax, and the default checkout country.
2. Set the **Tax Regime** and **Default VAT Rate**. Product prices are entered gross, and VAT is extracted from those prices at checkout.
3. Choose **Who do you sell to?** and keep VIES validation on for B2B sales.
4. Configure at least one payment gateway and enable shipping (or mark all products digital) before opening checkout.
5. Run a test order with a physical and a digital product, including a business order if B2B is enabled.
