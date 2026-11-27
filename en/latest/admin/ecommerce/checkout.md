# Checkout

Vale includes a multi-step checkout flow with guest support, coupon application, shipping quotes, and multiple payment gateways.

## Checkout Flow

The standard checkout proceeds through these steps:

1. **Cart**: Review items, quantities, and subtotal. Apply coupon codes.
2. **Information**: Enter billing and (optionally) shipping address. Guest checkout is supported. No account required.
3. **Shipping**: Select a shipping method from available options for the customer's address zone.
4. **Payment**: Choose a payment gateway and complete the transaction.
5. **Confirmation**: Order summary page with order ID. Confirmation email sent automatically.

### Consent Record

The order form requires the customer to accept the Terms & Conditions, the Privacy Policy and the Return Policy before the order can be placed. The server rejects a submission without that consent, so the check cannot be skipped by disabling JavaScript.

Each accepted checkout writes a **consent** entry to the order's Activity Log with the version of the accepted policies (a short hash of their last update), the timestamp, the visitor's IP address and a hashed user-agent. The IP is masked when IP anonymization is enabled under **[Settings](../settings/) → Privacy**. The entry is the evidence of consent for that order and cannot be edited.

## Guest Checkout

Guest checkout can be enabled or disabled in **[Settings](../settings/) → [E-Commerce](../settings/ecommerce/) → [Guest Checkout](../settings/ecommerce/checkout#guest-checkout)**. When enabled, customers can complete a purchase using only their email address. A customer account is optionally created automatically after the first purchase.

## Business Orders (B2B)

Business customers can add a company name and tax number at checkout. Once **Business** is selected, both fields are required and the **Check** button stays disabled until they are filled.

The field adapts to the billing country:

- **Inside the EU**: labelled **VAT Number**, with a country-prefixed example as placeholder. Click **Check** to validate it against VIES; a valid number from another member state removes VAT under the reverse-charge rule.
- **Outside the EU**: labelled **Tax ID**, with no placeholder and no online validation. The number is stored with the order as extra information, and VAT follows your shop's tax rules for that country.

Enable the business option under **[Settings](../settings/) → [E-Commerce](../settings/ecommerce/) → Shop → [B2B Sales & Reverse Charge](../settings/ecommerce/shop#b2b-sales-reverse-charge)**, where the validation and invoicing behaviour are explained.

## Coupon Codes

Customers can enter a coupon code on the cart page or during checkout. Valid coupons adjust the order total in real time. See [Coupons](./coupons) for how to create and manage codes.

## Shipping Quotes

Shipping options are displayed at the shipping step based on:
- The customer's delivery address zone
- The shipping methods configured for that zone (flat rate, free shipping, local pickup)

Configure zones and methods in [Settings](../settings/) → [E-Commerce](../settings/ecommerce/).

## Payment

Vale supports these payment gateways at checkout:
- **Stripe**: card, Apple Pay, Google Pay
- **PayPal**: PayPal wallet
- **Mollie**: iDEAL, card, and other European methods
- **2Checkout**: global card payments
- **Checkout.com**: enterprise card processing
- **Bank Transfer**: manual payment instructions shown on a dedicated instructions page

The default gateway is shown first. Customers can switch to an alternative if multiple gateways are active.

## Additional Information (Custom Fields)

You can collect extra information from customers at checkout using the Form Builder. Go to **[Settings](../settings/) → [E-Commerce](../settings/ecommerce/) → [Checkout](../settings/ecommerce/checkout#checkout)** and select a form under **Additional Form Fields**. The form's fields appear at the end of checkout under an "Additional Information" section.

This is useful for gathering gift messages, delivery preferences, business details, or any other custom data. No code required. See [Using Forms in Checkout](../forms#using-forms-in-checkout) for how to build and manage forms.

## Resuming an Unpaid Order

If a customer leaves before completing payment, Vale generates a **Payment Link** that can be sent manually from the order detail page. Clicking the link resumes payment for that specific order:

- **Online gateways**: the link redirects straight to the payment provider.
- **Bank Transfer**: the link opens a **Bank Transfer Instructions** page with your account details, the amount, a payment reference and the transfer deadline. The customer can click **I've Sent the Transfer** to notify you. This logs the claim and emails you, while verification stays manual.

See [Orders → Payment Links & Bank Transfer](./orders#payment-links-bank-transfer) for the admin-side workflow.

## Refund Requests

After a successful order, customers can submit a refund request from their **My Account → Orders** page. Requests appear in the admin panel under **Orders** for review and approval.

::: tip SEE ALSO
- [Forms](../forms): build custom fields for checkout and other pages.
- [Orders](./orders): manage order statuses and fulfilment.
- [Coupons](./coupons): discount codes and restrictions.
- [Settings](../settings/) → [E-Commerce](../settings/ecommerce/): payment gateways, shipping, and tax configuration.
:::
