# SEO Settings

Optimize your site for search engines, social media, and AI agents with global configurations.

::: tip SEO SYSTEM TOGGLE
The **Enable SEO system** global switch lives in **Settings → General → Features**. When disabled (off), the SEO settings below are grayed out.
:::

## Meta Defaults

Vale applies sensible defaults automatically, so every page looks right in search results and social feeds with zero configuration:

- **Title format**: Page titles are built as `<Title> — <Site Name>` with a long dash separator (e.g. `My Post — Vale`). The symbol is controlled by the `seo_title_separator` setting.
- **Default meta description**: When a post, page, or product defines no explicit meta description, Vale generates one automatically — using the post's excerpt, the product's short description, or the first ~160 characters of the content (HTML stripped). Pages with no content or excerpt fall back to an empty description.
- **Social Preview Image**: The default Open Graph image shown when your site is shared on Facebook, Twitter/X, LinkedIn, etc. Configured in [General Settings](./general#social-preview-image).

## Search Engines

- **Allow search engines to index this site**: When disabled, the site adds a `noindex` robots meta tag on all pages.
- **Add noindex to archive / tag pages**: Prevents category and tag archive pages from appearing in search results.

### Robots.txt

Edit the `robots.txt` file directly. Leave empty to use the default (allows all crawlers, references `/ai-robots.txt`, includes sitemap URL). A live preview shows the generated content.

### AI Crawler Control

Block AI crawlers separately from regular search engine robots. When enabled, Vale adds `Disallow` rules to `robots.txt` for known AI crawlers:

- Amazonbot, anthropic-ai, Applebot, Applebot-Extended, Bytespider
- CCBot, ChatGPT-Agent, ChatGPT-Apple-Preview, ChatGPT-User, ClaudeBot
- Claude-Searchbot, Claude-User, Claude-Web, cohere-ai, cohere-training-data-crawler
- Diffbot, DuckAssistBot, FacebookBot, Google-CloudVertexBot, Google-Extended
- Google-InspectionTool, GoogleOther, GPTBot, ImagesiftBot, Meta-ExternalAgent
- Meta-ExternalFetcher, Meta-LlamaBot, MistralAI-User, OAI-SearchBot, OmgiliBot
- Perplexity-User, PerplexityBot, YouBot

The list covers training crawlers, AI answer engines (search assistants), and agent user agents. A preview of the generated `robots.txt` is available.

#### `ai-robots.txt` Endpoint

Vale also exposes `/ai-robots.txt`, a combined file of per-crawler rules that documents your AI crawler policy. Enforcement happens in `robots.txt` itself; `ai-robots.txt` mirrors the same setting: when AI crawlers are blocked, each crawler receives `Disallow: /`; otherwise `Allow: /`.

## Per-Content SEO

Each post, page, and product has its own SEO panel in the editor sidebar where you can override:
- Meta title and description
- Open Graph title, description, and image
- Twitter Card type and image
- Canonical URL
- `noindex` / `nofollow` control

## Structured Data (JSON-LD)

Vale automatically injects **JSON-LD structured data** (schema.org) into your pages to help search engines and AI agents understand your content without parsing HTML — no plugin or configuration required.

| Content type | Schema generated |
|---|---|
| Blog posts | `Article` with headline, author, datePublished, dateModified, image |
| Products | `Product` with name, description, offers (price, currency, availability), brand, GTIN, MPN, aggregateRating |
| Web pages | `WebPage` with name, description, url |
| Site | `WebSite` with name, url, and `SearchAction` (enabling sitelinks search box) |

No configuration is required — structured data is generated automatically based on the content and your site settings (name, URL, logo). To maximise schema quality:

- Fill in **Brand**, **GTIN** (EAN/ISBN/UPC), **MPN**, and **Condition** on each product.
- Upload a product image — it is included in the `Product` schema `image` field.
- Enable **Ratings & Reviews** — aggregate ratings are included when reviews exist.
- For articles, set a **Featured Image** and fill in the **Author** field.

The JSON-LD is injected as an inline `<script type="application/ld+json">` in the `<head>`, generated at request time and cached as part of the page cache — no external request or API call involved.

## Redirects

Managed under **SEO → Redirects** sub-tab.

### Automatic Redirects

- **Enable automatic 301 redirects when slugs change**: When a post, page, product, category, tag, or content type slug/prefix is updated, a permanent redirect is automatically created from the old URL to the new URL.

### URL Prefixes

Customize the URL structure for every section of the site. Changes trigger 301 redirect creation automatically when the feature is enabled.

| Group | Prefixes |
|-------|----------|
| **Content** | Page, Blog, Category, Tag |
| **Shop** | Shop, Cart, Checkout |
| **Membership** | Membership |
| **Account** | Account, Login, Register, Forgot Password, Reset Password, Verify Email, Logout |

When multi-language is enabled, prefixes can be configured per language. A language switcher appears above the prefix fields.

A warning banner shows which prefixes have changed and offers to create redirects on save.

### Manual Redirects

Create manual redirects from the redirects section:
- Source path (e.g., `/old-page`)
- Destination URL (absolute or relative)
- Redirect type: `301 Permanent` or `302 Temporary`

### Clearing all redirect rules

To remove every stored redirect rule at once (automatic and manual), use **Clear redirect table** under **Settings → Maintenance → Database Optimization**. This option is visible only when **Enable SEO System** is turned on. See [Maintenance → Database Optimization](./maintenance#clear-redirect-table) for details.

## Noindex Controls

Prevent specific content from appearing in search engines:
- **Per-content**: Use the `noindex` toggle in the editor sidebar
- **Archives**: Toggle **Noindex Tag/Category archives** globally to prevent thin archive pages from being indexed
- **Search results pages**: Automatically noindexed

## Search Engine Verification

Add verification meta tags for:
- **Google Search Console**: Paste the `content` value from Google's verification screen
- **Yandex Webmaster**: Paste the `content` value from Yandex Webmaster
- **Bing Webmaster Tools**: Paste the `content` value from Bing Webmaster Tools

Each field has a sign-up link for the respective platform. Vale inserts the correct `<meta>` tag automatically.

## XML Sitemap

A sitemap is automatically generated at `/sitemap.xml` and kept up to date as you publish content. It includes your homepage, blog posts, pages, and products that are published and indexable. No configuration is required.

::: tip SEE ALSO
- Set per-content SEO in the [Editor](../content/editor).
- Fine-tune [Product SEO](../ecommerce/products) with GTIN, MPN, and brand fields.
- [GDPR & Privacy](../system/gdpr) — AI crawler blocking and `robots.txt` privacy settings.
:::