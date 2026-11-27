# Checkout


## Guest Checkout

Allow customers to checkout without creating an account. When disabled, customers must log in before checking out.

## Buy Now Button

Display an additional **Buy Now** button on product pages, directly below the **Add to Cart** button. When clicked, the product is added to the cart and the customer is redirected straight to checkout (skipping the cart page). The button is only shown for in-stock products and follows the same variation/quantity rules as **Add to Cart**.

| Setting | Description |
|---------|-------------|
| **Enable "Buy Now" button** | Master toggle. Requires the Shop feature to be enabled. Default: off. |

## Checkout Form

Configure which billing fields are displayed and which are mandatory:

| Field | Display | Mandatory |
|-------|---------|-----------|
| **First Name** | ✓ | ✓ |
| **Last Name** | ✓ | ✓ |
| **Email** | ✓ | ✓ |
| **Phone** | ✓ | optional |
| **Country** | ✓ | ✓ |
| **Address** | ✓ | ✓ |
| **City** | ✓ | ✓ |
| **State / Region** | ✓ | optional |
| **Postcode** | ✓ | ✓ |
| **Order Notes** | ✓ | optional |

When a field is hidden (Display unchecked), the Mandatory checkbox is automatically disabled.

## Additional Form Fields

If the Form Builder is enabled, select an additional form to be appended at checkout. The form fields appear under "Additional Information" on the checkout page. See [Using Forms in Checkout](../../forms#using-forms-in-checkout) for setup steps and how checkout form submissions are handled.

## Abandoned Cart Recovery

Send reminder emails to customers who left items in their cart:

| Setting | Description |
|---------|-------------|
| **Enable abandoned cart emails** | Master toggle |
| **Delay (hours)** | Hours after cart is abandoned before sending first reminder (default: 2) |
| **Max reminders** | Maximum number of reminders to send (default: 3) |
| **Reminder interval (hours)** | Hours between subsequent reminders (default: 24) |

## Tax Display

Controls how tax appears in checkout and order summary views:

- **Show VAT included + breakdown**: Shows total with VAT and an itemized breakdown.
- **Show VAT included only**: Shows the total with VAT included, no breakdown.

