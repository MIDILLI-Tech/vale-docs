# Analytics

Vale includes a built-in analytics dashboard that helps you understand visitor traffic without requiring third-party scripts or cookies.

## Accessing Analytics

Open **Analytics** in the admin sidebar to view the traffic dashboard.

## Dashboard Overview

The dashboard provides several panels for exploring your site's traffic:

### Pageviews & Trends

- **Total pageviews** for the selected date range
- **Unique visitors** based on the available IP or session information
- **Daily trend chart** to identify traffic spikes and drops
- **Online visitors** showing visitors active in the last few minutes

### Top Pages

View a ranked list of the most-visited URLs and their pageview counts. Select a page to focus the dashboard on that URL where supported.

### Referrers

See which external sites, search engines, and direct links send visitors to your site. UTM parameters are parsed and grouped automatically.

### Browser, Device & Language

Review visitor breakdowns by:

- **Browser** — Chrome, Firefox, Safari, Edge, and other browsers
- **Device type** — Desktop, Mobile, or Tablet
- **Language** — The visitor's preferred language from the browser's `Accept-Language` header

## Date Range Filter

Use the date range picker at the top of the dashboard to filter the panels. Presets include the last 7 days, last 30 days, last 90 days, and a custom range.

## Customizing the Dashboard Layout

Rearrange analytics cards to match your workflow:

- **Drag to reorder** — Drag a card by its grip handle to move it within or between rows.
- **Arrow controls** — Use the move-to-top, up, down, and move-to-bottom buttons for precise positioning.
- **Reset Layout** — Restore the default card arrangement at any time.

::: tip Per-user, per-browser
The dashboard layout is stored in your browser's local storage. Each user's arrangement is independent. Clearing browser data or using another browser resets the dashboard to its default layout.
:::

## Configure Analytics

Enable tracking, choose the geolocation method, and exclude administrators or paths from collection in [Settings → Analytics](../settings/analytics). For IP storage and pageview retention controls, see [Privacy & Security settings](../settings/privacy).

::: tip SEE ALSO
- [Analytics Settings](../settings/analytics) — tracking, geolocation, and exclusion options.
- [Privacy & Security](../settings/privacy) — IP privacy and data retention controls.
:::
