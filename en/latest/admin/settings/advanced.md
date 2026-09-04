# Advanced Settings

Developer tools, system-level configurations, and admin panel customisation.

## API Tokens

Create secure, scoped credentials that let external applications connect to Vale's [REST API](../../developer/api) without exposing user passwords.

### Creating a Token

1. Go to **[Settings](./) → Advanced**.
2. Open the **API Tokens** section.
3. Click **Create Token**.
4. Enter a descriptive name for the token (for example, `Mobile App`).
5. Select the required **Abilities** (permissions).
6. Optionally set an expiration date.
7. Click **Generate**.

::: danger IMPORTANT
The plain-text token is shown **only once**. Copy it and store it securely. Vale stores only a hashed version of the token.
:::

Available abilities follow the `verb:resource` convention (e.g. `read:posts`, `write:products`):

- `read:pages` / `read:posts` / `write:posts` / `delete:posts`
- `write:pages` / `delete:pages`
- `read:products` / `write:products` / `delete:products`
- `read:orders` / `write:orders`
- `read:media` / `write:media` / `delete:media`
- `read:subscribers` / `write:subscribers` / `delete:subscribers`
- `submit:forms` — submit a form from an external site (`POST /api/form/{slug}`)

The full endpoint→ability reference is available in the admin **Settings → Advanced → API Reference**, and in the [Developer REST API guide](../../developer/api).

### Managing Tokens

- **Revoke access**: Delete a token at any time to disable it immediately.
- **Last used**: Check when a token last made an API request.
- **Expiration**: Expired tokens stop working automatically.

## Webhooks

Set up outgoing HTTP POST requests to notify your external apps about site events:

| Event | Description |
|---|---|
| `order.paid` | Payment confirmed |
| `order.status_changed` | Order status transition (any change) |
| `post.created` | Post/page/CPT created (any status) |
| `post.published` | Post first goes live |
| `post.updated` | Existing published post saved |
| `user.registered` | New user registered or created |
| `form.submitted` | An external or internal form has been submitted |
| `subscriber.created` | New newsletter subscriber added |

Each webhook supports a custom **secret** for payload signing, custom HTTP headers, and a **Test** button to verify the endpoint before going live.

## Maintenance Tools

Cache management, database optimization, media rescan, and revision pruning are available in the **[Maintenance tab](./maintenance)**. System-level operations like software updates and cron scheduling are also located there.

## Navigation Order

Customise the order of items in the admin sidebar:

1. Go to **[Settings](./) → Advanced → [Navigation Order](./advanced#navigation-order)**.
2. Drag and drop sidebar sections and individual menu items into your preferred order.
3. Changes are saved per-user, not site-wide.
4. Quick action buttons are reordered separately — from the **Manage** button on the dashboard (see [Quick Actions](#quick-actions) below).

### Quick Actions

The dashboard **Quick Actions** grid shows shortcuts such as New Post, New Page, New Product, New Order, New Campaign, New User, New Subscriber, New Coupon, Optimize, Warm Cache, and one entry per active [custom content type](../content/content-types) (e.g. `New Event`).

- Clicking a shortcut goes straight to its create form. **New User**, **New Subscriber**, and **New Coupon** open the related list page with the create dialog already expanded; the others open the full create page.
- Up to **8 actions fit in a single row** on wide screens; the grid collapses to fewer columns on smaller screens.
- Use **Manage** on the dashboard to:
  - **Reorder** — drag actions by the ⠿ handle into your preferred order, then press **Save Order**. The saved order applies **both** to the dashboard grid **and** to the Quick Actions section in the top-right user menu (below **Settings**).
  - **Hide / Show** — click the eye toggle on a card. Hidden actions are removed from the Quick Actions section in the top-right user menu, while remaining on the dashboard (dimmed in Manage mode) so you can restore them later. The hidden list is stored in your browser per browser — not per user — and applies across all admin pages.
- Only actions you have permission for are shown, and feature-gated actions are hidden when the corresponding feature is disabled: shop actions when the shop is off, New Campaign / New Subscriber when the newsletter is off, and New Coupon when both the shop and subscriptions are off.

## Custom Scripts

Inject code into your theme without modifying theme files:

- **Header Scripts** — Inserted before the `</head>` tag (e.g., Google Analytics, Meta Pixel)
- **Footer Scripts** — Inserted before the `</body>` tag (e.g., live chat, tracking pixels)
- **Custom CSS** — Global styles applied site-wide on top of the active theme

::: danger SECURITY WARNING
Only paste code from sources you trust. The code added here runs on every page view and is executed by all visitors. Malicious or incorrect JavaScript can:
- Steal visitor credentials or session cookies
- Redirect users to phishing sites
- Break your site's functionality
- Expose sensitive configuration data

Always review third-party snippets before adding them. Remove unused scripts and CSS immediately.
:::

## Environment Variables

::: tip FOR SYSADMINS
Vale reads its core configuration from the `.env` file in the project root. Two variables control caching and debugging behaviour: `APP_ENV` (`dev` disables caches) and `APP_DEBUG` (`true` shows detailed error pages and logs to `storage/logs/errors.log`).

For the full reference — default values, all affected features, and production guidelines — see the [Environment Variables](../../developer/env) developer docs. After changing them, run `php vale cache:clear` to flush any existing cache.
:::

::: tip SEE ALSO
- View the [Developer Guide](../../developer/index) for API and webhook technical details.
- Learn about [CLI Commands](../system/cli) for server-side management.
- [Maintenance settings](./maintenance) for cache, cron, updates, and database optimization.
:::
