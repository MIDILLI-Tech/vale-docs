# Environment Variables

Vale uses a `.env` file to manage configuration for different environments. Start from the `.env.example` file in the repository root:

```bash
cp .env.example .env
```

::: tip QUICK TIP
Generate your `.env` file visually using the offline [Environment Generator](https://docs.getvale.org/environment-generator.html). All processing happens in your browser, and no data leaves your machine.
:::

::: tip Maintenance
This reference must be kept in sync with `.env.example` and `config/*.php` defaults. When adding, removing, or renaming env vars, update both `.env.example` and this page.
:::

## Application

| Variable | Description | Default |
|---|---|---|
| `APP_URL` | Canonical base URL: must match your actual domain. **Required:** Vale refuses to boot when it is missing or is not an absolute `http(s)://` URL (there is no fallback to the request host). | none (required) |
| `APP_ENV` | `production` for live sites or `dev` during development. Controls caching and compilation behavior (see below). | `production` |
| `APP_DEBUG` | Show detailed error messages, stack traces, and enable file-based exception logging. All exceptions are always sent to the server error log (stderr on Docker, PHP error log locally). 500 and 403 error pages display a unique Reference ID for log correlation. Never `true` in production. | `false` |
| `APP_KEY` | 64-char hex encryption key. **Never change after install**: encrypted settings become unreadable. If lost, use `php vale key:generate` to create a new key, then re-enter affected settings. See [Security](./security/#encryption). | none |
| `APP_LOCALE` | Default UI locale: `en`, `tr`, `de`, `fr`, `es`, `it`, `pt`, `nl`. | `en` |

### `APP_ENV` vs `APP_DEBUG`

Both variables control caching and development behavior, but they serve different purposes:

| Feature | `APP_ENV=dev` | `APP_DEBUG=true` |
|---|---|---|
| Twig template cache | Disabled | Disabled |
| Auto-reload Twig templates | Enabled | Enabled |
| Full-page HTML cache | Disabled | Disabled |
| DI container compilation | Disabled | none |
| Detailed error pages | none | Only when combined with `APP_ENV=dev` |
| Exception logging to `storage/logs/errors.log` | none | Enabled |
| Bootstrap debug logging | none | Enabled |
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
| `DB_PASS` | Database password (MySQL/MariaDB/PostgreSQL). | none |
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
| `RATE_LIMIT_PROBE` | Max error responses (404/405) per window per IP before the address is throttled with HTTP 429. Counts only error responses, so normal traffic never consumes the budget. This stops scanner noise (`xmlrpc.php`, `wp-login.php`, `.env` probes, …). Requests carrying a `vl_session` cookie (logged-in users) are exempt. | `60` |
| `RATE_LIMIT_PROBE_WINDOW` | Probe window in seconds. A throttled IP stays locked out (429 with `Retry-After`) for this long after crossing `RATE_LIMIT_PROBE`. | `600` |
| `HEALTH_DEEP_LIMIT` | Max `?deep=1` external health probes per window per IP before HTTP 429. Plain `/api/v1/health` is never limited. | `30` |
| `HEALTH_DEEP_WINDOW` | Deep health window in seconds. | `60` |
| `TRUSTED_PROXIES` | Comma-separated IPs/CIDRs of the **immediate** reverse proxy (the peer address PHP sees as `REMOTE_ADDR`). Proxy headers (`CF-Connecting-IP`, then `X-Forwarded-For`) are only trusted when `REMOTE_ADDR` matches this list. Behind multiple hops, list every proxy's subnet. Used by the rate limiter and analytics (unique visitors, geolocation). Leave empty when no proxy is in front. | none (empty) |
| `VLE_SKIP_RATE_LIMIT` | Disables the scanner/probe throttling (`ProbeRateLimitMiddleware`) only. Login, form, and API limits stay active. Exists for test suites that sweep hundreds of synthetic 404 routes and would otherwise throttle themselves. Leave `false` in production. | `false` |

### Trusted proxies

`TRUSTED_PROXIES` is matched against `REMOTE_ADDR` — the IP of the **last hop** that connected to Vale, not the visitor's IP. If it does not match, Vale falls back to `REMOTE_ADDR`:

- analytics stores `NULL` country/city,
- every visitor appears to share one IP (rate limits, captcha remote IP, form IPs).

Match the list to your actual chain:

| Setup | `TRUSTED_PROXIES` |
|---|---|
| Cloudflare → Vale (origin) | Cloudflare's published IPv4/IPv6 ranges |
| Cloudflare → Nginx → Vale | Nginx's IP/CIDR (e.g. `172.16.0.0/12`) |
| Cloudflare → CapRover (Swarm) → Vale | `10.0.1.0/24` (captain-overlay-network) |
| Docker Compose proxy | `172.16.0.0/12` |

Find the peer address in the access log (first column):

```bash
docker logs --tail 20 <container>
```

Verify with the Cloudflare check (`proxy_trusted: true`) in **Admin → Settings → Analytics → IP Geolocation**. After changing this value only **new** pageviews receive geolocation data. Container environment variables override `.env` (Dotenv is loaded immutably).

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
| `UPDATE_PUBLIC_KEY_GPG` | ASCII-armored GPG public key (optional, secondary verification). | none |

## Emergency Access

| Variable | Description |
|---|---|
| `EMERGENCY_RESET_TOKEN` | Enables the emergency password reset endpoint at `/emergency-reset/<token>`. Generate with `php -r "echo bin2hex(random_bytes(32));"`. Keep secret and disable after use. |

## Privacy

| Variable | Description | Default |
|---|---|---|
| `ENCRYPT_PII` | Encrypts customer/order address PII at rest (billing, shipping, addresses, phone, company). Enabling it means a lost or changed `APP_KEY` makes those addresses permanently unreadable. Treat the key as critical. While it is off, `php vale doctor` reports encrypted rows still present in the database. See [Encrypted PII](./security/#encrypted-pii-addresses-phone-opt-in) for details. | `false` |

## Mail

Mail is **not** configured via environment variables. It is set up in the admin panel (**Settings → Mail**) and stored in the database settings table (`mail_driver`, `mail_smtp_host`, `mail_smtp_port`, `mail_smtp_user`, `mail_smtp_pass`, `mail_from_address`, `mail_from_name`, …). SMTP passwords and provider API keys are stored encrypted. See the [Admin Guide: Mail](../admin/settings/mail).

## Integration Keys

Payment and captcha keys are set in the admin panel (**Settings → E-Commerce**, **Settings → Forms**) and stored encrypted in the database settings table. They are **not** read from environment variables:

- `stripe_secret_key`, `stripe_publishable_key`, `stripe_webhook_secret`
- `checkoutcom_secret_key`, `checkoutcom_webhook_secret`
- `paypal_client_id`, `paypal_client_secret`, `paypal_sandbox`
- `mollie_api_key`, `twocheckout_api_secret`
- `turnstile_site_key`, `turnstile_secret_key`

## Docker (container-only)

These variables are read only by the Docker entrypoint (`docker/entrypoint.sh`) and are **not** part of `.env` / app settings. Defaults match the baked `docker/php.ini` / `docker/nginx.conf` (128M).

| Variable | Description | Default |
|---|---|---|
| `UPLOAD_MAX_FILESIZE` | PHP `upload_max_filesize` (and the effective single-file ceiling). | `128M` |
| `POST_MAX_SIZE` | PHP `post_max_size` and (on the Nginx image) `client_max_body_size`. | `128M` |
| `MEMORY_LIMIT` | PHP `memory_limit`. | `512M` |
| `MAX_EXECUTION_TIME` | PHP `max_execution_time` in seconds, plus the matching Nginx `fastcgi_send_timeout` / `fastcgi_read_timeout` and Apache `Timeout`. | `120` |
| `MAX_INPUT_TIME` | PHP `max_input_time` in seconds. | `120` |

Change them at runtime — no rebuild needed:

```bash
docker run -e UPLOAD_MAX_FILESIZE=256M -e POST_MAX_SIZE=256M \
  -e MEMORY_LIMIT=1G -e MAX_EXECUTION_TIME=300 midillitech/vale
# or via compose:
UPLOAD_MAX_FILESIZE=512M POST_MAX_SIZE=512M MEMORY_LIMIT=1G docker compose up
```

## Environment Generator

Use the fully offline [Environment Generator](https://docs.getvale.org/environment-generator.html) to create your `.env` file locally. All processing happens in your browser; no data is sent to any server.
