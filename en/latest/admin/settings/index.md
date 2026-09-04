# Settings

The Settings panel is the command center of your Vale site. It is divided into several specialized tabs to help you configure everything from basic site identity to complex e-commerce workflows.

## Settings search

Use the search field in the top-right corner of **Settings** to jump directly to any option — no need to hunt through tabs and sub-tabs.

| Action | How |
|--------|-----|
| Open search | Click the field, or press **Ctrl+K** (**⌘K** on Mac) |
| Find a setting | Start typing — results filter instantly |
| Navigate results | **↑** / **↓** arrow keys |
| Go to a result | Click it, or press **Enter** |
| Close results | **Esc**, or click outside |

Each result shows the setting name and a breadcrumb path (for example `E-Commerce › Checkout › Guest checkout`).

When you select a result, Vale:

1. Switches to the correct tab (and sub-tab, if needed)
2. Scrolls the page to the field
3. **Highlights** it with a brief blue flash so you can spot it quickly
4. Focuses the input, checkbox, or select when possible

Some options only appear after another setting is enabled (for example, fields inside a collapsed section). Search still finds them, but the result is marked **May be hidden until related option is enabled** — enable the parent option first, then use the link again if needed.

::: tip
Search matches setting labels, section names, internal keys, and common keywords. Use several words to narrow results (for example `stripe webhook` or `cookie warning`).
:::

## Configuration Tabs

Explore the detailed documentation for each settings category:

- **[General](./general)**: Site identity, homepage, communications, localization, and feature toggles.
- **[Content](./content)**: Media, Blog, Multi-Language, and Advertisement — organized in sub-tabs.
- **[Discussion](./discussion)**: Comments, comment system choice, and comment captcha.
- **[E-Commerce](./ecommerce)**: Shop identity, payments, products, shipping, taxes, currencies, checkout, and legal.
- **[Registration](./registration)**: User registration methods, SSO, captcha, and two-factor authentication.
- **[SEO](./seo)**: Search engine visibility, redirects, AI crawler control, and verification.
- **[Mail](./mail)**: Mail setup, email templates, email notifications, and mail logs.
- **[Privacy & Security](./privacy)**: IP collection mode, captcha API keys, and GDPR settings.
- **[Analytics](./analytics)**: Pageview tracking, geolocation, exclusions, and data retention.
- **[Maintenance](./maintenance)**: Software updates, data export/import, cron, cache, media, and database optimization.
- **[Advanced](./advanced)**: API tokens, webhooks, navigation order, and custom scripts.

::: tip PRO TIP
Each settings sub-tab has its own form. Use the floating **Save** button (bottom-right) to save the active form — fixed inline Save buttons inside forms have been removed. Some sections, like Mail drivers, include a "Test" button to verify your configuration before going live.
:::
