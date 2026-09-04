# Spam Prevention

Vale protects your forms and comments from automated spam out of the box — no plugin needed. Start free with the built-in honeypot, math challenge, and per-IP rate limiting, and step up to privacy-friendly CAPTCHAs (Cloudflare Turnstile, hCaptcha) or reCAPTCHA only if you need them.

## Supported Providers

You can enable third-party CAPTCHA providers in **Settings > Discussion** (for comments) or within individual form settings.

### Cloudflare Turnstile (Recommended)
A non-intrusive, privacy-friendly alternative to reCAPTCHA.
- **Setup**: Create a site at Cloudflare and obtain your **Site Key** and **Secret Key**.
- **Configuration**: Enter the keys in **[Settings](../settings/) → [Privacy & Security](../settings/privacy#captcha-api-keys)**.

### hCaptcha
A privacy-focused CAPTCHA service.
- **Setup**: Sign up at hCaptcha.com.
- **Configuration**: Enter your **Site Key** and **Secret Key** in **[Settings](../settings/) → [Privacy & Security](../settings/privacy#captcha-api-keys)**.

### Google reCAPTCHA v3
- **Setup**: Create keys in the Google reCAPTCHA admin console.
- **Configuration**: Enter your **Site Key** and **Secret Key** in **[Settings](../settings/) → [Privacy & Security](../settings/privacy#captcha-api-keys)**.

## Honeypot Protection
For all forms created via the Form Builder, you can enable a "Honeypot" field. This is a hidden field that bots typically fill out but humans cannot see. If the field is populated, the submission is silently ignored.

## Rate Limiting
Vale automatically limits the number of form submissions and login attacks per IP address.
