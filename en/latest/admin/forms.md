# Forms

Vale supports flexible forms for collecting visitor information, accepting submissions from your site or external websites, and connecting responses to your site's workflows.

::: tip PERMISSION
Managing forms requires the **Manage Forms** permission — granted to Super Admin, Admin, and Editor by default. The form picker inside the block editor stays available to anyone who can edit content.
:::

## Form Builder

Build forms with a variety of field types:

- **Text** — Single-line text input
- **Textarea** — Multi-line text input
- **Email** — Email address input with validation.
- **Phone** — Telephone number input
- **Select** — Dropdown menu (one option from a list)
- **Checkbox** — Checkboxes (one or more options)
- **Radio** — Radio buttons (one option from a list)
- **Static Text** — Informational text displayed in the form (not a data field). Line breaks are supported.
- **Newsletter Subscribe** — A checkbox that subscribes the visitor to the newsletter. For subscriptions to work, the form must also include a **Required** Email field — visitors who leave it empty are not subscribed, so the builder shows a reminder when the Email field is present but optional.

Each field has the following properties:

- **Label** — The visible label (for Static Text this is the content itself)
- **Name (key)** — The field identifier used in submissions (auto-generated from the label)
- **Required** — Whether the field must be filled before submission
- **Placeholder** — Optional hint text shown inside empty Text, Email, Phone, and Textarea inputs
- **Options** — Available for Select, Checkbox, and Radio. Enter one option per line.
- **Option Titles** — Available for Select, Checkbox, and Radio. Optional tooltip text shown when a visitor hovers over an option. Enter one line per option, matched by position with the options above.

### Reordering Fields

Fields can be reordered by:

- **Drag-and-drop** — Hold the `⠿` handle and drag to a new position
- **Arrow buttons** — Use `⇈` (top), `↑` (up), `↓` (down), `⇊` (bottom) to move a field step by step

### Multi-Column Layout

In the form builder, each field card has a **width selector** that controls how much horizontal space it occupies:

| Width | Columns |
|-------|---------|
| **100%** | Full width (default) |
| **50%** | Half width — place two fields side by side |
| **33%** | One third — place three fields per row |
| **25%** | One quarter — place four fields per row |

The builder uses responsive flex wrapping: fields automatically wrap to the next line when there isn't enough space, and a minimum width is enforced so cards never become too narrow to edit. This layout is preserved on the front-end render as well.

## Form Options

The form editor sidebar is laid out like the post/page editor. From top to bottom:

### Publish

| Option | Description |
|--------|-------------|
| **Active** | Enable or disable the form. Inactive forms reject submissions. |

### Options

| Option | Description |
|--------|-------------|
| **Allow External Submissions** | Enable API access for embedding forms on other websites. |
| **Allowed Domains (CORS)** | One domain per line. Restricts which external sites may submit. Leave empty to allow all. |
| **Enable Honeypot** | Adds a hidden field to catch spam bots. |
| **Honeypot Field Name** | The name of the hidden honeypot field. Pick something natural-looking, e.g. `website`, so bots are more likely to fill it. |
| **Allow Multiple Submissions** | When disabled, the same visitor (browser or email) can only submit this form once. |
| **Captcha** | Select the captcha type (see Spam Protection below). |
| **Notification Email** | Address that receives a notification on each new submission. |
| **Submit Button Label** | Custom text for the submit button (defaults to "Submit"). |
| **Success Message** | Message shown after a successful submission. |

### Access

| Option | Description |
|--------|-------------|
| **Only Registered Users** | Require visitors to be logged in to view and submit this form. |
| **Required Membership Tags** | Require specific membership tags to access the form. Only shown when the Membership module is enabled. |

## Embedding Forms

### Shortcode

Embed the form in any page or post using the shortcode:

```text
[form slug="contact-us"]
```

::: tip SEE ALSO
- [Developer → Shortcodes](../developer/shortcodes) — full `[form]` reference and all other supported shortcodes.
:::

### Standalone URL

Every form has a standalone public URL:

```
/form/{slug}
```

Use this to share a direct link to the form or test it without embedding.

## Using Forms in Checkout

Forms can be attached to the shop checkout to collect additional information from customers during purchase.

### Setup

1. Go to **[Settings](./settings/) → [E-commerce](./settings/ecommerce) → [Checkout](./settings/ecommerce#checkout)**
2. Under **Additional Form Fields**, select a form from the dropdown
3. Save the settings

The selected form's fields will appear under an **Additional Information** section at the end of the checkout page. Customers can fill in the extra fields (e.g. special delivery instructions, gift options, custom attributes) before completing their order.

### How It Works

- Only active forms appear in the dropdown
- All field types are supported: text, textarea, email, phone, select, checkbox, radio, static text, and newsletter subscribe
- The form is rendered inline — no page reload or separate step
- Submissions are saved to **Forms → Submissions** so you can view them alongside other form data
- Field answers also appear on the order detail page in the admin panel

> Use this to collect any extra information you need at checkout without custom code — gift messages, delivery preferences, business details, etc.

## Access Control

Forms support two levels of access restriction that control who can see and submit the form:

### Registered Users Only

When **Only Registered Users** is enabled, visitors who are not logged in see a sign-in prompt instead of the form. The prompt includes a **Sign In** button and, if user registration is enabled, a **Register** button.

Logged-in users can view and submit the form normally.

### Membership Tag Paywalls

When the [Membership](./ecommerce/memberships) module is active, you can select one or more **Required Membership Tags**. Visitors who do not hold an active membership with at least one of the required tags see a "members only" paywall with a link to the membership plans page.

Both restrictions can be combined: enabling **Only Registered Users** alongside membership tags means the visitor must be logged in *and* hold the required membership.

::: tip NOTE
Access control applies to both the standalone form URL and the shortcode embed. External API submissions also enforce these restrictions — unauthenticated requests are rejected if the form requires login, and requests without an active subscriber matching the required tags are rejected when membership tags are set.
:::

## Submissions

All form data is saved in the database. You can view, export, or delete submissions from the **Forms → Submissions** panel.

## Spam Protection

Vale includes several captcha options that can be enabled per form:

| Type | Description |
|------|-------------|
| **None** | No captcha |
| **Honeypot (hidden field)** | Adds a hidden field to catch spam bots. Bots that fill it are silently rejected. |
| **Math question** | Generates a simple math problem for users to solve |
| **hCaptcha** | Uses hCaptcha (requires API key in [Settings](./settings/) → [Privacy](./settings/privacy)) |
| **Google reCAPTCHA v3** | Uses reCAPTCHA v3 (requires API key in [Settings](./settings/) → [Privacy](./settings/privacy)) |
| **Cloudflare Turnstile** | Uses Cloudflare Turnstile (requires API key in [Settings](./settings/) → [Privacy](./settings/privacy)) |

> If you select a captcha that requires an API key, a warning will appear if the key is not configured in **[Settings](./settings/) → [Privacy & Security](./settings/privacy#captcha-api-keys)**.

## External Form Submissions

Forms can accept submissions from external websites or JavaScript applications via a JSON API endpoint. This must be enabled per-form: open the form editor and toggle **Allow External Submissions**.

### Endpoint

```
POST /api/form/{slug}
Content-Type: application/json
```

### Authentication (Optional)

Pass an API token with the `submit:forms` ability to bypass the domain restriction and the registered-user/membership-tag checks. If no token is provided, the request is validated against the **Allowed Domains** list instead.

> A token does **not** grant submission when **Allow External Submissions** is disabled — that toggle is always enforced first.

### Domain Restrictions

In the form editor, enter a list of allowed domains (e.g. `example.com`). Subdomains are automatically permitted. If the list is empty and no token is used, any origin is accepted.

### Request Body

Field values must be nested under a `fields` key (see the developer API reference for the exact shape). Form-encoded bodies are also supported.

```json
{
  "fields": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "message": "Hello!"
  }
}
```

Form-encoded bodies are also supported with the same `fields[name]` nesting.

### Response

Successful submissions return a success message; errors return a failure message.

### Spam Protection

- **Honeypot**: Include the form's configured honeypot field in the body with an empty value. A non-empty value silently discards the submission.
- **Required fields**: Defined per-field in the form editor. Missing required fields return an error listing the missing field labels.

### JavaScript Embed Code

When **Allow External Submissions** is enabled, the form editor shows a ready-to-use embed code snippet. Click **Copy Code** to copy it, then paste it into any external website. The code submits without page reload and displays success/error messages inline.

::: tip SEE ALSO
- [Developer → REST API](../developer/api) — API tokens, abilities and the full `/api/v1` endpoint reference.
:::
