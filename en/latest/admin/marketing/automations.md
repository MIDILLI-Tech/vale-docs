# Automations

Build automated email workflows that run in the background — triggered by subscriber behaviour, purchases, or tags.

## Visual Automation Builder

Go to **Newsletter → Automations** and click **New Automation** to open the drag-and-drop workflow canvas.

Each automation consists of a **Trigger**, followed by a chain of **Steps**.

## Triggers

Choose what starts the automation:

| Trigger | Description |
|---|---|
| **Subscriber joins list** | Fires when anyone subscribes via a form or import |
| **Tag added** | Fires when a specific tag is applied to a subscriber |
| **Order placed** | Fires when a customer completes checkout |
| **Order status changes** | E.g., fires when order moves to *Shipped* |
| **Subscription started** | Fires when a membership plan is activated |
| **Segment match** | Fires when a subscriber enters a saved segment |

## Step Types

Add steps after the trigger to build your workflow:

- **Send Email** — Compose and send an email to the subscriber. Supports personalization placeholders with fallback values (see [Newsletter](./newsletter#personalization-reference)).
- **Wait / Delay** — Pause the automation for a fixed duration (minutes, hours, or days) before continuing.
- **Add Tag** — Apply one or more tags to the subscriber.
- **Remove Tag** — Remove one or more tags from the subscriber.
- **Condition** — Branch the workflow with an if/else split based on subscriber data or activity (e.g., *did they open the last email?*, *do they have the tag "VIP"?*, *have they placed an order?*).

## Enrollment

- **Automatic**: Subscribers are enrolled as soon as they match the trigger.
- **Segment-Based Criteria**: Restrict enrollment to subscribers who also match a saved [Segment](./newsletter#tag-based-segmentation). Only those who satisfy both the trigger and the segment conditions will enter the automation.
- **Segment Exit Conditions**: Automatically remove a subscriber from an active automation when they enter or leave a specific segment (e.g., stop a re-engagement sequence the moment they place an order).
- **Manual Removal**: Unenroll individual subscribers from an active automation at any time from the enrollment list.
- **Prevent Re-enrollment**: Optionally block subscribers from entering the same automation more than once.

## Automation Status

Each automation can be toggled **Active** or **Paused**. Pausing stops new enrollments and halts processing of pending steps — existing subscribers resume when the automation is reactivated.

## Common Use Cases

### Welcome Series
Trigger: *Subscriber joins list*
1. Immediately send a welcome email
2. Wait 2 days → send a "Getting Started" guide
3. Wait 5 days → send a featured product or offer

### Post-Purchase Follow-up
Trigger: *Order placed*
1. Wait 1 day → send a thank-you email with order details
2. Wait 7 days → ask for a product review
3. Wait 14 days → offer a discount code for their next purchase

### Re-engagement
Trigger: *Segment match* (subscribers inactive for 60+ days)
1. Send a "We miss you" email
2. Wait 3 days
3. Condition: *Opened last email?*
   - **Yes** → Remove `inactive` tag, end automation
   - **No** → Send a final offer → Wait 7 days → Add tag `dormant`

### Membership Onboarding
Trigger: *Subscription started*
1. Immediately send a welcome email with login link
2. Wait 1 day → send a feature walkthrough
3. Add tag `member-onboarded`

::: tip SEE ALSO
- Set up subscriber [Segments](./newsletter#tag-based-segmentation) to use as enrollment filters.
- Configure transactional email drivers in [Mail Settings](../settings/mail).
:::
