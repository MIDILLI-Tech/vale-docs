# Import


The **Import** sub-tab lets you bring products into your shop from external platforms or from a Vale CSV export.

## Marketplace Imports

Four platform-specific cards handle Shopify, Etsy, eBay, and Amazon exports. Each card accepts the platform's own CSV/Excel file, maps its columns to Vale product fields, and links straight to that platform's export screen. See [Products → Import Products from Marketplaces](../../ecommerce/products#import-products-from-marketplaces) for the full reference.

## Vale Products

Use the **Vale Products** card to import your own product catalog from a CSV file that uses Vale's native column format.

- **Download Template**: Get a CSV with all available columns and two example rows (one simple product, one variable product with variations).
- **Import Media**: When checked, image URLs in `featured_image_url`, `gallery`, and `download_files` are downloaded into the media library.
- **Update Existing**: When checked, products that already exist (matched by slug) are updated instead of skipped.

For the complete column reference, variation format, and CLI equivalent, see [Products → Import Your Own Catalog](../../ecommerce/products#import-your-own-catalog).

::: tip FOR SYSADMINS
The same import is available from the terminal, see the CLI section in [Products → Import Your Own Catalog](../../ecommerce/products#import-your-own-catalog).
:::

::: tip SEE ALSO
- Detailed guide on managing [Products](../../ecommerce/products).
- Learn how to handle [Orders](../../ecommerce/orders).
- Create discount [Coupons](../../ecommerce/coupons).
- Configure recurring plans in [Membership](../membership).
- Configure captcha API keys in [Privacy & Security](../privacy).
:::
