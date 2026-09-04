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
