# Mail Settings

Ensure your system emails (like order receipts and newsletters) are delivered reliably. The Mail tab has three sub-tabs: **Notifications**, **Mail Setup**, and **Templates**.

## Notifications

Choose which types of automated emails are sent. Each email type has its own table with up to two columns:

- **Customer / member**: Sent to the recipient.
- **Admin**: Sent to the admin address (see [General → Communications](./general#communications)).

Toggle each row on or off independently. The available types cover order confirmations, payment received, order status updates, tracking updates, order notes, invoices, payment links, refund-request notifications (customer, admin, reviewed, auto-approved), low-stock warnings, subscription welcome/cancelled, password reset, email verification, welcome, newsletter confirmation, and comment/review notifications.

## Mail Setup

Choose a mail driver based on your hosting provider:
- **SMTP**: Connect to any custom mail server or Gmail/Outlook.
- **Mailgun / SendGrid / Resend / Unosend**: High-performance transactional email services (recommended).
- **PHP Mail**: Basic delivery using your server's local resources.
- **Log**: Does not send anything — writes every email to the log file (useful for testing).

### From Address

Set the **From Address** and **From Name** used on all outgoing system emails.

### Driver Configuration

Each driver shows its own configuration fields when selected:

| Driver | Fields |
|--------|--------|
| **Log** | None — logging always active |
| **PHP Mail** | None |
| **SMTP** | Host, Port, Username, Password, Encryption (TLS/SSL) |
| **Resend** | Resend API key |
| **Unosend** | Unosend API key |
| **Mailgun** | Mailgun API key, Domain |
| **SendGrid** | SendGrid API key |

### Test Email

Send a test email to a recipient address to verify your configuration before going live.

::: info TRANSACTIONAL VS MARKETING
Settings here apply to system emails. For marketing newsletters, you may need additional configuration in the [Newsletter](../marketing/newsletter) section.
:::

## Templates

Customize the look and feel of automated emails:
- **Header & Footer**: Add your logo and brand colors.
- **Specific Templates**: Edit the text for "Order Confirmation", "Password Reset", and "Customer Welcome" emails.

## Mail Logs

### Log Outgoing Emails

When enabled, a copy of every email sent by the system is saved to a log file. This includes order confirmations, password reset emails, newsletter campaigns, and any other automated messages.

- The checkbox is located under **Settings → Mail**, just below the driver selector.
- It is enabled by default.
- When the **Log** driver is selected, logging is always active (the checkbox is checked and locked).
- For other drivers (SMTP, Resend, etc.), you can toggle this on or off independently.

Both successful and failed emails are logged. Failed entries include the error message, making it easy to diagnose delivery issues.

### Viewing Logs

Click the **View Logs** link next to the driver selector to open the mail log viewer.

The log table displays:
- **Date** — When the email was sent.
- **To** — Recipient address.
- **Subject** — Email subject line.
- **Driver** — Which mail driver was used (smtp, resend, mailgun, etc.).
- **Status** — `sent` or `failed`.
- **Error** — If the email failed, the error message is shown here.

You can search across all fields using the search bar, and the list is paginated for large volumes.

If the email has an HTML body, a **Preview** button appears. Click it to see the rendered email content directly in the admin panel. You can also open the preview in a new browser tab.

### Managing Logs

- **Delete a single entry**: Click the **Delete** button on any row to remove that specific log entry.
- **Clear all logs**: Click the **Clear Logs** button at the top of the page to wipe the entire log file. This cannot be undone.

::: tip TIP
If you are debugging a specific email delivery issue, filter by the recipient address or subject, then use Preview to verify the email content.
:::

::: tip SEE ALSO
- Start an [Email Campaign](../marketing/newsletter).
- Create automated [Workflows](../marketing/automations).
:::
