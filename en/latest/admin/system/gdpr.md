# GDPR & Privacy

The General Data Protection Regulation (GDPR) is a data protection law that affects any website which collects personal information from visitors in the European Union. This includes IP addresses, names, emails, order details, and other identifiable data.

Vale includes a set of built-in privacy controls to help you comply with GDPR and similar data protection regulations. These tools cover data minimization, consent management, user rights, and secure data handling.

::: warning
These tools help you implement privacy-respecting practices, but full legal compliance depends on your specific jurisdiction and use case. Consult a legal advisor if you have questions about your obligations.
:::

## IP Address Privacy

Control how visitor IP addresses are stored across analytics, comments, and form submissions.

Go to **[Settings](../settings/) → [Privacy & Security](../settings/privacy#ip-address-privacy)** and choose one of three modes:

| Mode | Description |
|---|---|
| **Store full IP address** | Store the complete IP address |
| **Mask last octet** | Store only the first three octets (default) |
| **Don't collect IP addresses** | Do not collect or store IP addresses at all |

This setting applies to:
- Analytics pageview logs
- Comment submissions
- Form submissions

## Analytics Data Retention

Automatically delete old pageview records to limit how long visitor data is retained.

Go to **[Settings](../settings/) → [Analytics](../settings/analytics#data-retention)** and set the number of days after which pageview logs are automatically purged. The cleanup runs daily via the cron job.

Set to `0` to disable automatic purging.

## Cookie Consent Banner

Vale includes a customisable cookie consent banner displayed to new visitors.

Configure it in **[Settings](../settings/) → [General](../settings/general) → Cookie Consent**:
- **Enabled/Disabled** toggle
- Banner message text
- Accept button label
- Consent is stored in `localStorage`; no cookie is written until consent is given

## Double Opt-In for Newsletter

All newsletter subscriptions go through **double opt-in** by default: subscribers receive a confirmation email and must click the verification link before being added to your list. This ensures only genuine, consenting subscribers are recorded.

## Unsubscribe Links

Every email campaign sent by Vale includes a one-click unsubscribe link in the footer. Clicking it immediately removes the subscriber without requiring a login.

## Account Deletion & Anonymization

Vale provides two approaches for handling user accounts: **anonymization** (preserves records) and **deletion** (removes the account).

### Self-Service Account Deletion

Logged-in users can delete their own account from **My Account → Manage Account**. This requires the **Enable users to delete their own accounts** setting to be enabled (it is by default).

Go to **[Settings](../settings/) → [Privacy & Security](../settings/privacy)** to configure:

| Setting | Description |
|---|---|
| **Enable users to download their own data** | Shows a "Download Data" option in the account page. |
| **Enable users to delete their own accounts** | Shows a "Delete My Account" option in the account page. |

When a user deletes their account:
1. Profile information is anonymized and addresses cleared.
2. Comments are anonymized; the email address is preserved for record continuity.
3. Active subscriptions are cancelled at the payment gateway.
4. Newsletter subscription is set to "unsubscribed".
5. Order history is preserved but unlinked from the account.

### Admin Actions

Admins can manage user accounts from **Users** in the admin panel. Each user row offers three actions:

| Action | Description |
|---|---|
| **Edit** | Open the user edit modal. |
| **Anonymize** | Anonymize the user's data while preserving their email for record continuity. |
| **Delete** | Hard-delete the user account. Comments are anonymized, orders are preserved. |

#### Anonymize

The **Anonymize** action performs a GDPR-compliant soft deletion: profile and comments are anonymized with the email preserved, subscriptions are cancelled at the gateway, newsletter is unsubscribed, and orders are preserved but unlinked.

#### Delete

The **Delete** action performs a hard deletion: the user account is permanently removed, comments are anonymized to preserve discussion threads, orders are preserved but unlinked, and subscriptions are cancelled at the gateway.

::: warning
Deleting a user account cannot be undone. Anonymization is recommended for GDPR compliance as it preserves order history and financial records.
:::

#### Bulk Actions

Admins can select multiple users and apply **Activate**, **Deactivate**, or **Anonymize** actions in bulk from the user list.

## Data Portability & Export

Vale can export user data as JSON for GDPR data portability requests. This covers profile details, orders, subscriptions, comments, and newsletter subscriptions.

For full site migration (all content, users, products, orders, settings, etc.) between Vale instances, use the **Export/Import** tools in **[Settings](../settings/) → [Maintenance](../settings/maintenance) → [Data Export / Import](../settings/maintenance#data)** or the [CLI commands](./cli#export-import) (`php vale export` / `php vale import`).

### Enabling Exports

Go to **[Settings](../settings/) → [Privacy & Security](../settings/privacy)** and enable **GDPR Download**. Once enabled:
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

Go to **[Settings](../settings/) → [E-Commerce](../settings/ecommerce) → [Checkout & Legal](../settings/ecommerce#legal)** and set:
- **Privacy Policy** page
- **Terms & Conditions** page
- **Return Policy** page

Visitors must accept the Terms & Conditions during checkout (configurable).

## CAPTCHA & Spam Protection

Protect forms and comment submissions from automated abuse. Supported CAPTCHA methods are configured per-form and in **[Settings](../settings/) → [Discussion](../settings/discussion)**:

- hCaptcha
- Google reCAPTCHA v3
- Cloudflare Turnstile
- Math question (no API key required)
- Honeypot hidden field

See [Spam Prevention](./spam) for the full guide.

::: tip SEE ALSO
- [Analytics](../marketing/analytics): pageview collection and geolocation.
- [Newsletter](../marketing/newsletter): subscriber consent and double opt-in.
- [Spam Prevention](./spam): CAPTCHA and honeypot configuration.
:::
