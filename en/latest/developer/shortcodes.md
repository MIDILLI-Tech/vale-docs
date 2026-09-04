# Shortcodes

Vale supports dynamic content injection using WordPress-style shortcodes. There are two families of shortcodes:

- **Square-bracket shortcodes** (for example `[form slug="…"]`): processed at page render time by `ShortcodeProcessor` (`src/Infrastructure/Content/ShortcodeProcessor.php`) for site visitors.
- **Email placeholders** (for example `[unsubscribe_url]`): processed only inside newsletter campaigns and automation emails by `NewsletterService::processShortcodes()` (and `AutomationService`), and are replaced with per-subscriber values before the email is sent.

Attributes use `key="value"` syntax. When square-bracket shortcodes are entered through the Tiptap editor they are stored as literal shortcode text and converted to visual blocks while editing.

## [form]

Embeds a form by slug.

- **Usage**: `[form slug="contact"]`
- If a form is disabled, hidden by settings, or missing, the shortcode renders nothing.

## [newsletter_form]

Embeds a newsletter sign-up form.

- **Usage**: `[newsletter_form placeholder="Your email address" button="Subscribe" privacy_page="privacy" tag="blog"]`
- Attributes (all optional):
  - `placeholder`: input placeholder text
  - `button`: submit button label
  - `privacy_page`: slug of a page to link in the required consent checkbox
  - `tag`: subscriber tag assigned on subscribe

## [toc]

Generates a Table of Contents from the page's `h1` to `h3` headings. If no headings exist, the shortcode is removed.

- **Usage**: `[toc]`
- **Attributes**: `max_level="N"` includes headings up to level `N` (1 to 3, default 3)

## [pages]

Lists the child pages of the current page (or a specified parent).

- **Usage**: `[pages]`
- **Attributes**:
  - `parent="slug"`: page slug to list children of (defaults to the current page)
  - `max_level="N"`: nesting depth (1 to 3, default 1)

## [field]

Renders a custom meta field value from the current post.

- **Usage**: `[field name="isbn"]`
- If the value is a positive integer, it is resolved as a media library item and rendered as an image.
- Bare meta-field placeholders in the form `{{ fieldname }}` are also replaced on custom content types (only for fields that exist on the current post; unknown placeholders are left untouched).

## [ad]

Renders the advertisement code configured in the Advertising settings.

- **Usage**: `[ad]`
- Renders nothing when advertising is disabled or no code is configured.

## [carousel]

Renders an image/video carousel.

- **Usage**: `[carousel images="/uploads/a.jpg,/uploads/b.mp4"]`
- Attributes (all optional unless noted):
  - `images`: comma-separated URLs (required). Local files and YouTube/Vimeo links are supported.
  - `autoplay`: `true`/`false` (default `true`)
  - `duration`: slide duration in ms (default `5000`)
  - `arrows`: `true`/`false` (default `true`)
  - `dots`: `true`/`false` (default `true`)
  - `pauseBtn`: `true`/`false` (default `false`)
  - `fit`: `cover`, `contain`, `fill`, `none` or `scale-down` (default `cover`)
  - `lightbox`: `true`/`false` (default `false`)
  - `bg`: slide background color (defaults to the active theme)
  - `height`: slide height, any CSS length (default `200px`)
  - `transition`: `fade`, `slide-left`, `slide-right`, `slide-up`, `zoom` or `none` (default `fade`)

## [product]

Embeds a product card.

- **Usage**: `[product id="42"]`
- Attributes:
  - `id`: product ID (required)
  - `show_image`, `show_price`, `show_description`: `true`/`false` (defaults `true`)
  - `name`, `price`, `image`, `desc`, `slug`: fallback values shown when the product is not found
  - `bg`: card background color
- If the current post has a language, the product translation for that language is used when available.

## [link_button_group]

Renders a group of styled link buttons. New buttons are always saved by the editor in this grouped form.

- **Usage**:
  ```
  [link_button_group layout="horizontal" gap="12"]
  [link_button href="https://example.com" alignment="center"]Button one[/link_button]
  [link_button href="https://example.org/page" alignment="right"]Button two[/link_button]
  [/link_button_group]
  ```
- Group attributes:
  - `layout`: `vertical` (buttons stacked) or `horizontal` (buttons in a row); default `vertical`
  - `gap`: spacing between buttons in px (default `12`)
- Each inner `[link_button]` accepts the same attributes as the standalone shortcode below. In **vertical** layout each button spans its own row and is aligned `left`/`center`/`right` across it; in **horizontal** layout the buttons are split into equal-width cells so each button aligns to its own side.

## [link_button]

Renders a styled link button. A standalone (legacy, ungrouped) `[link_button]` still renders for backward compatibility, but new saves always wrap buttons in `[link_button_group]`.
- **Usage**: `[link_button href="https://example.com" bgColor="#000000" textColor="#ffffff"]Button text[/link_button]`
- Attributes:
  - `href`, `target`: link target (default `_self`)
  - `bgColor`, `textColor`: button colors
  - `borderWidth`, `borderStyle`, `borderColor`, `borderRadius`, `padding`: button styling
  - `alignment`: `left`, `center` or `right` (default `center`)
  - `fullWidth`: `true`/`false`

## [embed]

Renders a WordPress-style external video embed as a responsive 16:9 player. This is how `[embed]URL[/embed]` shortcodes arriving via the WordPress importer are displayed.

- **Usage**: `[embed]https://www.youtube.com/watch?v=dQw4w9WgXcQ[/embed]`
- YouTube (`youtube.com/watch`, `youtu.be`) and Vimeo URLs render an iframe player; any other URL renders a plain link so nothing is lost.
- The block editor converts `[embed]` into a video block on load (and stores raw iframe HTML on save).
- Embedded players require their hosts in the `frame-src` CSP directive (`SecurityHeadersMiddleware` allowlists YouTube and Vimeo alongside Stripe).

## [card_group]

Renders a responsive grid of image cards. Cards have a fixed base width (~260px) and wrap below it, so the grid collapses to a single column on mobile without extra CSS. Every row, including a partially filled last row, is centered, and all cards share one width.

- **Usage**:
  ```
  [card_group gap="12" radius="12px" align="center" width="50%" halign="center" lightbox="true"]
  [card_item image="https://example.com/media/plan.jpg" link="https://example.com/pricing" target="_self" bg="#ffffff"][card_title]Plan[/card_title][card_desc]See <strong>details</strong>[/card_desc][/card_item]
  [card_item image="" link="" target="_self" bg=""][card_title]Free[/card_title][card_desc]No cost[/card_desc][/card_item]
  [/card_group]
  ```
- Group attributes:
  - `gap`: spacing between cards in px (default `12`)
  - `bg`: default card background color (hex, default transparent)
  - `radius`: corner rounding, one of `0`, `4px`, `8px`, `12px` (default), `16px`, `24px`
  - `align`: title and description alignment, one of `left`, `center` (default), `right`
  - `halign`: grid position when `width` is narrower than full width: `left`, `center` (default), `right`
  - `width`: grid width in percent, in pixels, or `auto` for full width (default)
  - `lightbox`: `true` renders card images clickable into the shared lightbox overlay (default off)
- Each inner `[card_item]` accepts `image` (image **or** video URL), `link`, `target` (`_self`/`_blank`), `bg` (per-card background override, falls back to the group `bg`), `fit` (`cover` default or `contain`, applies to both images and videos), and `autoplay` (`true`/`false`, only meaningful for videos). The `[card_title]` / `[card_desc]` inner blocks accept inline markup (`strong`, `em`, links). Media render in fixed 16:9 boxes; cards without media reserve the same invisible space so titles stay aligned when sibling cards have media - when no card in the group has media the empty slots are omitted entirely, and descriptions are pinned to the card bottom. Invalid colors, URLs, and sizes fall back to safe defaults; fully empty cards are skipped. Direct video files render as `<video>` (with controls, or autoplay when `autoplay="true"`); YouTube/Vimeo URLs render as an embedded player.

## [hero]

Renders a marketing hero section in two variants: `split` (text beside media) or `cta` (centered card, no media column). The editor stores it as `[hero …][hero_heading]…[/hero_heading][hero_subtitle]…[/hero_subtitle][/hero]`; the inner blocks accept inline markup and per-block text alignment.

- **Usage**:
  ```
  [hero variant="split" bg="" shadow="lg" shadowColor="#1d4ed8" radius="12px" width="auto" image="/uploads/hero.jpg" mediaSide="right" badge="Since 2024" button1Text="Get started" button1Url="/pricing"][hero_heading]Welcome[/hero_heading][hero_subtitle]Short supporting text[/hero_subtitle][/hero]
  ```
- Attributes (all optional):
  - `variant`: `split` (default) or `cta`
  - `bg`: section background. Empty for the theme-tinted gradient (default), a hex color, or legacy `white` / `gray` / `dark`
  - `shadow`: `none`, `sm`, `md`, `lg`, `xl`; empty renders a soft default shadow. Applied to the `<section>` (plus the media box in `split`, the card in `cta`)
  - `shadowColor`: hex shadow tint (default black)
  - `radius`: corner rounding in px (default `12px`)
  - `width`: section width in percent, in pixels, or `auto` for full width (default); constrains the inner row/card
  - `image`, `imageAlt` - media URL (image or video) and alt text (alt falls back to the plain-text heading)
  - `imageFit` - single-image fit: `cover` (default), `contain`, `fill`, `none` or `scale-down`. Non-cover fits render on a transparent media box so the section background shows through the letterbox area. Also applies to single videos.
  - `mediaAutoplay` - `true` autoplays a single video (muted, required by browsers); default off (shows controls). Only meaningful when `image` is a video URL.
  - `mediaType`: `image` (default) or `carousel`
  - `carouselImages`: comma-separated URLs; `carouselAutoplay` (`true` default), `carouselDuration` (ms, default `5000`), `carouselShowArrows` / `carouselShowDots` (default `true`), `carouselPauseBtn` (default off), `carouselFit` (`cover` default), `carouselHeight` (default `100%`), `carouselTransition` (`fade` default), `carouselBg` (hex)
  - `lightbox`: `true` makes the image open enlarged in the shared lightbox overlay (default off)
  - `mediaSide`: `right` (default) or `left`
  - `badge`: corner badge text on the media box (`split` only)
  - `badgeBg`, `badgeTextColor`: hex badge background / text colors (defaults: theme primary / white)
  - `button1Text`, `button1Url`, `button1Target` (`_self`/`_blank`), `button1Style` (`primary`/`secondary`), `button1Color`, `button1TextColor`: primary button; empty label renders nothing
  - `button2Text`, `button2Url`, `button2Target`, `button2Style`, `button2Color`, `button2TextColor`: secondary button (same rules)
  - `headingAlign`, `subtitleAlign`: `left`, `center` or `right` text alignment for the inner blocks
- Rendered with theme CSS variables (`var(--theme-*)`) and inline styles so output matches all themes. The split row is a wrapping flex row (base width ~300px per column, `32px` gap): side by side on desktop, stacked on mobile. A hero with no heading, subtitle, buttons, media, or badge renders nothing.

## [redirect]

Renders a timed redirect notice and navigates the visitor to another URL after a delay.

- **Usage**: `[redirect url="https://example.com" seconds="5"]`
- Attributes:
  - `url`: the redirect target. It can be a full `http(s)` URL, a site path (`/pricing`), or a bare page slug from the page picker (treated as a site path). Empty or dangerous schemes (`javascript:`, `data:`, …) render nothing.
  - `internal_type` / `internal_id`: entity reference stored by the editor's internal-link picker (e.g. `internal_type="page" internal_id="15"`). When present the URL is resolved live at render time, so slug or prefix changes propagate automatically; a deleted or unpublished target omits the redirect entirely.
  - `seconds`: delay before redirecting, `0` to `300` (default `5`). `0` issues an immediate server-side HTTP 302 redirect instead of rendering the page.
- With a delay, the page shows a notice with a live countdown and a manual link, then navigates via `window.location.replace()`. A `<noscript>` meta-refresh fallback covers visitors without JavaScript. When several `[redirect]` blocks are on one page, only the first drives the navigation; the rest render as informational boxes with a manual link.
- In the block editor this is the **Redirect** block (`/redirect`): a settings modal takes the target URL (external tab, or internal tab searching posts, pages, products, custom content types and static links) and the delay (presets `Instant (302 Redirect) / 3 / 5 / 10 / 30 s` plus a custom `0` to `300` s field).

## HTML Comment Markers

These are stored as HTML comments and processed like shortcodes.

### <!--spacer-->

Inserts an invisible vertical spacer.

- **Usage**: `<!--spacer size="50" unit="px"-->`

### <!--more-->

Defines the "read more" cutoff used in blog listings and the excerpt. The editor's More block saves as `<!--more-->`.

- **Usage**: `<!--more-->`

<div v-pre>

## Email / Newsletter Placeholders

These `[ … ]` placeholders are processed only by `NewsletterService::processShortcodes()` and `AutomationService` when sending a campaign or automation step. They are replaced with per-subscriber values; if the recipient is unknown they fall back to a sensible default.

### `[unsubscribe_url]`

Personal unsubscribe URL for the recipient.

- **Usage**: `[unsubscribe_url]`

### `[open_pixel]`

Tracking pixel HTML (`<img src="…" width="1" height="1" alt="">`). Empty string when open tracking is disabled for the campaign.

- **Usage**: `[open_pixel]`

### `[email]`

Recipient's email address (HTML-escaped).

- **Usage**: `[email]`

### `[subscriber_name]`

Recipient's name, or a fallback string when the subscriber has no name.

- **Usage**: `[subscriber_name]` or `[subscriber_name|Valued Customer]`
- Default fallback when none is supplied: `Valued Customer`.

### `[generate_coupon …]`

Generates a unique coupon code for the recipient and inserts it into the email. The coupon is saved to the database before the email is sent.

- **Usage**: `[generate_coupon prefix="WELCOME" discount_percent="15" max_uses_per_email="1" expires_days="14" for-email="[email]"]`
- Attributes:
  - `prefix`: uppercase letters/digits used at the start of the code (default `CAMP`)
  - `discount_percent`: percentage discount (sets `type=percent`)
  - `discount_fixed`: fixed cart discount (sets `type=fixed_cart`)
  - `max_uses`: total uses; defaults to `1` when `for-email` is supplied
  - `max_uses_per_email`: per-recipient usage limit
  - `expires_days`: number of days from send date until the code expires
  - `starts_at`: optional start date/time (`YYYY-MM-DDTHH:MM`); the coupon cannot be used before this moment
  - `for-email`: restricts the coupon to an email address (use `[email]` to bind it to the recipient); defaults `max_uses` to `1`
  - `only_users`: limits the coupon to logged-in users

### `[latest_posts …]`

Renders an HTML list of recent posts with inline CSS (dark-mode aware). Returns an empty string when no posts match.

- **Usage**: `[latest_posts count="5" category="news" tag="release" type="post" lang="en"]`
- Attributes:
  - `count`: number of posts to include (default `5`)
  - `category`: limit to a category slug
  - `tag`: limit to a tag slug (comma-separated for multiple tags)
  - `type`: content type to query (default `post`)
  - `lang`: language to filter by; defaults to the campaign's sending language

</div>
