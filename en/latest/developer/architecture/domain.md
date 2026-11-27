# Domain Model

Vale is built with a strong focus on **Domain-Driven Design (DDD)**. The core business logic is encapsulated within the `src/Domain/` directory, isolated from framework concerns.

## Core Domain Packages

### Content
- **Entities**: `Post`, `Page`, `Tag`, `Category`, `Comment`, `Revision`, `Media`.
- **Logic**: Handles the lifecycle of articles, hierarchical pages, and media metadata.
- **Scheduling**: `Post` carries `published_at` (go-live), `expires_at` (auto-offline → `expired` status) and `swap_post_id` (scheduled URL handover to a replacement record). The handover runs inside a DB transaction (`PostRepositoryInterface::performSwap()`), and the `homepage_page_id` setting follows the record that takes over the URL. Replacement UI is gated per content type via the `scheduled_swap` support flag (pages support it by default).

### Shop (E-Commerce)
- **Entities**: `Product`, `Variation`, `Order`, `Coupon`, `Customer`, `TaxRate`, `ShippingMethod`.
- **Logic**: Manages inventory states, price calculations (Regular vs. Sale), and order status transitions.

#### Product age restriction and batch numbers

`Product` stores the fields behind the storefront age gate and lot traceability:

| Getter | Column | Values |
|---|---|---|
| `getMinAge()` | `products.min_age` | `null`, `16` or `18` |
| `getBatchNumber()` | `products.batch_number` | free text (optional lot identifier) |

Both are hydrated by `Product::fromRow()` and persisted by `DbalProductRepository::save()`.

**Age restriction.** `resources/views/shop/product.twig` renders a full-screen age gate when `min_age > 0`. Confirming writes `vl_age_ok_<age>` to `localStorage`, so later visits from the same browser skip the gate. The gate is a self-declaration, not an identity check.

At checkout, `CheckoutController::requiredAgeForItems()` returns the highest `min_age` in the cart. The order is rejected when the `age_confirmed` POST field is missing, and `Order::setAgeConfirmedAt()` records the timestamp in `orders.age_confirmed_at`. `ShopController::cart()` passes the same maximum to the cart template for its warning block.

**Batch snapshot.** When the order is written, the product's batch number is copied into `order_items.batch_number`. Past orders keep the lot that was actually sold even if the product is edited later; an empty batch number is stored as `NULL` and rendered nowhere.

### User & Auth
- **Entities**: `User`, `Role`, `Permission`.
- **Logic**: Granular RBAC (Role-Based Access Control) and authentication state management.

### Shared (Value Objects)
We use immutable Value Objects to ensure data integrity across the system:
- **`Email`**: Validates and represents a valid email address.
- **`Slug`**: Represents a URL-friendly string.
- **`Pagination`**: Encapsulates logic for offsets, limits, and total pages.

## Design Principles

1. **Isolation**: Domain entities should not depend on external libraries or the database.
2. **Immutability**: Value objects are immutable; any change results in a new instance.
3. **Rich Entities**: Entities contain logic relevant to their state (e.g., `Post->publish()`) rather than being simple data bags.

::: tip DEVELOPER NOTE
When adding a new feature, always start by defining your Domain Entities and Value Objects before writing implementation details in the Infrastructure layer.
:::
