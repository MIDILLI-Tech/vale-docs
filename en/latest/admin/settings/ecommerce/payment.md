# Payment


Vale supports multiple payment providers. Each gateway gets its own card with a status badge (`Tested` / `Not tested`) and an enable switch. All enabled methods are offered at checkout; the default is pre-selected.

| Gateway | Notes |
|---------|-------|
| **Stripe** | Card processing, Apple Pay, Google Pay |
| **PayPal** | Standard checkout and subscription billing |
| **Mollie** | Popular in the Netherlands and across Europe |
| **2Checkout** | Global payments with multi-currency support |
| **Checkout.com** | Enterprise-grade card processing |
| **Bank Transfer** | Manual payment instructions shown at checkout; orders stay in *pending* until you mark them paid. Supports a configurable transfer deadline (**max days**) and admin-generated instruction links, see [Orders](../../ecommerce/orders#payment-links-bank-transfer) |

To configure a gateway:

1. Open its card, enter your API keys, and click **Save & Test Gateway**. A successful test saves the values and enables the provider automatically. (Bank Transfer needs no test, fill in the required bank details and click **Save**, then switch it on manually.)
2. Optionally click **Set Default** to make it the pre-selected method at checkout. The button stays disabled until the provider is enabled.

The switch in a card header stays locked with a hint until the provider is tested (online gateways) or the required fields are filled in (Bank Transfer).

## Stripe Payment Methods

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

## PayPal Webhook ID

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

