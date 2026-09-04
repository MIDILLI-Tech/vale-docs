# Analytics Settings

Track pageviews, referrers, browser, and device information. No cookies are required.

::: tip ANALYTICS TOGGLE
The **Enable analytics** global switch lives in **[Settings](./) → [General](./general) → [Features](./general#features)**. When disabled, no analytics data is collected.
:::

## Geolocation

Choose how to resolve visitor country and city from IP address:

| Mode | Description |
|------|-------------|
| **None** | No geolocation data |
| **Cloudflare header (CF-IPCountry)** | Uses the `CF-IPCountry` header set by Cloudflare |
| **IP2Location LITE DB1 (Country)** | Free IP2Location country database. Auto-downloaded on first use. |
| **IP2Location LITE DB3 (Country + City)** | Free IP2Location city database. Requires manual download from IP2Location website. |

::: warning BEHIND A PROXY OR CLOUDFLARE?
If Vale runs behind Cloudflare, Nginx, Docker, or another reverse proxy, the app may only see the proxy's IP — geolocation can silently record empty country/city for every visit. Forward this to whoever manages your hosting.
:::

::: tip FOR SYSADMINS
Set `TRUSTED_PROXIES` in `.env` so analytics (and rate limiting) sees the visitor's real IP instead. When Cloudflare is in front, use Cloudflare's own published IP ranges as the value. See [Environment variables](../../developer/env#rate-limiting).
:::

### IP2Location Database

When IP2Location is selected, the panel shows:
- Database file status (found/not found) with file size
- **Download Database** / **Re-download** button for the country database
- Manual download instructions for the city database (requires free IP2Location account)
- Progress indicator during download

## Exclusions

- **Exclude admin users**: Do not track pageviews from logged-in admin/superadmin users. Enabled by default.
- **Exclude Paths**: One path per line. Use `*` as wildcard (e.g., `/admin/*` excludes all admin pages).

## Data Retention

- **Pageview retention (days)**: Pageview logs older than this many days are automatically deleted by cron. Default: 90 days. A warning suggests enabling cron in **Maintenance → Scheduled Tasks** if it is disabled.

::: tip SEE ALSO
- [Privacy & Security settings](./privacy) for IP address collection mode.
:::