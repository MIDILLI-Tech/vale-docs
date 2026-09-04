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
| **Cloudflare header (CF-IPCountry, CF-IPCity)** | Uses the `CF-IPCountry` (and `CF-IPCity`) headers set by Cloudflare |
| **IP2Location LITE DB1 (Country)** | Free IP2Location country database. Auto-downloaded on first use. |
| **IP2Location LITE DB3 (Country + City)** | Free IP2Location city database. Downloaded manually; the panel links the account page and the download. |

::: warning BEHIND A PROXY OR CLOUDFLARE?
If Vale runs behind Cloudflare, Nginx, Docker, or another reverse proxy, the app may only see the proxy's IP. Geolocation then silently records empty country/city for every visit, and every visitor appears to share one IP. Find the peer address in the container access log (first column) and add its subnet to `TRUSTED_PROXIES` (see [Environment variables](../../developer/env#trusted-proxies)). Forward this to whoever manages your hosting if you do not have server access.
:::

::: tip FOR SYSADMINS
`TRUSTED_PROXIES` must contain the **immediate** proxy's address as PHP sees it (`REMOTE_ADDR`), not only Cloudflare's ranges. Behind an intermediate proxy (Nginx, Traefik, CapRover, Docker) the peer is that proxy's IP/CIDR — e.g. `10.0.1.0/24` on CapRover's `captain-overlay-network`. When it does not match, Vale falls back to the proxy's IP: country/city are stored as `NULL` and every visitor appears to share one IP. Validate with **Admin → Settings → Analytics → IP Geolocation** — the Cloudflare check must report `proxy_trusted: true`. See [Environment variables](../../developer/env#trusted-proxies).
:::

::: tip CLOUDFLARE CITY (CF-IPCity)
`CF-IPCountry` is sent by Cloudflare automatically and gives the country. City is **not** sent by default — enable it in Cloudflare under **Rules → Settings → Managed Transforms → Add visitor location headers** (older dashboards: **Rules → Transform Rules → Managed Transforms → Add visitor location headers**). Without it only the country is recorded.
:::

### IP2Location Database

When IP2Location is selected, the panel shows:
- Database file status (found/not found) with file size
- **Download Database** / **Re-download** button for the country database
- A link to the free IP2Location account and the city database download (the city database is not downloaded automatically)
- Progress indicator during download

## Exclusions

- **Exclude admin users**: Do not track pageviews from logged-in admin/superadmin users. Enabled by default.
- **Exclude Paths**: One path per line. Use `*` as wildcard (e.g., `/admin/*` excludes all admin pages).

## Data Retention

- **Pageview retention (days)**: Pageview logs older than this many days are automatically deleted by cron. Default: 90 days. A warning suggests enabling cron in **Maintenance → Scheduled Tasks** if it is disabled.

::: tip SEE ALSO
- [Privacy & Security settings](./privacy) for IP address collection mode.
:::