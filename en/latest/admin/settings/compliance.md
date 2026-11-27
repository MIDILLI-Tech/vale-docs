# Legal & Compliance

The **Legal & Compliance** tab collects the legal checklist, the policy pages and the consumer-rights features of your store. It is a top-level Settings tab, separate from E-Commerce, so it stays one click away whether or not the shop is enabled.

::: warning NOT LEGAL ADVICE
The profile reports what is commonly expected where you operate and whether a page or setting is configured. It never states that your store is legally compliant. Confirm your documents and processes with a qualified adviser.
:::

## Country profile

Open **Settings → Legal & Compliance** and choose the **Country of operation**. Vale resolves it to a region and lists the documents and settings that region commonly expects, each marked **Required** or **Recommended**.

| Suggested region | Suggested banner | Typical requirements |
|------------------|------------------|----------------------|
| European Union / EEA | Opt-in | Privacy policy and withdrawal required; consent, 30-day price and verified reviews expected |
| Germany / Austria | Opt-in | Imprint, privacy policy, terms and withdrawal required |
| United Kingdom | Opt-in | Privacy policy and withdrawal required |
| United States | Opt-out | Do Not Sell or Share control required |
| Canada | Opt-in | Privacy policy and consent banner required |
| Australia / New Zealand | Opt-in | Privacy policy and consent banner required |
| No specific profile | Opt-in | Generic recommendations |

Each row shows a status:

| Status | Meaning |
|--------|---------|
| **Configured** | The page or setting that satisfies the item is in place |
| **Partial** | Something is on but incomplete, for example only the simple cookie notice instead of the full banner |
| **Missing** | Nothing is configured for this item yet |
| **Not in Vale yet** | The item has no corresponding Vale module |
| **Handled outside Vale** | You recorded that the item is handled elsewhere |

**I handled this myself** stores the date you acknowledged the item and removes it from the dashboard advisories. It does not mark the document as configured; unticking the box removes the record.

**Use this banner model** turns the cookie consent banner on and sets the US opt-out control to match the suggested region — on for opt-out regions, off otherwise.

When E-Commerce is disabled, the shop-related rows (return policy, withdrawal, digital withdrawal waiver, lowest price, verified reviews, warranty) are hidden and are not reported as open items. They come back automatically when the shop is enabled.

## Open items

The panel shows an **Open items for this profile** box under the checklist, and the dashboard keeps a matching advisory list. Every entry links to the screen that fixes it: a missing policy page, the consent banner switched off, third-party captcha loading before consent, advertising or unclassified scripts loading before consent, or the US opt-out left off. Items marked **I handled this myself** are skipped.

## Policy pages

Pick the pages that hold your documents. Privacy, terms and returns are linked from the checkout and from order confirmation emails; the imprint is linked from the site footer.

| Setting | Document |
|---------|----------|
| **Privacy Policy Page** | Privacy policy |
| **Terms & Conditions Page** | Terms and conditions |
| **Imprint Page** | Legal notice with business name, address, contact and registration details |
| **Return Policy Page** | Return and refund policy (shop only) |

Click **Create a new page →** to open the page editor in a new tab.

### Footer menu

Under **Legal Pages**, the **Footer menu** card reports whether a footer menu exists and whether it has a Legal column. **Add Legal section** adds the Legal column with the selected policy pages; **Create footer menu** creates the menu first. If no footer menu exists, the policy pages are printed as a plain row in the footer instead.

## Online withdrawal

Enable **Online withdrawal function** to publish a withdrawal page for customers. This requires E-Commerce to be enabled.

- The public page is linked from the checkout (**Right of withdrawal**) and from order confirmation emails; the panel's **Open the withdrawal page** link opens it directly.
- A customer enters the order number and email address from the order confirmation, optionally a name, the items concerned and a reason, and confirms the declaration.
- When the email matches the order's billing address, the declaration is linked to the order automatically. A declaration with an unmatched email is still recorded, without the order link.
- The customer receives a confirmation email with a unique reference; the shop receives a notification with a link to the declaration.
- Declarations are listed under **Orders → Withdrawals** and can be searched by reference, order, name or email. Statuses: **Pending**, **Accepted**, **Rejected**, **Completed**. Open a declaration to change its status and keep an internal note.
- **Who pays the return shipping?** is shown on the checkout and withdrawal pages. EU consumer law requires telling customers before they order who pays for returning the goods.

### Digital withdrawal waiver

When **Digital withdrawal waiver** is on, a **Digital withdrawal waiver** switch appears in the product editor for digital content. At checkout, an order containing such a product requires the customer to agree that the download starts immediately and that the withdrawal right ends with it. The period shown comes from **E-Commerce → Product → Cancellation & Refund Settings**.

## Warranty and guarantee

**Warranty & guarantee** is a free-text field in the same panel. Its content is printed at the checkout, in the **Additional Information** block under the billing fields, and the checklist row turns **Configured** as soon as the field has text.

State how long the statutory liability for defects lasts in your jurisdiction and what a voluntary guarantee covers, including who provides it and for how long. Consumer law in the EU and the UK expects the customer to see this before ordering, which is why the row is marked **Recommended** in every region rather than required: the statutory warranty exists whether or not the store describes it.

::: tip
Keep it short and factual. A guarantee that promises more than the law requires becomes a contractual promise you have to honour.
:::

## Price transparency

| Setting | What it does |
|---------|--------------|
| **Unit price** | Shows the price per kg, litre or square metre below the product price, calculated from the content amount and unit. Products sold by the piece never show it. |
| **Lowest price in the last 30 days** | Records price changes and shows the lowest price of the previous 30 days while a product is on sale (EU Omnibus). |

Both are product-level settings: enter the content amount and choose a unit in the product editor's compliance section. Variation-specific values can be set per variation.

## Product safety and traceability

The compliance section of the product editor holds the information product-safety rules ask for:

| Field | Purpose |
|-------|---------|
| **Manufacturer** and **Manufacturer Address** | Who made the product |
| **EU Responsible Person** and **EU Responsible Address** | Who is responsible inside the EU |
| **Country of Origin** | Two-letter country code |
| **Safety Warnings** | Warnings shown with the product |
| **Product Documents** | Manuals and instructions, either from the media library or external URLs; each entry can carry its own name |
| **Minimum age** | `16+` or `18+`, or no restriction |
| **Batch number** | Optional lot identifier |

Products sold by weight or volume also take a content amount and unit for the unit price.

These values appear on the product page's **Additional information** tab. Products without any of them do not show the tab.

### Age-restricted products

- The product page shows an age gate. Once confirmed, that browser remembers the answer for that age limit.
- The cart warns that the order contains age-restricted items.
- Checkout requires a confirmation checkbox before the order can be placed.
- The confirmation timestamp is stored on the order and appears in the order confirmation email, the invoice and the admin order screen.

### Batch numbers

A batch number is copied to each order item when the order is placed, so the lot stays visible in **Orders** even if the product is edited later. On a variable product, each variation can carry its own batch number; leave the variation field empty to inherit the product's lot. The batch number is shown on the product page and on the admin order screen.

## Verified reviews

**E-Commerce → Product → Reviews → Only allow verified buyers to review** restricts reviews to customers who bought the product and states this on the review form. The EU Omnibus, the UK Digital Markets, Competition and Consumers Act and the US FTC review rule expect verified reviews with a clear disclosure.

## US privacy opt-out

**Settings → Privacy & Security → Cookie Consent → US Privacy Opt-Out** adds a **Do Not Sell or Share** action to the consent banner and honours Global Privacy Control signals. The country profile marks it as required for the United States and recommended for Canada. The full banner workflow is on [Cookie Consent](./consent).

::: tip SEE ALSO
- [E-Commerce](./ecommerce/) for refunds, the refund period and review settings.
- [Privacy & Security](./privacy) for IP handling, captcha and GDPR options.
- [Cookie Consent](./consent) for categories, banner text and the consent log.
- [Products](../ecommerce/products) for the full product editor.
- [Orders](../ecommerce/orders) for withdrawal declarations and order details.
:::
