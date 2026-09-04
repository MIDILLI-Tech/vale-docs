# CapRover Deployment

Deploy Vale to CapRover using the built-in `captain-definition` file.

## Prerequisites

- A CapRover server with a wildcard DNS (e.g., `*.example.com`)
- A domain/subdomain pointed to your CapRover server
- Docker installed on the CapRover node

## Quick Deploy

```bash
# Using CapRover CLI (recommended)
caprover deploy \
  --caproverUrl http://caprover.example.com \
  --caproverPassword YOUR_CAPROVER_PASSWORD \
  --caproverApp vale-app
```

### Without local CapRover CLI

If you don't have the `caprover` CLI installed, use the official Docker image:

```bash
docker run -it --rm \
  -v $(pwd):/app \
  -w /app \
  caprover/cli-caprover:latest \
  sh -c "git config --global --add safe.directory '*' && caprover deploy \
  --caproverUrl http://caprover.example.com \
  --caproverPassword YOUR_CAPROVER_PASSWORD \
  --caproverApp app-name-on-captain"
```

Or as a single line:

```
docker run -it --rm -v "${PWD}:/app" -w /app caprover/cli-caprover:latest sh -c "git config --global --add safe.directory '*' && caprover deploy --caproverUrl http://caprover.example.com --caproverPassword YOUR_CAPROVER_PASSWORD --caproverApp app-name-on-captain"
```

::: warning PASSWORD
Never commit your CapRover password to version control. Use environment variables or a secrets manager.
:::

## captain-definition

The `captain-definition` file at the project root configures CapRover:

```json
{
  "schemaVersion": 2,
  "dockerfilePath": "./docker/Dockerfile",
  "template": {
    "volumes": [
      {
        "name": "vale-storage",
        "mount": "/var/www/html/storage",
        "size": "2Gi"
      },
      {
        "name": "vale-themes",
        "mount": "/var/www/html/themes",
        "size": "500Mi"
      }
    ]
  }
}
```

### Key Choices

- **Immutable image** (the `docker/Dockerfile` defaults: `VARIANT=apache`, `FLAVOR=immutable`): Code is baked into the image. CapRover manages deploys, not bind-mounts.
- **Persistent volumes**: Add `vale-storage` (2Gi) and `vale-themes` (500Mi) via the captain-definition `template.volumes`. These directories are managed by CapRover. Do not mount a named volume over `.env` (file mounts do not persist reliably). `storage/` holds logs, cache, sessions, uploads, and backups. `themes/` holds uploaded themes.
- **`.env` is ephemeral**: The Docker image ships with an empty `.env` file. The web installer writes configuration into it. At runtime, Vale reads CapRover's **App Environment** variables directly via `getenv()`. These are the source of truth. On redeploy the `.env` resets to empty, but the app continues working from CapRover env vars.

## Environment Variables

Configure these in the CapRover dashboard under **App Environment**. Vale reads these directly from the container environment (`getenv()` / `$_ENV`). A `.env` file is **not** required.

Most variables have built-in defaults, so the **minimum set is very small**. The only two truly required values are `APP_URL` and `APP_KEY` (plus `DB_DRIVER=sqlite` if you use SQLite instead of the default MySQL). For the full list of variables and defaults, see [Environment Variables](../env).

### Minimum Required

| Variable | Description |
|----------|-------------|
| `APP_KEY` | Run `vale key:generate` locally and paste the result. **Must be stable** because it encrypts sessions, cookies, and credentials. Without it, redeploys would rotate the key and break encrypted data. |
| `APP_URL` | Your site URL (e.g., `https://vale.yourdomain.com`) |

### Only When You Use SQLite or PostgreSQL

| Variable | Description |
|----------|-------------|
| `DB_DRIVER` | Set to `sqlite` or `pgsql` (default is `mysql`). For SQLite, `DB_NAME` defaults to `storage/database.sqlite`. For PostgreSQL, `DB_PORT` defaults to `5432` and `DB_USER` defaults to `postgres`. |

### Only When You Use MySQL

| Variable | Description |
|----------|-------------|
| `DB_HOST` | Database host (default `127.0.0.1`; use CapRover's managed MySQL or an external host) |
| `DB_NAME` | Database name (default `Vale`) |
| `DB_USER` | Database user (default `root`) |
| `DB_PASS` | Database password (default empty) |

For every other variable (session, cache, rate limits, updates, …), see the full reference with defaults in [Environment Variables](../env).

::: tip Why so few are required
Config files read their values via `env('KEY', <default>)` (see `config/app.php`, `config/database.php`, `config/auth.php`, `config/cache.php`). When a variable is missing, the default is used. `APP_URL` and `APP_KEY` have no usable default, which is why only those two are mandatory.
:::

### Reverse proxy / rate limiting

CapRover terminates TLS in its own Nginx and forwards requests to the app, so Vale sees the proxy's IP (`10.0.1.13` on the `captain-overlay-network`) rather than the visitor's. Set `TRUSTED_PROXIES` to `10.0.1.0/24` (add Cloudflare's ranges only if Cloudflare can hit the container directly). Without it, geolocation stores `NULL` country/city, all visitors share one IP, and rate limits / captcha remote IP are wrong. Validate with **Admin → Settings → Analytics → IP Geolocation** (`proxy_trusted: true`). See [Environment variables](../env#trusted-proxies).

### Ready-to-Copy (SQLite)

```bash
APP_URL=https://vale.yourdomain.com
APP_KEY=
DB_DRIVER=sqlite
```

Generate `APP_KEY` with `vale key:generate` and paste the output.

### Ready-to-Copy (MySQL)

```bash
APP_URL=https://vale.yourdomain.com
APP_KEY=
DB_HOST=db
DB_NAME=vale
DB_USER=vale
DB_PASS=
```

Everything else in `.env.example` uses its default automatically, including `SESSION_SECURE` (HTTPS-only cookies are on by default unless `APP_ENV` is `local`/`dev`).

## Database

### Option A: CapRover Managed MySQL

1. In CapRover, go to **Apps → Databases** and create a MySQL database
2. Note the connection details (host, port, user, password, database name)
3. Add them as environment variables to your Vale app

### Option B: External Database

Use any MySQL 8.4+, PostgreSQL @pgsqlVersion@+, or SQLite compatible database. Add connection details as environment variables.

## First Deploy & Setup

1. Push the `captain-definition` to your project root
2. Deploy via CapRover CLI or the CapRover dashboard
3. Set the environment variables in the CapRover dashboard (**App Environment**): at minimum `APP_URL` and `APP_KEY`
4. Trigger a redeploy
5. Open `https://your-domain.com/install.php` to complete setup

::: tip AUTO-FILL
The installer pre-fills the form from your CapRover environment variables (`APP_URL`, `DB_DRIVER`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_PREFIX`, `ADMIN_NAME`, `ADMIN_EMAIL`). You only need to click through the steps and set an admin password. There is no need to retype database settings.
:::

::: tip ENVIRONMENT VARIABLES
Vale reads CapRover's **App Environment** variables directly via `getenv()` / `$_ENV`. These are the source of truth at runtime. A `.env` file is not required for the application to run. The Docker image ships with an empty `.env` so the installer can write to it. On redeploy `.env` resets to empty, but CapRover env vars remain available.
:::

## Persistent Data

| Volume | Mount | Purpose |
|--------|-------|---------|
| `vale-storage` | `/var/www/html/storage` | Logs, cache, sessions, uploads, backups |
| `vale-themes` | `/var/www/html/themes` | Uploaded themes |

::: tip BACKUPS
Back up these volumes regularly. CapRover's volume backup feature or your provider's snapshot tool can be used.
:::

## Updating Vale

1. Pull the latest code (including updated `captain-definition` and Dockerfile)
2. Push to CapRover: it rebuilds the immutable image and redeploys
3. After redeploy, run migrations manually:
   ```bash
   docker exec -it vale-showcase vale migrate --no-interaction
   ```

Auto-migrations run on boot when database configuration is available (a non-empty `.env` **or** `DB_HOST` / `DB_DRIVER` environment variables) and `vale` + `vendor/` exist in the image. `storage/installed.lock` is not required; running migrations again is safe. After a **successful** migration run the entrypoint creates `storage/installed.lock`; if the database is not reachable yet, the boot migration fails with a warning, the lock is left absent, and the container starts web once the DB comes up. So if you rely on CapRover env vars, migrations run automatically on redeploy. Run them manually only if you skipped the env vars.

## Troubleshooting

### 502 Bad Gateway after deploy

Check container logs in CapRover dashboard. Common causes:
- Missing `APP_KEY`: run `vale key:generate` and set `APP_KEY`
- Database connection failure: verify `DB_HOST`, `DB_PORT`, credentials
- Port conflict: ensure CapRover's HTTP port mapping is correct

### Migrations not running

Migrations auto-run on boot when database config is available (non-empty `.env` or `DB_HOST`/`DB_DRIVER` env vars). If you see "Skipping auto-migration", either `vale` or `vendor/` is missing from the image; "No database configuration found" means no DB env vars are set. A migration that fails because the database is not ready yet leaves `storage/installed.lock` absent. Re-run once the database is reachable:
```bash
docker exec -it vale-showcase vale migrate --no-interaction
```

### vale doctor reports "not installed"

`vale doctor` treats the app as uninstalled when `storage/installed.lock` is missing **and** no database is configured (`DB_DRIVER=sqlite` requires `DB_NAME`; MySQL requires `DB_HOST` + `DB_NAME`). On a fresh container both are absent, so the doctor warns accordingly. Complete the installer at `/install.php` once (it writes `installed.lock` into the persistent volume), or configure the database env vars and run `vale migrate`.

### File permissions

The entrypoint sets `www-data:www-data` ownership on `storage/` and `themes/` (the only writable paths; `public/` is served read-only). If you see permission errors, check that the volumes are mounted correctly.

### Theme assets returning 404

Ensure the `vale-themes` volume is mounted at `/var/www/html/themes`. The Apache vhost in the Docker image includes an `Alias /themes` directive.

### Geolocation empty or everyone shares one IP

Vale sees CapRover's Nginx (`10.0.1.13`) instead of the visitor. Set `TRUSTED_PROXIES=10.0.1.0/24` in the CapRover app environment. Verify with **Admin → Settings → Analytics → IP Geolocation** (`proxy_trusted: true`). Only new pageviews receive geolocation data after the change.
