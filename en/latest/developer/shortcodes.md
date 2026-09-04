# Shortcodes

Vale supports dynamic content injection using WordPress-style shortcodes. There are two families of shortcodes:

- **Square-bracket shortcodes** (for example `[form slug="…"]`) — processed at page render time by `ShortcodeProcessor` (`src/Infrastructure/Content/ShortcodeProcessor.php`) for site visitors.
- **Email placeholders** (for example `[unsubscribe_url]`) — processed only inside newsletter campaigns and automation emails by `NewsletterService::processShortcodes()` (and `AutomationService`), and are replaced with per-subscriber values before the email is sent.

Attributes use `key="value"` syntax. When square-bracket shortcodes are entered through the Tiptap editor they are stored as literal shortcode text and converted to visual blocks while editing.

## [form]

Embeds a form by slug.

- **Usage**: `[form slug="contact"]`
- If a form is disabled, hidden by settings, or missing, the shortcode renders nothing.

## [newsletter_form]

Embeds a newsletter sign-up form.

- **Usage**: `[newsletter_form placeholder="Your email address" button="Subscribe" privacy_page="privacy" tag="blog"]`
- Attributes (all optional):
  - `placeholder` — input placeholder text
  - `button` — submit button label
  - `privacy_page` — slug of a page to link in the required consent checkbox
  - `tag` — subscriber tag assigned on subscribe

## [toc]

Generates a Table of Contents from the page's `h1`–`h3` headings. If no headings exist, the shortcode is removed.

- **Usage**: `[toc]`
- **Attributes**: `max_level="N"` — include headings up to level `N` (1–3, default 3)

## [pages]

Lists the child pages of the current page (or a specified parent).

- **Usage**: `[pages]`
- **Attributes**:
  - `parent="slug"` — page slug to list children of (defaults to the current page)
  - `max_level="N"` — nesting depth (1–3, default 1)

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
  - `images` — comma-separated URLs (required). Local files and YouTube/Vimeo links are supported.
  - `autoplay` — `true`/`false` (default `true`)
  - `duration` — slide duration in ms (default `5000`)
  - `arrows` — `true`/`false` (default `true`)
  - `dots` — `true`/`false` (default `true`)
  - `pauseBtn` — `true`/`false` (default `false`)
  - `fit` — `cover`, `contain`, `fill`, `none` or `scale-down` (default `cover`)
  - `lightbox` — `true`/`false` (default `false`)
  - `bg` — slide background color (defaults to the active theme)
  - `height` — slide height, any CSS length (default `200px`)
  - `transition` — `fade`, `slide-left`, `slide-right`, `slide-up`, `zoom` or `none` (default `fade`)

## [product]

Embeds a product card.

- **Usage**: `[product id="42"]`
- Attributes:
  - `id` — product ID (required)
  - `show_image`, `show_price`, `show_description` — `true`/`false` (defaults `true`)
  - `name`, `price`, `image`, `desc`, `slug` — fallback values shown when the product is not found
  - `bg` — card background color
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
  - `layout` — `vertical` (buttons stacked) or `horizontal` (buttons in a row); default `vertical`
  - `gap` — spacing between buttons in px (default `12`)
- Each inner `[link_button]` accepts the same attributes as the standalone shortcode below. In **vertical** layout each button spans its own row and is aligned `left`/`center`/`right` across it; in **horizontal** layout the buttons are split into equal-width cells so each button aligns to its own side.

## [link_button]

Renders a styled link button. A standalone (legacy, ungrouped) `[link_button]` still renders for backward compatibility, but new saves always wrap buttons in `[link_button_group]`.

- **Usage**: `[link_button href="https://example.com" bgColor="#000000" textColor="#ffffff"]Button text[/link_button]`
- Attributes:
  - `href`, `target` — link target (default `_self`)
  - `bgColor`, `textColor` — button colors
  - `borderWidth`, `borderStyle`, `borderColor`, `borderRadius`, `padding` — button styling
  - `alignment` — `left`, `center` or `right` (default `center`)
  - `fullWidth` — `true`/`false`

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
  - `prefix` — uppercase letters/digits used at the start of the code (default `CAMP`)
  - `discount_percent` — percentage discount (sets `type=percent`)
  - `discount_fixed` — fixed cart discount (sets `type=fixed_cart`)
  - `max_uses` — total uses; defaults to `1` when `for-email` is supplied
  - `max_uses_per_email` — per-recipient usage limit
  - `expires_days` — number of days from send date until the code expires
  - `starts_at` — optional start date/time (`YYYY-MM-DDTHH:MM`); the coupon cannot be used before this moment
  - `for-email` — restricts the coupon to an email address (use `[email]` to bind it to the recipient); defaults `max_uses` to `1`
  - `only_users` — limits the coupon to logged-in users

### `[latest_posts …]`

Renders an HTML list of recent posts with inline CSS (dark-mode aware). Returns an empty string when no posts match.

- **Usage**: `[latest_posts count="5" category="news" tag="release" type="post" lang="en"]`
- Attributes:
  - `count` — number of posts to include (default `5`)
  - `category` — limit to a category slug
  - `tag` — limit to a tag slug (comma-separated for multiple tags)
  - `type` — content type to query (default `post`)
  - `lang` — language to filter by; defaults to the campaign's sending language

</div>
