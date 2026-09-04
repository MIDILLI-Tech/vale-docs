# Testing

Vale uses **PHPUnit** for its test suite. We prioritize automated testing to ensure system stability and prevent regressions.

## Test Structure

Tests are located in the `tests/` directory and are divided into:

1. **Unit Tests**: Test individual classes (Entities, Value Objects, Services) in isolation. No database or network required.
2. **Integration Tests**: Test the interaction between multiple components, including the database and routing.
3. **Feature Tests**: End-to-end testing of specific application features.

## Running Tests

### All Tests

```bash
composer test
```

### By Test Suite

```bash
composer test:unit            # Unit tests only (~1s)
composer test:integration     # Integration tests only
composer test:feature         # Feature tests only
```

### Specific Files or Groups

```bash
# Run a specific test file
vendor/bin/phpunit tests/Unit/Domain/Content/Entity/PostTest.php

# Run tests by group
vendor/bin/phpunit --group=unit
```

## Mocking

We use the built-in PHPUnit mocking system to isolate dependencies in unit tests.

**Example**:
```php
$repo = $this->createMock(PostRepositoryInterface::class);
$repo->method('findById')->willReturn($post);
```

## CI/CD

Vale uses **GitHub Actions** to automatically run the test suite and static analysis on every push and pull request. See `.github/workflows/` for configuration details.

