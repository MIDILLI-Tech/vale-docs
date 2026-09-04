# Installation

Vale is designed to be straightforward to set up, whether you are a site administrator installing via web browser or a system administrator deploying with Docker.

> **Which option should I choose?**
> - Most sites: use **Option 1 (Pre-built ZIP)** — upload the files and finish setup in your browser. No terminal needed.
> - Docker or VPS deployments: use **Option 2** (marked **For Sysadmins** where terminal commands are involved).

---

### Prerequisites

- **PHP**: @phpVersion@ or higher
- **Database**: **MySQL** @mysqlVersion@+ / **MariaDB** @mariadbVersion@+ **(recommended)** / **PostgreSQL** @pgsqlVersion@+ or **SQLite** 3.x
- **PHP Extensions (required)**: `pdo_mysql` (for MySQL/MariaDB), `pdo_pgsql` (for PostgreSQL), `pdo_sqlite` (for SQLite), `mbstring`, `json`, `openssl`, `fileinfo`, `sodium`, `zip`
- **PHP Extensions (recommended)**: `gd`, `intl`, `curl`, `dom`, `xml`, `bcmath`, `Zend OPcache` — installation works without them, only the related features are limited. See the [full extension table](../developer/prerequisites#php-extensions) for what each one does.

## Option 1: Pre-built ZIP (Recommended for Most Sites)

If you downloaded the official pre-built Vale release archive, all required PHP and JavaScript assets are pre-compiled and included and it is ready to deploy.

### Step 1: Upload & Extract Files
Extract the release ZIP archive and upload all files to your web server directory. Ensure your web server's document root points to the `public/` folder.

### Step 2: Set Directory Permissions
Ensure that the web server user (e.g. `www-data` or `apache`) has write permissions for the following directories:
- `storage/` (and all subdirectories)
- `public/uploads/`

### Step 3: Run the Web Installer
1. Open your browser and navigate to your domain (e.g. `https://example.com`).
2. You will be automatically directed to the Web Installer wizard at `/install.php`.
3. Follow the guided steps:
   - **Database Configuration:** Provide your database server details (MySQL, PostgreSQL, or SQLite).
   - **Admin Account:** Set up your primary super-administrator username and password.
    - **Sample Content (Optional):** Check **Add sample data** if you wish to populate your site with demo blog posts, products, pages, and forms. This also creates a demo subscriber login (`user@example.com` / `password123`) shown on the success screen — delete the demo users or change their passwords before going live.

Once complete, the installer automatically generates your configuration `.env` file and locks the installer for security.

---

## Option 2: Docker Deployment

For containerized environments, Vale provides official Docker and Docker Compose configurations.

::: tip FOR SYSADMINS
The steps below run in a terminal on your server. If someone else manages hosting for you, forward this section to them.
:::

### Quick Deployment

Follow the steps below to deploy Vale with the production Docker Compose stack.

**1. Prepare your environment file**

```bash
cp .env.example .env
```

Open `.env` and set your `APP_URL`, `APP_KEY`, and database credentials. If you'd like a hand with this, our browser-based [environment generator](https://docs.getvale.org/environment-generator.html) builds the file for you — it runs completely offline, so no data is shared with us.

**2. Start the container stack**

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

**3. Apply database migrations**

```bash
docker compose exec vale-app vale migrate
```

This creates all database tables and loads the built-in defaults (roles, permissions, and settings). The container usually takes care of this on startup, so run it manually just to be sure — it's always safe to repeat.

**4. Create your admin account**

Migrations don't create any users, so create your login once:

```bash
docker compose exec vale-app vale user:create --name="Admin" --email="admin@example.com" --password="your-secure-password" --role=super_admin
```

**5. Verify system health**

```bash
docker compose exec vale-app vale doctor
```

::: tip Want sample content instead of a blank site?

The command below fills your site with demo posts, products, orders, coupons, and demo users (`admin@getvale.org` / `password123`). It also switches on demo-oriented settings such as multi-language (en + tr) and the shop. Since the production container runs with `APP_ENV=production`, seeding needs the `--force` flag:

```bash
docker compose exec vale-app vale db:seed --demo --force
```

:::

::: tip Web Installer with Docker
If you prefer configuring your site via the browser installer when using Docker, start the containers, ensure `storage/installed.lock` is removed if created, and visit `http://your-server/install.php`.
:::

::: tip SEE ALSO
For reverse proxy setup (Nginx/Traefik), TLS certificates, persistent volume configuration, and custom database containers, see the full [Docker Deployment Guide](../developer/deployment/docker).
:::

---

## Option 3: Installation From Source

If you cloned the source repository directly from GitHub, follow the [Installation From Source](../developer/deployment/#installation-from-source) guide in the Developer Documentation to install PHP dependencies with Composer and build static frontend assets.

---

## Post-Installation Security & Configuration

### Document Root Protection
To protect sensitive system files (such as `.env` or local database files), ensure your web server is configured with `public/` as its document root.

::: tip FOR SYSADMINS — verify sensitive files are blocked
Run this from a terminal or ask your host to check it for you:
```bash
curl -I https://example.com/.env
```
- **Secure:** Returns `403 Forbidden` or `404 Not Found`.
- **Insecure:** Returns `200 OK` and exposes file contents. If exposed, adjust your web server document root immediately as detailed in [Web Server Protection](../developer/security/#web-server-document-root-protection).
:::

### Basic Configuration (`.env`)

::: tip FOR SYSADMINS
You can fine-tune your site configuration at any time by editing `.env` on the server:
- **`APP_ENV`**: Set to `production` for live websites or `dev` during local testing.
- **`APP_DEBUG`**: Set to `false` in production to prevent technical error details from being displayed to visitors.
:::

::: danger SECURITY NOTICE
Never leave `APP_DEBUG=true` on live production servers.
:::

::: tip SEE ALSO
- [System CLI Commands](./system/cli) — System administration and health checks via terminal.
- [Environment Variables Reference](../developer/env) — Complete `.env` options guide.
