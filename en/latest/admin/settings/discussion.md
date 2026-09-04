# Discussion Settings

Control how visitors interact with your content through comments and captcha protection.

## Allow Comments

- **Allow comments on posts**: Site-wide toggle at the top of the tab. When enabled, visitors can comment on posts and custom content types. Individual posts can override this in their own settings.

## Comment System

Choose which comment platform to use under **[Settings](./) → Discussion → [Comment System](./discussion#comment-system)**. Four options are available:

| System | Type | Requirements |
|--------|------|-------------|
| **Local** | Built-in (default) | None |
| **Disqus** | Third-party hosted | Disqus Shortname |
| **Giscus** | GitHub Discussions | Public GitHub repo with Discussions enabled |
| **Facebook** | Facebook social plugin | Facebook App ID |

### Local

Vale's built-in comment system stores everything in your own database. Configure these options when Local is selected:

- **Users must be logged in to comment**: Only allow logged-in users to comment.
- **Hold comments for moderation**: New comments by guests must be manually approved before they appear. Logged-in users are auto-approved.
- **Enable comment replies**: Allow users to reply to comments, up to a configurable **Maximum reply depth** (1–10 levels, default 2). After 3 visual levels, replies flatten and show a "Replying to @name" label to keep the layout clean.
- **Allow users to edit/remove their own comments**: Let logged-in users edit and delete their own comments.
- **Comments per page**: Control how many comments are visible on a page (default 5).
- **Comment Captcha**: Select the captcha type for comment submissions — None, Math question, hCaptcha, Google reCAPTCHA v3, Cloudflare Turnstile, or Honeypot. API keys are configured in [Privacy & Security settings](./privacy).

### Disqus

Select **Disqus** and enter your **Disqus Shortname** (e.g., `mysite` for `mysite.disqus.com`). The Disqus embed script loads the comment thread using the page URL for mapping. You can access setup links directly from the settings panel.

### Giscus (GitHub)

Select **Giscus** and configure the following fields:

| Field | Description |
|---|---|
| **Repository** | Your public GitHub repo (e.g., `owner/repo`) |
| **Repo ID** | The repository's ID |
| **Category** | Discussion category name |
| **Category ID** | Discussion category ID |
| **Mapping** | How to associate pages with discussions: `pathname`, `url`, `title`, or `og:title` |
| **Theme** | Widget appearance: `light`, `dark`, or `preferred_color_scheme` (follows system) |

You can use the quick access link directly in the admin settings panel to retrieve your repository and category IDs.

### Facebook Comments

Select **Facebook** and enter your **Facebook App ID**. You can generate one from the provider's developer console using the quick access link in the settings panel. The Facebook Comments SDK loads and associates threads with the page URL.

::: tip NOTE
Star ratings and product reviews are configured under **[E-Commerce](./ecommerce) → [Product](./ecommerce#product)**.
:::

::: tip SEE ALSO
- Manage pending [Comments](../content/comments).
- Set per-content comment rules in the [Page Editor](../content/pages).
- Configure captcha API keys in [Privacy & Security settings](./privacy).
- Configure product reviews and star ratings in [E-Commerce → Product](./ecommerce#product).
:::
