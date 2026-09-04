# General Settings

Manage the basic identity and localization of your site.

## Homepage

Choose which page appears as your site's homepage:

- **Latest posts**: Shows the blog feed (default).
- **Shop**: Shows the shop front page (requires **Shop** to be enabled in Features).
- **A static page**: Select any existing page from your site.

::: tip NOTE
The Homepage setting is shared across all locales when multi-language content is enabled. If you need a translated homepage, create a page for each language and use the language switcher.
:::

## Site Identity

- **Site Name**: The title of your website, used in SEO and browser tabs.
  ::: tip TEMPLATE USAGE
  Display the site name using <code v-pre>{{ site_name }}</code>.
  :::
- **Site Tagline**: A short subtitle or slogan for your site.
  ::: tip TEMPLATE USAGE
  You can display the tagline in your theme templates using the <code v-pre>{{ site_tagline }}</code> variable.
  :::
- **Logo & Favicon**: Upload your brand images. High-resolution PNGs are recommended for logos.
  ::: tip TEMPLATE USAGE
  Access the logo URL using <code v-pre>{{ site_logo }}</code>.
  :::
- **Social Preview Image**: The default Open Graph image shown when your site is shared on Facebook, Twitter/X, LinkedIn, etc. Upload a `1200×630` px image for best results. 
  ::: tip REQUIRES SEO
  This section only appears when **SEO is enabled** in Settings → SEO.
  :::
  ::: info Fallback chain
  The fallback chain for social preview images is:
  1. Per-content OG image (set in the editor's SEO panel → Social tab)
  2. Featured image of the post, page, or product
  3. **Site-wide Social Preview Image** (this setting)
  :::

When **multi-language content** is enabled (see [Content Settings](./content#multi-language)), language tabs appear on **Site Name**, **Tagline**, **Footer Copyright**, **Maintenance Message**, and **Cookie Warning Text**. Vale serves the value matching the visitor's detected locale. See [Multi-Language](../content/translations#translatable-site-settings) for details.

## Communications

- **Admin Email**: The email address used for system notifications and administrative alerts.
- **Footer Copyright**: Displays a copyright message at the bottom of the page. Leaving it automatically generates from the **Site Name** and also localizes it if **multi-language content** is enabled.
  ::: tip TEMPLATE USAGE
  Use <code v-pre>{{ footer_copyright }}</code> to display this in your footer.
  :::

## Localization

- **Default Language**: Choose the primary language for the **Admin interface**.
- **Timezone**: Set your local timezone to ensure scheduled posts and orders are timestamped correctly.

## Maintenance

- **Maintenance Mode**: Enable this to show a message to visitors while you work on your site. Logged-in administrators will still be able to see the full site. Leave it to automatically use the existing message. This message is also translateable, if **multi-language content** is enabled.
- **Display Cookie Warning**: Enable a standard cookie consent banner for visitors, with customizable text.

## Features

Use these toggles to enable or disable built-in modules. When a feature is turned off, its related admin tab and sidebar items are hidden automatically.

| Feature | Description | Controls |
|---------|-------------|----------|
| **Enable blog** | Allows publishing posts, categories, and tags. When disabled, all blog routes return 404. | Content › Blog tab |
| **Enable pages** | Allows static pages. When disabled, all page routes return 404. | Pages sidebar |
| **Enable newsletter** | Enables newsletter features and tracking URLs. | Newsletter sidebar |
| **Enable form builder** | Allows creating and displaying forms on the frontend. | Forms sidebar |
| **Enable custom content types** | Allows defining custom post types with their own fields. | Content Types sidebar |
| **Enable multi-language content** | Allows creating translations for posts, pages, products, categories, tags, and more. Localized URLs like `/tr/path` will be enabled. | Content › Multi-Language tab |
| **Enable advertisement** | Displays advertisement slots and enables the `[ad]` shortcode. | Content › Advertisement tab |
| **Enable shop** | Allows visitors to browse shop, use cart, and purchase items using configured payment gateways. | E-Commerce tab |
| **Enable subscriptions** | Allows users to subscribe, make donations or recurring payments, and enable paid content based on their tiers. | Orders & Membership sidebar |
| **Enable user registration** | Global toggle. When disabled, registration is completely turned off. | Registration tab |
| **Enable SEO system** | Global toggle for meta tags, social previews, and search engine optimization features. | SEO tab |
| **Enable analytics** | Track pageviews, referrers, browser, and device information. No cookies required. | Analytics tab |

::: tip NOTE
The individual settings for each feature can be found on their respective tabs (for example, Blog settings are under **Content › Blog**, Shop settings under **E-Commerce**). Use the **Content** tab's sub-tabs to configure Blog, Multi-Language, Advertisement, and Media.
:::

::: tip SEE ALSO
- Configure [SEO Defaults](./seo) for better search ranking.
- Set up your [Shop Identity](./ecommerce) if you are running an online store.
:::
