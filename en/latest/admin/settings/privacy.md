# Privacy & Security Settings

Manage IP address handling, CAPTCHA service credentials, and GDPR data portability options. The tab is organized into three sub-tabs, **IP Privacy**, **Captcha**, and **GDPR & Portability**: each with its own save form.

## IP Address Privacy

Controls how IP addresses are stored in comments, form submissions, and pageview analytics:

- **Don't collect IP addresses**: IP is never stored.
- **Mask last octet** (default): Stores `192.168.1.***` instead of the full IP.
- **Store full IP address**: Full IP is stored.

## Captcha API Keys

Configure API credentials for captcha services. The actual captcha type selection is done per-section:

- **Discussion** tab, captcha for comments
- **E-Commerce → Product**: captcha for reviews
- **Registration** tab, captcha for login and registration
- **Form Editor**: captcha for custom forms

Three services are supported, each with collapsible configuration. A test widget appears after saving a Site Key, click **Test this captcha** to verify that rendering and server-side verification both work.

::: tip THE LINK IS IN THE PANEL
Every provider card here links straight to the page where you create the keys, so you can create them, paste them back, and test without leaving the panel.
:::

### hCaptcha

| Field | Description |
|-------|-------------|
| **Site Key** | Issued by hCaptcha for your site |
| **Secret Key** | Issued by hCaptcha for your site |

### Google reCAPTCHA v3

| Field | Description |
|-------|-------------|
| **Site Key** | Issued by Google for your site |
| **Secret Key** | Issued by Google for your site |
| **Score Threshold** | Minimum score (0.0 to 1.0) required to pass. Default 0.5. Higher is stricter. |

### Cloudflare Turnstile

| Field | Description |
|-------|-------------|
| **Site Key** | Issued by Cloudflare for your site |
| **Secret Key** | Issued by Cloudflare for your site |

Each provider shows a green **Configured** badge when keys are saved, or a red warning if used but not configured.

## GDPR & Data Portability

- **Enable users to download their own data**: When enabled, users see a "Download Data" option in their account settings.
- **Enable users to delete their own accounts**: When enabled, users see a "Delete My Account" option. The account and personal data will be anonymized.

## Administrative Data Export

Export all known data associated with an email address (orders, newsletter subscriptions, profile) as JSON. Enter the email and click **Export JSON** to download.

::: tip SEE ALSO
- Configure captcha per-section in [Registration](./registration), [Discussion](./discussion), and [E-Commerce](./ecommerce).
- Set pageview retention in [Analytics → Data Retention](./analytics#data-retention).
- [GDPR & Privacy](../system/gdpr) overview.
:::