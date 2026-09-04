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

## Refunds

Handle refund requests directly from the order detail page. You can issue full or partial refunds depending on your payment gateway's capabilities.

## Payment Links & Bank Transfer

On the order detail page, the **Payment Link** panel helps you recover unpaid orders. Its behavior depends on the order's payment method:

- **Online gateways** (Stripe, PayPal, Mollie, 2Checkout, Checkout.com): click **Generate Payment Link** to create a one-click `/pay/…` link that sends the customer back to the payment step. Regenerating invalidates the previous link.
- **Bank Transfer**: the panel becomes **Bank Transfer Instructions**. It shows your account details (bank, holder, IBAN, SWIFT, routing, branch) with copy buttons plus the transfer deadline calculated from the configured **max days**. Click **Generate Instruction Link** to create a link that opens an instructions page instead of an online payment.
- If bank transfer details are not configured yet, the panel shows a warning pointing you to **Settings → Payment → Bank Transfer**.

### Customer Instructions Page

The bank transfer instructions page shows the order number, total, your account details, a payment reference (`#OrderNumber`) and the deadline. The customer can click **I've Sent the Transfer** to notify you:

- A `customer_claimed_payment` entry is added to the order timeline (limited to once per 24 hours to prevent spam).
- You receive an email notification with the order number, total and customer email.
- The order status does **not** change automatically — verify the incoming transfer in your bank account and update the order status manually.

### Sending by Email

In the **Send Email to Customer** panel, the relevant option adapts to the payment method:

- **Send Payment Link** — for online gateway orders; includes the payment link.
- **Send Bank Transfer Instructions** — for bank transfer orders; the email contains the account details inline plus the instructions link.

## Shipping & Tracking

### Updating Tracking Info

On the order detail page, use the **Shipping & Tracking** panel to record the carrier and tracking number. Select a carrier from the dropdown (or choose **Other** and paste the full tracking page URL directly into the tracking number field), then click **Save** or **Save & Notify** to email the customer.

### Adding Custom Carriers

If you frequently use a carrier that is not in the default list, you can add your own in **[Settings → E-Commerce → Shipping → Custom Tracking Carriers](../settings/ecommerce#custom-tracking-carriers)**. Each entry requires a name and a URL template containing `{tracking_number}` (for example, `https://kamilkargo.com/track/{tracking_number}`). Once saved, custom carriers appear alongside built-in ones in the order tracking dropdown, sorted alphabetically.

### Copy Tracking URL

After entering a tracking number, the **Tracking URL (auto-generated)** field appears below. Click **Copy** to copy the link to your clipboard, then paste it into any messaging app or email.

### Save & Notify

- **Save**: Stores the carrier and tracking number without notifying the customer.
- **Save & Notify**: Stores the data and immediately sends a tracking update email to the customer.

