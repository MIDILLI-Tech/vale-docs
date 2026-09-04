# Checkout

Vale includes a multi-step checkout flow with guest support, coupon application, shipping quotes, and multiple payment gateways.

## Checkout Flow

The standard checkout proceeds through these steps:

1. **Cart** — Review items, quantities, and subtotal. Apply coupon codes.
2. **Information** — Enter billing and (optionally) shipping address. Guest checkout is supported — no account required.
3. **Shipping** — Select a shipping method from available options for the customer's address zone.
4. **Payment** — Choose a payment gateway and complete the transaction.
5. **Confirmation** — Order summary page with order ID. Confirmation email sent automatically.

## Guest Checkout

Guest checkout can be enabled or disabled in **[Settings](../settings/) → [E-Commerce](../settings/ecommerce) → [Guest Checkout](../settings/ecommerce#guest-checkout)**. When enabled, customers can complete a purchase using only their email address. A customer account is optionally created automatically after the first purchase.

## Coupon Codes

Customers can enter a coupon code on the cart page or during checkout. Valid coupons adjust the order total in real time. See [Coupons](./coupons) for how to create and manage codes.

## Shipping Quotes

Shipping options are displayed at the shipping step based on:
- The customer's delivery address zone
- The shipping methods configured for that zone (flat rate, free shipping, local pickup)

Configure zones and methods in [Settings](../settings/) → [E-Commerce](../settings/ecommerce).

## Payment

Vale supports these payment gateways at checkout:
- **Stripe** — card, Apple Pay, Google Pay
- **PayPal** — PayPal wallet
- **Mollie** — iDEAL, card, and other European methods
- **2Checkout** — global card payments
- **Checkout.com** — enterprise card processing
- **Bank Transfer** — manual payment instructions shown on a dedicated instructions page

The default gateway is shown first. Customers can switch to an alternative if multiple gateways are active.

## Additional Information (Custom Fields)

You can collect extra information from customers at checkout using the Form Builder. Go to **[Settings](../settings/) → [E-Commerce](../settings/ecommerce) → [Checkout](../settings/ecommerce#checkout)** and select a form under **Additional Form Fields**. The form's fields appear at the end of checkout under an "Additional Information" section.

This is useful for gathering gift messages, delivery preferences, business details, or any other custom data — no code required. See [Using Forms in Checkout](../forms#using-forms-in-checkout) for how to build and manage forms.

## Resuming an Unpaid Order

If a customer leaves before completing payment, Vale generates a **Payment Link** that can be sent manually from the order detail page. Clicking the link resumes payment for that specific order:

- **Online gateways**: the link redirects straight to the payment provider.
- **Bank Transfer**: the link opens a **Bank Transfer Instructions** page with your account details, the amount, a payment reference and the transfer deadline. The customer can click **I've Sent the Transfer** to notify you — this logs the claim and emails you, while verification stays manual.

See [Orders → Payment Links & Bank Transfer](./orders#payment-links-bank-transfer) for the admin-side workflow.

## Refund Requests

After a successful order, customers can submit a refund request from their **My Account → Orders** page. Requests appear in the admin panel under **Orders** for review and approval.

::: tip SEE ALSO
- [Forms](../forms) — build custom fields for checkout and other pages.
- [Orders](./orders) — manage order statuses and fulfilment.
- [Coupons](./coupons) — discount codes and restrictions.
- [Settings](../settings/) → [E-Commerce](../settings/ecommerce) — payment gateways, shipping, and tax configuration.
:::
