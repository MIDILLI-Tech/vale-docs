# GDPR & Privacy

The General Data Protection Regulation (GDPR) is a data protection law that affects any website which collects personal information from visitors in the European Union. This includes IP addresses, names, emails, order details, and other identifiable data.

Vale includes a set of built-in privacy controls to help you comply with GDPR and similar data protection regulations. These tools cover data minimization, consent management, user rights, and secure data handling.

::: warning
These tools help you implement privacy-respecting practices, but full legal compliance depends on your specific jurisdiction and use case. Consult a legal advisor if you have questions about your obligations.
:::

## IP Address Privacy

Control how visitor IP addresses are stored across analytics, comments, and form submissions.

Go to **Settings → General → Privacy** and choose one of three modes:

| Mode | Description |
|---|---|
| **Full** | Store the complete IP address (e.g., `192.168.1.100`) |
| **Masked** | Store only the first three octets (e.g., `192.168.1.x`) |
| **Disabled** | Do not collect or store IP addresses at all |

This setting applies to:
- Analytics pageview logs
- Comment submissions
- Form submissions

## Analytics Data Retention

Automatically delete old pageview records to limit how long visitor data is retained.

Go to **Settings → General → Privacy → Data Retention** and set the number of days after which pageview logs are automatically purged. The cleanup runs daily via the cron job.

Set to `0` to disable automatic purging.

## Cookie Consent Banner

Vale includes a customisable cookie consent banner displayed to new visitors.

Configure it in **Settings → General → Cookie Consent**:
- **Enabled/Disabled** toggle
- Banner message text
- Accept button label
- Consent is stored in `localStorage` — no cookie is written until consent is given

## Double Opt-In for Newsletter

All newsletter subscriptions go through **double opt-in** by default: subscribers receive a confirmation email and must click the verification link before being added to your list. This ensures only genuine, consenting subscribers are recorded.

## Unsubscribe Links

Every email campaign sent by Vale includes a one-click unsubscribe link in the footer. Clicking it immediately removes the subscriber without requiring a login.

## Account Deletion & Anonymization

Vale provides two approaches for handling user accounts: **anonymization** (preserves records) and **deletion** (removes the account).

### Self-Service Account Deletion

Logged-in users can delete their own account from **My Account → Manage Account**. This requires the **Enable users to delete their own accounts** setting to be enabled (it is by default).

Go to **Settings → Privacy & Security** to configure:

| Setting | Description |
|---|---|
| **Enable users to download their own data** | Shows a "Download Data" option in the account page. |
| **Enable users to delete their own accounts** | Shows a "Delete My Account" option in the account page. |

When a user deletes their account:
1. Profile information is anonymized (name → "Deleted User", password randomized, avatar removed, addresses cleared).
2. Comments are anonymized (author name → "Deleted User", IP removed, user link removed). The email address is preserved for record continuity.
3. Active subscriptions are cancelled at the payment gateway.
4. Newsletter subscription is set to "unsubscribed".
5. Order history is preserved but unlinked from the account (`user_id` set to null).

### Admin Actions

Admins can manage user accounts from **Users** in the admin panel. Each user row offers three actions:

| Action | Description |
|---|---|
| **Edit** | Open the user edit modal. |
| **Anonymize** | Anonymize the user's data while preserving their email for record continuity. |
| **Delete** | Hard-delete the user account. Comments are anonymized, orders are preserved. |

#### Anonymize

The **Anonymize** action (orange button) performs a GDPR-compliant soft deletion:
- **User profile**: Name → "Deleted User", password randomized, avatar removed, addresses cleared, account deactivated. Email is preserved.
- **Comments**: Author name → "Deleted User", IP and URL removed, user link removed. Email is preserved.
- **Subscriptions**: Cancelled at the payment gateway.
- **Newsletter**: Set to "unsubscribed".
- **Orders**: Preserved but unlinked (`user_id` set to null).

#### Delete

The **Delete** action (red button) performs a hard deletion:
- **User account**: Permanently removed from the database.
- **Comments**: Anonymized (same as the Anonymize action) to preserve discussion threads.
- **Orders**: Preserved but unlinked.
- **Subscriptions**: Cancelled at the payment gateway.

::: warning
Deleting a user account cannot be undone. Anonymization is recommended for GDPR compliance as it preserves order history and financial records.
:::

#### Bulk Actions

Admins can select multiple users and apply **Activate**, **Deactivate**, or **Anonymize** actions in bulk from the user list.

## Data Portability & Export

Vale can export user data as JSON for GDPR data portability requests. This covers profile details, orders, subscriptions, comments, and newsletter subscriptions.

For full site migration (all content, users, products, orders, settings, etc.) between Vale instances, use the **Export/Import** tools in **Settings → Advanced → Maintenance → Data Portability** or the [CLI commands](./cli#export-import) (`php vale export` / `php vale import`).

### Enabling Exports

Go to **Settings → Privacy & Security** and enable **GDPR Download**. Once enabled:
- Users see a **Download Your Data** section in their profile.
- The account page renames from **Delete Account** to **Manage Account**.

### Admin Export

Admins can export any user's data from the admin panel without logging in as that user. The export includes:
- Profile information
- Orders with billing and shipping details
- Active subscriptions
- Comments
- Newsletter subscriber records

Sensitive fields such as payment tokens, transaction IDs, and internal identifiers are automatically removed from exports.

## Legal Pages

Link your legal pages so they appear on checkout and in order emails:

Go to **Settings → E-Commerce → Checkout & Legal** and set:
- **Privacy Policy** page
- **Terms & Conditions** page
- **Return Policy** page

Visitors must accept the Terms & Conditions during checkout (configurable).

## CAPTCHA & Spam Protection

Protect forms and comment submissions from automated abuse. Supported CAPTCHA methods are configured per-form and in **Settings → Discussion**:

- hCaptcha
- Google reCAPTCHA v3
- Cloudflare Turnstile
- Math question (no API key required)
- Honeypot hidden field

See [Spam Prevention](./spam) for the full guide.

::: tip SEE ALSO
- [Analytics](../marketing/analytics) — pageview collection and geolocation.
- [Newsletter](../marketing/newsletter) — subscriber consent and double opt-in.
- [Spam Prevention](./spam) — CAPTCHA and honeypot configuration.
:::
