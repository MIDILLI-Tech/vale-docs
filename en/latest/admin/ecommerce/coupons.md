# Coupons

Drive sales by creating discount codes for your customers.

## Discount Types

- **Percentage Discount**: A percentage off the total (e.g., 10% OFF).
- **Fixed Cart Discount**: A fixed amount off the total (e.g., $5 OFF), optionally restricted to specific products or categories.

## Discount Application Scope

The **Applies To** setting controls which cart items a product coupon discounts:

- **All eligible products** (default): the discount is calculated from the total of all eligible items. Without any product/category restriction this is the whole cart; with restrictions, only the matching items count — restricted-out items are never discounted.
- **Cheapest eligible product only**: only the cheapest eligible product is discounted, and only **one unit** of it. Example: 20% off with the cheapest item at $40 gives $8 off, even if the customer buys 2 units of it.
- **Most expensive eligible product only**: same as above, but for the priciest eligible product (one unit only).

Rules that apply to every scope:

- A **fixed amount** can never exceed what it applies to: the eligible total (all-eligible mode) or the single unit's price (cheapest/most-expensive mode).
- **Minimum Order** is always checked against the whole cart total, not the eligible subset.
- **Blocked** products/categories always win over allowed ones.
- The scope setting only applies to shop (product) coupons, not membership coupons.

## Coupon Settings

When creating or editing a coupon, you can configure:

- **Code**: The discount code customers enter at checkout. Use the Generate button for a random code. An optional **Prefix** is added in front of the code when saved.
- **Discount Type**: Choose between Percentage or Fixed amount.
- **Discount Value**: The percentage or fixed amount to discount.
- **Applies To**: Which items the discount covers — all eligible products, or only the cheapest / most expensive eligible product (one unit). See Discount Application Scope above.
- **Minimum Order**: Optional minimum cart total required to use the coupon.
- **Max Uses**: Optional limit on how many times the coupon can be used in total.
- **Start Date**: Optional date and time when the coupon becomes active. Before this date, the coupon is not valid and shows as "Scheduled".
- **Expiry Date**: Optional date and time when the coupon expires. After this date, the coupon is no longer valid and shows as "Expired".
- **Enabled**: Toggle to enable or disable the coupon immediately. If a start date is set, the coupon will be scheduled automatically from that date.
- **Free Shipping**: When enabled, the coupon waives the shipping cost.
- **Only Registered Users**: When enabled, only logged-in users can apply this coupon. Guests will see a message prompting them to sign in.
- **Allowed / Blocked Categories**: Restrict the coupon to specific product categories.
- **Allowed / Blocked Products**: Restrict the coupon to specific products — including individual variations (e.g. size or color options). See Product Variations below.
- **Allowed Emails**: Restrict the coupon to specific email addresses (comma-separated). Leave empty for no restriction.

## Product Variations

Products with options (such as size or color) list each option as a **Variation** underneath its **Parent Product** in the Allowed / Blocked Products lists. Variations show their option names (e.g. Red / L) and SKU so you can tell them apart.

- **Select a parent product** to include (or exclude) all of its variations at once.
- **Select a single variation** to target just that option — for example, 10% off only the Red / L T-shirt.
- **Block a parent product** to exclude all of its variations.
- **Block a single variation** to exclude just that option while the other variations stay eligible — for example, allow a T-shirt but exclude the out-of-stock size.
- The search box also matches variation options and SKUs, so typing a size, color, or SKU will find the right variation.

## Coupon Status

Coupons can have four statuses:

- **Active**: The coupon is enabled and currently valid (within the start/end date window).
- **Scheduled**: The coupon has a start date in the future. It will become active automatically when the start date is reached.
- **Disabled**: The coupon has been manually disabled.
- **Expired**: The coupon has passed its expiry date or exceeded its usage limit.

## Bulk Actions

Tick the checkboxes next to coupons to select them, then use the action bar to **Enable**, **Disable**, or **Delete** several coupons at once.

## Restrictions

You can add rules to your coupons:
- **Minimum Spend**: Coupon only works if the cart total is above a certain amount.
- **Expiry Date**: Set a date when the coupon will no longer be valid.
- **Usage Limits**: Limit how many times a coupon can be used in total, or per customer.
- **Excluded Products / Categories / Plans / Variations**: When one of these is in the cart, the coupon cannot be used at all — it is rejected at checkout. (To discount only matching items while keeping the coupon usable for the rest of the cart, use Allowed restrictions instead.)
