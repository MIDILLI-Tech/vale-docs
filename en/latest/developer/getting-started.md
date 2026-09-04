# Getting Started

This page is the single source of truth for setting up a local Vale development environment from source. If you just want to install and run a Vale site, follow the [Admin Installation](../admin/installation) guide instead.

## Prerequisites

To develop for Vale, you'll need the following installed on your local machine:

- **PHP @phpVersion@+**
- **Composer @composerVersion@** (for PHP dependencies)
- **Node.js @nodeVersion@+ & npm** (for asset building and theme development)
- **MySQL @mysqlVersion@+**, **MariaDB @mariadbVersion@+**, **PostgreSQL @pgsqlVersion@+**, or **SQLite**

See [Prerequisites](./prerequisites) for the full list of supported versions and PHP extensions.

::: tip USING DOCKER?
When running Vale in Docker, no local PHP install or database server is needed. Everything runs inside the containers. The images also ship a `vale` wrapper binary, so CLI commands become `vale <command>` instead of `php vale <command>`. See the [Docker Deployment Guide](./deployment/docker).
:::

## Install Dependencies

1. **Clone the repository**:
   ```bash
   git clone @gitRepo@.git
   cd vale
   ```

2. **Install PHP dependencies**:
   ```bash
   # End-user / production (no dev tools)
   composer install --no-dev

   # Developer (includes PHPUnit, linting, etc.)
   composer install
   ```
   ::: tip NOT CONTRIBUTING?
   If you are installing from source to *run* Vale rather than to develop it, use `composer install --no-dev` to skip the dev-only packages.
   :::

3. **Install Node dependencies** (developer only):
   ```bash
   npm install
   ```

4. **Build assets** (developer only):
   ```bash
   npm run build
   ```

## Enable Git Hooks

Vale's git hooks (a secret scan on staged files in `pre-commit`, among others) live in `.githooks/` so they are tracked and shared with the repository. Git does not look there by default, so after cloning enable them once:

```bash
git config core.hooksPath .githooks
```

This writes to your local `.git/config` (not tracked), so each developer runs it once after cloning. To verify the hooks are active:

```bash
git config core.hooksPath
# → .githooks
```

## Configure the Environment

```bash
cp .env.example .env
```
Open `.env` and set at minimum:
- `APP_URL`: your site's full URL
- `APP_KEY`: generate with `php -r "echo bin2hex(random_bytes(32));"`
- `DB_DRIVER`: `mysql` (default), `sqlite`, or `pgsql`
- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`: your database credentials
- For **SQLite**, set `DB_DRIVER=sqlite` and `DB_NAME` to the file path (e.g. `storage/database.sqlite`).
- For **PostgreSQL**, set `DB_DRIVER=pgsql` and `DB_PORT` to `5432`.

See [Environment Variables](./env) for the full list with defaults.

## Run the Installer

### Web Installer (optional)

Open your domain in a browser. The installer will guide you through database setup and admin account creation.

::: warning IMPORTANT
If `storage/installed.lock` already exists (e.g., Docker entrypoint auto-ran migrations), the installer will not run. Delete `storage/installed.lock` to re-run it.
:::

Alternatively, use the headless CLI below.

### CLI Installation (Headless)

For automated/CI setups:

**1. Prepare the environment file**

```bash
cp .env.example .env
```

Edit `.env` with your DB credentials and `APP_KEY`.

**2. Apply database migrations**

```bash
php vale migrate
```

This creates all tables and loads the built-in defaults (roles, permissions, and settings).

**3. Create your admin account**

```bash
php vale user:create --name="Admin" --email="admin@example.com" --password="your-secure-password" --role=super_admin
```

::: tip DOCKER
No local `php` needed. Inside any container, `vale <command>` is a shortcut for `php vale <command>` (the images ship a wrapper binary at `/usr/local/bin/vale`). On startup, the entrypoint automatically runs migrations if `.env` is present and populated (or if `DB_HOST`/`DB_DRIVER` environment variables are set), then creates `storage/installed.lock`. The lock file is created only after a successful migration run. To create your admin login, run:

```bash
docker compose exec vale-app vale user:create --name="Admin" --email="admin@example.com" --password="your-secure-password" --role=super_admin
```

:::

## Demo Seeder

`DemoSeeder` (`database/seeds/DemoSeeder.php`) populates the database with sample content for development and testing. Run it whenever you want a demo install:

```bash
php vale db:seed --demo
```

**What it creates:**

- **Admin user**: If no admin or super_admin user exists, it creates `admin@getvale.org` / `password123` with the `super_admin` role.
- **Subscriber user**: Creates `user@example.com` / `password123` with the `subscriber` role.
- **Blog content**: 6 sample posts, 3 categories (Technology, Design, News), 6 tags (CMS, PHP, Web, Tutorial, Design, News), and post-to-category/tag relationships.
- **Pages**: Home, About Us, Services, Contact, Privacy Policy, Terms of Service.
- **Products**: 6 sample products with variations, categories, and reviews.
- **Navigation menus**: Main Menu and Footer menus linked to pages and shop routes.
- **Orders**: 5 sample orders with items, coupons, and different statuses.
- **Forms**: A contact form with sample submissions.
- **Newsletter**: Subscribers, campaigns, and automation sequences.
- **Settings**: Enables e-commerce, multi-language content (`en,tr`), fallback originals, and the fallback content notice by default.

If the relevant records already exist, the seeder skips them to avoid duplicates.

### What you can test

The seeded data is designed to exercise the most common storefront scenarios out of the box:

- **Digital product with a hidden download URL**: The *Vale CMS Developer Guide E-Book* is a `digital` product using an **external URL** file source with **Hide URL (Proxy Download)** enabled (`download_url_proxy = 1`). Test that the real destination link stays hidden from the customer and downloads are served through the proxy.
- **A variable product with a free-text custom variation and its own shipping estimate**: The *Minimalist Cotton T-Shirt* ships with a **Custom** variation that carries a free-text **Custom Name** attribute (empty value → free-text input) plus its own **Estimated Delivery Time** override (4 to 10 days), while the base size/color variations use the parent's default. Test the front-end free-text selector and that the 4 to 10 day estimate wins where that variation is used.
- **Sale prices**: The *Wireless Noise-Canceling Headphones* (€179.99) and *Smart Fitness Watch* (€119.00) have regular and sale prices, so you can check sale pricing and badge rendering.
- **A variable product with differently priced size options**: The *Ergonomic Mechanical Keyboard* has Small / Medium / Large variations priced at €129.50 / €139.50 / €149.50.
- **Verified vs. guest reviews**: The Headphones carry an approved, *verified* 5-star review from the logged-in subscriber, while the Keyboard has a guest (unverified) 5-star review. Test review badges, moderation state, and rating aggregation.
- **Coupons**: `WELCOME10` (10% percent) and `SUMMER20` (€20 fixed with free shipping).
- **Orders in different statuses**: Completed, processing, and pending orders, including a guest order and orders that applied a coupon.
- **Membership-gated content**: Two sample posts carry `access_tags` (`bronze` / `gold`) and the Bronze & Gold membership plans seed matching tags, so you can test content gating by plan.
- **Newsletter A/B campaign & automation**: A draft A/B-tested campaign (variation B) with tracking and a weekly recurrence, plus a *Welcome Onboarding Series* automation sequence.
- **Multi-language demo**: `en,tr` content languages are enabled with original-fallback, so you can test the fallback notice and untranslated-content behavior.

## Next Steps

- [Architecture](./architecture/): understand the Domain-Driven Design layout before changing core code.
- [Theme Development](./themes): start customizing your site's appearance.
- [Testing](./testing/): run the test suite after your changes.
