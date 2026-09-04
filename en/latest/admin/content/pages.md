# Pages

Build your site's backbone: About, Contact, Services, landing pages, and more, with hierarchical ordering, custom layouts per page, and campaign swaps that take over a live URL on schedule.

::: tip Pages that run themselves
Set an expiry for time-sensitive announcements, or prepare a campaign version that replaces the live page at midnight and hands the URL back afterwards. No midnight deploys, no broken links.
:::

## Creating a Page

Go to **Pages → Add New** to create a new page. The interface is similar to the [Post Editor](./posts), but with features specific to hierarchical site structures.

### Main Fields
- **Title**: The name of the page.
- **Content**: The body of the page, created using the [Editor](./editor/).

### Sidebar Configuration

- **Publish Box**:
  - **Status**: *Draft*, *Published*, *Unlisted*, or *Archived* (offline, kept for bookkeeping). *Published* and *Unlisted* require publishing rights. Without them you can only save drafts (see [Users & Roles](../users#publish-permissions)).
  - **Template**: Choose the layout for this page (see [Page Templates](#page-templates) below).
  - **Hide title**: Hide the page title heading on the site (the title is still used in menus, the browser tab, and SEO).
  - **Parent Page**: Select a parent to create a hierarchical URL structure (e.g., `/services/web-design`).
  - **Sort Order**: Controls the order of pages sharing the same Parent Page (default `0`, lower numbers come first; ties fall back to title). It does not affect navigation menus, which have their own ordering.
  - **Preview** (Ctrl+Shift+P): Open a live preview of your page in a new tab.
  - **Show Active Version** (Ctrl+Shift+S): Open the published version of your page in a new tab (published pages only).
- **Slug**: The URL path.
- **SEO Panel**: Per-page meta tags and social sharing settings.

## Searching the Page List

The search box above the list matches the **title**, **excerpt**, and **slug**. Tick **Also search in content** next to it to include the full page body. Full-content search scans every record, so it is noticeably slower on large catalogs.

## Scheduled Expiry & Campaign Swaps

Pages can take themselves offline, or hand their URL over to a replacement page, completely automatically. This is useful for announcements that should disappear after an event, or campaign pages (Black Friday, product launches) that go live at midnight and revert afterwards.

### Expiry date & time

Set **Expiry date & time** in the Publish Box. When the time passes, a published page moves to the **Expired** status and disappears from the site (same as unpublishing it by hand). Leave it empty for pages that should stay online indefinitely.

Expired pages are kept with an orange *Expired* badge in the page list, so you can re-publish them at any time.

### Replace a live page on schedule

Tick **Replace a live page on schedule** and pick the page this one replaces in the **Replaces** dropdown. At go-live (the **Publish date & time** set via **Set schedule** on a *Draft* or *Unlisted* page), this page **takes over the selected page's URL**. Visitors keep using the same address while seeing the new content. The previous page is moved to *Expired* under an archive URL.

- Use the 📋 button next to the dropdown to **copy the content** of the replaced page into the current one first, then edit just what changes (e.g. the hero banner).
- To revert automatically, also set an **Expiry date & time** on the campaign page and point its *Replaces* field back. At expiry the original page is restored to its URL.
- If the page is set as the static **Homepage** under **Settings → General**, the homepage setting follows the swap automatically.
- The **Clone** button in the page list duplicates any page as a draft, which is handy for preparing a campaign version.

::: warning TIMING: FOR SYSADMINS
Schedule times use your site timezone (**Settings → General → Timezone**). The switch happens on the next cron run after the configured time, so keep cron running frequently (every minute), especially for short campaign windows. If you manage the server, see [Scheduled Tasks](../settings/maintenance#scheduled-tasks-cron); otherwise forward this to your host.
:::

## Page Templates

Vale allows you to change the entire layout of a page using templates. These are defined by your theme and automatically appear in the dropdown menu. Installing a new theme under **[Appearance](../appearance/themes)** can add more templates to this list.

- **Standard**: The default layout including your theme's header, footer, and sidebar.
- **None (Blank Canvas)**: Renders the page body exactly as it is in the editor, without any theme styles, header, or footer. This is perfect for landing pages or custom-coded HTML content.
- **Theme-Specific Templates**: Depending on your active theme, you may see options like "Full Width", "Contact Layout", or "Landing Page".

::: info DEVELOPER NOTE
New templates can be created right in the admin panel under **[Appearance](../appearance/themes) → Themes → Edit** (new `page-templates/*.twig` file), or by placing `.twig` files in the theme's `page-templates/` directory manually. Either way requires Twig knowledge. See the [Theme Development](../../developer/themes#page-templates) guide for more details.
:::

::: tip SEE ALSO
- Organize your pages into [Navigation Menus](../appearance/menus).
- See the [Editor](./editor/) for available features.
:::
