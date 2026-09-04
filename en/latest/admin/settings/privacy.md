# Privacy & Security Settings

Manage IP address handling, CAPTCHA service credentials, and GDPR data portability options.

## IP Address Privacy

Controls how IP addresses are stored in comments, form submissions, and pageview analytics:

- **Don't collect IP addresses**: IP is never stored.
- **Mask last octet** (default): Stores `192.168.1.***` instead of the full IP.
- **Store full IP address**: Full IP is stored.

## Captcha API Keys

Configure API credentials for captcha services. The actual captcha type selection is done per-section:

- **Discussion** tab — captcha for comments
- **E-Commerce → Product** — captcha for reviews
- **Registration** tab — captcha for login and registration
- **Form Editor** — captcha for custom forms

Three services are supported, each with collapsible configuration:

### hCaptcha

| Field | Description |
|-------|-------------|
| **Site Key** | From hCaptcha Dashboard → Sites |
| **Secret Key** | From hCaptcha Dashboard → Sites |

A test widget appears after saving a Site Key. Click **Test this captcha** to open the live widget and verify that rendering and server-side verification both work correctly.

### Google reCAPTCHA v3

| Field | Description |
|-------|-------------|
| **Site Key** | From Google reCAPTCHA Admin Console |
| **Secret Key** | From Google reCAPTCHA Admin Console |
| **Score Threshold** | Minimum score (0.0 to 1.0) required to pass. Default 0.5. Higher is stricter. |

A test widget appears after saving a Site Key. Click **Test this captcha** to open the live widget and verify that rendering and server-side verification both work correctly.

### Cloudflare Turnstile

| Field | Description |
|-------|-------------|
| **Site Key** | From Cloudflare Dashboard → Turnstile |
| **Secret Key** | From Cloudflare Dashboard → Turnstile |

A test widget appears after saving a Site Key. Click **Test this captcha** to open the live widget and verify that rendering and server-side verification both work correctly.

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