# Security

Vale is designed with security as a top priority, implementing multiple layers of protection against common web vulnerabilities and infrastructure-level threats.

## Authentication & Session Security

- **CSRF Protection**: Every non-GET request (POST, PUT, DELETE) requires a valid per-session CSRF token. Handled automatically by `CsrfMiddleware`. Tokens rotate on each request.
- **Password Hashing**: bcrypt with cost factor 12.
- **Rate Limiting**: Critical endpoints (login, form submissions, API requests, password reset, cron endpoint) are rate-limited per IP using a **file-based rate limiter** — no Redis or external dependency required.
- **TOTP Replay Protection**: Each consumed TOTP timeslice is recorded per user (`users.totp_last_slice`); a captured code cannot be reused within its validity window. Recovery codes are consumed single-use and compared timing-safely.
- **Download Tokens**: Digital download grant tokens are stored only as SHA-256 hashes — a database dump no longer yields usable download URLs.
- **Session Cookies**: `Secure`, `HttpOnly`, and `SameSite` flags are enabled by default (see [`SESSION_SECURE`](../env#session)).

## Encryption

Sensitive settings (API keys, SMTP passwords, OAuth credentials) are encrypted at rest using **XChaCha20-Poly1305** via libsodium before storage in the database. This ensures that even if the database is compromised, secrets remain protected and tamper-evident.

The encryption key is derived from `APP_KEY` in `.env`:

::: danger APP_KEY
If `APP_KEY` is lost, encrypted settings cannot be recovered. If it is compromised, your secrets are at risk. Keep it secret and back it up separately from the database.
:::

### Encrypted Settings

The following settings are encrypted in the database:

| Category | Settings |
|---|---|
| **Payment Gateways** | `stripe_secret_key`, `stripe_webhook_secret`, `paypal_client_secret`, `mollie_api_key`, `twocheckout_api_secret`, `twocheckout_secret_key`, `checkoutcom_secret_key`, `checkoutcom_webhook_secret` |
| **Mail Services** | `mailgun_secret_key`, `sendgrid_api_key`, `resend_api_key`, `unosend_api_key`, `mail_smtp_pass` |
| **SSO Providers** | All `sso_*_client_secret` values (Google, GitHub, etc.) |
| **2FA** | `users.two_factor_secret`, `users.two_factor_recovery_codes` |

### Encrypted PII (Addresses & Phone) — opt-in

Customer-facing free-text address data is encrypted at rest **only when
`ENCRYPT_PII=true`** in `.env` (default is `false`). When enabled, the same
XChaCha20-Poly1305 scheme is used as for settings:

| Table | Field | Encrypted keys | Plaintext (kept for lookups & tax) |
|---|---|---|---|
| `orders` | `billing` | `first_name`, `last_name`, `phone`, `company`, `address`, `address_2`, `address_1` | `email`, `city`, `state`, `postcode`, `country` |
| `orders` | `shipping_address` | `first_name`, `last_name`, `phone`, `company`, `address`, `address_2`, `address_1` | `city`, `state`, `postcode`, `country` |
| `users` | `billing_address` | `first_name`, `last_name`, `phone`, `company`, `address_1`, `address_2` | `city`, `state`, `postcode`, `country` |
| `users` | `shipping_address` | `first_name`, `last_name`, `phone`, `company`, `address_1`, `address_2` | `city`, `state`, `postcode`, `country` |

- **Email is never encrypted** — it stays plaintext so unique constraints and
  `LOWER(billing) LIKE` order lookups continue to work.
- Location fields (`city`, `state`, `postcode`, `country`) stay plaintext so
  they render in admin/order views and feed country-based tax calculation.
- Encryption happens at the persistence boundary (repository/controller): the
  domain always holds plaintext, so admin searches and display work unmodified.
- **`ENCRYPT_PII=false`** stores these fields in plaintext (the default). Set it
  to `true` to opt in to encryption. This is an explicit choice — enabling it
  means a lost/changed `APP_KEY` makes existing order/customer addresses
  permanently unreadable.
- **Switching between modes** is the operator's responsibility and is documented,
  not enforced:
  - `false` → `true`: existing plaintext rows are still readable (backward
    compatible) and are encrypted on the next save of that row.
  - `true` → `false`: existing encrypted rows are returned as ciphertext
    (`encrypted::v1::…`) until re-saved with `ENCRYPT_PII=true`. Only re-save
    rows while the flag is on and `APP_KEY` is unchanged.
- `php vale doctor` reports a **failure** when `ENCRYPT_PII=false` but encrypted
  addresses exist in the database.

### Key Loss Recovery

If `APP_KEY` is lost or changed:

1. Generate a new key: `php vale key:generate`
2. Update `APP_KEY` in `.env` manually
3. Re-enter all affected settings in the admin panel
4. Users with 2FA will need to set up again
5. **Encrypted order/customer addresses become permanently unreadable** — they
   cannot be re-entered from the CLI, so back up `APP_KEY` alongside any
   database export that contains order addresses. This only matters when
   `ENCRYPT_PII=true`; settings (gateways, mail, SSO, 2FA) are always encrypted
   regardless of the flag.

For detailed recovery steps, see [Troubleshooting — Lost APP_KEY](../../admin/system/troubleshooting#lost-or-changed-app_key).

### Integrity Checks

The `php vale doctor` command validates encrypted settings integrity by attempting to decrypt each encrypted value. Corrupted settings are reported as failures, helping you identify which settings need to be re-entered.

## Role-Based Access Control (RBAC)

Vale ships a database-driven permission system built on four tables: `roles`, `permissions`, `user_roles` and `role_permissions` (both pivots use `UNIQUE` keys and cascading foreign keys). Permission slugs follow `<module>.<action>` notation — e.g. `posts.edit_others`, `orders.delete`, `system.cache`, `roles.manage`.

### How a Request Is Authorized

The admin route stack applies three middleware layers in order:

1. **AuthMiddleware** — verifies the session and exposes `user_role`, `user_permissions` (a snapshot of all slugs granted via any of the user's roles) as request attributes.
2. **AdminMiddleware** — blocks roles with no panel access (`subscriber`) from `/admin`.
3. **PermissionMiddleware** — enforces per-route permissions.

Only the `super_admin` role bypasses permission checks. The `admin` role is seeded with every permission but its capabilities live in the database and can be revoked from Admin → Roles — the middleware will honour that immediately for new sessions.

### Guarding Routes

Permissions are attached to route groups in `routes/admin.php`. Any group accepts an array of slugs; holding **at least one** grants access:

```php
use ValeApp\App\Middleware\PermissionMiddleware;

$group->group('', function (RouteCollectorProxy $g): void {
    $g->get('/orders', [OrderController::class, 'index']);
    $g->get('/orders/{id:[0-9]+}', [OrderController::class, 'show']);
})->add(new PermissionMiddleware($session, ['orders.list']));
```

Conventions used by the core routes:

| Area | Read | Write | Delete |
|---|---|---|---|
| Users | `users.list` | `users.create` / `users.edit` | `users.delete` |
| Roles | — | `roles.manage` | `roles.manage` |
| Orders | `orders.list` | `orders.edit` | `orders.delete` |
| Products | `products.list` | `products.create` / `products.edit` | `products.delete` |
| Settings & system config | `settings.view` | `settings.edit` | — |
| Cache/maintenance/cron | — | `system.cache` | — |
| Themes & appearance | — | `system.themes` | — |

When adding a new admin section, register it inside a guarded group rather than relying on panel access alone — every non-dashboard route must carry its own permission check.

### Custom Content Type Permissions

Creating or cloning a content type calls `RoleRepositoryInterface::ensureContentTypePermissions()`, which seeds five slugs (`cpt.{slug}.list|create|edit|delete|publish`) and grants them to `super_admin` **and** `admin`. Renaming or deleting a content type renames/removes its permissions with portable, parameter-bound SQL.

### Session Snapshot & Invalidation

Permission checks read the session snapshot written at login (`LoginUseCase` → `findPermissionSlugsForUser()`), so no per-request DB joins are needed. To keep this safe, every authorisation-relevant change bumps `users.session_version`:

- Role or password change on a user
- Deactivation/anonymization
- Permission edits on a role (`RoleController::update()`)
- Custom role deletion

`FlashMiddleware` compares the stored version against the database on each request and destroys stale sessions automatically. If you add a new way to modify users or roles, call `$user->incrementSessionVersion()` or `UserRepositoryInterface::incrementSessionVersionForRole()` accordingly.

### Primary Role Resolution

A user may hold several roles; the session's single `user_role` attribute is derived once via `User::resolvePrimaryRole()` which prefers `super_admin`, then `admin`, then falls back to the first assigned role (or `subscriber`). Use this helper instead of hand-rolled priority checks so all entry points behave identically.

### Analytics Admin Exclusion

With the *Exclude admins from analytics* setting enabled, `PageviewMiddleware` skips tracking for logged-in users holding the `admin` or `super_admin` role. The lookup is wrapped defensively — if the schema is unavailable the visit is counted rather than erroring.

### Templates

Twig templates receive `user_role` and `user_permissions` globals (populated by `FlashMiddleware`). Gate UI elements like this:

```twig
{% if 'roles.manage' in user_permissions %}
    <a href="{{ url('/admin/roles') }}">{{ __('Roles') }}</a>
{% endif %}
```

The admin sidebar is filtered automatically: nav entries declare a `permission` key in `config/admin-nav.php` and hidden items never reach the template.

::: tip SEE ALSO
- [Users & Roles](../../admin/users) — end-user documentation.
- [Hooks](../hooks) — e.g. `user.registered` fires after account creation.
:::

## Inbound Payment Webhooks

Webhook verification is **fail-closed**: notifications without a verifiable signature are rejected, never trusted — even when processing would otherwise succeed.

| Gateway | Verification |
|---|---|
| Stripe | HMAC-SHA256 over the raw body (`Stripe-Signature`), 300 s timestamp tolerance, timing-safe comparison |
| Checkout.com | HMAC-SHA256 (base64) via `cko-signature` — required; requests without the header are rejected |
| 2Checkout | INS Secret Word hash — required; missing/mismatched hash is rejected |
| PayPal | `POST /v1/notifications/verify-webhook-signature` using `paypal_webhook_id`; requires all five `Paypal-Transmission-*` / auth headers |

Configure each gateway's webhook secret in **Settings → E-commerce → Payment**. For PayPal, copy the webhook ID from the PayPal developer dashboard into the new **Webhook ID** field — subscription webhooks are ignored until it is set.

## SSO Account Linking

SSO providers only auto-link to an existing local account when they attest the email address is verified (e.g., Google's `email_verified`, GitHub's verified primary email from `/user/emails`). Unverified provider emails can create new accounts but never silently attach to an existing one — preventing account takeover through unverified email claims.

## Update Integrity

Every update package is verified with **Ed25519 digital signatures** before being applied. The verification chain:

1. Vale downloads the release manifest from the official update server.
2. The manifest contains the SHA-256 hash and Ed25519 signature for each release.
3. The downloaded package is verified against both the hash and the signature.
4. If either check fails, the update is rejected and the site remains on the current version.

The update process also creates an **automatic backup** before applying changes. If any migration step fails, an **automatic rollback** is triggered to restore the previous stable state.

## SQL Injection Prevention

All database interactions use **prepared statements via Doctrine DBAL**. Raw SQL is never constructed from user input.

## XSS Prevention

- **Twig auto-escaping**: All template variables are HTML-escaped by default. Raw output requires explicit `|raw` filter.
- **Content Security Policy**: Automatically sent by `SecurityHeadersMiddleware` on every response. Configured for Alpine.js compatibility (`unsafe-eval` + `unsafe-inline`). When building custom themes or plugins that load external scripts/styles, extend the CSP rules accordingly.

## File Upload Security

- **MIME Validation**: Files are validated against a strict allowlist of MIME types — file extension alone is never trusted.
- **Zero-Byte Rejection**: Empty files are rejected at the upload boundary.
- **Image Bomb Protection**: Images are checked for pixel area and memory footprint before being loaded into GD/Imagick, preventing memory exhaustion attacks.
- **EXIF Stripping**: GPS coordinates and camera metadata are automatically removed from uploaded images.
- **SVG Hardening**: SVG files are sanitised with a strict tag and attribute allowlist before storage, preventing XSS via inline scripts, event handlers, or `<use>` references to external resources.

## Security Headers

Vale sends these HTTP security headers on every response via `SecurityHeadersMiddleware`:

| Header | Value | Notes |
|---|---|---|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'self'; base-uri 'self'; form-action 'self'` | `unsafe-eval` and `unsafe-inline` are required for Alpine.js expression evaluation |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Sent only when the request is over HTTPS (direct or via `X-Forwarded-Proto`) |
| `X-Frame-Options` | `SAMEORIGIN` | Prevents clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS filter (modern browsers rely on CSP) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer information |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disables sensitive browser APIs |

::: tip Developer Note
The CSP includes `https:` in `script-src` and `style-src`, allowing any HTTPS origin. When adding third-party CDN scripts or styles in custom themes/plugins, they will pass this rule. For tighter security, replace `https:` with specific domains (e.g. `https://cdn.jsdelivr.net`) once the set of external sources is finalised.
:::

### Proxy & Trusted Proxies

When Vale runs behind a reverse proxy (Cloudflare, Nginx, Traefik, etc.), the client IP seen by the rate limiter may be the proxy's IP instead of the visitor's. Set the [`TRUSTED_PROXIES`](../env#rate-limiting) environment variable to enable `X-Forwarded-For` header inspection for correct IP detection.

## Web Server & Document Root Protection

Sensitive files (`.env`, the SQLite database inside `storage/`, and application source code) must never be publicly accessible. How you protect them depends on your web server configuration.

### 1. Recommended: Point the Document Root to `public/`

Always set the web root to the project's `public/` directory — e.g. `root /var/www/vale/public;` (Nginx) or `DocumentRoot /var/www/vale/public` (Apache). This keeps `.env`, `storage/`, and the core code physically outside the web-accessible directory, preventing external access by default.

### 2. Nginx Fallback (Root/Subdirectory Panel Mode)

If your hosting panel forces the web root to the main project folder instead of `public/`, paste the deny rules from the root `nginx.conf` template into your server block:

```nginx
# Block hidden files (.env, .git, etc.)
location ~ /\. {
    deny all;
}

# Block access to sensitive files
location ~ ^/(composer\.(json|lock)|phinx\.php)$ {
    deny all;
}

# Block direct access to sensitive directories
location ~ ^/(app|bootstrap|config|database|routes|src|storage|vendor|resources)(/|$) {
    deny all;
}
```

### 3. Apache Fallback (Root/Subdirectory Panel Mode)

The root `.htaccess` file already blocks access to `.env`, `storage/`, and other sensitive folders — but only if `AllowOverride All` is enabled in the virtual host, so the `.htaccess` rules are actually loaded and respected.

### Verifying Your Setup

After installation, confirm that sensitive files are not exposed:

```bash
curl -I https://yourdomain.com/.env
```

If you use SQLite, also try `https://yourdomain.com/storage/database.sqlite`.

- **Secure**: `403 Forbidden` or `404 Not Found` — the browser must never download or display the file.
- **Insecure**: `200 OK` and the file contents are readable — fix the document root, load the Nginx deny rules, or enable `AllowOverride All` in Apache.

::: tip DOCKER
Docker deployments: the official images already point the document root to `public/`, so this check is not required.
:::

## Page Cache Security

The full-page HTML cache automatically bypasses for:
- Authenticated users (to prevent serving cached personal data to others)
- Requests with active flash messages (e.g., "Added to cart")
- POST requests

This ensures performance optimisations never serve stale or personalised content to the wrong visitor.

## Secret Scanning

Vale uses [gitleaks](https://github.com/gitleaks/gitleaks) to prevent secrets and sensitive data from being committed to the repository. The scan runs automatically as a **git pre-commit hook** on every commit.

### How it works

1. **Pre-commit hook** (`.githooks/pre-commit`) runs `gitleaks protect --staged` before each commit.
2. Gitleaks scans only the staged changes (fast — typically under 100ms).
3. If a secret is found, the commit is blocked with details about the detected pattern.
4. Additionally, forbidden file extensions (`.env`, `.pem`, `.key`, `.p12`, `.pfx`, `id_rsa`, `id_ed25519`) are checked independently.

### Configuration

The scanning rules are defined in `.gitleaks.toml` at the project root:

**Built-in rules** — gitleaks ships with 100+ patterns for common services (AWS, GitHub, Stripe, OpenAI, etc.). These are enabled by default.

**Custom rules** — Vale adds project-specific patterns:

| Rule | Pattern |
|---|---|
| `vale-ed25519-private-key` | `UPDATE_PRIVATE_KEY_ED25519=...` |
| `vale-gpg-private-key` | `UPDATE_PRIVATE_KEY_GPG=...` |
| `vale-pem-private-key` | `BEGIN ... PRIVATE KEY` |
| `vale-app-key` | `APP_KEY=...` |
| `vale-db-password` | `DB_PASS=...` |
| `vale-generic-secret-assignment` | `SECRET_KEY=`, `API_KEY=`, `PASSWORD=`, etc. |

### Allowlist

These paths are excluded from scanning:

- `.env.example` — may contain key *names* (but not values)
- `generate-keypair.php`, `prepare-release.php`, `sign-release.php` — contain key generation logic
- `.gitleaks.toml`, `.githooks/pre-commit` — the scan configuration itself
- `vendor/`, `node_modules/`, `storage/cache/`, `storage/logs/`

### Installation

On a fresh clone, install the hook once:

```bash
git config core.hooksPath .githooks
```

Install gitleaks via [scoop](https://scoop.sh/) (Windows), [brew](https://brew.sh/) (macOS), or [go install](https://github.com/gitleaks/gitleaks#install):

```bash
# Windows
scoop install gitleaks

# macOS
brew install gitleaks
```

### Emergency bypass

If you need to commit a file that triggers a false positive (e.g., removing an old secret):

```bash
git commit --no-verify
```

This bypasses all pre-commit checks. Use sparingly and only when you have verified the content is safe.

::: tip SEE ALSO
- [Updates & Backups](../../admin/system/updates) — backup and rollback procedures.
- [Environment Variables](../env) — `APP_KEY` and security-related configuration.
:::
