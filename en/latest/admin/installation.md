# Installation

Vale is designed to be straightforward to set up: upload a pre-built ZIP and finish in your browser, or run the official Docker image if your server already runs Docker.

> **Which option should I choose?**
> - Most sites: use **Option 1 (Pre-built ZIP)**: upload the files and finish setup in your browser. No terminal needed.
> - Servers that already run Docker: use **Option 2** (marked **For Sysadmins** where terminal commands are involved).

---

## Option 1: Pre-built ZIP (Recommended for Most Sites)

If you downloaded the official pre-built Vale release archive, all required files are included and it is ready to deploy.

### Prerequisites

- **PHP**: @phpVersion@ or higher
- **Database**: **MySQL** @mysqlVersion@+ / **MariaDB** @mariadbVersion@+ **(recommended)** / **PostgreSQL** @pgsqlVersion@+ or **SQLite** 3.x
- **PHP Extensions (required)**: `pdo_mysql` (for MySQL/MariaDB), `pdo_pgsql` (for PostgreSQL), `pdo_sqlite` (for SQLite), `mbstring`, `json`, `openssl`, `fileinfo`, `sodium`, `zip`
- **PHP Extensions (recommended)**: `gd`, `intl`, `curl`, `dom`, `xml`, `bcmath`, `Zend OPcache`; installation works without them, only the related features are limited. See the [full extension table](../developer/prerequisites#php-extensions) for what each one does.

### Step 1: Upload & Extract Files
Extract the release ZIP archive and upload all files to your web server directory. Ensure your web server's document root points to the `public/` folder.

### Step 2: Set Directory Permissions
Ensure that the web server user (e.g. `www-data` or `apache`) has write permissions for the following directories:
- `storage/` (and all subdirectories), including `storage/uploads/`, where media is written
- `themes/` (and all subdirectories), to be able to upload themes, create and edit templates.

### Step 3: Run the Web Installer
1. Open your browser and navigate to your domain (e.g. `https://example.com`).
2. You will be automatically directed to the Web Installer wizard at `/install.php`.
3. Follow the guided steps:
   - **Database Configuration:** Provide your database server details (MySQL, PostgreSQL, or SQLite).
   - **Admin Account:** Set up your primary super-administrator username and password.
    - **Sample Content (Optional):** Check **Add sample data** if you wish to populate your site with demo blog posts, products, pages, and forms. This also creates a demo subscriber login (`user@example.com` / `password123`) shown on the success screen; delete the demo users or change their passwords before going live.

Once complete, the installer generates your configuration and your site will be ready to use.

---

## Option 2: Docker (Prebuilt Image)

Vale publishes ready-made Docker images, so there is nothing to upload, clone, or build: pull the image and start a container. Your server needs Docker and nothing else: no PHP, database server, Composer, or Node.js on the host.

::: tip FOR SYSADMINS
The steps below run in a terminal on the server that has Docker. If someone else manages hosting for you, forward this section to them.
:::

### Step 1: Generate an application key

```bash
docker run --rm @dockerImage@:latest vale key:generate
```

Copy the `APP_KEY=...` line from the output. The command only generates and prints a key; it does not change your site.

::: tip More flavours and variants
Vale offers Apache (default) and nginx servers with different flavours for auto-managed and self-managed. See [this page](../developer/deployment/docker-registry#prebuilt-images) for the complete list.
:::

### Step 2: Start the container

```bash
docker run -d --name vale \
  -p 80:80 \
  -v vale-storage:/var/www/html/storage \
  -v vale-themes:/var/www/html/themes \
  -e APP_URL=https://example.com \
  -e APP_KEY=paste-the-key-from-step-1 \
  -e DB_DRIVER=sqlite \
  @dockerImage@:latest
```

- **Always write the image name in full.**
- `:latest` is the Apache image with the application code baked in; the Nginx variant is `@dockerImage@:nginx`. Both listen on port 80 inside the container.
- The two volumes keep your content, media, themes, and backups across restarts and updates.
- SQLite needs no extra service and is fine for a small or low-traffic site. For a busy shop or a site with several editors, point Vale at your own **MySQL/MariaDB** or **PostgreSQL** server instead: drop `DB_DRIVER=sqlite` and pass `DB_HOST`, `DB_NAME`, `DB_USER`, and `DB_PASS`.

::: tip More environment variables?
Our browser-based [environment generator](https://docs.getvale.org/environment-generator.html) builds the `-e` flags for you; it runs completely offline, so no data is shared with us. Every supported variable is documented in the [Environment Variables Reference](../developer/env).
:::

On first start Vale creates the database tables, writes the installer lock, and begins serving your site. Nothing needs to be opened in a browser: this image is configured entirely through environment variables.

### Step 3: Create your admin account

Setting up the database does not create any users, so create your login once:

```bash
docker exec vale vale user:create --name="Admin" --email="admin@example.com" --password="your-secure-password" --role=super_admin
```

### Step 4: Verify system health

```bash
docker exec vale vale doctor
```

::: tip Want sample content instead of a blank site?

The command below fills your site with demo posts, products, orders, coupons, and demo users (`admin@getvale.org` / `password123`). It also switches on demo-oriented settings such as multi-language (en + tr) and the shop. Because the container runs in production mode, seeding needs the `--force` flag:

```bash
docker exec vale vale db:seed --demo --force
```

:::

### Step 5: Keep the image updated

This image (:latest) carries its own copy of the application, so the in-app updater does nothing. To update, pull the new release and recreate the container:

```bash
docker pull @dockerImage@:latest
docker stop vale && docker rm vale
# then run the same docker run command from Step 2 again
```

Your content, uploads, and backups live in the volumes, so recreating the container does not touch them. See [Updates & Backups → Docker Deployments](./system/updates#docker-deployments) for what the admin panel shows.

::: tip SEE ALSO
- Reverse proxy (Nginx/Traefik), TLS certificates, bundled database containers, and the Nginx / self-managed variants: [Docker Deployment](../developer/deployment/docker)
- Complete tag scheme (`latest`, version tags, `mutable-*`): [Publishing Images](../developer/deployment/docker-registry)
:::

---

## Other Ways to Install

Installing from a Git checkout, building your own Docker image, or running the Compose stacks from the repository are developer workflows. Start with [Deployment](../developer/deployment/), which covers [installation from source](../developer/deployment/#installation-from-source), [building and running the containers](../developer/deployment/docker), and CapRover.

---

## Post-Installation Security & Configuration

### Document Root Protection
To protect sensitive system files (such as `.env` or local database files), ensure your web server is configured with `public/` as its document root. The Docker image already does this for you.

::: tip FOR SYSADMINS: verify sensitive files are blocked
Run this from a terminal or ask your host to check it for you:
```bash
curl -I https://example.com/.env
```
If using SQLite:

```bash
curl -I https://example.com/storage/database.sqlite # assuming the database is stored in the default location.
```

- **<font color="green">Secure:</font>** Returns `403 Forbidden` or `404 Not Found`.
- **<font color="red">Insecure</font>:** Returns `200 OK` and exposes file contents. If exposed, adjust your web server document root immediately as detailed in [Web Server Protection](../developer/security/#web-server-document-root-protection).
:::

### Basic Configuration (`.env`)

::: tip FOR SYSADMINS
You can fine-tune your site configuration at any time by editing `.env` on the server:
- **`APP_ENV`**: Set to `production` for live websites or `dev` during local testing.
- **`APP_DEBUG`**: Set to `false` in production to prevent technical error details from being displayed to visitors.
:::

::: tip Docker installs
The prebuilt image has no editable `.env`; its configuration lives in the environment. Set these values as `-e` flags on `docker run` (or in your orchestrator's environment) and recreate the container. A `.env` file will be lost on the next redeploy.
:::

::: danger SECURITY NOTICE
Never leave `APP_DEBUG=true` on live production servers.
:::

::: tip SEE ALSO
- [System CLI Commands](./system/cli): System administration and health checks via terminal.
- [Environment Variables Reference](../developer/env): Complete `.env` options guide.
