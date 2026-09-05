# Installation

Vale is designed to be straightforward to set up, whether you are a site administrator installing via web browser or a system administrator deploying with Docker.

---

## Option 1: Pre-built ZIP (Recommended for Most Sites)

If you downloaded the official pre-built Vale release archive, all required PHP and JavaScript assets are pre-compiled and included. No command-line build tools or Composer installations are required.

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
   - **Sample Content (Optional):** Check **Add sample data** if you wish to populate your site with demo blog posts, products, pages, and forms.

Once complete, the installer automatically generates your configuration `.env` file and locks the installer for security.

---

## Option 2: Docker Deployment

For containerized environments, Vale provides official Docker and Docker Compose configurations.

### Quick Deployment

```bash
# 1. Prepare environment file
cp .env.example .env
# Edit .env to set your APP_URL, APP_KEY, and database credentials

# 2. Start the Vale container stack
docker compose -f docker-compose.prod.yml up -d --build

# 3. Apply database migrations
docker compose exec vale-app vale migrate

# 4. Create the admin account (and optional sample data)
docker compose exec vale-app vale db:seed

# 5. Verify system health
docker compose exec vale-app vale doctor
```

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

You can verify that sensitive files are blocked by making a web request to `.env`:
```bash
curl -I https://example.com/.env
```
- **Secure:** Returns `403 Forbidden` or `404 Not Found`.
- **Insecure:** Returns `200 OK` and exposes file contents. If exposed, adjust your web server document root immediately as detailed in [Web Server Protection](../developer/security/#web-server-document-root-protection).

### Basic Configuration (`.env`)
You can fine-tune your site configuration at any time by editing `.env`:
- **`APP_ENV`**: Set to `production` for live websites or `dev` during local testing.
- **`APP_DEBUG`**: Set to `false` in production to prevent technical error details from being displayed to visitors.

::: danger SECURITY NOTICE
Never leave `APP_DEBUG=true` on live production servers.
:::

::: tip SEE ALSO
- [System CLI Commands](./system/cli) — System administration and health checks via terminal.
- [Environment Variables Reference](../developer/env) — Complete `.env` options guide.
