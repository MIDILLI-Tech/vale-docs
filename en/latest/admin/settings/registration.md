# Registration Settings

Control how users sign up, log in, and secure their accounts.

::: tip REGISTRATION TOGGLE
The **Enable user registration** global switch lives in **[Settings](./) → [General](./general) → [Features](./general#features)**. When disabled, registration is completely turned off and the settings below are hidden.
:::

## Default Role

- **Default role for new users**: Choose the role assigned to newly registered users (e.g., Subscriber).

## Registration Methods

- **Email registration**: Allow users to register with email and password.
  - **Send confirmation email**: When enabled, users must verify their email address before they can log in.
- **SSO registration**: Allow users to register using their social accounts.

### SSO Providers

For each provider, turn it on and enter the **Client ID** and **Client Secret**. Each provider also shows the **Callback URL** that you paste into the same provider screen.

::: tip THE LINK IS IN THE PANEL
Every provider row links straight to the page where you create the app, so there is no dashboard URL to look up here.
:::

| Provider | Credentials it needs |
|----------|---------------------|
| Google | OAuth 2.0 client ID and client secret |
| Facebook | App ID and App Secret |
| GitHub | OAuth App client ID and client secret |
| Steam | Uses OpenID, optional API key for fetching player name and avatar |

A "Configured" badge appears next to each provider when both credentials are saved.

## Login

- **Enable SSO login**: Show social login buttons on the sign-in page. Uses the SSO providers selected for registration.

## Captcha

Apply captcha protection to login and registration forms independently:

| Option | Description |
|--------|-------------|
| **None** | No captcha |
| **Math question** | Simple arithmetic, no API key needed |
| **hCaptcha** | Requires API keys in [Privacy & Security settings](./privacy) |
| **Google reCAPTCHA v3** | Requires API keys in Privacy & Security settings |
| **Cloudflare Turnstile** | Requires API keys in Privacy & Security settings |
| **Honeypot** | Hidden field, catches automated bots |

::: warning
If a captcha type requiring API keys is selected but not yet configured, a warning is shown. Configure keys in **Privacy & Security → Captcha API Keys**.
:::

## Two-Factor Authentication

- **Enable 2FA for all users**: When enabled, users can activate two-factor authentication from their profile using an authenticator app.
- **Force 2FA for all users**: Users must complete 2FA setup on first login before accessing their accounts. Only shown when 2FA is enabled.

See [Users & Roles](../users#two-factor-authentication-2fa) for the day-to-day workflow.

## Account

- **Allow email change**: When disabled, users cannot change their email address from their profile.

## Public Profiles

**Enable public profiles** turns author pages on site-wide. It is off by default.

With the switch on, every user gets a **Public bio** box and a **Public display name** field on their profile page. The display name replaces the account name in post bylines, comment author names and the author page; leave it empty to keep using the account name. Bios accept **bold**, *italic* and `[label](https://…)` links with a live preview, and are capped at 2,000 characters.

Author pages live at `/blog/author/<user id>`, where the blog segment follows your [blog routing setting](./content#blog). They are added to the XML sitemap with a schema.org `Person` block, and show the avatar, the bio and that author's published posts. Without a bio the page lists the posts only.

See [Users & Roles → Public author profiles](../users#public-author-profiles) for the day-to-day workflow.

## Profile Pictures

Users can upload a profile picture for themselves; it appears in the site header and account menu, next to their name on posts and comments, and on their author page.

| Setting | Description |
|---------|-------------|
| **Maximum avatar size (KB)** | Largest accepted JPEG or PNG file (default: 1,024 KB). Values below 64 or above 10,240 are clamped, and the server's upload limit always wins — the field shows that ceiling underneath. |
| **Avatar uploads per hour** | How many times one user may replace their picture per hour (default: 1; `0` means unlimited). |

Images are cropped to a square and re-encoded when they are stored, which strips camera metadata (including location). An administrator can also upload or remove a picture from the user edit screen.

See [Users & Roles → Profile Pictures](../users#profile-pictures) for the user-facing workflow.

::: tip SEE ALSO
- Configure captcha API keys in [Privacy & Security settings](./privacy).
- Manage user [Roles & Permissions](../users#roles-permissions).
- View the [Users](../users) list.
:::