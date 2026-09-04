# Newsletter

Build your email list and send campaigns directly from Vale. This is the common place to manage free and paid subscriptions.

## Subscribers

Build and manage your email list from **Newsletter → Subscribers**.

### Subscriber Actions

Each subscriber row offers contextual actions based on their status:

| Status | Available Actions | Description |
|---|---|---|
| No active subscription | **Edit** · **Remove** | Remove deletes the subscriber from the newsletter list entirely. |
| Active membership subscription | **Edit** · **Cancel** · **Terminate** | Cancel ends the subscription at the next billing cycle. Terminate cancels immediately. Remove is hidden until the subscription is cancelled or terminated. |

::: tip
If a subscriber has an active membership subscription, you must **Cancel** or **Terminate** it first before you can **Remove** them from the list. This prevents orphaned payment agreements.
:::

### Cancel Subscription

Clicking **Cancel** on a subscriber with an active membership subscription will:

1. Notify the payment gateway to stop renewals — the subscription remains active until the end of the current billing period.
2. Update the subscription status to *Cancelling* in the database.
3. Cancel any pending orders linked to that subscription.

No email is sent to the subscriber. Use this when the subscriber has requested cancellation but should retain access until their paid period ends.

::: note
For PayPal subscriptions, cancellation is always immediate because PayPal does not support period-end cancellation. The subscriber's access will end right away.
:::

### Terminate Subscription

Clicking **Terminate** on a subscriber with an active membership subscription will:

1. Cancel the payment agreement at the gateway (Stripe or PayPal) immediately — no refund is issued.
2. Update the subscription status to *Cancelled* in the database.
3. Cancel any pending orders linked to that subscription.
4. Remove the membership plan tag from the subscriber.
5. Send a cancellation email to the subscriber.

During termination, you are prompted with an **optional message** field. If you enter a message, it will be included in the cancellation email as a highlighted note. If you leave it empty (or press Cancel on the prompt), the email is sent without an extra note.

### Cancel vs Terminate

| | Cancel | Terminate |
|---|---|---|
| **Gateway** | Stripe: period-end · PayPal: immediate | Immediate |
| **Subscription status** | `cancelling` | `cancelled` |
| **User access** | Until end of billing period | Ends immediately |
| **Email sent** | No | Yes (cancellation email) |
| **Plan tag** | Kept until period ends | Removed immediately |
| **Use case** | User requested cancellation | Policy violation, abuse, etc. |

### Membership Status Column

The **Membership Status** column in the subscriber list displays the plan name and current status:

| Status | Display |
|---|---|
| Active | Plan name with expiry date (or *Never* for lifetime plans) |
| Cancelling | Plan name with *Cancelling* indicator |
| Cancelled | Plan name with *Cancelled* indicator |
| Expired / Other | Plan name with *Ended* indicator |
| No subscription | — |

### Subscriber Edit Panel

Click **Edit** on any subscriber to open the edit panel, which shows:

- **Name** and **Email** — the subscriber's display name and email address.
- **Status** — subscriber status (active, pending, unsubscribed).
- **Tags** — current tags assigned to the subscriber for segmentation.

If the subscriber has a linked user account with campaign activity, the panel also shows:

- **Campaigns received** — total number of campaigns sent to this subscriber.
- **Opened campaigns** — number of campaigns opened, with open rate percentage.
- **Clicked campaigns** — number of campaigns with link clicks, with click rate percentage.

The campaign statistics are clickable and link to the filtered campaign list for that subscriber.

### Tag-Based Segmentation
Organize subscribers using tags (e.g., `VIP`, `New Customer`, `Purchased`) to target campaigns precisely.

### Import/Export
Move your list easily with CSV support — import existing contacts or export for external use.

### Double Opt-In
Ensure high-quality leads by requiring email confirmation before adding a contact to your list.

## Subscription Forms

There are two ways to add subscription forms to your site:

### 1. Simple Shortcode
Insert a standard newsletter form into any post or page:
```text
[newsletter_form placeholder="Enter your email" button="Join Now"]
```
- `placeholder`: The text inside the email input (default: `Your email address`).
- `button`: The text on the subscribe button (default: `Subscribe`).

::: tip SEE ALSO
- [Developer → Shortcodes](../../developer/shortcodes) — full `[newsletter_form]` reference, including `privacy_page` and `tag` attributes.
- [Developer → Email / Newsletter Placeholders](../../developer/shortcodes#email-newsletter-placeholders) — <code v-pre>[unsubscribe_url]</code>, <code v-pre>[subscriber_name]</code>, <code v-pre>[generate_coupon]</code> and other tokens available inside campaign and automation emails.
:::

### 2. Custom Form Builder
For more complex forms (e.g., collecting Name or Interests), use the [Form Builder](../forms) and add a field of type **Newsletter Subscribe**.

## Campaigns

Create and send email campaigns from **Newsletter → Campaigns**:

- **Visual Builder**: Design your layout with the block editor.
- **Personalization**: Use placeholders like <code v-pre>[subscriber_name]</code> and <code v-pre>[email]</code> to customize content per recipient. Placeholders support **fallback values** using the pipe syntax: <code v-pre>[subscriber_name|Friend]</code> renders `Friend` if the subscriber's name is not set.

## Personalization Reference

::: v-pre
| Placeholder | Fallback example | Notes |
|---|---|---|
| `[subscriber_name]` | `[subscriber_name\|Friend]` | Subscriber display name |
| `[email]` | — | Subscriber email address |
| `[unsubscribe_url]` | — | Auto-generated; included in all campaigns |
| `[open_pixel]` | — | Invisible 1×1 tracking pixel (empty when open tracking is disabled) |
| `[latest_posts]` | — | Recent posts feed HTML with inline CSS and dark-mode support |
:::

The fallback syntax works in subject lines too: a subject of <code v-pre>[subscriber_name|there], check this out</code> becomes `John, check this out` for subscribers with a name, and `there, check this out` for those without.
- **Open & Click Tracking**: See exactly who opened your emails and which links were clicked.
- **Scheduling**: Send immediately or schedule for a specific date and time.
- **Clone**: Duplicate any past campaign to reuse its structure and content.
- **Resend**: Resend a campaign to subscribers who did not open the original.

## A/B Testing

Run split tests on your campaigns to compare variants before sending to your full list:

1. When creating or editing a campaign, enable the **A/B Test** toggle.
2. Define two variants:
   - **Subject line** — different wording, emojis, or personalization.
   - **Email body** — entirely different layouts or copy.
3. Set the **B weight** using the slider — e.g., `20%` of recipients receive Variant B, `80%` receive Variant A.
4. Save the campaign and send it.

Vale sends Variant A and Variant B to the split audience and records opens and clicks for each variant. You can review the results on the campaign recipients page and use the winner for your next send.

::: tip
For statistically meaningful results, A/B tests work best with lists of at least 500 active subscribers.
:::

## Recurring Campaigns

Turn any campaign into a recurring newsletter that sends on a fixed schedule:

1. When creating or editing a campaign, enable the **Recurring** toggle.
2. Choose the **frequency**:
   - **Daily** — sends every day at a set time.
   - **Weekly** — sends on selected days of the week.
   - **Monthly** — sends on a specific day of the month.
3. Set the **send time** (e.g., `09:00`).
4. Choose which **content** to include:
   - **Post types** — e.g., `post`, `page`, or a custom post type. Selecting multiple types uses **OR** (any matching type qualifies).
   - **Post count** — limit how many new items are included per send.
   - **Category / Tag filters** — narrow the content to a specific topic. Within each filter group, multiple selections use **OR** (any selected category or tag qualifies). Between groups, the logic is **AND** — a post must match at least one selected category **and** at least one selected tag to be included.
   - **Language** — target a specific locale if your site is multilingual.
5. Save the campaign.

When a recurring campaign is saved, it is stored as a **draft**. On each scheduled interval, Vale generates the email from the latest matching content and dispatches it automatically. You can manually trigger the next send at any time from the campaign list, or pause the sequence by changing its status.

You can also embed `[latest_posts]` manually inside any campaign or automation email to show a dynamic posts feed with full control over count, category, tag, and content type.

## Campaign Targeting

Before sending, narrow the audience for each campaign using the filters on the campaign edit page:

| Filter | Description |
|---|---|
| **Tag filter** | Only send to subscribers matching any of the given tags. |
| **Source form filter** | Only send to subscribers who signed up via a specific form. |
| **Order count** (shop required) | Min / max completed orders. |
| **Engagement — open rate** | Min / max open percentage across previous campaigns. |
| **Engagement — click rate** | Min / max click percentage across previous campaigns. |

Combine multiple filters to build precise audiences. For example: *“VIPs who have placed at least 1 order and opened at least one campaign in the last 30 days.”*

::: tip
If the e-commerce module is enabled, purchase-based filters become available automatically in both campaign targeting and automation step rules.
:::

## Common Use Cases

### Welcome Series
Use a one-off campaign or an automation to greet new subscribers immediately after they confirm their email.

### Weekly / Monthly Digest
Use a **Recurring Campaign** to automatically send a summary of new posts every week or month.

### Re-engagement
Target inactive subscribers by combining a low engagement filter (e.g., max open rate `0%`) with a compelling offer or survey.

### Post-Purchase Follow-up
If the shop is enabled, use order-count and engagement filters to send exclusive offers to repeat buyers.

### Abandoned Cart Recovery
If the shop is enabled, automate emails to customers who leave checkout without completing payment. Configure the recovery delay and optional coupon under [Settings → E-Commerce → Abandoned Cart](../settings/ecommerce).

::: tip SEE ALSO
- [Automations](./automations) — build multi-step workflows triggered by subscriber behaviour.
- [Abandoned Cart](../ecommerce/abandoned-cart) — recover lost sales.
- [Settings → Mail](../settings/mail) — configure sending domain and deliverability.
:::
