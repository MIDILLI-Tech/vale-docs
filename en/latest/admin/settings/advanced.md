# Advanced Settings

Developer tools, system-level configurations, and admin panel customisation.

## API Tokens

Create secure, scoped credentials that let external applications connect to Vale's [REST API](../../developer/api) without exposing user passwords.

### Creating a Token

1. Go to **Settings → Advanced**.
2. Open the **API Tokens** section.
3. Click **Create Token**.
4. Enter a descriptive name for the token (for example, `Mobile App`).
5. Select the required **Abilities** (permissions).
6. Optionally set an expiration date.
7. Click **Generate**.

::: danger IMPORTANT
The plain-text token is shown **only once**. Copy it and store it securely. Vale stores only a hashed version of the token.
:::

Available abilities are scoped to individual resources and operations, such as:

- `read:posts` / `write:posts`
- `read:products` / `write:products` / `delete:products`
- `read:pages`
- `read:subscribers` / `write:subscribers` / `delete:subscribers`

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

Customise the order of items in the admin sidebar and the **Quick Actions** bar on the dashboard:

1. Go to **Settings → Advanced → Navigation Order**.
2. Drag and drop sidebar sections and individual menu items into your preferred order.
3. Rearrange quick action buttons independently.
4. Changes are saved per-user, not site-wide.

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

Vale reads its core configuration from the `.env` file in the project root. Two variables control caching and debugging behaviour:

| Variable | Purpose | Recommended for Development |
|---|---|---|
| `APP_ENV` | Set to `dev` to disable Twig cache, page cache, and DI compilation. | `dev` |
| `APP_DEBUG` | Set to `true` to show detailed error pages and log exceptions to `storage/logs/errors.log`. Errors are always sent to the server log (stderr on Docker). | `true` |

For the full reference — default values, all affected features, and production guidelines — see the [Environment Variables](../../developer/env) developer docs.

::: tip
After changing `APP_ENV` or `APP_DEBUG`, run `php vale cache:clear` to flush any existing cache.
:::

::: tip SEE ALSO
- View the [Developer Guide](../../developer/index) for API and webhook technical details.
- Learn about [CLI Commands](../system/cli) for server-side management.
- [Maintenance settings](./maintenance) for cache, cron, updates, and database optimization.
:::
