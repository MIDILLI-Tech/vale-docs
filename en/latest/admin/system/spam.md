# Spam Prevention

Vale includes built-in protection against automated bot submissions for forms and comments.

## Supported Providers

You can enable third-party CAPTCHA providers in **Settings > Discussion** (for comments) or within individual form settings.

### Cloudflare Turnstile (Recommended)
A non-intrusive, privacy-friendly alternative to reCAPTCHA.
- **Setup**: Create a site at Cloudflare and obtain your **Site Key** and **Secret Key**.
- **Configuration**: Enter the keys in **Settings → Privacy & Security**.

### hCaptcha
A privacy-focused CAPTCHA service.
- **Setup**: Sign up at hCaptcha.com.
- **Configuration**: Enter your **Site Key** and **Secret Key** in **Settings → Privacy & Security**.

### Google reCAPTCHA v2 / v3
- **Setup**: Create keys in the Google reCAPTCHA admin console.
- **Configuration**: Enter your **Site Key** and **Secret Key** in **Settings → Privacy & Security**.

## Honeypot Protection
For all forms created via the Form Builder, you can enable a "Honeypot" field. This is a hidden field that bots typically fill out but humans cannot see. If the field is populated, the submission is silently ignored.

## Rate Limiting
Vale automatically limits the number of form submissions and login attacks per IP address.
