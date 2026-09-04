# Settings

The Settings panel allows you to configure the core behavior of your Vale site. It is organized into tabs, each with its own form. Use the floating **Save** button (bottom-right) to save the active form.

## General Settings

Located at **[Settings](./settings/) → [General](./settings/general)**, you can manage:
- **Site Identity**: Site name, tagline, logo, and social preview image.
- **Homepage**: Choose which page appears as your homepage (latest posts, shop, or a static page).
- **Communications**: Admin email and footer copyright.
- **Localization**: Default language, timezone, maintenance mode, and cookie warning.
- **[Features](./settings/general#features)**: Enable or disable built-in modules (blog, pages, newsletter, form builder, custom content types, multi-language, advertisement, shop, subscriptions, registration, SEO, analytics). Toggling a feature off hides its related admin tab and sidebar items.

## Content Settings

Located at **[Settings](./settings/) → [Content](./settings/content)**, organized into sub-tabs:
- **Blog**: Posts per page, RSS feed, reading time, read count, author display, timestamps, and default category.
- **Multi-Language**: Content languages, fallback behavior, and translation notices (only visible when enabled in [Features](./settings/general#features)).
- **Advertisement**: Ad code and placement options (only visible when enabled in [Features](./settings/general#features)).
- **Media**: WebP conversion, lazy loading, upload folders, filename settings, and file size limits.

## E-Commerce Settings

Located at **[Settings](./settings/) → [E-Commerce](./settings/ecommerce)**, you can manage shop identity, payments, products, shipping, taxes, currencies, checkout, and legal. This tab is only visible when **Enable shop** is turned on in **[Settings](./settings/) → [General](./settings/general) → [Features](./settings/general#features)**.

## Registration Settings

Located at **[Settings](./settings/) → [Registration](./settings/registration)**, you can configure user registration methods, SSO, captcha, and two-factor authentication. This tab is only visible when **Enable user registration** is turned on in **[Settings](./settings/) → [General](./settings/general) → [Features](./settings/general#features)**.

## SEO Settings

Located at **[Settings](./settings/) → [SEO](./settings/seo)**, you can manage search engine visibility, redirects, AI crawler control, and verification. This tab is only visible when **Enable SEO system** is turned on in **[Settings](./settings/) → [General](./settings/general) → [Features](./settings/general#features)**.

## Analytics Settings

Located at **[Settings](./settings/) → [Analytics](./settings/analytics)**, you can configure pageview tracking, geolocation, and exclusions. This tab is only visible when **Enable analytics** is turned on in **[Settings](./settings/) → [General](./settings/general) → [Features](./settings/general#features)**.

## Mail Configuration

Vale supports several mail drivers to ensure reliable delivery of system emails:
- SMTP
- Mailgun / SendGrid / Resend / Unosend (transactional email services)
- PHP Mail
- Log (writes emails to the log file instead of sending; useful for testing)

You can test your mail configuration directly from the **[Settings](./settings/) → [Mail](./settings/mail)** tab with a test email.

## Two-Factor Authentication

Under the **Registration** tab, two settings control 2FA behavior:

- **Enable 2FA for all users**: Makes 2FA available across the system. When off, 2FA options are hidden from user profiles and the Users panel.
- **Force 2FA for all users**: When on, every user must complete 2FA setup before using the site.

See [Users & Roles](./users#two-factor-authentication-2fa) for the day-to-day workflow (enabling, resetting, and recovery codes).
