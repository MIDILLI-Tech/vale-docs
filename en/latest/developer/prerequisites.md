# Prerequisites

::: tip AI AGENTS
Using an AI coding agent? Load the [`vale-env-check`](./agent-skills) skill for a goal-driven environment readiness check with exact fix commands.
:::

The following environment versions are required to install and develop Vale.

| Tool | Version | Notes |
| --- | --- | --- |
| PHP | @phpVersion@+ | Required, see PHP extensions below |
| Composer | @composerVersion@ | PHP dependency management |
| Node.js & npm | @nodeVersion@+ | Asset building and theme development |
| MySQL | @mysqlVersion@+ | Recommended database driver |
| MariaDB | @mariadbVersion@+ | Recommended database driver |
| PostgreSQL | @pgsqlVersion@+ | Supported database driver |
| SQLite | 3.x | Lightweight alternative database driver |

## PHP Extensions

Single source of truth: `config/reference-data.php` → `requirements` (the web installer at `public/install.php` reads the same data). **Required** extensions block installation when missing; **recommended** ones only limit the features listed. The installer shows a warning and continues.

| Extension | Status | What it is needed for |
| --- | --- | --- |
| `pdo` + one driver (`pdo_mysql`, `pdo_pgsql`, `pdo_sqlite`) | Required | Database access: pick the driver matching your database |
| `mbstring` | Required | Multibyte string handling throughout the app |
| `json` | Required | JSON encoding/decoding (settings, API, webhooks) |
| `openssl` | Required | HTTPS requests and encrypted SMTP connections |
| `fileinfo` | Required | Upload MIME-type detection (extension alone is never trusted) |
| `sodium` | Required | Credential encryption and update-package signature verification |
| `zip` | Required | Extracting update packages |
| `gd` | Recommended | Thumbnail generation for uploaded images |
| `intl` | Recommended | Localized date/number/currency formatting: falls back to plain PHP formatting when missing |
| `curl` | Recommended | Faster HTTP for payments, webhooks and APIs: falls back to `allow_url_fopen`; only errors if both are unavailable |
| `dom` | Recommended | Invoice PDFs (Dompdf) and XML feed generation (RSS, product feeds) |
| `xml` | Recommended | Product import from XLSX/XML files |
| `bcmath` | Recommended | Precise decimal math for shop totals, VAT, coupons and gateway amounts: falls back to float math when missing |
| `Zend OPcache` | Recommended | Opcode caching for production performance (see [production optimization](./deployment/#production-optimization)) |

## Optional

| Tool | Notes |
| --- | --- |
| Docker & Docker Compose | Recommended for local development and production deployment. See the [Docker Deployment Guide](./deployment/docker). |
