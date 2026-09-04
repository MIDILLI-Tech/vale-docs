# Forms

Vale supports flexible forms for collecting visitor information, accepting submissions from your site or external websites, and connecting responses to your site's workflows.

## Form Builder

Build forms with a variety of field types:

- **Text** — Single-line text input
- **Textarea** — Multi-line text input
- **Email** — Email address input with validation. The field key is fixed to `email` (read-only) so submissions and integrations always use a consistent identifier.
- **Phone** — Telephone number input (`tel`)
- **Select** — Dropdown menu (one option from a list)
- **Checkbox** — Checkboxes (one or more options)
- **Radio** — Radio buttons (one option from a list)
- **Static Text** — Informational text displayed in the form (not a data field). Line breaks are supported.
- **Newsletter Subscribe** — A checkbox that subscribes the visitor to the newsletter. The label text appears next to the checkbox.

Each field has the following properties:

- **Label** — The visible label (for Static Text this is the content itself)
- **Name (key)** — The field identifier used in submissions (auto-generated from the label)
- **Required** — Whether the field must be filled before submission
- **Options** — Available for Select, Checkbox, and Radio. Enter one option per line.

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

Each form has the following settings in the sidebar:

| Option | Description |
|--------|-------------|
| **Active** | Enable or disable the form. Inactive forms reject submissions. |
| **Allow External Submissions** | Enable API access for embedding forms on other websites. |
| **Allowed Domains (CORS)** | One domain per line. Restricts which external sites may submit. Leave empty to allow all. |
| **Enable Honeypot** | Adds a hidden `_hp_name` field to catch spam bots. |
| **Allow Multiple Submissions** | When disabled, the same visitor (browser or email) can only submit this form once. |
| **Captcha** | Select the captcha type (see Spam Protection below). |
| **Notification Email** | Address that receives a notification on each new submission. |
| **Submit Button Label** | Custom text for the submit button (defaults to "Submit"). |
| **Success Message** | Message shown after a successful submission. |

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

1. Go to **Settings → E-commerce → Checkout**
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

## Submissions

All form data is saved in the database. You can view, export, or delete submissions from the **Forms → Submissions** panel.

## Spam Protection

Vale includes several captcha options that can be enabled per form:

| Type | Description |
|------|-------------|
| **None** | No captcha |
| **Honeypot (hidden field)** | Adds a hidden `_hp_name` field. Bots that fill it are silently rejected. |
| **Math question** | Generates a simple math problem for users to solve |
| **hCaptcha** | Uses hCaptcha (requires API key in Settings → Privacy) |
| **Google reCAPTCHA v3** | Uses reCAPTCHA v3 (requires API key in Settings → Privacy) |
| **Cloudflare Turnstile** | Uses Cloudflare Turnstile (requires API key in Settings → Privacy) |

> If you select a captcha that requires an API key, a warning will appear if the key is not configured in **Settings → Privacy & Security**.

## External Form Submissions

Forms can accept submissions from external websites or JavaScript applications via a JSON API endpoint. This must be enabled per-form: open the form editor and toggle **Allow External Submissions**.

### Endpoint

```
POST /api/form/{slug}
Content-Type: application/json
```

### Authentication (Optional)

Pass an API token with the `forms:submit` ability to bypass domain restrictions:

```
Authorization: Bearer YOUR_API_TOKEN
```

If no token is provided, the request is validated against the **Allowed Domains** list instead. If a token is provided but invalid or expired, the request is rejected with 401.

### Domain Restrictions

In the form editor, enter a list of allowed domains (e.g. `example.com`). Subdomains are automatically permitted. Vale validates the `Origin` or `Referer` header against this list. If the list is empty and no token is used, any origin is accepted.

### Request Body

Field values must be nested under a `fields` key:

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

```json
{ "success": true, "message": "Thank you! Your message has been sent." }
```

Errors return a non-2xx status with `{ "success": false, "message": "..." }`.

### Spam Protection

- **Honeypot**: Include `_hp_name` in the body with an empty value. A non-empty value silently discards the submission.
- **Required fields**: Defined per-field in the form editor. Missing required fields return a `422` error listing the missing field labels.

### JavaScript Embed Code

When **Allow External Submissions** is enabled, the form editor shows a ready-to-use AJAX embed code snippet. Click **Copy Code** to copy it, then paste it into any external website. The code:

- Submits the form via `fetch()` without page reload
- Displays success/error messages inline
- Includes the honeypot field if **Enable Honeypot** is active
