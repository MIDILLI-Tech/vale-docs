# Repository Pattern

Vale uses the **Repository Pattern** to mediate between the Domain and mapping layers. This provides a collection-like interface for accessing domain objects.

## Interface Contracts

Every repository starts with an interface in `src/Domain/`. This interface defines the contract that the application layer expects.

**Example: `PostRepositoryInterface`**
```php
interface PostRepositoryInterface {
    public function findById(int $id): ?Post;
    public function findBySlug(Slug $slug): ?Post;
    public function save(Post $post): Post;
    public function delete(int $id): void;
}
```

## Dbal Implementation

The concrete implementations reside in `src/Infrastructure/Persistence/` and use **Doctrine DBAL** for database communication.

**Example: `DbalPostRepository`**
```php
final class DbalPostRepository implements PostRepositoryInterface {
    public function findById(int $id): ?Post {
        $row = $this->db->fetchAssociative('SELECT * FROM posts WHERE id = ?', [$id]);
        return $row ? Post::fromArray($row) : null;
    }
}
```

::: tip SQLite-compatible SQL
Vale supports MySQL, MariaDB, PostgreSQL, and SQLite drivers. When writing raw SQL in a repository, keep the queries portable across all supported drivers — avoid MySQL-only syntax and functions, and test against multiple engines before committing.
:::

## Why this structure?
- **Swappable**: You can switch between the supported database drivers (MySQL, MariaDB, PostgreSQL, SQLite) or swap in an In-memory or Redis version for testing or performance without changing your business logic.
- **Clean SQL**: Using DBAL allows us to write optimized SQL while still benefiting from a high-level abstraction.

::: tip SEE ALSO
- Learn more about the [Technology Stack](../index#technology-stack).
:::
