# Architecture

Vale is built around **Domain-Driven Design (DDD)**. Business logic lives in `src/Domain/`, application coordination in `src/Application/`, and concrete implementations in `src/Infrastructure/`, keeping each layer isolated and testable.

This separation means the core of Vale has no dependency on any framework, database, or HTTP detail — entities and use cases describe *what* the application does, while infrastructure classes decide *how* it is done. In practice that makes behavior easy to unit-test, implementations swappable, and the codebase approachable for new contributors.

The pages in this section explain how the layers fit together:

- **Domain Model** — the entities and value objects that capture core business rules.
- **Use Cases** — application services that coordinate domain objects to achieve a user goal.
- **Repository Pattern** — the collection-like interface between the domain and the database.

::: tip SEE ALSO
- Learn more about the [Technology Stack](../index#technology-stack).
:::
