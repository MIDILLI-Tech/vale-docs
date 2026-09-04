# Settings

The Settings panel allows you to configure the core behavior of your Vale site. It is organized into tabs, each with its own form. Use the floating **Save** button (bottom-right) to save the active form.

## General Settings

Located at **Settings → General**, you can manage:
- **Site Identity**: Site name, tagline, logo, and social preview image.
- **Homepage**: Choose which page appears as your homepage (latest posts, shop, or a static page).
- **Communications**: Admin email and footer copyright.
- **Localization**: Default language, timezone, maintenance mode, and cookie warning.
- **Features**: Enable or disable built-in modules (blog, pages, newsletter, form builder, custom content types, multi-language, advertisement, shop, subscriptions, registration, SEO, analytics). Toggling a feature off hides its related admin tab and sidebar items.

## Content Settings

Located at **Settings → Content**, organized into sub-tabs:
- **Blog**: Posts per page, RSS feed, reading time, read count, author display, timestamps, and default category.
- **Multi-Language**: Content languages, fallback behavior, and translation notices (only visible when enabled in Features).
- **Advertisement**: Ad code and placement options (only visible when enabled in Features).
- **Media**: WebP conversion, lazy loading, upload folders, filename settings, and file size limits.

## E-Commerce Settings

Located at **Settings → E-Commerce**, you can manage shop identity, payments, products, shipping, taxes, currencies, checkout, and legal. This tab is only visible when **Enable shop** is turned on in **Settings → General → Features**.

## Registration Settings

Located at **Settings → Registration**, you can configure user registration methods, SSO, captcha, and two-factor authentication. This tab is only visible when **Enable user registration** is turned on in **Settings → General → Features**.

## SEO Settings

Located at **Settings → SEO**, you can manage search engine visibility, redirects, AI crawler control, and verification. This tab is only visible when **Enable SEO system** is turned on in **Settings → General → Features**.

## Analytics Settings

Located at **Settings → Analytics**, you can configure pageview tracking, geolocation, and exclusions. This tab is only visible when **Enable analytics** is turned on in **Settings → General → Features**.

## Mail Configuration

Vale supports various mail drivers to ensure reliable delivery of system emails:
- SMTP
- Mailgun
- SendGrid
- Resend
- PHP Mail

You can test your mail configuration directly from the **Settings → Mail** tab.

## Two-Factor Authentication

Under the **Registration** tab, two settings control 2FA behavior:

- **Enable 2FA for all users** — Makes 2FA available across the system. When unchecked, 2FA features are hidden from both the user profile and the admin Users panel. When checked, admins see 2FA options and users can activate it from their profile.
- **Force 2FA for all users** — When checked, every user **must** complete 2FA setup before accessing any page (Shop, Blog, Admin, etc.). Users with pending 2FA are redirected to the setup wizard. Only `/assets/`, `/uploads/`, and `/logout` remain accessible during forced setup.
