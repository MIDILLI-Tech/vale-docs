# SEO Guide

Vale covers the technical side of search optimisation for you: every page gets a title, a meta description, a canonical address, social preview tags and structured data without a plugin, and the XML sitemap and `robots.txt` are generated automatically. What is left is editorial work — describing each page clearly and telling Vale which pages should stay out of search results.

This guide follows the order you normally work in. For the field-by-field reference of the Settings screen, see [SEO Settings](./settings/seo).

## What Vale Does Automatically

| Output | What you get |
|--------|--------------|
| **Page title** | Built as `<Page title> - <Site name>`; the site name is appended for you. |
| **Meta description** | The page's own description when set; otherwise the excerpt, the listing summary or the start of the content. The fallback length follows **Listing summary length** in [Content Settings](./settings/content#blog). |
| **Canonical URL** | Every page declares its own canonical address. Override it per page only when the content duplicates another address. |
| **Social previews** | Open Graph and Twitter Card tags, with the default image from [General → Site Identity](./settings/general#site-identity) whenever a page has no image of its own. |
| **Structured data** | JSON-LD for `Article` and `WebPage` on content, `Product` on shop products and `Person` on author pages, with the site as publisher. |
| **XML sitemap** | Generated at `/sitemap.xml` and refreshed as you publish. It lists your homepage, published and indexable posts, pages and products, plus an author page for every active author with at least one published post while the blog is enabled. Category and tag archives are not included. |
| **robots.txt** | A sensible default that allows crawlers, references `/ai-robots.txt` and points at the sitemap. You can replace it and preview the result. |
| **Language alternates** | With Multi-Language Content on, each translation links to its siblings so search engines serve the right language. |
| **Blog feeds** | RSS at `<blog prefix>/feed.xml`; custom content types that enable RSS get their own feed. |
| **Redirects** | With automatic redirects enabled, changing a slug or URL prefix creates a permanent redirect from the old address. |

## Set the Foundation Once

1. **Turn the SEO system on** in **Settings → General → Features**. While it is off, the SEO screen is greyed out and the editor's SEO panel is unavailable.
2. **Fill in the site identity**: site name, logo and default social image under **Settings → General → Site Identity**. The site name appears in every title, the name and logo feed the publisher data, and the image is the fallback for shared links.
3. **Allow indexing** under **Settings → SEO → Search Engines**. Leave *Allow search engines to index this site* off only while the site is still private — when it is off, every page carries `noindex, nofollow`.
4. **Decide your URL prefixes** under **Settings → SEO → Redirects → URL Prefixes**. Changing the blog, shop or page prefix later still creates redirects when automatic redirects are on, but the fewer moves the better.
5. **Enable automatic redirects** on the same screen, so a slug change never breaks an indexed address.
6. **Add verification codes** under **Settings → SEO → Search Engine Verification** for Google, Yandex and Bing. Each field inserts the matching `<meta>` tag.
7. **Choose a crawler policy**: whether AI crawlers are blocked, and whether category and tag archives should be indexed at all.

## Optimise a Page

Posts, pages and products have an **SEO** panel in the editor sidebar; custom content types show it when the type enables the SEO support. The panel has three tabs.

### General

- **Meta title**: a specific title for search results. The site name is appended automatically, so do not repeat it.
- **Meta description**: write one for pages that matter. The automatic fallback is cut from body copy and may read like an opening paragraph instead of a summary.
- **Search preview**: shows how the result is likely to appear.
- **Focus keyword**: only an authoring aid that records the term the page targets. Ranking depends on the term genuinely appearing in the title, description, URL and body — not on the field itself.

### Social

- Fill in the **Open Graph** title, description and image used when the page is shared.
- Pick the **Twitter Card** type and image.
- Use **Preview** (Facebook and X tabs) to check the card before publishing.

### Advanced

- **Show this page in search results**: unchecking adds a `noindex` tag and also removes the page from the sitemap.
- **Show this page in the sitemap**: keeps the page indexed but out of `sitemap.xml` — useful for pages you want found only through links.
- **Let search engines follow links**: unchecking adds `nofollow`.
- **Canonical URL**: set it only when this address serves content that lives somewhere else too. Leaving it empty is correct for normal pages.
- **RSS exclusion**: keeps the item out of the feed while leaving the page itself untouched.

## Products

Product structured data is only as good as the fields behind it:

- Fill in **Brand**, **GTIN** (UPC, EAN, JAN or ISBN) and **MPN** under Inventory. Brand falls back to the site name when it is empty.
- Upload a **featured image**, and keep **price** and **stock status** accurate — they are published in the product's offer data.
- Enable **Ratings & Reviews** so that existing reviews add an aggregate rating.
- Use the product's **SEO** fields for a shop-specific meta title and description instead of the page defaults.

## Author Pages

With **Public Profiles** enabled under **Settings → Registration**, each user can add a public display name and a bio. The author page at `/blog/author/<user id>` shows the avatar, the bio and that author's published posts, and it carries `Person` structured data. Bylines, blog cards and the post footer link to it.

See [Users & Roles → Public author profiles](./users#public-author-profiles) for the workflow and [Registration Settings](./settings/registration#public-profiles) for the toggle.

## Archives, Tags and Thin Pages

- **Add noindex to archive / tag pages** under **Settings → SEO → Search Engines** keeps category and tag archives out of search results. Archive pages are never part of the sitemap, so this toggle only controls the `noindex` tag.
- Use the per-page **Show this page in search results** checkbox for individual pages that add little value to search, such as thank-you pages or duplicate landing pages.
- A page with no useful text of its own competes badly with the page it repeats — prefer adding a canonical URL or a `noindex` tag over publishing both.

## Change a URL Safely

1. Make sure **Enable automatic 301 redirects when slugs change** is on.
2. Change the slug or the section prefix.
3. Open the old address and confirm it redirects to the new one.

Manual redirects (**301 Permanent** or **302 Temporary**) are available under **Settings → SEO → Redirects** for addresses that no longer have a record in Vale. To clear every stored rule at once, use **Clear redirect table** under [Maintenance → Database Optimization](./settings/maintenance#clear-redirect-table).

## Sitemap, Robots and AI Crawlers

- The sitemap needs no maintenance: it is rebuilt from published, indexable content. After a large restructure, point your search engine tools at `/sitemap.xml` again.
- `robots.txt` defaults to allowing all crawlers, referencing `/ai-robots.txt` and linking the sitemap. Editing it is rarely needed — use the settings toggles first.
- **Block AI crawlers** under **Settings → SEO** adds `Disallow` rules for training crawlers, AI answer engines and agent user agents, and mirrors the policy at `/ai-robots.txt`.

## Check the Result

- Use the panel's **Search preview** and social previews before publishing.
- Confirm the important pages appear in `/sitemap.xml` and that excluded pages do not.
- After adding verification codes, check coverage and indexing in the search engine's own tools.
- For traffic and landing-page data inside Vale, see [Analytics](./marketing/analytics).

## Common Mistakes

- Leaving *Allow search engines to index this site* off after launch.
- Shipping key pages with an empty meta description and letting body text fill it.
- Changing slugs while automatic redirects are off.
- Turning on archive noindex and then wondering why category pages lost their traffic.
- Publishing products without a brand, identifier or image, so the offer data stays incomplete.
- Setting the same canonical URL on several different pages.

::: tip SEE ALSO
- [SEO Settings](./settings/seo): the full reference for every field.
- [Editor](./content/editor/): writing and formatting content.
- [Products](./ecommerce/products): product fields, identifiers and reviews.
- [Users & Roles](./users#public-author-profiles): public bios and author pages.
:::
