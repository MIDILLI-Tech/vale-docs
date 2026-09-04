# Newsletter

Build your email list and send campaigns directly from Vale. This is the common place to manage free and paid subscriptions.

::: tip PERMISSION
Subscribers, campaigns, and automations require the **Manage Newsletter** permission, granted to Super Admin, Admin, and Editor by default.
:::

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

1. Notify the payment gateway to stop renewals. The subscription remains active until the end of the current billing period.
2. Update the subscription status to *Cancelling* in the database.
3. Cancel any pending orders linked to that subscription.

No email is sent to the subscriber. Use this when the subscriber has requested cancellation but should retain access until their paid period ends.

::: info
For PayPal subscriptions, cancellation is always immediate because PayPal does not support period-end cancellation. The subscriber's access will end right away.
:::

### Terminate Subscription

Clicking **Terminate** on a subscriber with an active membership subscription will:

1. Cancel the payment agreement at the gateway (Stripe or PayPal) immediately. No refund is issued.
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
| No subscription | - |

### Subscriber Edit Panel

Click **Edit** on any subscriber to open the edit panel, which shows:

- **Name** and **Email**: the subscriber's display name and email address.
- **Status**: subscriber status (active, pending, unsubscribed).
- **Tags**: current tags assigned to the subscriber for segmentation.

If the subscriber has a linked user account with campaign activity, the panel also shows:

- **Campaigns received**: total number of campaigns sent to this subscriber.
- **Opened campaigns**: number of campaigns opened, with open rate percentage.
- **Clicked campaigns**: number of campaigns with link clicks, with click rate percentage.

The campaign statistics are clickable and link to the filtered campaign list for that subscriber.

### Tag-Based Segmentation
Organize subscribers using tags (e.g., `VIP`, `New Customer`, `Purchased`) to target campaigns precisely.

### Import/Export
Move your list easily with CSV support: import existing contacts or export for external use.

### Double Opt-In
Ensure high-quality leads by requiring email confirmation before adding a contact to your list.

## Subscription Forms

There are two ways to add subscription forms to your site:

### 1. Simple Shortcode
Insert a standard newsletter form into any post or page (placeholder and button text are configurable). See the [Editor](../content/editor/blocks#newsletter-form) and the developer [shortcode reference](../../developer/shortcodes) for all attributes.

### 2. Custom Form Builder
For more complex forms (e.g., collecting Name or Interests), use the [Form Builder](../forms) and add a field of type **Newsletter Subscribe**.

## Campaigns

Create and send email campaigns from **Newsletter → Campaigns**:

- **Visual Builder**: Design your layout with the block editor.
- **Personalization**: Use placeholders like subscriber name and email to customize content per recipient. Placeholders support **fallback values** using the pipe syntax, which renders the fallback when the value is not set (works in subject lines too).

## Personalization Reference

Common placeholders include the subscriber name, email address, unsubscribe link, open-tracking pixel, and latest-posts feed. Placeholders support fallback values with the pipe syntax. See [Developer → Shortcodes](../../developer/shortcodes) for the full list.
- **Open & Click Tracking**: See exactly who opened your emails and which links were clicked.
- **One-click unsubscribe**: Every campaign carries a hidden unsubscribe header, so Gmail and Yahoo show an **Unsubscribe** button next to the sender name. Readers can leave the list in one click without opening the email. Fewer spam complaints, better deliverability.
- **Scheduling**: Send immediately or schedule for a specific date and time.
- **Clone**: Duplicate any past campaign to reuse its structure and content.
- **Resend**: Resend a campaign to subscribers who did not open the original.
- **Audience preview**: Draft and scheduled campaigns show an estimated recipient count (`~N`) in the list, computed live from the campaign's filters. The number is indicative. The final count is fixed at send time.
- **Search**: The campaign list search matches the **subject** and **sender email**. Tick **Also search in content** to also scan the email bodies. Full-content search scans every record, so it is noticeably slower on large archives.

## Queued & Batch Sending

Large campaigns are not sent in one go. Instead of emailing everyone at once, Vale splits the recipient list into small groups and sends one group at a time, in the background.

::: tip WHAT IS A "CHUNK"?
A **chunk** is simply one small group of emails, for example, 100 recipients out of 5,000. Vale sends one chunk, pauses, then continues with the next, so large mailings never overload your server or hit provider rate limits.
:::

When you hit **Send**, the campaign is queued and each cron run dispatches the next group until every matching subscriber is covered. This queue flow always applies and cannot be turned off:

- **Chunk size** is controlled by **Settings → Mail → Batch Sending & Queue → Max Batch Chunk Size**. It is capped per mail provider (see the settings page for the per-provider limits).
- Disabling **Use provider bulk API** does **not** disable queueing. It only switches each group from the provider's one-request bulk delivery to sending emails one by one. The campaign still needs cron.
- **Cron is required**: without a cron mode, queued campaigns never progress. If cron is off, the Mail settings page shows an inline warning next to the batch toggle.
- Progress survives between runs: if a run is interrupted, the next cycle resumes where it left off. You can also trigger the next chunk manually with the **Resume** button. **Resend** resets progress and starts over; **Clone** copies content and targeting into a fresh draft without delivery stats.

::: tip SEE ALSO
- [Mail Settings](../settings/mail#batch-sending-queue): configure batch size and API keys.
- [CLI → cron:run](../system/cli#cron-run): how scheduled sending runs.
:::

## A/B Testing

Run split tests on your campaigns to compare variants before sending to your full list:

1. When creating or editing a campaign, enable the **A/B Test** toggle.
2. Define two variants:
   - **Subject line**: different wording, emojis, or personalization.
   - **Email body**: entirely different layouts or copy.
3. Set the **B weight** using the slider, e.g., `20%` of recipients receive Variant B, `80%` receive Variant A.
4. Save the campaign and send it.

Vale sends Variant A and Variant B to the split audience and records opens and clicks for each variant. You can review the results on the campaign recipients page and use the winner for your next send.

::: tip
For statistically meaningful results, A/B tests work best with lists of at least 500 active subscribers.
:::

## Recurring Campaigns

Turn any campaign into a recurring newsletter that sends on a fixed schedule:

1. When creating or editing a campaign, enable the **Recurring** toggle.
2. Choose the **frequency**:
   - **Daily**: sends every day at a set time.
   - **Weekly**: sends on selected days of the week.
   - **Monthly**: sends on a specific day of the month.
3. Set the **send time** (e.g., `09:00`).
4. Choose which **content** to include:
   - **Post types**: e.g., `post`, `page`, or a custom post type. Selecting multiple types uses **OR** (any matching type qualifies).
   - **Post count**: limit how many new items are included per send.
   - **Category / Tag filters**: narrow the content to a specific topic. Within each filter group, multiple selections use **OR** (any selected category or tag qualifies). Between groups, the logic is **AND**: a post must match at least one selected category **and** at least one selected tag to be included.
   - **Language**: target a specific locale if your site is multilingual.
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
| **Engagement: open rate** | Min / max open percentage across previous campaigns. |
| **Engagement: click rate** | Min / max click percentage across previous campaigns. |

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
If the shop is enabled, automate emails to customers who leave checkout without completing payment. Configure the recovery delay and optional coupon under [Settings](../settings/) → [E-Commerce](../settings/ecommerce) → [Abandoned Cart](../settings/ecommerce#abandoned-cart-recovery).

::: tip SEE ALSO
- [Automations](./automations): build multi-step workflows triggered by subscriber behaviour.
- [Abandoned Cart](../ecommerce/abandoned-cart): recover lost sales.
- [Settings](../settings/) → [Mail](../settings/mail): configure sending domain and deliverability.
:::
