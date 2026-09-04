# Prerequisites

The following environment versions are required to install and develop Vale. Values are defined once in `.vitepress/config.js` (the `VARIANTS` object), so this table always stays in sync with the rest of the documentation.

| Tool | Version | Notes |
| --- | --- | --- |
| PHP | @phpVersion@+ | Required, with `sodium` and `zip` extensions |
| Composer | @composerVersion@ | PHP dependency management |
| Node.js & npm | @nodeVersion@+ | Asset building and theme development |
| MySQL | @mysqlVersion@+ | Recommended database driver |
| MariaDB | @mariadbVersion@+ | Recommended database driver |
| PostgreSQL | @pgsqlVersion@+ | Supported database driver |
| SQLite | 3.x | Lightweight alternative database driver |

## Optional

| Tool | Notes |
| --- | --- |
| Docker & Docker Compose | Recommended for local development and production deployment. See the [Docker Deployment Guide](./deployment/docker). |
| Redis | Optional cache and session driver |
