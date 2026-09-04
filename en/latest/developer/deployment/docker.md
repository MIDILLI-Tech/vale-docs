# Docker Deployment

Vale ships with first-class Docker support for both local development and production deployment. Two compose files and four Dockerfiles cover the most common scenarios.

## Quick Start (Local Development)

The default `docker-compose.yml` builds the image from your local source and runs two web servers (Apache + Nginx) plus a MySQL or PostgreSQL database side by side.

```bash
docker compose up --build
```

| Service     | URL                | Notes                              |
|-------------|--------------------|------------------------------------|
| `vale-apache` | `http://localhost:8080` | Apache + `mod_php`                |
| `vale-nginx`  | `http://localhost:8081` | Nginx + PHP-FPM                   |
| `vale-db-mysql` | `localhost:3306` | MySQL @mysqlVersion@ (default profile) |
| `vale-db-postgres` | `localhost:5432` | PostgreSQL 16 (postgres profile) |

### Default Credentials

The dev compose file ships with safe defaults for local use. Override them in a `.env` file at the project root (Compose reads it automatically):

```bash
# .env (project root, not the Vale .env)
# MySQL (default db-mysql profile)
DB_ROOT_PASSWORD=root
DB_USER=vale_user
DB_PASS=vale_pass
DB_NAME=vale
DB_PORT=3306
APP_PORT_APACHE=8080
APP_PORT_NGINX=8081
```

For PostgreSQL, set `DB_DRIVER=pgsql` in Vale's `.env` and use the `--profile db-postgres` flag. The default PostgreSQL credentials are `postgres`/`postgres` with port `5432`.

::: warning
These defaults are for local development only. Never reuse them on a server reachable from the public internet.
:::

## Environment Variables

Vale reads its configuration from a `.env` file in the project root. In Docker deployments, the `.env` file lives on the host and is bind-mounted into the container at `/var/www/html/.env`.

```bash
# /path/to/vale/.env (Vale's config — NOT Docker Compose's)
APP_URL=http://localhost:8080
APP_ENV=production
APP_DEBUG=false

# Generate with: php -r "echo bin2hex(random_bytes(32));"
APP_KEY=your-64-character-hex-key

# MySQL
DB_HOST=db
DB_PORT=3306
DB_NAME=vale
DB_USER=vale
DB_PASS=strong-password-here
```

### Which Variables Can Be Set?

Anything in Vale's `.env.example` is supported. This includes all `APP_*`, `DB_*`, `ASSETS_*`, session, cache, and rate-limit variables. Unknown keys are silently ignored. Mail is not set via environment variables — configure it in the admin panel (**Settings → Mail**).

For the full list with defaults and descriptions, see [Environment Variables](../env).

### Passing Variables as Environment Flags

You don't need a `.env` file at all — pass any variable directly with `docker run -e`:

```bash
docker run -d \
  --name vale \
  -p 8080:80 \
  -v vale-storage:/var/www/html/storage \
  -v vale-uploads:/var/www/html/public/uploads \
  -e APP_URL=http://localhost:8080 \
  -e APP_ENV=production \
  -e APP_DEBUG=false \
  -e APP_KEY=1a2b3c4d...your-64-char-hex-key \
  -e DB_HOST=db \
  -e DB_NAME=vale \
  -e DB_USER=vale \
  -e DB_PASS=strong-password \
  @dockerImage@:apache
```

The same works in `docker-compose.yml` under each service's `environment:` block.

### Minimal Required Variables

Most variables have built-in defaults (see the [Environment Variables](../env) page). The **only truly required** variables are:

| Variable | Why |
|----------|-----|
| `APP_KEY` | Encryption key — no default. Generates with `php vale key:generate`. Must stay stable across restarts (it encrypts sessions, cookies, and credentials). |
| `APP_URL` | Canonical base URL — no usable default for a real domain. |

For **SQLite** add `DB_DRIVER=sqlite` (default is `mysql`); `DB_NAME` then defaults to `storage/database.sqlite`.

For **MySQL** set `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` when they differ from the defaults (`127.0.0.1`, `Vale`, `root`, empty).

For **PostgreSQL** add `DB_DRIVER=pgsql`; `DB_PORT` defaults to `5432` and `DB_USER` defaults to `postgres`.

Everything else (`APP_ENV`, `APP_DEBUG`, `SESSION_*`, `CACHE_*`, rate limits, …) falls back to sane defaults and can be set only when you need to change them — including `SESSION_SECURE` (HTTPS-only cookies are on by default unless `APP_ENV` is `local`/`dev`).

### Ready-to-Copy

**SQLite:**

```bash
APP_URL=http://your-server
APP_KEY=
DB_DRIVER=sqlite
DB_NAME=storage/database.sqlite
```

**MySQL:**

```bash
APP_URL=http://your-server
APP_KEY=
DB_HOST=db
DB_NAME=vale
DB_USER=vale
DB_PASS=
```

**PostgreSQL:**

```bash
APP_URL=http://your-server
APP_KEY=
DB_DRIVER=pgsql
DB_HOST=db-postgres
DB_PORT=5432
DB_NAME=vale
DB_USER=postgres
DB_PASS=postgres
```

Generate `APP_KEY` with `php vale key:generate` and paste the output.

::: tip Override Priority
Vale's bootstrap uses `Dotenv::createImmutable()`, which means **environment variables passed to Docker always win** over values inside a bind-mounted `.env` file. This is the standard 12-factor approach: keep secrets in the orchestrator (Docker, Kubernetes, ECS), not in the image.
:::

::: tip Two .env files
- **Project root `.env`** — Vale's own config (read by PHP). Lives on the host, bind-mounted into the app container.
- **Project root `.env`** *(same path, separate file)* — Docker Compose variables (read by `docker compose`). Names like `DB_ROOT_PASSWORD`, `DB_PORT`, `APP_PORT_APACHE` are used by Compose to set up the MySQL container and port mappings; they are **not** seen by Vale itself.

In practice you keep both blocks in the same physical `.env` file. Compose ignores unknown keys, and Vale's loader ignores keys that don't match its own config namespace.
:::

## Headless / CLI Install (No Web Installer)

You can skip `install.php` entirely. Once the containers are running:

**1. Start the stack**

```bash
docker compose up -d --build
```

**2. Apply database migrations**

```bash
docker compose exec vale-app vale migrate
```

`migrate` creates all tables and loads the built-in defaults (roles, permissions, and settings). The entrypoint usually runs it on startup, so running it again is safe. After a successful `migrate`, `storage/installed.lock` is created — the web installer will not run again.

**3. Create your admin account**

```bash
docker compose exec vale-app vale user:create --name="Admin" --email="admin@example.com" --password="your-secure-password" --role=super_admin
```

**4. Verify the system is healthy**

```bash
docker compose exec vale-app vale doctor
```

::: tip Want sample content instead of a blank site?

`db:seed --demo` fills the site with demo posts, products, orders, coupons, and demo users (`admin@getvale.org` / `password123`). The production container runs with `APP_ENV=production`, so add `--force`:

```bash
docker compose exec vale-app vale db:seed --demo --force
```

:::

::: tip Vale CLI shortcut
Inside any Vale container, `vale <command>` is a shortcut for `php vale <command>` — the images ship a `vale` wrapper binary at `/usr/local/bin/vale`. The shortcut is **only available inside the Docker containers**; on a plain VPS or shared host, use `php vale <command>`.
:::

For the production compose file, the commands stay the same — just add `-f docker-compose.prod.yml`, plus the profile flag that matches your database.

**Bundled MySQL container:**

```bash
docker compose -f docker-compose.prod.yml --profile db exec vale-app vale migrate
docker compose -f docker-compose.prod.yml --profile db exec vale-app vale user:create --name="Admin" --email="admin@example.com" --password="your-secure-password" --role=super_admin
docker compose -f docker-compose.prod.yml --profile db exec vale-app vale doctor
```

**Bundled PostgreSQL container:**

```bash
docker compose -f docker-compose.prod.yml --profile db-postgres exec vale-app vale migrate
docker compose -f docker-compose.prod.yml --profile db-postgres exec vale-app vale user:create --name="Admin" --email="admin@example.com" --password="your-secure-password" --role=super_admin
docker compose -f docker-compose.prod.yml --profile db-postgres exec vale-app vale doctor
```

**External database (or SQLite — no profile needed):**

```bash
docker compose -f docker-compose.prod.yml exec vale-app vale migrate
docker compose -f docker-compose.prod.yml exec vale-app vale user:create --name="Admin" --email="admin@example.com" --password="your-secure-password" --role=super_admin
docker compose -f docker-compose.prod.yml exec vale-app vale doctor
```

## Image Variants

Four Dockerfiles live under `docker/`. Pick the one that matches your use case.

| Dockerfile                          | Size    | Use case                                         |
|-------------------------------------|---------|--------------------------------------------------|
| `docker/apache.Dockerfile`          | ~1 GB   | Dev & self-managed production (Apache + mod_php) |
| `docker/nginx.Dockerfile`           | ~1 GB   | Dev & self-managed production (Nginx + PHP-FPM)  |
| `docker/no-update/apache.Dockerfile` | ~150 MB | Immutable image for registries (Apache)         |
| `docker/no-update/nginx.Dockerfile`  | ~150 MB | Immutable image for registries (Nginx)           |

All four images ship a `HEALTHCHECK` against the unauthenticated `GET /api/v1/health` endpoint (30s interval, 30s start period), so orchestrators and `depends_on: condition: service_healthy` can gate on actual readiness. The build context is trimmed by `.dockerignore` (no `.env` secrets, `vendor/`, `node_modules/`, `storage/` runtime data, or stale `public/assets/build` output baked into layers). The container check intentionally stays on the **plain** mode — never add `?deep=1` to it, so a temporarily slow database cannot trigger a restart loop.

### External Monitoring

Point an outside monitor (Uptime Kuma, Better Stack, UptimeRobot) at:

```
GET https://your-domain/api/v1/health?deep=1
```

The response is always one word — `ok` (HTTP 200) or `degraded` (HTTP 503) — plus `version` and `timestamp`. There are no per-check details: an outsider learns nothing beyond "up / not up".

Deep mode verifies:

- **Database** — a `SELECT 1` with a hard timeout (MySQL: `max_execution_time = 2000ms`); a hung connection yields `degraded`, never a hung request.
- **Storage tree** — `storage/` and `storage/cache/` exist, are writable, and accept a real probe file (permissions can lie on NFS/FUSE, so this writes and deletes one).

Deep probes are mini rate-limited per IP: [`HEALTH_DEEP_LIMIT`](../env#rate-limiting) requests per [`HEALTH_DEEP_WINDOW`](../env#rate-limiting) seconds (defaults: 30 per 60 s), then HTTP 429 with `Retry-After`. The plain endpoint is never limited.

### Why two modes?

On a healthy system both modes return the same thing — `ok` with no per-check details. That is intentional: the contract is a single word, and a healthy system has nothing more to say. The difference only appears **during an outage**:

| Situation | Plain `/health` | `?deep=1` |
|---|---|---|
| Everything healthy | 200 `ok` | 200 `ok` (looks identical — this is normal) |
| Database down | 200 `ok` (misleading) | **503 `degraded`** |
| Storage not writable | 200 `ok` (misleading) | **503 `degraded`** |

The plain endpoint deliberately never touches the database, so a down DB cannot flip it (and cannot trigger a container restart loop). Point your **external** monitor at the deep URL — pointing it at the plain URL would miss database and storage outages entirely, because visitors would see error pages while the monitor still reports "up".

::: tip Verifying deep mode works
On a healthy system you cannot tell deep mode apart from plain mode by looking at the response. To prove it works, stop the database container for a few seconds: `?deep=1` must flip to `degraded` (503) while plain `/health` stays `ok`. Then start the database again.
:::

### Apache vs. Nginx

Both web server variants run the same Vale application — only the web server differs:

- **Apache** — Uses `mod_php` for a single-process setup. Simpler, ideal for shared hosting-style deployments and `.htaccess` users.
- **Nginx** — Uses PHP-FPM behind Nginx. Better performance under high concurrency, more common in production.

Pick whichever you're more comfortable operating. Functionality is identical.

### Self-Managed vs. No-Update

- **Self-managed** (`docker/apache.Dockerfile`, `docker/nginx.Dockerfile`) — The codebase is bind-mounted from the host. Vale's in-app auto-updater writes back to the host filesystem, so updates persist across container restarts. Larger image size.
- **No-update** (`docker/no-update/*.Dockerfile`) — Code is baked into the image at build time using a multi-stage build (Node for assets, Composer for vendor, PHP for the final image). The auto-updater is effectively a no-op. The image is immutable: `.env` resets on every redeploy and all configuration must come from the orchestrator's environment. Smaller image, ready for `docker push` to a registry like Docker Hub or GHCR.

::: tip `.env` persistence
- **Self-managed**: `.env` lives on the host (bind-mounted), so it survives restarts and the web installer runs only once.
- **No-update / immutable**: `.env` is baked into the image as an empty file and **resets on every redeploy**. If `/var/www/html` is **not** a persistent volume, `.env` is lost permanently. Do **not** rely on `.env` for baked deployments — set all required variables as container environment variables (`docker run -e`, Compose `environment:`, or orchestrator secrets). Vale reads them via `getenv()`/`$_ENV`, and `storage/installed.lock` (in the persistent `storage` volume) prevents `install.php` from re-running.
:::

::: tip When to use which
- Running Vale on a single VPS and want auto-updates → **self-managed**.
- Running Vale on Kubernetes / Swarm / multiple replicas / a PaaS → **no-update** with rolling image deploys.
:::

## Production Deployment

`docker-compose.prod.yml` defines a production-ready layout with named volumes for persistent data.

```bash
# Default: Apache only (use with external DB or SQLite)
docker compose -f docker-compose.prod.yml up -d --build

# Apache + bundled MySQL
docker compose -f docker-compose.prod.yml --profile db up -d --build

# Apache + bundled PostgreSQL
docker compose -f docker-compose.prod.yml --profile db-postgres up -d --build

# Nginx + bundled MySQL
docker compose -f docker-compose.prod.yml --profile nginx --profile db up -d --build
```

### Profiles

`docker-compose.prod.yml` uses Docker Compose profiles to keep optional services off by default:

| Command | Effect |
|---------|--------|
| `docker compose -f docker-compose.prod.yml up -d --build` | Apache only (no DB) |
| `docker compose -f docker-compose.prod.yml --profile db up -d --build` | Apache + bundled MySQL |
| `docker compose -f docker-compose.prod.yml --profile db-postgres up -d --build` | Apache + bundled PostgreSQL |
| `docker compose -f docker-compose.prod.yml --profile nginx up -d --build` | Nginx only (no DB) |
| `docker compose -f docker-compose.prod.yml --profile nginx --profile db up -d --build` | Nginx + bundled MySQL |
| `docker compose -f docker-compose.prod.yml --profile nginx --profile db-postgres up -d --build` | Nginx + bundled PostgreSQL |

If you're using an external database or SQLite, omit the database profile. Set `DB_DRIVER=sqlite` or point `DB_HOST` to an external MySQL/PostgreSQL server in your `.env`.

### What the Production Compose Includes

```yaml
services:
  vale-app:
    build:
      context: .
      dockerfile: docker/apache.Dockerfile   # self-managed
    # (or use docker/no-update/apache.Dockerfile for immutable builds)
    environment:
      - APP_ENV=production                  # always production
    volumes:
      - .:/var/www/html                     # code on host (self-managed)
      - vale-storage:/var/www/html/storage  # persistent storage
      - vale-themes:/var/www/html/themes    # theme uploads
      - vale-uploads:/var/www/html/public/uploads  # media
    depends_on:
      - db
```

The `no-update` variant is included as a commented block in the same file. Uncomment it and comment out `vale-app` to switch.

### Production Environment

Create a `.env` file at the project root with at least these values:

```bash
# Application
APP_URL=http://your-server
APP_ENV=production
APP_DEBUG=false
APP_KEY=your-64-char-hex-key

# Port mapping (default: 80)
APP_PORT_APACHE=80
APP_PORT_NGINX=80

# Database (only required when using --profile db with bundled MySQL or --profile db-postgres with bundled PostgreSQL)
DB_ROOT_PASSWORD=<strong-password>
DB_USER=vale
DB_PASS=<strong-password>
DB_NAME=vale
```

For PostgreSQL, add `DB_DRIVER=pgsql` and set `DB_PORT=5432`, `DB_USER=postgres`. For local development alongside other services, override to avoid conflicts:
```bash
APP_PORT_APACHE=8080
APP_PORT_NGINX=8081
```

For external databases, set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, and `DB_NAME` in the same `.env` file. The `DB_ROOT_PASSWORD`, `DB_USER`, and `DB_PASS` values are only consumed by the bundled database containers (MySQL or PostgreSQL).

To use non-standard ports, set `APP_PORT_APACHE` and `APP_PORT_NGINX` in your `.env`.

::: warning No-Update Images
If you are using the **no-update** image variant (baked/immutable), do **not** create a `.env` file — it is part of the baked image and resets on every redeploy. Pass the same values via Compose `environment:` or `docker run -e` flags instead. See the `.env` persistence tip above.
:::

### First-Run Setup

After the containers come up, either:

1. Visit `http://your-server/install.php` to run the web installer, or
2. Run the headless commands from inside the app container — `migrate` (which also loads the default roles, permissions, and settings), `user:create` for your admin login, and `doctor` for a health check:

    ```bash
    docker compose -f docker-compose.prod.yml --profile db exec vale-app vale migrate
    docker compose -f docker-compose.prod.yml --profile db exec vale-app vale user:create --name="Admin" --email="admin@example.com" --password="your-secure-password" --role=super_admin
    docker compose -f docker-compose.prod.yml --profile db exec vale-app vale doctor
    ```

    Swap `--profile db` for `--profile db-postgres` with the bundled PostgreSQL container, or drop the flag entirely with an external database or SQLite.

The `doctor` command verifies PHP extensions, database connectivity, disk space, and migrations — exactly what the container needs to function.

## Customizing the Image

### Adding PHP Extensions

Both Apache and Nginx Dockerfiles install the full extension set Vale recommends. To add another, append to the `docker-php-ext-install` line:

```dockerfile
RUN docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    # ... existing extensions ...
    <your-extension>        # add here
```

For PECL extensions:

```dockerfile
RUN pecl install <extension> \
    && docker-php-ext-enable <extension>
```

### Changing the PHP Version

Replace the `FROM` line in your chosen Dockerfile:

```dockerfile
FROM php:@phpVersion@-apache    # or php:@phpVersion@-fpm
```

Vale requires PHP @phpVersion@+; later minor versions are supported.

### Upload Limits

Docker images ship with increased PHP upload limits for media handling:

| Setting | Value |
|---------|-------|
| `upload_max_filesize` | 128M |
| `post_max_size` | 128M |
| `memory_limit` | 512M |
| Nginx `client_max_body_size` | 128M |

To change these, edit `docker/php.ini` and `docker/nginx.conf` before building.

### Custom Nginx / Apache Config

- Apache vhost: edit `docker/vhost.conf` before building.
- Nginx config: edit `docker/nginx.conf` before building.

## Persistent Data

Production deployments should always mount the following as named volumes (or bind mounts) so they survive image rebuilds:

| Path                              | Why                                |
|-----------------------------------|------------------------------------|
| `/var/www/html/storage`           | Logs, cache, sessions, backups     |
| `/var/www/html/themes`            | Custom theme uploads               |
| `/var/www/html/public/uploads`    | User-uploaded media               |
| `/var/lib/mysql` (in db container) | MySQL data directory               |
| `/var/lib/postgresql/data` (in db-postgres container) | PostgreSQL data directory |

::: danger Database Backups
Always include a backup strategy for the MySQL volume. The `vale backup:create` CLI command works inside the container and writes to the persistent `storage/backups/` volume.
:::

## Reverse Proxy / TLS

The containers listen on port 80 inside the network. In production, put a reverse proxy in front:

- **Traefik** with automatic Let's Encrypt
- **Caddy** with `auto_https` enabled
- **Cloudflare Tunnel** for zero-config public exposure
- **Nginx Proxy Manager** for a GUI

Or expose port 80 directly if the host's firewall handles TLS termination.

When running behind a reverse proxy, set the `TRUSTED_PROXIES` environment variable so the rate limiter can read the visitor's real IP from the `X-Forwarded-For` header. Without it, all requests appear to come from the proxy's IP, bypassing per-IP rate limits.

```bash
# Docker Compose example
environment:
  - TRUSTED_PROXIES=172.16.0.0/12
```

## Health Checks

Vale's `vale doctor` command exits non-zero if any blocking check fails. Use it as a Docker `HEALTHCHECK`:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD vale doctor > /dev/null 2>&1 || exit 1
```

## Troubleshooting

### Composer / npm fails during build

Network restrictions in CI can break the `composer install` and `npm install` steps. Build with increased verbosity:

```bash
docker build --progress=plain -f docker/apache.Dockerfile .
```

### File permissions on storage

The Dockerfile sets `storage/` and `public/` to `www-data:www-data` with mode `775`. If you bind-mount from the host and the UID differs, run:

```bash
docker compose exec vale-app chown -R www-data:www-data storage public
```

### Database connection refused on first run

`depends_on` only waits for the container to start, not for MySQL to be ready. The `vale-app` service retries the connection; if it fails repeatedly, check the `db` container logs:

```bash
docker compose logs db
```

### Updates not persisting in no-update mode

Expected — the no-update image bakes the code in. Pull a new image and restart:

```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

## See Also

- [Environment Variables](../env) — full list of `.env` options
- [Deployment Index](./) — VPS, shared hosting, and bare-metal setups
- [CLI Reference](../../admin/system/cli) — `doctor`, `migrate`, `backup:create`, and more
