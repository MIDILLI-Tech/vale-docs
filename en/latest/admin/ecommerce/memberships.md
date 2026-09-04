# Memberships

Vale's membership system sells **recurring plans** through Stripe or PayPal subscriptions and gates content with subscriber tags. Plans are managed under **E-Commerce → Memberships**; global behavior lives in [Settings](../settings/) → [Membership](../settings/membership).

## How It Works

1. You define a plan (price, billing interval, gateway, access tag).
2. A customer picks the plan on the front-end membership page and completes checkout through the selected gateway.
3. Vale records the subscription, assigns the plan's **access tag** to the customer's profile, and logs a payment.
4. While the tag is present, gated content is accessible. When the subscription is cancelled (or a trial expires), the tag is removed automatically.

::: tip TAGS ARE THE KEY
Access control is entirely tag-based: the same tags used by [Newsletter](../marketing/newsletter) segments and [Automations](../marketing/automations). This means a member can be targeted by campaigns exactly like any other tagged subscriber.
:::

## Managing Plans

Open **E-Commerce → Memberships** to see all plans with their status, then create or edit:

| Field | Purpose |
|---|---|
| Name | Display name on the membership page |
| Price | Recurring amount (charged per interval) |
| Interval | Billing period: daily, weekly, monthly, or yearly |
| Gateway | Which payment processor handles the subscription (Stripe or PayPal) |
| Access Tag | **Required.** Tag assigned while the subscription is active: this is what unlocks content |
| Description | Shown to customers on the plan card |
| Sort Order | Position of the plan card in the front-end list |
| Active | Inactive plans are hidden from new signups |

Deleting a plan does not cancel existing gateway subscriptions. Those continue until cancelled at the gateway or by the customer.

## Trials

Each plan supports an optional trial:

- **Trial Days**: length of the trial period; the customer is charged nothing (or the trial price) during it.
- **Trial Price**: optional discounted first-period price instead of free.
- **Trial Tag**: separate tag applied during the trial (e.g. `trial_member`) so you can target trialists differently.

A sweep processes expired trials: when the trial ends, the trial tag is replaced by the plan tag (subscription active) or removed (payment failed / cancelled).

## Subscription Lifecycle

| Event | What Vale does |
|---|---|
| Checkout completed | Creates the local subscription record |
| Renewal invoice paid | Records a payment (also appears in Orders) |
| Status change (past due, unpaid…) | Mirrors the gateway status locally |
| Cancelled | Marks cancelled and removes the plan tag |
| Customer reactivates | Restores the active state and re-applies the tag |

Payments recorded through memberships appear in the normal [Orders](./orders) list, so revenue reporting stays in one place.

## Customer Self-Service

Logged-in customers manage their own subscriptions from the [account area](./account): current plan, billing history, cancel/reactivate actions, and GDPR-safe account deletion that preserves order records.

::: tip SEE ALSO
- [Settings](../settings/) → [Membership](../settings/membership): enable the feature, choose pages, configure gating messages.
- [Automations](../marketing/automations): enroll members into welcome sequences via their plan tag.
- Developer reference: [Payment Gateways](../../developer/payment-gateways) for how the Stripe/PayPal webhooks drive this flow.
:::
