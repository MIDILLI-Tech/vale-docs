# Troubleshooting

Find solutions to common issues encountered while setting up or running Vale.

## Installation Issues

### 404 Not Found on all pages

::: tip FOR SYSADMINS
This is a web-server rewrite issue. On Apache ensure rewrites are enabled and the `public/.htaccess` is active; on Nginx check the `try_files` setup (see [Deployment Guide](../../developer/deployment/)). Forward this to your host if you don't manage the server.
:::

### Blank Screen or 500 Error
- Ask your host to check the PHP/server error logs (on Docker: container logs).
- Ensure the `storage/` directory and its subfolders are writable by the web server.
- For 500 and 403 errors, the error page displays a **Reference ID**. Share this ID with support or use it to locate the matching log entry.

::: tip FOR SYSADMINS
Set `APP_DEBUG=true` in `.env` to see the detailed error message. Debug mode also writes unhandled exceptions with stack traces to `storage/logs/errors.log`; errors are always sent to the server log as well.
:::

### Database Connection Failed
- Verify your DB credentials in `.env`.
- Ensure the database server is running and the user has permission to access the specified database.

## System Health Check

If you have command-line access to the server (or are running Docker), use the built-in health check to diagnose common issues:

```bash
php vale doctor
```

For containerized deployments:

```bash
docker compose exec vale-app php vale doctor
```

Any failed check indicates a problem that blocks the application — fix those first (see [CLI Commands](./cli) for details).

## Email Issues

### Emails not being sent
- Go to **[Settings](../settings/) → [Mail](../settings/mail#test-email)** and use the **Test Configuration** button.
- If using SMTP, verify your host, port, and encryption settings.
- If using a service like Mailgun or SendGrid, ensure your API keys are correct.
- Check the **Mail Logs** tab for any recorded errors.

## Content & Media

### Images not appearing
- Ensure the `public/uploads/` directory is writable and accessible.
- Check if your server has the `GD` extension installed for thumbnail generation.

### Changes not appearing on the site
- Clear the application cache under **[Settings](../settings/) → [Maintenance](../settings/maintenance#cache)**.
- If `APP_DEBUG` is false, Vale uses full-page caching. Changes may take a few minutes to appear unless the cache is manually cleared.

## Stale Admin UI After Deploy

If the admin panel looks outdated after a deployment (e.g. an editor toolbar on the Dashboard, or buttons that do nothing), it is almost always a caching layer serving old files. Work through these with whoever manages your hosting, top to bottom:

1. **Duplicate containers** — a rolling update can leave old and new code serving traffic side by side.
2. **Stale compiled templates** — production caches compiled templates; they must be cleared inside the container, then the container restarted.
3. **Stale CSS/JS behind a CDN or proxy** — changed files automatically get a fresh URL, so a still-outdated file means the CDN/proxy is serving its own cached copy. Purge the CDN/proxy cache for the assets path.

::: tip FOR SYSADMINS
Exact commands for each layer (orchestrator task lists, cache-clear commands, cached-URL checks) live in the deployment runbooks. Local dev is unaffected because it disables template caching and cache-busting.
:::

## Lost or Changed APP_KEY

If the `APP_KEY` in your `.env` file is lost or changed, all encrypted settings (API keys, webhook secrets, SMTP passwords, SSO client secrets, and 2FA secrets) become unreadable. The application will silently use corrupted values, causing payment processing, email delivery, SSO login, and 2FA to fail.

::: tip Logins
User logins with their passwords will keep working, so you should not worry about being completely locked out.
:::

### Recovery Steps

1. **Generate a new APP_KEY:**
   ```bash
   php vale key:generate
   ```
   This displays a new key and lists all settings that must be re-entered.

2. **Update `.env` manually:**
   Open `.env` in a text editor and replace the `APP_KEY` value with the new key.

3. **Re-enter affected settings:**
   Go to **Settings** in the admin panel and re-enter:
   - Payment gateway credentials (Stripe, PayPal, Mollie, etc.)
   - Mail service API keys (Mailgun, SendGrid, Resend, etc.) or SMTP password
   - SSO provider client secrets (Google, GitHub, etc.)
   - Any webhook secrets

4. **2FA Recovery:**
   Users with two-factor authentication enabled will lose access. They can:
   - Use the emergency password reset endpoint if configured
   - Contact an administrator to disable 2FA for their account

5. **Permanent address loss (read-only):**
   Encrypted **order and customer addresses** (name, phone, street, company) can
   no longer be decrypted with a new `APP_KEY`. These cannot be re-entered from
   the CLI — they become permanently unreadable and must be re-submitted by the
   customer. This only applies when `ENCRYPT_PII=true`; if encryption was off,
   address data is stored in plaintext and unaffected.

6. **Verify:**
   ```bash
   php vale doctor
   ```
   Check that all encrypted settings pass validation.

::: warning Backups
Always keep a backup of your `.env` file in a secure location. The `APP_KEY` cannot be recovered if lost.
:::

::: tip See also
See [CLI Commands](././cli) for more information about the doctor command.
:::

::: tip STILL STUCK?
If you can't find the answer here, please check our [GitHub Issues](@gitRepo@/issues) or community forums.
:::
