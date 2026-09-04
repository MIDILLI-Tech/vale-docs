# Troubleshooting

Find solutions to common issues encountered while setting up or running Vale.

## Installation Issues

### 404 Not Found on all pages
- **Apache**: Ensure `mod_rewrite` is enabled and the `.htaccess` file in `public/` is being read.
- **Nginx**: Check your configuration and ensure `try_files` is set up correctly (see [Deployment Guide](../../developer/deployment/)).

### Blank Screen or 500 Error
- Set `APP_DEBUG=true` in your `.env` file to see the actual error message.
- Check the PHP error logs on your server. On Docker, run `docker logs <container-name>` to see errors in real time.
- Ensure the `storage/` directory and its subfolders are writable by the web server.
- When `APP_DEBUG=true`, Vale writes all unhandled exceptions to `storage/logs/errors.log` with the full stack trace. This file is only created when debug mode is enabled. Regardless of `APP_DEBUG`, all exceptions are always sent to the server's error log (stderr on Docker, PHP error log on local servers).
- For 500 and 403 errors, the error page displays a **Reference ID**. Use this ID to quickly locate the corresponding log entry in `storage/logs/errors.log` or the server error log.

### Database Connection Failed
- Verify your DB credentials in `.env`.
- Ensure the database server is running and the user has permission to access the specified database.

## System Health Check

If you have command-line access to the server (or are running Docker), use the built-in health check to diagnose common issues:

```bash
php vale doctor
```

Any ❌ (failed) check indicates a problem that will block the application. Fix those first before investigating other issues.

::: tip See also
See [Doctor](./cli) for usage and more information.
:::

### Running Doctor in Docker

For containerized deployments, exec into the running container:

```bash
docker compose exec vale-app php vale doctor
```

## Email Issues

### Emails not being sent
- Go to **Settings → Mail** and use the **Test Configuration** button.
- If using SMTP, verify your host, port, and encryption settings.
- If using a service like Mailgun or SendGrid, ensure your API keys are correct.
- Check the **Mail Logs** tab for any recorded errors.

## Content & Media

### Images not appearing
- Ensure the `public/uploads/` directory is writable and accessible.
- Check if your server has the `GD` extension installed for thumbnail generation.

### Changes not appearing on the site
- Clear the application cache under **Settings → Advanced**.
- If `APP_DEBUG` is false, Vale uses full-page caching. Changes may take a few minutes to appear unless the cache is manually cleared.

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
If you can't find the answer here, please check our [GitHub Issues](https://github.com/vale/vale/issues) or community forums.
:::
