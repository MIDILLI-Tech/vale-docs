# Database Migrations

::: tip AI AGENTS
Using an AI coding agent? Load the [`vale-migration`](./agent-skills) skill for cross-database-safe Phinx migrations and the repository's table conventions.
:::

Vale uses **Phinx** for database schema migrations, giving you a versioned, reversible way to evolve the database schema as your application changes.

## Overview

Migrations live in `database/migrations/`. Each migration is a PHP class with an `up()` method (apply changes) and an optional `down()` method (reverse changes).

Phinx is configured in `phinx.php` in the project root. It reads the database credentials from `.env`.

## Running Migrations

```bash
# Run all pending migrations
php vale migrate

# Check migration status
php vale migrate --status

# Roll back the last batch of migrations
php vale migrate --rollback
```

## Marking Migrations as Already Applied (`--fake`)

Use `--fake` when the database already contains the final schema but the Phinx log (`vl_migrations`) is empty, for example after importing a database dump or restoring a backup. Phinx **records the migrations as applied without executing any SQL**, so existing data and tables are never touched.

```bash
php vale migrate --fake
```

> ⚠️ **Verify the schema first.** Only use `--fake` for migrations whose changes are genuinely already in the database. If a migration adds new columns or tables that are missing, run it for real instead. Faking it would leave the schema out of sync with the migration log.

A common safe workflow after importing a database:

1. Run `php vale migrate --status` to see which migrations are pending.
2. Inspect the schema (e.g. `SHOW CREATE TABLE`) to confirm the imported tables match the pending migrations.
3. Run `php vale migrate --fake` to sync the log, then `php vale migrate --status` to confirm everything shows as `up`.

::: tip SEE ALSO
- CLI reference: [`migrate`, `db:seed`, `db:optimize`](../admin/system/cli)
- [Architecture](./architecture/domain): understanding the Vale data layer.
:::

## Creating a Migration

Use Phinx's `create` command directly (bypass the Vale wrapper for migration authoring):

```bash
vendor/bin/phinx create AddProductVariantsTable
```

This generates `database/migrations/YYYYMMDDHHIISS_add_product_variants_table.php`.

### Migration Structure

```php
<?php

use Phinx\Migration\AbstractMigration;

final class AddProductVariantsTable extends AbstractMigration
{
    public function up(): void
    {
        $table = $this->table('product_variants');
        $table
            ->addColumn('product_id', 'integer', ['null' => false])
            ->addColumn('sku', 'string', ['limit' => 255])
            ->addColumn('price', 'decimal', ['precision' => 10, 'scale' => 2, 'null' => true])
            ->addColumn('stock', 'integer', ['default' => 0])
            ->addForeignKey('product_id', 'products', 'id', ['delete' => 'CASCADE'])
            ->addIndex(['product_id'])
            ->create();
    }

    public function down(): void
    {
        $this->table('product_variants')->drop()->save();
    }
}
```

## Available Phinx Methods

| Method | Description |
|---|---|
| `$this->table('name')` | Open a table builder |
| `->addColumn(name, type, options)` | Add a column |
| `->changeColumn(name, type, options)` | Alter a column |
| `->removeColumn(name)` | Drop a column |
| `->addIndex(columns, options)` | Add an index |
| `->removeIndex(columns)` | Drop an index |
| `->addForeignKey(...)` | Add a foreign key constraint |
| `->create()` / `->update()` / `->drop()` | Commit DDL changes |
| `$this->execute('SQL')` | Run raw SQL |
| `$this->fetchRow('SQL')` | Query a single row |
| `$this->table()->insert([...])->saveData()` | Insert seed rows |

Full reference: [Book.CakePHP.org/Phinx](https://book.cakephp.org/phinx/latest/en/migrations.html)

## Column Types

Common Phinx column types:

| Phinx type | MySQL type |
|---|---|
| `integer` | `INT` |
| `biginteger` | `BIGINT` |
| `string` | `VARCHAR` |
| `text` | `TEXT` |
| `boolean` | `TINYINT(1)` |
| `decimal` | `DECIMAL(p, s)` |
| `datetime` | `DATETIME` |
| `timestamp` | `TIMESTAMP` |
| `json` | `JSON` |

## Best Practices

- **Always implement `down()`** unless the migration is irreversible by design (e.g., one-time data transforms that cannot be undone). A missing `down()` means `--rollback` will fail.
- **Never modify existing migrations** once they have been run in production. Create a new migration instead.
- **Keep migrations atomic:** one logical change per migration file.
- **Test both directions** before deploying:
  ```bash
  php vale migrate
  php vale migrate --rollback
  php vale migrate
  ```
- A normal `migrate` run also applies the safe initial seed. Use `db:seed --demo` only when you explicitly want sample content; demo data is never loaded automatically.

::: tip SEE ALSO
- CLI reference: [`migrate`, `db:seed`, `db:optimize`](../admin/system/cli)
- [Architecture](./architecture/domain): understanding the Vale data layer.
:::
