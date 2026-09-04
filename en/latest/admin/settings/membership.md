# Memberships & Subscriptions

Vale supports recurring subscription plans (memberships) and one-time payment plans (e.g., donations), allowing you to charge customers daily, weekly, monthly, yearly, or per transaction and gate premium content behind a paywall.

## Payment Gateways

Subscriptions are supported via:
- **Stripe** — card billing with automatic renewal, SCA-compliant
- **PayPal** — PayPal Billing Agreements

Configure both in [Settings → E-Commerce → Payment Gateways](./ecommerce).

## Creating a Plan

Go to **Memberships → Add Plan** and fill in:

| Field | Description |
|---|---|
| **Name** | Plan display name (e.g., `Pro`, `Monthly Access`) |
| **Description** | Short description shown on the checkout page |
| **Price** | Recurring charge amount |
| **Currency** | Inherited from your store currency setting |
| **Billing Interval** | `One-time` (e.g., Donations), `Daily`, `Weekly`, `Monthly`, or `Yearly` |
| **Trial Period** | Optional free trial in days (0 = no trial) |
| **Gating Tags** | One or more tags applied to the subscriber while their plan is active |

## Content Gating

Memberships use a **tag-based gating** system:
1. Assign one or more **Gating Tags** to a plan (e.g., `member`, `pro`).
2. On any post or page, enable **Restrict to members with tag** and select the required tag.
3. Visitors without an active subscription are shown a paywall or login prompt instead of the content.

When a subscription is cancelled or expires, the gating tags are automatically removed from the customer's account.

## Trial Periods

Set a **Trial Period** (in days) on any plan. During the trial:
- The customer is not charged — or charged with a lower introductory rate (e.g., `$1.99` during a 4-week trial, then `$7.99`).
- Gating tags are applied immediately so they get full access.
- After the trial ends, the first billing cycle begins automatically.

## Customer Self-Service

Subscribers can manage their own memberships from **My Account → Subscriptions**:
- View active plans and next billing date
- Cancel their subscription
- View billing history

Cancellation stops future charges. Access (gating tags) is maintained until the end of the current billing period.

## Managing Subscriptions

From the admin panel (**Memberships → Subscribers**) you can:
- View all active, trialling, cancelled, and expired subscriptions
- Manually cancel a subscription
- Check payment status and next renewal date

## Cron Reconciliation

The Vale cron job runs a daily subscription reconciliation that:
- Checks for expired trials and initiates the first charge
- Removes gating tags from cancelled or lapsed subscriptions
- Syncs subscription status with Stripe/PayPal

Ensure your cron is running — see [CLI Commands](../system/cli).

::: tip SEE ALSO
- [Settings → E-Commerce](./ecommerce) — payment gateway configuration.
- [Newsletter](../marketing/newsletter) — tag-based subscriber segmentation.
:::
