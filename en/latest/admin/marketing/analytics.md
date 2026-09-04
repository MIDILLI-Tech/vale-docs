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

See which external sites, search engines, and direct links send visitors to your site. UTM parameters are parsed and grouped automatically. The **Top Destinations** column shows, per source, which landing pages the traffic arrived on — click a page to open it.

### Browser, Device & Language

Review visitor breakdowns by:

- **Browser** — Chrome, Firefox, Safari, Edge, and other browsers
- **Device type** — Desktop, Mobile, or Tablet
- **Language** — The visitor's preferred language

## Date Range Filter

Use the From/To date fields at the top of the dashboard to filter the panels, then click **Apply**. Quick presets (7d, 30d, 90d, This month, Last month) fill the dates for you — you can adjust them before applying. The earliest selectable date is limited by your pageview retention setting (90 days by default).

## Customizing the Dashboard Layout

Rearrange and resize analytics cards to match your workflow:

- **Drag to reorder** — Hover a card and drag it by its grip handle to move it within or between rows, or drop it into the gap between rows to place it in a new row. Your arrangement is saved automatically.
- **Card width** — Each card header has a width selector with five sizes: **Narrow**, **Third**, **Half**, **Wide**, and **Full**. For example, give the traffic chart a Wide slot while keeping small lists Narrow.
- **Card height** — Drag the grip bar at the bottom of any card to make it taller or shorter. Charts and lists grow with the card. Double-click the grip bar to reset a card to its default height.
- **Reset Layout** — When you have customized the layout, a **Reset Layout** button appears below the cards. Click it to restore the default card arrangement, widths, and heights at any time.

On smaller screens the cards stack vertically and the width selector is hidden, since every card already uses the full width.

::: tip Per-user, per-browser
The dashboard layout — including card order, widths, and heights — is stored in your browser's local storage. Each user's arrangement is independent. Clearing browser data or using another browser resets the dashboard to its default layout.
:::

## Configure Analytics

Enable tracking, choose the geolocation method, and exclude administrators or paths from collection in [Settings](../settings/) → [Analytics](../settings/analytics). For IP storage and pageview retention controls, see [Privacy & Security settings](../settings/privacy).

::: tip SEE ALSO
- [Analytics Settings](../settings/analytics) — tracking, geolocation, and exclusion options.
- [Privacy & Security](../settings/privacy) — IP privacy and data retention controls.
:::
