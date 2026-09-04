# Customer Account

Vale provides a front-end customer account area where shoppers can manage their profile, addresses, orders, and subscriptions without needing access to the admin panel.

## Accessing the Account Area

Customers access their account at `/account` after logging in. If they do not have an account, they can register at `/register`.

## Account Sections

### Profile
- Update display name and email address
- Change password
- Connect or disconnect SSO providers (GitHub, Google, Facebook, Steam, Twitter/X)

### Addresses
- Add, edit, and delete saved billing and shipping addresses
- Set a default billing address and a default shipping address used to pre-fill checkout

### Orders
- View full order history with status, items, and totals
- Download PDF invoices for completed orders
- Request a refund on eligible orders
- Download purchased digital files (subject to download limits and expiry)

### Subscriptions
- View active membership plans with next billing date and status
- Cancel a subscription (access is maintained until the end of the current billing period)
- View past subscription invoices

### Account Deletion (GDPR)
Customers can permanently delete their account from the **Profile** page. The deletion process:
1. Anonymises all personal data (name, email, address)
2. Preserves order records for financial compliance
3. Removes all active subscriptions

See [GDPR & Privacy](../system/gdpr) for more detail.

## SSO Login

SSO providers let customers register and log in with an existing account (GitHub, Google, Facebook, Steam, Twitter / X). Customers can link multiple providers to a single account.

## Admin: Managing Customer Accounts

Admins can view and manage customer accounts from **Users** in the admin panel:
- Edit customer details and roles
- View order history per customer
- Delete or anonymise accounts

::: tip SEE ALSO
- [Users & Roles](../users): admin user management.
- [Orders](./orders): order history and fulfilment.
- [Memberships](../settings/membership): subscription plans and gating.
- [GDPR & Privacy](../system/gdpr): account anonymisation and data rights.
:::
