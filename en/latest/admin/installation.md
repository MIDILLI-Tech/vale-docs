# Installation

Vale is designed to be easy to install, whether you're a beginner or a seasoned developer.

## Option 1: Pre-built ZIP (Recommended for Users)

If you have downloaded a pre-built Vale release, you don't need to install any dependencies. All PHP and JavaScript assets are already included.

1. **Upload Files**: Extract the ZIP archive and upload all files to your web server.
2. **Configure Permissions**: Ensure the `storage/` and `public/assets/` directories are writable by the web server.
3. **Run the Installer**: Navigate to your domain in a browser. You will be redirected to the web installer (`/install.php`).
4. **Follow the Steps**: Enter your database credentials and create your admin account. The installer will automatically create your `.env` file. The optional **Add sample data** checkbox is off by default; enable it only if you want example pages, products, orders, users, and other demo content.

## Option 2: Docker

If you prefer containerized deployment, Vale ships with official Dockerfiles and compose files.

### Quick Start

```bash
# 1. Create .env with your DB credentials (or pass as environment variables, or 
#    skip 1 completely if you plan to use Web Installer)

# 1a. Use the online https://docs.getvale.org/environment-generator.html 
#     to create .env interactively in your browser (100% client-side, 
#     no data sent to any server).

# 1b. Alternatively, copy the example environment file as .env
cp .env.example .env
## Edit .env — set APP_URL, APP_KEY, DB_DRIVER, DB_HOST, DB_NAME, DB_USER, DB_PASS

# 2. Start Vale
docker compose -f docker-compose.prod.yml up -d --build

# 3. Run migrations (entrypoint may have already done this
#   - skip if installed.lock exists)
docker compose exec vale-app vale migrate

# 4. Seed sample data and create the default admin account
docker compose exec vale-app vale db:seed

# 5. Verify installation
docker compose exec vale-app vale doctor
```

::: tip DEMO SAMPLE DATA
`vale db:seed` (or the optional **Add sample data** installer checkbox) runs `DemoSeeder`, which creates sample users, blog posts, pages, products (including a digital download with a hidden URL and a variable product with a free-text custom variation), orders, coupons, membership plans, forms, and newsletter automation. See [Demo Seeder → What you can test](../developer/getting-started#demo-seeder) for the scenarios you can exercise with it.
:::

::: tip QUICK TIP
Generate your `.env` file visually using the offline [Environment Generator](https://docs.getvale.org/environment-generator.html) — all processing happens in your browser, no data leaves your machine.
:::

### Using the Web Installer with Docker

If you prefer the browser-based installer instead of the CLI steps above:

1. Complete step 2 from the Quick Start above.
2. Delete `storage/installed.lock` if it exists — the Docker entrypoint creates this file after auto-running migrations, which prevents the installer from running:
   ```bash
   docker compose exec vale-app rm storage/installed.lock
   ```
3. Visit `http://your-server/install.php` and follow the wizard.

### Bundled Database (Optional)

The production compose file keeps optional MySQL/PostgreSQL services behind Compose profiles (`--profile db`, `--profile db-postgres`). Without a profile you need an external database or SQLite. See [Production Deployment](../developer/deployment/docker#production-deployment) for all profile combinations.

::: tip SEE ALSO
Image variants (Apache/Nginx, self-managed vs. static no-update), `.env` handling inside containers, reverse proxy/TLS setup, persistent volumes, and troubleshooting are covered in the full [Docker Deployment Guide](../developer/deployment/docker).
:::

## Option 3: From Source

If you cloned the repository from GitHub instead of downloading a pre-built release, follow the [Installation From Source](../developer/deployment/#installation-from-source) guide in the developer documentation. It installs dependencies with `composer install --no-dev`, so dev-only packages are skipped unless you plan to contribute.

## Post-Installation Configuration

After installation, you can fine-tune Vale by editing the `.env` file in your root directory.

### Environment & Debugging
- **`APP_ENV`**: Set to `production` for live sites or `dev` during development.
- **`APP_DEBUG`**: Set to `true` to see detailed error messages and stack traces.
- **`DB_DRIVER`**: Database driver — `mysql` (default), `sqlite`, or `pgsql`. When using SQLite, `DB_NAME` should point to the database file path (e.g. `storage/vale.db`). When using PostgreSQL, `DB_PORT` defaults to `5432` and `DB_USER` defaults to `postgres`.
  ::: danger SECURITY
  Never enable `APP_DEBUG` on a production server, as it can expose sensitive configuration data.
  :::

### Asset Management
- **`ASSETS_USE_CDN`**:
  - `false` (Default): Uses local, minified assets from `public/assets/build/`. Best for production.
  - `true`: Loads Tailwind CSS, Alpine.js, and fonts from CDNs. Useful during theme development if you don't want to run the local build system.

## Post-Installation Security Check

Sensitive files (`.env`, the SQLite database inside `storage/`) must never be reachable from the browser. Verify this right after installation:

```bash
curl -I https://yourdomain.com/.env
```

If you use SQLite, also try `https://yourdomain.com/storage/database.sqlite`.

- **Secure**: `403 Forbidden` or `404 Not Found` — the file is not downloadable.
- **Insecure**: `200 OK` and the file contents are readable — fix it immediately (see below).

::: danger SECURITY
If `.env` is downloadable, your `APP_KEY`, database credentials, and payment secrets are exposed. Treat this as a critical vulnerability.
:::

To fix it, point your web root to the `public/` directory, or follow the [Web Server & Document Root Protection](../developer/security/#web-server-document-root-protection) guide for Nginx/Apache hardening rules.

::: tip DOCKER
Using Docker? This check is not needed — the official images already set the document root to `public/`, so `.env` and `storage/` are never web-accessible.
:::

::: tip SEE ALSO
- Detailed list of [Environment Variables](../developer/env).
- Learn about the [Asset Build System](../developer/themes#assets).
:::
