# Deployment

Vale can be deployed to a variety of environments, from shared hosting to dedicated virtual servers. This page walks through installing from source step by step, then covers the most common targets: classic shared hosting panels, an Nginx-powered VPS, official Docker images, and one-click CapRover deployments.

Whichever route you take, the [production optimization](#production-optimization) checklist at the bottom applies: environment flags, local assets, OPcache, and the cron job that drives scheduled posts and automations.

## Installation From Source

If you've cloned the repository from GitHub, follow these steps:

### Prerequisites
- **PHP**: @phpVersion@ or higher
- **Database**: **MySQL** @mysqlVersion@+ / **MariaDB** @mariadbVersion@+ **(recommended)** / **PostgreSQL** @pgsqlVersion@+ or **SQLite** 3.x
- **Composer**: @composerVersion@
- **PHP Extensions**: `pdo_mysql` (for MySQL/MariaDB), `pdo_pgsql` (for PostgreSQL), `pdo_sqlite` (for SQLite), `gd` (thumbnails), `mbstring`, `json`, `sodium`, `xml`, `intl`, `curl`, `fileinfo`, `zip`, `bcmath`
- **Node.js @nodeVersion@+ & npm**: (Only if you plan to modify themes or core assets)

### Setup Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/vale/vale.git
   cd vale
   ```
2. **Install PHP Dependencies**:
   ```bash
   composer install --no-dev
   ```
   ::: tip DEVELOPER?
   If you're contributing to Vale (running tests, linting, building assets), use `composer install` instead. See [Getting Started](../getting-started) for the full development setup.
   :::

3. **Configure Environment**:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set at minimum:
   - `APP_URL` — your site's full URL
   - `APP_KEY` — generate with `php -r "echo bin2hex(random_bytes(32));"` and use the output
   - `DB_DRIVER` — `mysql` (default), `sqlite`, or `pgsql`
   - `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` — your database credentials (MySQL/MariaDB/PostgreSQL)
   - For **SQLite**, set `DB_DRIVER=sqlite` and `DB_NAME` to the path of your SQLite file (e.g. `storage/vale.db`). Other DB fields are ignored.
   - For **PostgreSQL**, set `DB_DRIVER=pgsql` and `DB_PORT` to `5432`. The default user is `postgres`.

4. **Run the Web Installer (optional)**:
   Open your domain in a browser. The web installer will guide you through the final database setup and admin user creation.

   ::: warning IMPORTANT
   If `storage/installed.lock` already exists (e.g., Docker entrypoint auto-ran migrations), the installer will not run. Delete `storage/installed.lock` to re-run it.
   :::

### CLI Installation
For headless/automated setups (e.g. CI), skip the web installer:
```bash
cp .env.example .env
# Edit .env with your DB credentials and APP_KEY
php vale migrate
php vale db:seed
```

::: tip DOCKER?
No local `php` needed — inside any Vale container, `vale <command>` is a shortcut for `php vale <command>` (the official images ship a wrapper binary). Example: `docker compose exec vale-app vale migrate`.
:::

## Shared Hosting (cPanel/Plesk)

1. **Upload**: Upload all files to your web server (usually `public_html`).
2. **Move Public**: For best security, your project root should be *above* the web root, with only the `public/` directory exposed. If you cannot do this, ensure the `.htaccess` file is working correctly.
3. **Writable Folders**: Ensure the `storage/` and `public/assets/build/` directories are writable by the server.
4. **PHP Version**: Ensure your host is running PHP @phpVersion@ or higher.

## Virtual Private Server (VPS) - Nginx

**Recommended Stack**: Nginx + PHP-FPM @phpVersion@+ + MySQL @mysqlVersion@ / PostgreSQL @pgsqlVersion@+

**Nginx Configuration Example**:

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/vale/public;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

## Docker

Vale ships with official `Dockerfile`s and `docker-compose.yml` files for both local development and production. Covers Apache + Nginx variants, self-managed and immutable image builds.

See [Docker Deployment](./docker) for the full guide.

## CapRover

Deploy Vale to CapRover using the built-in `captain-definition` file. The container handles `.env` creation and database migrations automatically on first boot.

See [CapRover Deployment](./caprover) for the full guide.

## Production Optimization

1. **`APP_ENV`**: Always set to `production` in `.env`.
2. **`APP_DEBUG`**: Always set to `false`.
3. **`ASSETS_USE_CDN`**: Set to `false` and ensure you have run `npm run build` to generate local assets.
4. **OPcache**: Ensure PHP OPcache is enabled for best performance.
5. **Document Root Protection**: Point the web root to `public/` and verify `.env` is not publicly accessible — see [Web Server & Document Root Protection](../security/#web-server-document-root-protection).

::: tip CRON JOB
For automations and scheduled posts, add the following cron job to your server:
```bash
* * * * * cd /path-to-vale && php vale cron:run >> /dev/null 2>&1
```
:::
