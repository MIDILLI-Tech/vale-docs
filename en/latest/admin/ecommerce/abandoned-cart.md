# Abandoned Cart Recovery

Recover lost sales by automatically following up with customers who added products to their cart but did not complete checkout.

## How It Works

Vale records the cart when a signed-in customer opens the checkout page or a guest enters their email address there. The cart is stored against that email address, along with its items and subtotal.

At the next cron run, every recorded cart that has been idle longer than the configured delay receives a reminder email. Further reminders follow at the configured interval until the customer places an order or the maximum number of reminders is reached. Placing an order with the same email address stops the reminders.

If a customer abandons a new cart after ordering, it starts a fresh reminder cycle.

## Configuration

Go to **[Settings](../settings/) → [E-Commerce](../settings/ecommerce) → [Abandoned Cart](../settings/ecommerce#abandoned-cart-recovery)** to configure:

| Setting | Description |
|---|---|
| **Enable abandoned cart emails** | Master toggle for cart tracking and reminders |
| **Delay (hours)** | Hours a cart stays idle before the first reminder (default: 2) |
| **Max reminders** | Total reminders sent for one cart (default: 3) |
| **Reminder interval (hours)** | Hours between reminders (default: 24) |

## Recovery Email

The reminder is sent through your configured mail driver, in the language the cart was recorded in, and contains:

- The number of items left in the cart
- The cart subtotal
- A **Complete your order** button that opens the checkout page

The email does not list individual products, include product images, or attach a coupon.

## Tracking

Vale marks a cart as recovered when an order is placed with its email address, and stops its reminders. Recovery is kept per cart only: the **Orders** screen has no abandoned-cart label, source filter or recovery report, so recovery revenue cannot be measured from that page.

## Cron Requirement

Abandoned cart emails are dispatched by the Vale cron job. Ensure cron is running (see [Maintenance → Scheduled Tasks](../settings/maintenance#scheduled-tasks-cron)).

::: tip FOR SYSADMINS
Setup details live under [CLI Commands](../system/cli).
:::

::: tip SEE ALSO
- [Checkout](./checkout): checkout configuration.
- [Orders](./orders): review incoming orders.
- [Automations](../marketing/automations): build multi-step post-purchase email sequences.
:::
