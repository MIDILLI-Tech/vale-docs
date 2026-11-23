# Health, Cache and Updates

Part of [CLI Commands](../cli).

Diagnose the installation, rotate the application key, clear or warm caches, and force an update check.

::: tip IN THE ADMIN PANEL
Cache clearing and warming live under **[Settings → Maintenance → Cache](../../settings/maintenance#cache)**; update checks under **[System → Updates & Backups → Updates](../updates)**. `doctor` and `key:generate` have no panel equivalent — use the terminal (the dashboard **System Status** card and `/api/v1/health` cover the health check).
:::

## Health

### `doctor`

Check system health: PHP version, environment configuration (with APP_KEY encrypt/decrypt roundtrip validation), encrypted settings integrity, database connection and pending migrations, required PHP extensions, and writable directory permissions.

```bash
php vale doctor
```

Output example:
```
Vale Doctor
===========

PHP
✅ PHP 8.3.12

Environment
✅ .env file
✅ APP_KEY valid (encrypt/decrypt roundtrip OK)
✅ APP_URL configured
✅ Application installed (storage/installed.lock)
✅ APP_ENV = production, APP_DEBUG = false
⚠️ APP_URL uses HTTPS (http://example.com)
✅ Disk space: 245.60 GB free

Encrypted Settings
✅ All encrypted settings readable

Database
✅ Connected (pdo_mysql)

Migrations
✅ All migrations applied (42)

PHP Extensions
✅ pdo_mysql (required)
✅ pdo_pgsql (recommended)
✅ pdo_sqlite (required)
✅ mbstring (required)
 ...

Directory Permissions
✅ storage/
✅ storage/logs/
✅ storage/cache/
 ...

Results: 33 passed, 2 warnings, 0 failed
```

The summary separates three categories:
- **passed (✅)**: Everything OK
- **warnings (⚠️)**: Non-blocking issues (e.g., recommended extension missing, no HTTPS in dev)
- **failed (❌)**: Blocking issues (e.g., missing `.env` file, no DB connection, required extension missing)

::: tip APP_KEY roundtrip
The doctor command validates APP_KEY by encrypting and decrypting a test value using the XChaCha20-Poly1305 algorithm. A failed roundtrip indicates a corrupt or modified key.
:::

::: warning Production Debug Mode
If `APP_ENV=production` and `APP_DEBUG=true`, the doctor shows a warning: detailed error pages expose sensitive information. Always set `APP_DEBUG=false` in production.
:::

::: tip Pending Migrations
If there are migration files in `database/migrations/` that haven't been applied yet, the doctor lists them as pending. Run `php vale migrate` to apply them.
:::

---

## Security

### `key:generate`

Generate a new `APP_KEY` and display all settings that must be re-entered after the change. The command outputs the new key but does **not** modify `.env`; you must update it manually.

```bash
php vale key:generate
```

Output example:
```
New APP_KEY generated:

  APP_KEY=a1b2c3d4e5f6...

WARNING: Changing APP_KEY will break all encrypted settings.

You must manually update the APP_KEY in your .env file:

  1. Open .env in a text editor
  2. Replace the existing APP_KEY value with the key above
  3. Save the file

After updating .env, re-enter the following settings in the admin panel:

Payment gateways:
  - stripe_secret_key
  - stripe_webhook_secret
  - paypal_client_secret
  - mollie_api_key
  ...

Mail services:
  - mail_smtp_pass
  - mailgun_secret_key
  - sendgrid_api_key
  ...

SSO providers:
  - All sso_*_client_secret values (Google, GitHub, etc.)

2FA:
  - All users with 2FA enabled will need to set up again
  - Users who cannot log in can use the emergency password reset

After re-entering settings, run:

  php vale doctor
```

::: warning When to use
Only run this command if your `APP_KEY` is lost or compromised. Changing the key requires re-entering all encrypted settings (payment gateways, mail services, SSO providers, and 2FA). If `ENCRYPT_PII=true`, encrypted **order and customer addresses** become permanently unreadable and cannot be re-entered. See [Troubleshooting: Lost APP_KEY](../troubleshooting#lost-or-changed-app-key) for detailed recovery steps.
:::

---

## Cache

### `cache:clear`

Clear application caches.

```bash
php vale cache:clear [type]
```

`type` can be: `pages`, `data`, `views`, `container`, or `all` (default: `all`)

| Type | Clears |
|---|---|
| `pages` | Full-page HTML cache (files + PageCache object flush) |
| `data` | Query-result and object caches |
| `views` | Compiled Twig templates |
| `container` | Compiled DI container |
| `all` | Everything above |

When clearing `pages` or `all`, the command also flushes the `PageCache` object in addition to deleting cached HTML files. This ensures the in-memory state is consistent with the filesystem.

A manual clear is the fallback, not the normal path: content changes invalidate the affected pages on their own. The full list of invalidation surfaces is documented under [Page Cache](../../../developer/page-cache).

Options: `--dry-run`

### `cache:warm`

Pre-generate caches for faster first-page-load in production.

```bash
php vale cache:warm [type]
```

`type` can be: `container`, `views`, or `all` (default: `all`)

Options: `--dry-run`

---

## Updates

### `update:check`

Check the remote update manifest for a new Vale version.

```bash
php vale update:check
```

| Option | Description |
|---|---|
| `--apply` | Download and apply the update if one is available |
| `--force` | Apply the update even if no newer version is found |
| `--backup` | Create a full backup of the current installation (without applying an update) |
| `--rollback[=DIR]` | Roll back to the backup in DIR (or the most recent backup) |

::: tip
A backup is created automatically when you use `--apply`. Use `--backup` only if you want an extra manual snapshot before running the update.
:::

---

