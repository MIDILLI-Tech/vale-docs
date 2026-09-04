# Environment Variables

Vale uses a `.env` file to manage configuration for different environments. Start from the `.env.example` file in the repository root:

```bash
cp .env.example .env
```

::: tip QUICK TIP
Generate your `.env` file visually using the offline [Environment Generator](https://docs.getvale.org/environment-generator.html) — all processing happens in your browser, and no data leaves your machine.
:::

::: tip Maintenance
This reference must be kept in sync with `.env.example` and `config/*.php` defaults. When adding, removing, or renaming env vars, update both `.env.example` and this page.
:::

## Application

| Variable | Description | Default |
|---|---|---|
| `APP_URL` | Canonical base URL — must match your actual domain. | `http://localhost` |
| `APP_ENV` | `production` for live sites or `dev` during development. Controls caching and compilation behavior (see below). | `production` |
| `APP_DEBUG` | Show detailed error messages, stack traces, and enable file-based exception logging. All exceptions are always sent to the server error log (stderr on Docker, PHP error log locally). 500 and 403 error pages display a unique Reference ID for log correlation. Never `true` in production. | `false` |
| `APP_KEY` | 64-char hex encryption key. **Never change after install** — encrypted settings become unreadable. If lost, use `php vale key:generate` to create a new key, then re-enter affected settings. See [Security](./security/#encryption). | — |
| `APP_LOCALE` | Default UI locale: `en`, `tr`, `de`, `fr`, `es`, `it`, `pt`, `nl`. | `en` |

### `APP_ENV` vs `APP_DEBUG`

Both variables control caching and development behavior, but they serve different purposes:

| Feature | `APP_ENV=dev` | `APP_DEBUG=true` |
|---|---|---|
| Twig template cache | Disabled | Disabled |
| Auto-reload Twig templates | Enabled | Enabled |
| Full-page HTML cache | Disabled | Disabled |
| DI container compilation | Disabled | — |
| Detailed error pages | — | Only when combined with `APP_ENV=dev` |
| Exception logging to `storage/logs/errors.log` | — | Enabled |
| Bootstrap debug logging | — | Enabled |
| Exception logging to server error log (stderr / PHP error log) | Always | Always |

::: tip Recommended Development Setup
Use `APP_ENV=dev` and `APP_DEBUG=true` together during development. This disables all caching and shows detailed errors. For staging environments, use `APP_ENV=dev` with `APP_DEBUG=false` to disable caching without exposing error details.
:::

::: warning
Never set `APP_DEBUG=true` in production. It exposes stack traces, database queries, and other sensitive information to end users.
:::

## Database

| Variable | Description | Default |
|---|---|---|
| `DB_DRIVER` | Database driver: `mysql` (default), `sqlite`, or `pgsql`. | `mysql` |
| `DB_HOST` | Database server address (MySQL/MariaDB/PostgreSQL). | `127.0.0.1` |
| `DB_PORT` | Database port (MySQL/MariaDB/PostgreSQL). | `3306` (`5432` for PostgreSQL) |
| `DB_NAME` | Database name (MySQL/MariaDB/PostgreSQL) or SQLite file path. For SQLite, use a path like `storage/database.sqlite`. | `Vale` |
| `DB_USER` | Database username (MySQL/MariaDB/PostgreSQL). | `root` (`postgres` for PostgreSQL) |
| `DB_PASS` | Database password (MySQL/MariaDB/PostgreSQL). | — |
| `DB_CHARSET` | Connection charset (MySQL/MariaDB/PostgreSQL). | `utf8mb4` (`utf8` for PostgreSQL) |
| `DB_PREFIX` | Table name prefix. | `vl_` |

::: tip SQLite Setup
For SQLite, set `DB_DRIVER=sqlite` and `DB_NAME=storage/database.sqlite`. The file will be created automatically on first migration if it doesn't exist.
:::

::: tip PostgreSQL Setup
For PostgreSQL, set `DB_DRIVER=pgsql` (alternatively `postgres` or `postgresql` are also accepted). Vale requires PostgreSQL @pgsqlVersion@+. The installer and `php vale doctor` will verify the version automatically.
:::

## Assets

| Variable | Description | Default |
|---|---|---|
| `ASSETS_USE_CDN` | Load Tailwind, Alpine.js, and fonts from CDN instead of local build. Useful during theme development. | `false` |

## Storage

| Variable | Description | Default |
|---|---|---|
| `STORAGE_DRIVER` | Storage driver for file uploads. Currently only `local` is supported. | `local` |

## Session

| Variable | Description | Default |
|---|---|---|
| `SESSION_LIFETIME` | Session lifetime in minutes. With "Remember Me" checked, extends to 30 days automatically. | `120` |
| `SESSION_SECURE` | Send session cookie only over HTTPS. Enabled by default; set `false` only for local plain-HTTP development. | `true` (except when `APP_ENV` is `local`/`dev`) |
| `SESSION_HTTPONLY` | Block JavaScript from reading the session cookie (XSS protection). | `true` |
| `SESSION_SAMESITE` | SameSite cookie policy: `Lax`, `Strict`, or `None`. | `Lax` |

## Cache

| Variable | Description | Default |
|---|---|---|
| `CACHE_DRIVER` | Cache backend. Currently only `file` is supported. | `file` |
| `CACHE_TTL` | Data/query cache TTL in seconds. | `3600` |
| `PAGE_CACHE_ENABLED` | Enable full-page HTML cache for guest visitors. | `true` |
| `PAGE_CACHE_TTL` | Page cache TTL in seconds. Falls back to `CACHE_TTL` if not set. | `86400` |

::: warning
When `APP_ENV=dev` or `APP_DEBUG=true`, full-page caching is automatically disabled so you always see live changes during development.
:::

## Rate Limiting

| Variable | Description | Default |
|---|---|---|
| `RATE_LIMIT_LOGIN` | Max login attempts per minute per IP. | `5` |
| `RATE_LIMIT_FORM` | Max form submissions per minute per IP. | `3` |
| `RATE_LIMIT_API` | Max API requests per minute per IP. | `60` |
| `RATE_LIMIT_PROBE` | Max error responses (404/405) per window per IP before the address is throttled with HTTP 429. Counts only error responses, so normal traffic never consumes the budget — this stops scanner noise (`xmlrpc.php`, `wp-login.php`, `.env` probes, …). Requests carrying a `vl_session` cookie (logged-in users) are exempt. | `60` |
| `RATE_LIMIT_PROBE_WINDOW` | Probe window in seconds. A throttled IP stays locked out (429 with `Retry-After`) for this long after crossing `RATE_LIMIT_PROBE`. | `600` |
| `HEALTH_DEEP_LIMIT` | Max `?deep=1` external health probes per window per IP before HTTP 429. Plain `/api/v1/health` is never limited. | `30` |
| `HEALTH_DEEP_WINDOW` | Deep health window in seconds. | `60` |
| `TRUSTED_PROXIES` | Comma-separated list of trusted proxy IPs (or a single IP). When set, the visitor's real IP is read from the `CF-Connecting-IP` header first (Cloudflare), falling back to `X-Forwarded-For`, instead of `REMOTE_ADDR`. Used by the rate limiter and analytics (unique visitors, geolocation). Required when Vale runs behind Cloudflare, Nginx, Traefik, or any reverse proxy that terminates TLS. Only set this when a proxy is actually in front — otherwise clients could spoof their IP. Leave empty to use `REMOTE_ADDR` directly. | — (empty) |
| `VLE_SKIP_RATE_LIMIT` | Disables the scanner/probe throttling (`ProbeRateLimitMiddleware`) only — login, form, and API limits stay active. Exists for test suites that sweep hundreds of synthetic 404 routes and would otherwise throttle themselves. Leave `false` in production. | `false` |

## Listings & Search

| Variable | Description | Default |
|---|---|---|
| `CLIENT_SIDE_SEARCH_FETCH_LIMIT` | Max records loaded into the browser for client-side search before switching to server-side queries. Applies to admin list pages (posts, pages, orders, users, tags, media, newsletter), the editor's link/page pickers and coupon product loader, and the account orders page. Raise it to keep more rows searchable instantly; lower it to reduce memory usage on large sites. Values below `1` are clamped to `1`. | `100` |
| `SHOP_BUFFER_SIZE` | How many products the storefront pager fetches from the server per round-trip while visitors browse or search the shop page. | `50` |

::: tip
When a list exceeds `CLIENT_SIDE_SEARCH_FETCH_LIMIT`, Vale switches that page to server-side mode: search, sorting, and pagination are handled by the server instead of the browser. The default of `100` keeps admin pages fast for most sites.
:::

## Update Checker

| Variable | Description | Default |
|---|---|---|
| `UPDATE_MANIFEST_URL` | URL of the release manifest JSON. | GitHub releases URL |
| `UPDATE_REQUIRE_SIGNATURE` | Require Ed25519 signature verification for updates. | `true` |
| `UPDATE_PUBLIC_KEY_ED25519` | Base64-encoded Ed25519 public key for release signature verification. | `@updatePublicKeyEd25519@` |
| `UPDATE_PUBLIC_KEY_GPG` | ASCII-armored GPG public key (optional, secondary verification). | — |

## Emergency Access

| Variable | Description |
|---|---|
| `EMERGENCY_RESET_TOKEN` | Enables the emergency password reset endpoint at `/emergency-reset/<token>`. Generate with `php -r "echo bin2hex(random_bytes(32));"` — keep secret and disable after use. |

## Privacy

| Variable | Description | Default |
|---|---|---|
| `ENCRYPT_PII` | Encrypts customer/order address PII at rest (billing, shipping, addresses, phone, company). Enabling it means a lost or changed `APP_KEY` makes those addresses permanently unreadable — treat the key as critical. While it is off, `php vale doctor` reports encrypted rows still present in the database. See [Encrypted PII](./security/) for details. | `false` |

## Mail

Mail is **not** configured via environment variables. It is set up in the admin panel (**Settings → Mail**) and stored in the database settings table (`mail_driver`, `mail_smtp_host`, `mail_smtp_port`, `mail_smtp_user`, `mail_smtp_pass`, `mail_from_address`, `mail_from_name`, …). SMTP passwords and provider API keys are stored encrypted. See the [Admin Guide – Mail](../admin/settings/mail).

## Integration Keys

Payment and captcha keys are set in the admin panel (**Settings → E-Commerce**, **Settings → Forms**) and stored encrypted in the database settings table. They are **not** read from environment variables:

- `stripe_secret_key`, `stripe_publishable_key`, `stripe_webhook_secret`
- `checkoutcom_secret_key`, `checkoutcom_webhook_secret`
- `paypal_client_id`, `paypal_client_secret`, `paypal_sandbox`
- `mollie_api_key`, `twocheckout_api_secret`
- `turnstile_site_key`, `turnstile_secret_key`

## Environment Generator

Use the fully offline [Environment Generator](https://docs.getvale.org/environment-generator.html) to create your `.env` file locally. All processing happens in your browser — no data is sent to any server.
