# Abandoned Cart Recovery

Recover lost sales by automatically following up with customers who added products to their cart but did not complete checkout.

## How It Works

When a logged-in customer or a guest who has entered their email address leaves the checkout without completing payment, Vale records the cart state. After a configurable delay, an automated recovery email is sent with a direct link back to their cart.

## Configuration

Go to **Settings → E-Commerce → Abandoned Cart** to configure:

| Setting | Description |
|---|---|
| **Enabled** | Toggle abandoned cart tracking on or off |
| **Recovery Delay** | Time to wait before sending the first recovery email (e.g., 1 hour) |
| **Recovery Email Template** | Choose or customise the email sent to the customer |
| **Coupon** | Optionally attach a discount coupon to the recovery email to incentivise completion |
| **Second Follow-up** | Enable a second email sent after a longer delay (e.g., 24 hours) if the cart is still unpurchased |

## Recovery Email

The recovery email is sent from your configured mail driver and includes:
- A personalised greeting (if the customer name is known)
- A summary of the items left in the cart with images and prices
- A **Recover My Cart** button that restores the exact cart contents and sends the customer directly to checkout
- An optional coupon code if one is configured

## Tracking & Reporting

Recovered carts are tracked in **Orders** with a source label of `abandoned-cart`. Use the **Order Reports** filter to measure recovery revenue over a date range.

## Cron Requirement

Abandoned cart emails are dispatched by the Vale cron job. Ensure your cron is running correctly:

```bash
* * * * * php /path/to/vale cron:run >> /dev/null 2>&1
```

See [CLI Commands](../system/cli) for setup details.

::: tip SEE ALSO
- [Orders](./orders) — view and filter recovered orders.
- [Coupons](./coupons) — create a recovery-specific discount code.
- [Automations](../marketing/automations) — build multi-step post-purchase email sequences.
:::
