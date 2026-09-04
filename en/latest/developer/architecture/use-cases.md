# Use Cases

Application logic in Vale is organized into **Use Cases** (also known as Interactors). These reside in `src/Application/` and are responsible for coordinating domain objects to fulfill a specific user goal.

## Pattern Structure

Each Use Case is typically a `final class` with a single public method (usually `execute`). They are injected into Controllers or CLI Commands via the DI container.

**Example: `SaveTagUseCase`**
```php
final class SaveTagUseCase {
    public function execute(array $data, ?int $id = null): Tag {
        // 1. Validate input
        // 2. Fetch or create domain entity
        // 3. Update entity state
        // 4. Persist via repository
        // 5. Return result
    }
}
```

## Benefits
- **Testability**: Use Cases can be easily unit tested by mocking their repository dependencies.
- **Reusability**: The same logic can be triggered by a Web controller, an API endpoint, or a CLI command.
- **Clarity**: The `src/Application/` directory serves as a readable catalogue of everything the system can do.

::: tip PRO TIP
Keep Use Cases focused on coordination. If logic is purely about business rules (like calculating a discount), it belongs in the Domain layer. If it's about database queries, it belongs in the Infrastructure layer.
:::
