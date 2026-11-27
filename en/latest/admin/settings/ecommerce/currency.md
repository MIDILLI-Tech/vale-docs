# Currency


## Default Currency

The base currency for prices and orders (e.g., USD, EUR, TRY). All orders are recorded in this currency regardless of the displayed currency.

## Additional Currencies

Select extra currencies customers can switch to. Uses a multi-select token interface. Leave empty for default currency only.

## Blocked Currencies

Select currencies to always block, even if they appear in additional currencies.

## Exchange Rates

Configure automatic rate conversion when multiple currencies are enabled:

**Rate Provider**:

| Provider | API Key Required | Notes |
|----------|------------------|-------|
| **None (no conversion)** | None | All prices shown in base currency only |
| **Frankfurter** | No | Free, 220+ currencies, blended daily rates from 100+ central banks, no quotas |
| **Open Exchange Rates** | Yes | Free plan: 1,000 requests/month (USD base) |
| **ExchangeRate-API** | Yes | Free plan: 1,500 requests/month (any base) |

**Cache Duration (hours)**: How long to keep cached rates before fetching again. Default: 24 hours.

Click **Refresh Rates Now** to force an immediate sync without reloading the page, the result appears inline below the button. The last updated time and base currency are shown.

When cron is disabled, a warning suggests enabling it in **Maintenance → Scheduled Tasks** for automatic refreshes.

