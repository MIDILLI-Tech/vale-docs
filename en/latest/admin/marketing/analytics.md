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

See which external sites, search engines, and direct links send visitors to your site.

### UTM Campaign Tracking

Visits that arrive through a tagged campaign link are grouped by every UTM parameter found on the landing URL:

- **Sources** (`utm_source`): `newsletter`, `google`, `partner-site`
- **Mediums** (`utm_medium`): `email`, `cpc`, `social`
- **Campaigns** (`utm_campaign`): `spring_sale`
- **Terms** (`utm_term`): the paid keyword, when present
- **Content** (`utm_content`): the link or banner variant, when present
- **Destinations**: the landing page a campaign link pointed to; click a page to open it

**Click a value to drill down.** Selecting a source filters the whole card, and the other panels immediately recount inside that source. Select a medium on top of it to narrow the list further. Combine as many dimensions as you need. Active filters appear as chips above the panels: use the ✕ on a chip to remove a single filter, or **Clear all** to start over. These filters live in the current page only, so a reload returns to the unfiltered view.

Values are matched exactly as they arrive. Only surrounding whitespace is trimmed, so `Email` and `email` remain separate entries. Visits that carry no value for a dimension are collected under **(not set)** instead of being dropped, so the panel counts always cover all campaign traffic. The **Terms** and **Content** panels appear only when at least one visit carries that parameter.

### Sorting Lists

Lists that are ranked by a number can be re-sorted from their column headers:

- **Views**: every list
- **Duration**: Top Pages, Top Posts, and entry pages (time spent on the page)
- **Avg. Session Duration (Avg. Sess. Dur.)**: exit pages (how long the visit lasted when it ended there)
- **Last Occurred**: HTTP status pages

The active column carries an arrow (↓ descending, ↑ ascending). Click a column to sort by it, then click it again to flip the direction. Cards that are not laid out as a table show the same **Views** control above the list. Sorting happens in the background. The page itself does not reload, and your choice is remembered per card in the browser, so it is still in place the next time you open the dashboard.

### Browser, Device & Language

Review visitor breakdowns by:

- **Browser**: Chrome, Firefox, Safari, Edge, and other browsers
- **Device type**: Desktop, Mobile, or Tablet
- **Language**: The visitor's preferred language

## Date Range Filter

Use the From/To date fields at the top of the dashboard to filter the panels, then click **Apply**. Quick presets (7d, 30d, 90d, This month, Last month) fill the dates for you. You can adjust them before applying. The earliest selectable date is limited by your pageview retention setting (90 days by default).

## Customizing the Dashboard Layout

Rearrange and resize analytics cards to match your workflow:

- **Drag to reorder**: Hover a card and drag it by its grip handle to move it within or between rows, or drop it into the gap between rows to place it in a new row. Your arrangement is saved automatically.
- **Card width**: Each card header has a width selector with five sizes: **Narrow**, **Third**, **Half**, **Wide**, and **Full**. For example, give the traffic chart a Wide slot while keeping small lists Narrow.
- **Card height**: Drag the grip bar at the bottom of any card to make it taller or shorter. Charts and lists grow with the card. Double-click the grip bar to reset a card to its default height.
- **Reset Layout**: When you have customized the layout, a **Reset Layout** button appears below the cards. Click it to restore the default card arrangement, widths, and heights at any time.

On smaller screens the cards stack vertically and the width selector is hidden, since every card already uses the full width.

::: tip Per-user, per-browser
The dashboard layout, including card order, widths, and heights, is stored in your browser's local storage. Each user's arrangement is independent. Clearing browser data or using another browser resets the dashboard to its default layout.
:::

## Configure Analytics

Enable tracking, choose the geolocation method, and exclude administrators or paths from collection in [Settings](../settings/) → [Analytics](../settings/analytics). For IP storage and pageview retention controls, see [Privacy & Security settings](../settings/privacy).

::: tip SEE ALSO
- [Analytics Settings](../settings/analytics): tracking, geolocation, and exclusion options.
- [Privacy & Security](../settings/privacy): IP privacy and data retention controls.
:::
