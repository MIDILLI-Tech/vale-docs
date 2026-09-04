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

Each API driver shows a **Get your API key here** link pointing at the provider's key management page, so you don't have to hunt through dashboards.

### Batch Sending & Queue

Campaign emails always go out in small groups (called **chunks** — e.g. 100 recipients at a time) through a queue (`queued` → `processing` → `sent`) — this flow cannot be disabled, see [Queued & Batch Sending](../marketing/newsletter#queued-batch-sending). **Use provider bulk API** only controls *how* each group is dispatched: when enabled, the mail provider receives the whole group in a single request (or over one kept-open connection); when disabled, every email in the group is sent one by one. Set **Max Batch Chunk Size** to control how many emails each cron cycle processes. The effective group size is capped per provider:

| Mail provider | Max per cycle |
|--------|---------------|
| Mailgun / SendGrid / Log | 1000 |
| SMTP | 500 |
| Resend / Unosend | 100 |
| PHP mail() | 50 |

::: warning CRON REQUIRED
Grouped delivery runs on cron. If no cron mode is configured, queued campaigns stall in `queued`/`processing` — the settings page shows an amber warning under the batch toggle. Enable a cron mode in [Maintenance → Scheduled Tasks](./maintenance#scheduled-tasks-cron).
:::

You only need to enter your API key (plus domain for Mailgun) — provider addresses are built in, nothing else to configure.

### Test Email

Send a test email to a recipient address to verify your configuration before going live.

::: info TRANSACTIONAL VS MARKETING
Settings here apply to system emails. For marketing newsletters, you may need additional configuration in the [Newsletter](../marketing/newsletter) section.
:::

### Gmail Inbox Features

Vale emails work out of the box with Gmail's inbox extras — no setup needed:

- **Order tracking buttons**: Order confirmation and shipping update emails automatically show a tracking button/card at the top of the message in Gmail, so customers can follow their order without opening the email.
- **One-click unsubscribe**: Newsletter campaigns and automation emails include an **Unsubscribe** button next to the sender name in Gmail (and Yahoo). Clicking it unsubscribes the reader instantly — this also keeps spam complaints low and protects your sender reputation.

## Templates

Customize the look and feel of automated emails:
- **Header & Footer**: Add your logo and brand colors.
- **Specific Templates**: Edit the text for "Order Confirmation", "Password Reset", and "Customer Welcome" emails.
- **Color Settings**: Emails can dynamically inherit colors from your active theme, or use custom email-only colors. See [Email Color Settings](#email-color-settings) below.

### Email Color Settings

The **Templates** sub-tab has an **Email Colors** panel at the top:

- **Use theme colors for emails**: When checked (default), all transactional emails inherit the color variables from your active theme — so changing your theme colors instantly updates every email's primary buttons, backgrounds, borders, and text colors.
- When unchecked, one color field per theme color variable appears in a two-column grid, letting you set email-only colors that diverge visually from your website theme.
- Every field has a **theme palette**: click the color swatch to open a panel of swatches from your active theme right below it. Pick a swatch to apply that theme color, or click **Custom** to open your browser's native color picker for any color. The hex value on the left stays editable at all times.
- Each field also has a **Reset to theme default** link that restores that single color.
- **Reset to Theme Defaults** (bottom button): reverts every color field in the panel back to the active theme's values. Colors are not stored until you save — use the floating **Save** button (bottom-right) as usual.

#### Live Preview

When a template is selected in the editor, a **Preview Template** button appears next to the Fullscreen button. Click it to open a modal showing the email rendered with the current color scheme and sample data. This lets you see exactly how the email will look — including primary button color, background, muted text, borders, and footer — before sending anything.

#### Color Variables

Emails use the same color variables as your theme (see [Themes → Color Variables](../appearance/themes#color-variables)). Any color variable you define in your theme is automatically available for email color customization.

## Mail Logs

### Log Outgoing Emails

When enabled, a copy of every email sent by the system is saved to a log file. This includes order confirmations, password reset emails, newsletter campaigns, and any other automated messages.

- The checkbox is located under **[Settings](./) → Mail**, just below the driver selector.
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
