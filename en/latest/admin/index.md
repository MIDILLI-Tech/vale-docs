# Admin Guide

Welcome to the Vale Admin Guide. This guide is tailored for **Site Administrators**, **Store Managers**, **Content Editors**, and **System Administrators (Sysadmins)** responsible for day-to-day operations, site management, and server administration. If you are looking for the Vale website to learn more or download, go [here](https://getvale.org).

Vale is built to run your whole site from one panel with no plugins required: content and shop, newsletters and automations, SEO and AI-crawler control, memberships and digital downloads — all built in, all manageable without touching code. This guide walks you through each of them task by task.

:::tip Search in documentation
If you can't find what you're looking for, use the search bar above. Alternatively, press <kbd>Ctrl</kbd> + <kbd>K</kbd> (or <kbd>Cmd</kbd> + <kbd>K</kbd> on macOS) to open it.
:::

## Overview & Target Audience

Whether you are managing content via the graphical admin dashboard or performing system maintenance tasks via CLI, the Admin Guide covers everything you need:

### For Site & Store Administrators
- **[Manage Content](./content/)**: Create and edit blog posts, pages, custom content types, revisions, and media.
- **[Run Your Shop](./ecommerce/)**: Manage products, orders, coupons, product feeds, checkout, memberships, and abandoned carts.
- **[Marketing](./marketing/)**: Handle newsletter campaigns, visual automations, analytics, and advertising.
- **[Forms](./forms)**: Build custom forms, embed them via shortcode, and manage submissions.
- **[Users & Roles](./users)**: Manage administrators, editors, customers, and custom roles.
- **[Appearance](./appearance/)**: Customize themes, navigation menus, and typography fonts.
- **[Settings](./settings)**: Configure payment gateways, shipping, taxes, mail setup, and general site behavior.
- **[Migration](./migration/)**: Import content from WordPress, Ghost, or other Vale installations.

### For System Administrators (Sysadmins)
- **[CLI Commands](./system/cli)**: Command-line operations for database migrations, backups, user management, and health diagnostics (`doctor`).
- **[System & Maintenance](./system/)**: Manage automated backups, updates, GDPR privacy controls, and troubleshooting.
- **[API Tokens & Webhooks](./settings/advanced)**: Generate credentials and configure webhooks for system integrations.

---

### Admin Dashboard

The Dashboard gives you a quick overview of your site at a glance:

- Key numbers for pages, posts, products, orders, subscribers, and comments.
- **System Status** notices when something needs attention (for example maintenance mode, missing payment gateway, or mail driver in log mode).
- **Quick Actions** shortcuts for frequent tasks (New Post/Page/Product/Order/Campaign/User/Subscriber/Coupon, Optimize, Warm Cache, plus one shortcut per active custom content type).
- Clicking a shortcut jumps straight to its create form. **New User**, **New Subscriber**, and **New Coupon** open the related page with the create dialog already expanded — no extra clicks.
- Use **Manage** to drag actions into your preferred order (**Save Order**) or hide actions you rarely use with the eye toggle. Hidden actions disappear from the top-right user menu but stay on the dashboard (dimmed while managing) so you can restore them anytime.
- The same actions appear in the **Quick Actions** section of the top-right user menu, below **Settings**. Your order is saved per user; the hidden list is remembered in your browser.

![Admin Dashboard Placeholder](https://via.placeholder.com/800x400?text=Admin+Dashboard)

Proceed to [Installation](./installation) to set up Vale, or explore the sections on the left sidebar.
