# Exchange Rates

Exchange rate configuration is part of the **[E-Commerce → Currency](../settings/ecommerce#currency)** settings. This page provides a quick reference.

Vale supports multi-currency displays and automatic price conversion using real-time exchange rates.

## Configuration

Go to **Settings → E-Commerce → Currency** to manage your currency settings.

### API Provider
Choose a service to fetch live rates:
- **Frankfurter**: Free, no API key required (covers major currencies).
- **Open Exchange Rates**: Requires an API key.
- **ExchangeRate-API**: Requires an API key.

### Cache Duration
Set how long rates are cached before the next fetch (1–168 hours). Default: 24 hours.

### Manual Refresh
Click **Refresh Rates Now** to force an immediate sync. The last updated time and base currency are displayed.

### Automatic Refresh
When cron is enabled (see [Maintenance → Scheduled Tasks](../settings/maintenance#scheduled-tasks-cron)), exchange rates are refreshed automatically according to the cache duration.

::: tip SEE ALSO
- Full configuration details in [E-Commerce → Currency](../settings/ecommerce#currency).
- [Maintenance settings](../settings/maintenance) for cron setup.
:::
