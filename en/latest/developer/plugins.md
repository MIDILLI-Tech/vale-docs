# Plugins (Drop-in Extensions)

::: tip AI AGENTS
Using an AI coding agent? Load the [`vale-plugin`](./agent-skills) skill for the drop-in manifest, registration, routes, hooks, and activation workflow.
:::

Vale core is updated by replacing files: `src/`, `app/`, `config/`, `routes/` and
`bootstrap/` all belong to the release. **Plugins** solve the opposite problem —
site-specific code kept outside the release.

Plugin code lives in `content/`, a directory the updater treats like `storage/`
and never deletes or overwrites, and connects to core through one entry point:
`register(App $app, ContainerInterface $c)`.

```
content/
├── plugins/
│   └── acme-tax/
│       ├── plugin.php        # manifest + register()
│       ├── src/              # PSR-4 classes
│       └── templates/        # Twig, exposed as @acme-tax
└── mu-plugins/
    └── acme-force-https.php  # always-on single file
```

::: tip UPDATES AND BACKUPS
`content/` is in the updater's protected-path list, is included in full backups,
and is excluded from published Docker images.
:::

## When a plugin, when core

| Requirement | Where it belongs |
|---|---|
| Works for every installation (new gateway, new block) | Core, with a workflow skill (`vale-payment-gateway`, `vale-shortcode`, …) |
| One site: bespoke tax rule, supplier sync, legal banner, internal route | A plugin in `content/plugins/` |
| A rule that must be impossible to switch off (HTTPS, legal headers) | A must-use drop-in in `content/mu-plugins/` |

## Writing a plugin

### 1. Create the directory

The directory name is the plugin slug: lowercase letters, digits, `-` and `_`,
starting with a letter or digit (`my-plugin`, `acme_tax_2`). Anything else is
ignored by the loader and cannot be activated.

```
content/plugins/acme-tax/plugin.php
```

### 2. Write the manifest

There is no separate `plugin.json`: `plugin.php` is the single metadata source (the
PHP equivalent of `theme.json`) and also carries the `register()` closure. It is a
plain PHP file returning an array, `include`d — never evaluated as a string,
never parsed as JSON:

```php
<?php

declare(strict_types=1);

use Psr\Container\ContainerInterface;
use Slim\App;
use ValeApp\Domain\Shared\Event\EventDispatcherInterface;

return [
    'name'          => 'Acme Tax Rules',
    'version'       => '1.0.0',
    'author'        => 'Acme',
    'description'   => 'One line shown in the plugin list',
    'license'       => 'MIT',
    'homepage'      => 'https://example.com/acme-tax',
    'updates'       => 'https://example.com/acme-tax/updates.json',
    'requires_plugin' => ['acme-core' => '^1.0', 'acme-utils'],
    'requires_vale' => '^0.77',
    'requires_php'  => '>=8.3',
    'requires_ext'  => ['curl', 'gd'],
    'capabilities'  => ['filesystem_read'],
    'priority'      => 10,

    // Optional declarative sidebar link (no nav-filter code needed)
    'admin' => [
        'label'      => 'Acme Tax',           // required, passed through __()
        'href'       => '/admin/acme-tax',    // required; must be an /admin path
        'group'      => 'group_content',      // optional; unknown → top-level link
        'permission' => 'settings.view',      // optional RBAC permission
        'icon'       => 'M3 12l2-2m0 0l7-7',  // optional SVG path
    ],

    'register' => static function (App $app, ContainerInterface $c): void {
        $events = $c->get(EventDispatcherInterface::class);

        $events->addAction('order.paid', static function ($order) use ($c): void {
            // Site-specific side effect: ERP sync, invoice numbering, …
        });

        $app->get('/acme/health', function ($request, $response) {
            $response->getBody()->write('ok');

            return $response->withHeader('Content-Type', 'text/plain');
        });
    },
];
```

| Key | Required | Meaning |
|---|---|---|
| `register` | yes | Callable receiving `App` and the PSR-11 container |
| `name` | no | Display name (defaults to the slug) |
| `version` | no | Plugin version shown in `plugin:list` (defaults to `0.0.0`) |
| `author` | no | Free text |
| `description` | no | One-line summary shown in the plugin list |
| `requires_ext` | no | PHP extensions the plugin needs (`curl`, `gd`, …); unmet → skipped, never fatal |
| `license` | no | SPDX-style label shown as a badge in the plugin list |
| `homepage` | no | Absolute `http(s)` URL, shown as a **Website** button; other schemes are ignored |
| `updates` | no | Absolute `http(s)` URL of an `updates.json` feed. HTTPS is required outside local development; without it the plugin has no update source |
| `requires_plugin` | no | Other plugins this one needs: `['acme-core' => '^1.0', 'acme-utils']` (or a plain list). The dependency must be installed, enabled and satisfy the version constraint — otherwise enabling is refused and the loader skips the plugin with a reported reason |
| `requires_vale` | no | Composer constraint; unmet → plugin skipped, never fatal |
| `requires_php` | no | Composer constraint |
| `capabilities` | no | Sensitive PHP APIs the plugin's code uses. During enable, ZIP install and update, `PluginSecurityScanner` token-scans every plugin `.php` file and refuses when an **undeclared** capability is used — declare exactly what is needed |
| `priority` | no | Lower registers first; ties break by slug |
| `namespace` | no | Defaults to `ValeApp\Plugins\<Studly>` |
| `admin` | no | Declarative sidebar link: `label`, `href` (must be `/admin…`), `group`, `permission`, `icon` |

Route and middleware callbacks must be **non-static closures** (or invokable
classes). Slim binds route handlers to the container; a static closure cannot be
bound and the route fails with `bindToContainer(): ... null returned`.

Classes under `src/` are autoloaded through that namespace by the plugin loader.
Nothing is added to `composer.json`, so `composer dump-autoload -o` stays clean.

### 3. Install and activate it

```bash
php vale plugin:install path/to/acme-tax.zip   # add --dry-run to validate only
php vale plugin:list                           # installed plugins, versions, status, last error
php vale plugin:enable acme-tax
php vale plugin:disable acme-tax
```

`plugin:install` is the CLI twin of **Install plugin** on `/admin/plugins`: it
extracts the ZIP safely, validates the manifest and installs under
`content/plugins/<slug>/` **disabled**, so review the package before enabling
it. It refuses to overwrite an existing plugin directory.

Activation is stored in the `enabled_plugins` setting as a JSON array of slugs;
the code stays on disk. Both directions flush the full-page cache, so no guest
page keeps rendering a plugin you just switched off (or misses one you enabled). `plugin:enable` refuses a plugin whose directory is missing, whose manifest is
invalid, whose `requires_vale` / `requires_php` / `requires_ext` do not match, or
whose `requires_plugin` dependency is missing, disabled or on another version —
it also fails when the code uses an undeclared [capability](#capabilities-and-the-security-scanner).
so a plugin cannot be half-activated.

### Admin menu entry

Declare an `admin` block and the plugin gets a sidebar link without any nav code.

- The link is injected **only while the plugin loads successfully**, so enabling
  or disabling the plugin adds or removes it on the next admin page — there is
  nothing to clear.
- An unknown `group` appends the link as a top-level item. Group ids come from
  `config/admin-nav.php` (`group_content`, `group_shop`, `group_system`, …).
- `href` must start with `/admin`; absolute or external URLs are ignored, and the
  base path is added for you.
- `permission` is enforced by the admin nav filter — users without it never see
  the link.
- A malformed `admin` block is ignored without failing the plugin.
- A **top-level** entry (no `group`, or an unknown one) participates in the
  sidebar drag & drop: its `plugin-<slug>` id is saved with the rest of the order
  while the plugin is enabled, so the position survives reloads. Top-level core
  and plugin entries share the same reorder mode. Inside a group every child —
  core or plugin — is draggable within that group, but a child cannot be moved
  to another group. The **Plugins** list's eye action hides or shows the
  declarative link globally (`plugin_nav_hidden`) without disabling the plugin.

For anything richer (badges, `label_cpt`-style labels, dynamic entries), use the
`admin_nav_groups` filter directly — see *Extension points* below.

### 4. Templates

A `templates/` directory is registered as the Twig namespace `@<slug>`:

```twig
{% include '@acme-tax/notice.twig' %}
```

Front-end template *overrides* (replacing a theme's `post.twig`) are not
supported yet — use a child theme for that.

## Capabilities and the security scanner

By default a plugin is ordinary PHP code under `src/Application/Plugin`-level
constraints: it can hook, route and use Vale's repositories. Code that reaches
behind that abstraction — reading `$_SERVER`, shelling out, writing raw files,
opening sockets — must say so in the manifest:

```php
'capabilities' => ['filesystem_read', 'network'],
```

The scanner recognizes these names, one capability each:

| Capability | Recognized calls |
|---|---|
| `env` | `getenv()`, `putenv()`, `$_ENV`, `$_SERVER` |
| `process` | `exec()`, `shell_exec()`, `system()`, `passthru()`, `proc_open()` and the other `proc_*` calls, `popen()`, `pcntl_exec()`, `pcntl_fork()`, backtick execution |
| `code_execution` | `eval()`, `assert()` |
| `filesystem_read` | `file_get_contents()`, `fopen()` (read modes), `fread()`, `file()`, `readfile()`, `scandir()`, `glob()`, `is_file()`, `is_dir()`, `file_exists()`, `filesize()`, `filemtime()`, `filectime()`, `parse_ini_file()` |
| `filesystem_write` | `file_put_contents()`, `fwrite()`, `fputs()`, `unlink()`, `rmdir()`, `mkdir()`, `rename()`, `copy()`, `chmod()`, `chown()`, `touch()`, `fopen()` (write modes) |
| `network` | `curl_init()` and the other curl functions, `fsockopen()`, `pfsockopen()`, `stream_socket_client()`, `dns_get_record()`, `gethostbyname()` |

Five things to know:

- **It is a name match, not a sandbox.** Every plugin source file (a bundled
  `vendor/` included) is tokenized, and an undeclared recognized name blocks
  enabling, ZIP install and update with an `InvalidPluginException` naming the
  file, line and expression. Qualified calls count too — `\shell_exec()` and
  `Support\shell_exec()` are matched by their last segment. Method calls
  (`$x->file()`), method definitions, `SomeClass::file()` references and
  `new \Class()` are not treated as calls.
- **Dynamic calls are only partly resolved.** A literal
  `call_user_func('shell_exec', …)`, a variable bound to one string
  (`$fn = 'scandir'; $fn()`), `use function … as …` imports (group imports
  included), parenthesized expressions (`('sys' . 'tem')()`) and
  concatenations of string literals (`'sys' . 'tem'`, also inside `fopen()`
  modes) are classified; a name computed at runtime, a variable with several
  assignments, `include`/`require`
  (normal plugin behaviour) and database reads through DBAL are not. Files are
  scanned beyond `*.php` (`.inc`, `.phtml`, `php3`–`php8`), and
  `SplFileObject`, `DirectoryIterator`, `SplFileInfo`, `hash_file()` and
  `stat()` count as `filesystem_read`. The arguments it reads are `fopen()`'s
  mode and `call_user_func()`'s literal target: `'r'` needs
  `filesystem_read`; `'w'`, `'a'`, `'x'`, `'c'` need `filesystem_write`; a `+`
  mode needs both, and so does a mode it cannot resolve statically. Everything
  else is classified by name, so `file_get_contents('https://…')` needs
  `filesystem_read`, not `network`.
- **It cannot stop code that arrives later.** A plugin that declares `network`
  and `filesystem_write` can download PHP at runtime and `include` it: the scan
  runs at enable/install/update time and never sees that code. Treat a manifest
  that combines both as equivalent to `code_execution`. The scan remains a
  code-review aid, never proof that a plugin is safe.
- **Extra declarations are harmless.** `capabilities` is a claim, not a
  measured fact; declaring more than you use only widens the warning badges.
- **The gate is activation-time, not runtime.** Enable, ZIP install and
  update are scanned; the loader does not re-scan a plugin on every request,
  and an already-enabled plugin that is hand-edited afterwards is not caught.

On `/admin/plugins` the claimed capabilities appear as amber badges in the
**Capabilities** column (hidden by default; enable it from **Columns**);
clicking **Enable** scans the plugin first and asks for confirmation of the capabilities it requests (the bulk **Enable** action runs the same scan for every selected plugin in one request). An update is
stopped the same way when the new package declares capabilities the installed
version did not: the screen asks for confirmation of that exact version
(`php vale plugin:update <slug> --acknowledge-capabilities` in the CLI).

## Admin screen

**System → Plugins** (`/admin/plugins`, permission `system.plugins`) is the
UI twin of the CLI commands:

| Column | Shows |
|---|---|
| Plugin | Display name and description |
| Version | Manifest `version` (mu-plugins: optional header `Version`), its `license` when declared, plus the latest update-check result when the plugin declares an `updates` feed |
| Requires | Vale/PHP constraints, PHP extensions (`ext:`) and dependent plugins (`plugin:`); hidden by default, enable it from Columns |
| Status | Enabled, Disabled, Invalid (manifest cannot be parsed), or Must-Use for mu-plugins, plus the pending migration count and the outcome of the last run |
| Installed | Installation date |
| Last Update | Date of the most recent plugin update |
| Actions | Update when a compatible release is available, power icon (Enable / Disable), gear (Settings) when a `settings` path is declared, eye (Hide/Show in navigation) when the plugin declares a sidebar link, globe (Website) when a `homepage` is declared, and trash (Delete); an invalid plugin cannot be switched on but can still be deleted, while mu-plugins show a disabled Delete |

The row's **Delete** action always disables the plugin and removes
`content/plugins/<slug>/`. Without **Include settings and data** its
`plugin:<slug>:*` settings, failure entry, cached update result and migration
bookkeeping stay for a reinstall. With the checkbox, every applied migration is
rolled back first (newest first), then those records are deleted too. A failed or
missing rollback aborts the deletion before any files are removed.

Must-use drop-ins from `content/mu-plugins/` are listed in the same table as
**Must-Use** rows. They share its search and pagination, but have no checkbox or
state-changing actions; their **Delete** button is disabled because the file is
managed on the server.

The list supports search, an Enabled / Disabled / Must-Use status filter (the
current search is kept) and pagination. Up to
`CLIENT_SIDE_SEARCH_FETCH_LIMIT` plugins (also mirrored to JavaScript as
`VL_CLIENT_SEARCH_FETCH_LIMIT`) are filtered and paged in the browser; larger
lists are filtered and sliced server-side.

Rows show an amber note while a `requires_plugin` dependency is missing, disabled
or on the wrong version. Rows with a runtime failure also show the last recorded
error from the `plugin_failures` setting.

The screen, its `/admin/plugins/toggle` action and the sidebar entry all require
the `system.plugins` permission. There is no separate “use” ability — one slug
covers viewing, toggling and installing. Fresh installs grant it to `super_admin` and
`admin`; the upgrade migration adds it to existing role assignments. The page
only reads manifests and mu-plugin headers and never calls a plugin's `register()` hook, so a plugin
whose `register()` crashes still shows up here and can be switched off. A banner
appears when the operator kill switch (`content/plugins/.disabled` or
`VL_DISABLE_PLUGINS`) is active.

### Assets

`content/plugins/<slug>/assets/` is served by core at
`/plugin-assets/<slug>/<path>`, so a plugin needs no web-server alias:

```php
$css = plugin_asset_url('acme-tax', 'css/acme.css');
// → /plugin-assets/acme-tax/css/acme.css (APP_URL subdirectory included)
```

Rules enforced by `PluginAssetResolver`:

- **Enabled plugins only** — a disabled plugin (or an operator-disabled install)
  answers 404, so no stale asset URL survives deactivation.
- **Extension whitelist** — `css`, `js`, `mjs`, `json`, `map`, `txt`, `vtt`,
  `svg`, `png`, `jpg`, `jpeg`, `gif`, `webp`, `avif`, `ico`, `woff`, `woff2`,
  `ttf`, `otf`, `eot`, `mp4`, `webm`, `mp3`, `wasm`. PHP, HTML and every other
  executable or markup type is refused.
- **Path containment** — traversal, dotfiles and symlink escapes return 404.
- **Caching** — `Cache-Control: public, max-age=3600` with `nosniff`; add a
  `?v=` query string when you change a file.

To expose `plugin_asset_url()` inside Twig, register your own function in
`register()`:

```php
$twig = $c->get(\Slim\Views\Twig::class)->getEnvironment();
$twig->addFunction(new \Twig\TwigFunction('acme_asset', static fn (string $p): string => plugin_asset_url('acme-tax', $p)));
```

## Plugin updates

A distributed plugin can publish an `updates.json` feed and point its manifest at
it. The admin screen checks the feed from **System → Plugins**, and
`php vale plugin:check-updates [slug]` does the same from the CLI; a plugin
without the key is installed and managed manually.

```php
'updates' => 'https://example.com/acme-tax/updates.json',
```

The feed describes one release. It is metadata only; Vale downloads and installs
the ZIP itself:

```json
{
  "version": "1.2.0",
  "download_url": "https://example.com/acme-tax-1.2.0.zip",
  "sha256": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  "requires_vale": "^0.77",
  "requires_php": ">=8.3",
  "requires_ext": ["curl"],
  "requires_plugin": {"acme-core": "^1.0"},
  "changelog": ["Fixed the tax threshold"]
}
```

| Field | Required | Meaning |
|---|---|---|
| `version` | yes | New plugin version. It must be newer than the installed one |
| `download_url` | yes | Absolute HTTPS URL of the release ZIP |
| `sha256` | yes | 64-character hexadecimal SHA-256 of the ZIP |
| `requires_vale` | no | Composer constraint checked against the running Vale version |
| `requires_php` | no | Composer constraint checked against the running PHP version |
| `requires_ext` | no | Required PHP extensions; a missing one blocks the update |
| `requires_plugin` | no | Plugin dependencies, checked like the manifest: installed, enabled and version-compatible |
| `changelog` | no | Short release lines carried by the feed and cached with the check result |

The release ZIP must contain `plugin.php` either at its root or inside one
top-level folder. After download, Vale parses that manifest again and requires
its `version` to match the feed and its `requires_*` values to pass. A package
without a matching, newer manifest is rejected.

Apply an available release from the CLI with `php vale plugin:update <slug>`.
It runs the same download, checksum, backup, migration and rollback path as the
admin **Update** button.

**Installation flow**

1. The feed is fetched through `SafeRemoteFetcher`; HTTPS and redirect/SSRF
   checks apply. The result is cached in the `plugin_update_status` setting.
2. The ZIP is downloaded to `storage/cache/plugin-updates/` and its SHA-256 is
   verified.
3. Entries are extracted individually; absolute paths, `..` segments and
   symbolic links are rejected.
4. The new package's manifest is parsed and a [capability scan](#capabilities-and-the-security-scanner)
   runs against it; an undeclared capability aborts the update.
5. The current plugin folder is copied to
   `storage/backups/plugins/plugin-<slug>-…/` before the files are replaced.
6. Pending migrations run when the plugin is enabled. If installation or
   migration fails, Vale restores the backup automatically.

The feed is not signed. HTTPS and the mandatory SHA-256 are the integrity
boundary; keep the update host under your control. Cron refreshes the cached
status on Vale's software-update schedule (at most once every 24 hours), but it
never applies a plugin update automatically.

### Installing from the admin panel

The **Install plugin** card on `/admin/plugins` accepts a ZIP with `plugin.php`
at its root or inside one top-level folder. Vale parses the package manifest,
requires a valid slug from the folder (or uploaded file) name, and installs it
disabled under `content/plugins/<slug>/`. An existing directory is never
overwritten, and no plugin code is enabled by the upload itself. The package
passes the same [capability scan](#capabilities-and-the-security-scanner) as an
update before its files are written.

This path is for **regular plugins only**. A must-use drop-in has no manifest
and lives directly in `content/mu-plugins/`; it cannot be installed from the
admin ZIP uploader or the plugin list.

## Migrations

Schema changes ship inside the plugin: `content/plugins/<slug>/migrations/`, one
file per migration named `YYYYMMDDHHMMSS_snake_name.php` (the file name defines
the order). Each file returns an `up` callable, or the callable itself. Add a `down`
callable next to it to make the migration reversible:

```php
<?php

declare(strict_types=1);

return [
    'up' => static function (\Doctrine\DBAL\Connection $db): void {
        $db->executeStatement(
            'CREATE TABLE ' . VL_DB_PREFIX . 'acme_notes (
                id INTEGER PRIMARY KEY,
                order_id INT NOT NULL,
                note VARCHAR(255) NOT NULL
            )'
        );
    },
    'down' => static function (\Doctrine\DBAL\Connection $db): void {
        $db->executeStatement('DROP TABLE ' . VL_DB_PREFIX . 'acme_notes');
    },
];
```

- **Cross-database SQL.** Migrations run on MySQL/MariaDB, PostgreSQL and SQLite:
  use `INT`, `VARCHAR`, `CURRENT_TIMESTAMP`, `COALESCE()`; never `||` for
  concatenation. Prefix tables with the `VL_DB_PREFIX` constant.
- **Run once.** Applied file names are recorded per plugin in the
  `plugin_migrations` setting. Renaming a migration therefore runs it again —
  don't rename shipped files.
- **Not transactional.** MySQL auto-commits DDL, so keep each file small and
  prefer idempotent statements (`CREATE TABLE IF NOT EXISTS`, additive `ALTER`).

### When migrations run

| Trigger | What happens |
|---|---|
| Activation (`plugin:enable`, admin toggle) | The plugin's pending migrations run immediately |
| Cron (`cron:run`, page-load cron) | Pending migrations of every enabled plugin run |
| `php vale plugin:migrate [slug] [--dry-run]` | Manual run, for files added after a deploy |

### Rollback

```bash
php vale plugin:migrate --rollback acme-tax --dry-run   # preview the down steps
php vale plugin:migrate --rollback acme-tax             # revert the newest migration
php vale plugin:migrate --rollback --all acme-tax       # revert everything, newest first
```

Rollback is explicit and per plugin — deactivating a plugin or a cron run never
reverts schema. A migration without a `down` callable aborts the rollback and
stays recorded, so add `down` when the first version ships.

A failing migration is reported with its file name and is not recorded, so it is
retried after the fix. On activation the plugin stays enabled (its `register()`
still runs) — the panel and the CLI show the error. Mu-plugins have no directory
of their own; put schema work in a regular plugin.

## Must-use drop-ins

`content/mu-plugins/*.php` files need no manifest and no activation. Each file
returns a callable and is loaded before every regular plugin. An optional
WordPress-style header block supplies the name, version, description, license
and website shown in **System → Plugins**; without it the file name is used and
the other fields stay empty:

```php
<?php

/**
 * Plugin Name: Demo Must-Use
 * Version: 1.0.0
 * Description: Adds a response header.
 * License: MIT
 * Website: https://example.com
 */

declare(strict_types=1);

return static function (\Slim\App $app, \Psr\Container\ContainerInterface $c): void {
    $app->add(function ($request, $handler) {
        return $handler->handle($request)
            ->withHeader('Strict-Transport-Security', 'max-age=31536000');
    });
};
```

`Version`, `License` and `Website` are displayed in the same columns as regular
plugins (`Plugin URI` is accepted as an alias for `Website`; only absolute
http(s) URLs are used). They are the right place for rules a site must never run
without. Because they run on every request, keep them small and
dependency-free. They are not distributed as ZIP plugins and have no admin
upload path — install the file over the filesystem or through your deployment
pipeline.

## Extension points

| Need | Mechanism |
|---|---|
| Custom route | `$app->get()/post()/map()` in `register()` |
| Static assets | `content/plugins/<slug>/assets/` → `plugin_asset_url()`, served at `/plugin-assets/<slug>/…` |
| Schema changes | `content/plugins/<slug>/migrations/` → run on activation, in cron, or with `php vale plugin:migrate` |
| DI override | `$c->set(Interface::class, $implementation)` |
| React to an event | `EventDispatcherInterface::addAction()` — see [Hooks & Events](./hooks) |
| Transform a value | `addFilter()` / `applyFilter()` |
| Admin sidebar entry | `addFilter('admin_nav_groups', …)` before the base-path prefixing step |
| Home page title | `addFilter('front_page_title', fn($title, $entityTitle, $path) => …)` — runs for every front page; check `$entityTitle === null` and the path to target the home page only |
| Settings screen link | `'settings' => '/admin/<slug>'` in `plugin.php` — renders a **Settings** button and makes the plugin name clickable on `/admin/plugins` |
| Declarative admin link | `'admin' => ['label', 'href', 'group', 'permission', 'icon']` in `plugin.php` — added/removed with activation |
| Twig templates | `templates/` → `@<slug>/…` |
| Stored settings | `SettingsRepositoryInterface`, keys of the form `plugin:<slug>:<key>` |

Plugin routes are registered **before** the `/{path:.+}` page catch-all, so a
plugin route wins over a page with the same path. Pick a distinctive prefix.

## Ordering and isolation

- Enabled plugins are validated first (manifest, slug, version gates), then
  registered by ascending `priority`.
- A broken plugin is skipped, never fatal: the failure is logged and stored in
  the `plugin_failures` setting (one write per distinct message, so a plugin
  that throws on every request does not hammer the database).
- A missing plugin directory — for example a plugin deleted without disabling
  it — is reported the same way.
- The admin **Global switch** (`plugins_enabled` setting, default `1`) makes the
  loader skip every plugin *and* mu-plugin when it is `0`, without touching the
  `enabled_plugins` list; `/plugin-assets/` then answers 404. The operator kill
  switch still takes precedence.

## Emergency brake

If a plugin breaks the admin panel, the panel cannot be used to disable it.
Both brakes work before any plugin code is included:

```bash
touch content/plugins/.disabled   # disables every plugin, mu-plugins included
rm content/plugins/.disabled      # re-enable
```

```bash
VL_DISABLE_PLUGINS=1 php vale plugin:list
```

`php vale plugin:disable <slug>` keeps working too as long as the database and
`APP_KEY` are healthy.

## Docker and the updater

- **Mutable** images bind-mount the project: `content/` is the host directory,
  edit and reload.
- **Immutable** images ship an empty `content/`; mount the `vale-content` named
  volume from `docker-compose.prod.yml` and copy plugins into the container.
- `content/plugins/*` and `content/mu-plugins/*` are git-ignored (only the
  `.gitkeep` files are tracked) and excluded from images, so a site's own code
  never enters the Vale repository or a published image.
- The installer checks both directories are writable, next to `storage/` and
  `themes/`.

## Current limitations

The only deliberate boundaries today:

- No front-end template overrides — a plugin cannot replace `post.twig`; use a
  child theme for that.
- Plugin updates are opt-in through `updates.json`; checks run on Vale's
  24-hour software-update schedule, but applying an update remains manual —
  there is no plugin auto-install setting.
- Update feeds are not signed; HTTPS plus the required SHA-256 protects the
  package download.
- Dependencies are not auto-enabled, and disabling one is not cascaded: the
  dependents stop loading and the reason appears in the plugin list.
- Admin menu children can be reordered inside their own group (core or plugin); a child cannot be moved to another group.
- The [capability scan](#capabilities-and-the-security-scanner) runs at enable,
  ZIP install and update time only. The loader does not re-scan a plugin on
  every request, and a hand-edited, already-enabled plugin is not caught — the
  gate is an install-time code review, not a sandbox.

## Related

- [Hooks & Events](./hooks) — the action/filter system plugins attach to.
- [Architecture](./architecture/) — the layers a plugin calls into.
- [CLI Reference](../admin/system/cli) — `plugin:list`, `plugin:enable`, `plugin:disable`, `plugin:migrate` (incl. `--rollback`).
- [Agent Skills](./agent-skills) — the `vale-plugin` skill for AI-assisted work.
