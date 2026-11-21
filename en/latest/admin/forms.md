# Forms

Vale supports flexible forms for collecting visitor information, accepting submissions from your site or external websites, and connecting responses to your site's workflows.

::: tip PERMISSION
Managing forms requires the **Manage Forms** permission, granted to Super Admin, Admin, and Editor by default. The form picker inside the block editor stays available to anyone who can edit content.
:::

## Form Builder

Build forms with a variety of field types:

- **Text**: Single-line text input
- **Textarea**: Multi-line text input
- **Email**: Email address input with validation.
- **Phone**: Telephone number input
- **Date**: Date picker input (stores the date the visitor picks)
- **Select**: Dropdown menu (one option from a list)
- **Checkbox**: Checkboxes (one or more options)
- **Radio**: Radio buttons (one option from a list)
- **Static Text**: Informational text displayed in the form (not a data field). Line breaks are supported.
- **Newsletter Subscribe**: A checkbox that subscribes the visitor to the newsletter. For subscriptions to work, the form must also include a **Required** Email field; visitors who leave it empty are not subscribed, so the builder shows a reminder when the Email field is present but optional.

Each field has the following properties:

- **Label**: The visible label (for Static Text this is the content itself)
- **Name (key)**: The field identifier used in submissions (auto-generated from the label)
- **Required**: Whether the field must be filled before submission
- **Placeholder**: Optional hint text shown inside empty Text, Email, Phone, and Textarea inputs
- **Options**: Available for Select, Checkbox, and Radio. Enter one option per line.
- **Option Titles**: Available for Select, Checkbox, and Radio. Optional tooltip text shown when a visitor hovers over an option. Enter one line per option, matched by position with the options above.
- **Conditions**: Available for every field type. Shows the field only when other answers match (see [Conditional Fields](#conditional-fields)).

### Reordering Fields

Fields can be reordered by:

- **Drag-and-drop**: Hold the `⠿` handle and drag to a new position
- **Arrow buttons**: Use `⇈` (top), `↑` (up), `↓` (down), `⇊` (bottom) to move a field step by step

### Multi-Column Layout

In the form builder, each field card has a **width selector** that controls how much horizontal space it occupies:

| Width | Columns |
|-------|---------|
| **100%** | Full width (default) |
| **50%** | Half width: place two fields side by side |
| **33%** | One third: place three fields per row |
| **25%** | One quarter: place four fields per row |

The builder uses responsive flex wrapping: fields automatically wrap to the next line when there isn't enough space, and a minimum width is enforced so cards never become too narrow to edit. This layout is preserved on the front-end render as well.

### Conditional Fields

Any field can be shown only when the visitor has already picked a specific answer somewhere else in the form. This keeps long forms short: ask "Company" or "Individual" first, then show the company name field only for companies.

Conditions are triggered by the fields that offer a fixed set of answers: **Select**, **Radio**, and **Checkbox**. Free-text fields (Text, Email, Phone, Textarea) and Static Text cannot be the trigger, but any field type can be the one that is shown or hidden.

#### Setup

1. Add the field that asks the question, with its options filled in (for example a Radio field "I am a…" with `Company` and `Individual`).
2. On the field you want to hide, tick **Show only when…** inside its card.
3. Pick the trigger field, the comparison, and the answer that reveals this field.
4. To depend on more than one answer, click **+ Add rule** and choose whether the field appears when **all** rules match or when **any** of them matches.

The available comparisons follow the trigger type:

| Trigger field | Comparisons |
|---------------|-------------|
| **Select**, **Radio** | is / is not, is empty / is not empty |
| **Checkbox** with options | includes / does not include, is empty / is not empty |
| **Checkbox** without options | is checked / is not checked |

`is empty` matches when the visitor has not answered the trigger at all, and `is not empty` matches any answer. Use them for optional follow-up questions that only make sense once a previous answer was (or was not) given.

#### How Conditional Fields Behave

- The field appears and disappears as soon as the trigger answer changes: no page reload, and no effect on the rest of the form.
- A hidden field is skipped entirely: if it is marked **Required**, it is not required while it is hidden, and its value is not stored with the submission or included in the notification email.
- Removing or renaming an option that a rule depends on removes the rule the next time you save the form. Deleting a trigger field leaves the affected rules with a **Source field no longer exists** warning in the builder.
- Conditions apply wherever the form is displayed: its standalone page, the shortcode embed, and the copy-paste embed code for external websites.
- In every display mode (standalone page, shortcode, embed code) the fields are hidden with JavaScript. If a visitor's browser blocks it, the conditional fields stay visible and a required conditional field has to be filled in before the form submits, but its answer is still discarded because the field is hidden by its conditions.
- The checkout form (**Settings → E-commerce → Checkout → Additional Form Fields**) always shows every field of the selected form; conditional rules are ignored there.

::: tip NOTE
Only the answers that are visible at the moment of submission are recorded, so submissions show exactly what the visitor provided.
:::

### Conditional Newsletter Tags

The **Newsletter Subscribe** field can tag subscribers by their answers, so one form sorts people without a separate sign-up form for each audience.

1. Add the **Newsletter Subscribe** field, and make sure the form has a **Required** Email field.
2. In the field's **Auto Tag** box, add the tags that every subscriber of this form should get.
3. Under **Assign tags when…**, click **+ Add rule**, then pick the trigger field, the comparison and the answer (for example: "I am a" is "Company").
4. Add the tags that rule should apply, and repeat for any further rules.

How it behaves:

- A subscriber gets the **Auto Tag** tags plus the tags of every rule that matches their answers.
- Rules use the same trigger fields and comparisons as [Conditional Fields](#conditional-fields).
- An answer that belongs to a hidden field counts as not given, so its rule does not apply.
- Visitors who are already subscribed keep their existing tags; the new ones are added to them and any tag automations that start on those tags are triggered.
- A rule left without tags is discarded when you save the form.

## Form Options

The form editor sidebar is laid out like the post/page editor. From top to bottom:

### Publish Now

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
- [Developer → Shortcodes](../developer/shortcodes): full `[form]` reference and all other supported shortcodes.
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
- All field types are supported: text, textarea, email, phone, date, select, checkbox, radio, static text, and newsletter subscribe
- The form is rendered inline, with no page reload or separate step
- Submissions are saved to **Forms → Submissions** so you can view them alongside other form data
- Field answers also appear on the order detail page in the admin panel

> Use this to collect any extra information you need at checkout without custom code: gift messages, delivery preferences, business details, and so on.

## Access Control

Forms support two levels of access restriction that control who can see and submit the form:

### Registered Users Only

When **Only Registered Users** is enabled, visitors who are not logged in see a sign-in prompt instead of the form. The prompt includes a **Sign In** button and, if user registration is enabled, a **Register** button.

Logged-in users can view and submit the form normally.

### Membership Tag Paywalls

When the [Membership](./ecommerce/memberships) module is active, you can select one or more **Required Membership Tags**. Visitors who do not hold an active membership with at least one of the required tags see a "members only" paywall with a link to the membership plans page.

Both restrictions can be combined: enabling **Only Registered Users** alongside membership tags means the visitor must be logged in *and* hold the required membership.

::: tip NOTE
Access control applies to both the standalone form URL and the shortcode embed. External API submissions also enforce these restrictions: unauthenticated requests are rejected if the form requires login, and requests without an active subscriber matching the required tags are rejected when membership tags are set.
:::

## Submissions

All form data is saved in the database. You can view, export, or delete submissions from the **Forms → Submissions** panel.

### Exporting Submissions

Use **Export CSV** or **Export JSON** at the top of the submissions screen. Both downloads follow the language tab you are viewing: **All Languages** exports every translation, while a single-language tab exports only that form.

- **CSV** contains one row per submission with the ID, form name and language, one column per form field, the submission date, IP address, user agent, and read state. The file is UTF-8 with a BOM, so spreadsheet apps open it with the correct encoding. Cells that begin with `=`, `+`, `-`, or `@` are prefixed with an apostrophe to prevent spreadsheet formula injection.
- **JSON** contains the form metadata, the field list, and an array of submissions. Each submission keeps its answers under `data`, keyed by field name, so the export can be consumed by scripts.
- Only fields that still exist in the form are exported; answers for deleted or renamed fields are left out. Static Text fields are not data and have no column.
- Exports include personal data such as IP addresses and user agents. Store and share the files according to your privacy policy.

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

> A token does **not** grant submission when **Allow External Submissions** is disabled; that toggle is always enforced first.

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
- [Developer → REST API](../developer/api): API tokens, abilities and the full `/api/v1` endpoint reference.
:::
