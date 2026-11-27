# Orders

Manage your sales and customer fulfillment from the Orders panel.

## Order Status Workflow

Vale uses a standardized workflow for order management:
1. **Pending**: Order placed, waiting for payment.
2. **Processing**: Payment received, preparing for shipment.
3. **Shipped**: Order is on its way.
4. **Delivered**: Customer received the order.
5. **Cancelled**: Order stopped before completion.
6. **Refunded**: Money returned to the customer.

## Invoices & Receipts

- **PDF Invoices**: Generate professional PDF invoices for any order.
- **Auto-Email**: Automatically send invoices to customers upon successful payment.

### Issuing & Reissuing

Click **Issue Invoice** on the order detail page to freeze the current items, totals and tax into an invoice snapshot. The invoice page, the PDF download and the customer email all render from that snapshot. Clicking **Reissue Invoice** later stores a new version with the latest totals. Earlier versions stay preserved in the order's Activity Log, each with its own **View**, **PDF** and **Send** buttons.

The invoice sheet shows your site logo in the top-right corner when one is set under **[Settings](../settings/) → General → Site**, scaled down to a small mark so it never competes with the totals. The screen, the PDF download and the attached PDF use the same layout.

### Language of Invoices and Emails

The invoice screen and the PDF you download from the admin panel follow your panel language. Customer emails — including the invoice email and its PDF attachment — are rendered in the order's language, so a customer who checked out in German receives a German email and invoice.

### GoBD Notes (Germany)

If you bill German customers, keep the GoBD bookkeeping principles in mind. Vale supports them as follows. The rest is your responsibility as the operator:

- **Immutability**: Finalized invoices cannot be silently changed or deleted. To correct an invoice, reissue it so the original stays on record.
- **Audit Trails**: Every issue and reissue is logged with a timestamp and the admin name, including the full snapshot at issue time.
- **Retention**: Vale never deletes invoices on its own, but backups and long-term archiving are your responsibility. Include the database in your backup strategy.

## Business (B2B) Orders

Orders that carry a company name or a tax number are business orders. They are marked with a **B2B** badge next to the order number in the list and next to **Order Info** on the order detail page; hovering the badge shows the localized label.

Under **Order Info** you see the customer's company name and tax number. The tax number is labelled **VAT ID** for EU billing countries and **Tax ID** elsewhere. The same label is used on the invoice, the PDF and the order confirmation email, so a US customer never sees an EU VAT term.

The **All / Business order / Private order** dropdown above the order list filters by customer type. It is only shown while B2B sales are enabled under **[Settings](../settings/) → [E-Commerce](../settings/ecommerce/) → Shop → [B2B Sales & Reverse Charge](../settings/ecommerce/shop#b2b-sales-reverse-charge)** and the shop already has at least one business order.

## Refunds

Handle refund requests directly from the order detail page. You can issue full or partial refunds depending on your payment gateway's capabilities.

## Payment Links & Bank Transfer

On the order detail page, the **Payment Link** panel helps you recover unpaid orders. Its behavior depends on the order's payment method:

- **Online gateways** (Stripe, PayPal, Mollie, 2Checkout, Checkout.com): click **Generate Payment Link** to create a one-click `/pay/…` link that sends the customer back to the payment step. Regenerating invalidates the previous link.
- **Bank Transfer**: the panel becomes **Bank Transfer Instructions**. It shows your account details (bank, holder, IBAN, SWIFT, routing, branch) with copy buttons plus the transfer deadline calculated from the configured **max days**. Click **Generate Instruction Link** to create a link that opens an instructions page instead of an online payment.
- If bank transfer details are not configured yet, the panel shows a warning pointing you to **[Settings](../settings/) → [Payment](../settings/ecommerce/payment#payment) → Bank Transfer**.

### Customer Instructions Page

The bank transfer instructions page shows the order number, total, your account details, a payment reference and the deadline. The customer can click **I've Sent the Transfer** to notify you:

- The claim is added to the order timeline and you receive an email notification.
- The order status does **not** change automatically. Verify the incoming transfer in your bank account and update the order status manually.

### Sending by Email

In the **Send Email to Customer** panel, the relevant option adapts to the payment method:

- **Send Payment Link**: for online gateway orders; includes the payment link.
- **Send Bank Transfer Instructions**: for bank transfer orders; the email contains the account details inline plus the instructions link.

## Shipping & Tracking

### Updating Tracking Info

On the order detail page, use the **Shipping & Tracking** panel to record the carrier and tracking number. Select a carrier from the dropdown (or choose **Other** and paste the full tracking page URL directly into the tracking number field), then click **Save** or **Save & Notify** to email the customer.

### Adding Custom Carriers

If you frequently use a carrier that is not in the default list, you can add your own in **[Settings](../settings/) → [E-Commerce](../settings/ecommerce/) → [Shipping](../settings/ecommerce/shipping#shipping) → [Custom Tracking Carriers](../settings/ecommerce/shipping#custom-tracking-carriers)**. Each entry requires a name and a URL template containing `{tracking_number}` (for example, `https://acmecargo.com/track/{tracking_number}`). Once saved, custom carriers appear alongside built-in ones in the order tracking dropdown, sorted alphabetically.

### Copy Tracking URL

After entering a tracking number, the **Tracking URL (auto-generated)** field appears below. Click **Copy** to copy the link to your clipboard, then paste it into any messaging app or email.

### Save & Notify

- **Save**: Stores the carrier and tracking number without notifying the customer.
- **Save & Notify**: Stores the data and immediately sends a tracking update email to the customer. In Gmail, the email shows a shipment tracking card at the top of the message.

