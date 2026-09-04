# Spam Prevention

Vale protects your forms and comments from automated spam out of the box, with no plugin needed. Start free with the built-in honeypot, math challenge, and per-IP rate limiting, and step up to privacy-friendly CAPTCHAs (Cloudflare Turnstile, hCaptcha) or reCAPTCHA only if you need them.

## Supported Providers

You can enable third-party CAPTCHA providers in **Settings > Discussion** (for comments) or within individual form settings.

::: tip THE LINK IS IN THE PANEL
Each provider card in **[Settings](../settings/) → [Privacy & Security](../settings/privacy#captcha-api-keys)** links straight to the page where you create its keys. Open it from there, then paste the **Site Key** and **Secret Key** back into the same card.
:::

### Cloudflare Turnstile (Recommended)
A non-intrusive, privacy-friendly alternative to reCAPTCHA.
- **Configuration**: Enter the **Site Key** and **Secret Key** in **[Settings](../settings/) → [Privacy & Security](../settings/privacy#captcha-api-keys)**.

### hCaptcha
A privacy-focused CAPTCHA service.
- **Configuration**: Enter the **Site Key** and **Secret Key** in **[Settings](../settings/) → [Privacy & Security](../settings/privacy#captcha-api-keys)**.

### Google reCAPTCHA v3
- **Configuration**: Enter the **Site Key** and **Secret Key** in **[Settings](../settings/) → [Privacy & Security](../settings/privacy#captcha-api-keys)**.

## Honeypot Protection
For all forms created via the Form Builder, you can enable a "Honeypot" field. This is a hidden field that bots typically fill out but humans cannot see. If the field is populated, the submission is silently ignored.

## Rate Limiting
Vale automatically limits the number of form submissions and login attacks per IP address.
