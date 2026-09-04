# Plugins

**System → Plugins** lists the drop-in extensions installed on this site: code
that is not part of Vale itself and lives outside Vale's own files.

::: tip FOR SYSADMINS
Plugins are a sysadmin concern. **Settings → General → Features** carries a
Plugins card that links here, so the screen is one click away from the settings
pages too.

Plugin code lives in `content/plugins/<slug>/`. Drop a plugin directory there
(or into `content/mu-plugins/` for an always-on single file) and reload this
screen, or upload a ZIP with the **Install plugin** card on the screen. The
screen only reads manifests and mu-plugin headers and never calls a plugin's `register()` hook, so a
plugin that crashes on load still appears in the list and can be switched off.
:::

## Who can manage plugins

The screen and its install, enable/disable and update actions require the
**`system.plugins`** permission (**Manage Plugins**, System group). Fresh installations grant it to
**Admin** and **Super Admin** only; **Editor**, **Author** and **Shop Manager**
do not get it — they see no **Plugins** entry in the sidebar, no Plugins card in
Settings, and a direct visit to `/admin/plugins` answers 403.

To let another role manage plugins, grant **Manage Plugins** under
**Admin → Roles → (role) → Permissions**. Super Admin bypasses permission checks
and always has access. There is no separate "use" permission: the same
`system.plugins` slug covers opening the list and toggling activation, and
removing it hides every entry point again. Sidebar links added by plugins use
the `permission` declared in that plugin's `admin` block instead.

## Global switch

The card at the top of the screen is a master switch for all plugin code. It is
**on by default** and stays on for installs that never touched it.

Turning it **off** skips every plugin on the next request — regular plugins and
always-on drop-ins in `content/mu-plugins/` — and makes their `/plugin-assets/`
URLs answer 404. Nothing is deleted: the per-plugin **Enabled / Disabled** state
is kept, so switching the master back on restores exactly the previous set. The
full-page cache is flushed both ways.

While it is off, the **Plugins** entry disappears from the admin sidebar. The
screen itself stays reachable from **Settings → General → Features** (the card
shows an **Off** badge) or by its URL, and the warning banner there explains the
state with the switch to turn plugins back on.

This is a convenience switch, not the emergency brake. The operator kill switch
(`content/plugins/.disabled` or `VL_DISABLE_PLUGINS`) still overrides it and is
what you use when the admin panel itself is broken.

## Reading the list

| Column | Meaning |
|---|---|
| **Plugin** | Display name and the plugin's one-line description |
| **Version** | Version declared by the plugin (for a mu-plugin, the optional header), its license when declared, plus the last update-check result when the plugin has an update source |
| **Requires** | Vale/PHP version constraints, required PHP extensions and dependent plugins; hidden by default, enable it from **Columns** |
| **Status** | **Enabled**, **Disabled**, **Invalid**, or **Must-Use** for mu-plugins, with the pending migration count and the last run result underneath |
| **Capabilities** | Sensitive APIs the plugin declares (`env`, `process`, `filesystem_read`, `filesystem_write`, `network`, `code_execution`); hidden by default, enable it from **Columns** |
| **Installed** | Installation date |
| **Last Update** | Date of the most recent plugin update |
| **Actions** | **Update** when a newer compatible release is available, power icon (**Enable** / **Disable**), gear (**Settings**) when the plugin declares one, eye (**Hide/Show in navigation**) when it declares a sidebar link, globe (**Website**) when it declares a homepage, and trash (**Delete**); mu-plugins show a disabled trash button |

The **Columns** button at the right of the search bar lets each operator hide
optional columns. The plugin name and action columns stay fixed, and the bulk
selection checkbox is never listed.

The **status filter** next to the search box narrows the list to **Enabled**,
**Disabled** or **Must-Use** plugins. Pick a value and press **Filter**; the
current search is kept. Choose **All Statuses** to clear it.

### Sidebar visibility and order

A plugin whose manifest declares an `admin` block shows a small eye button in
its row. **Hide from navigation** removes that link from the admin sidebar for
every administrator without disabling the plugin; click **Show in navigation**
to restore it. The preference survives disabling, enabling and updating the
plugin.

Use **Reorder** at the bottom of the sidebar to change the order. Every
top-level entry — core or plugin — can be dragged. Inside a group, every child —
core or plugin — has a drag handle and can be reordered within that group; a
child cannot be moved to another group. Click **Save Order** to persist both
changes, or **Reset Order** below it to restore the default order.

A plugin that needs another plugin lists it as `plugin: <slug> <version>` and shows an amber note while the dependency is missing, disabled or on the wrong version. Enabling is refused until the dependency is active; disabling a dependency makes its dependents fail to load with that reason shown here.

A plugin that declares a `license` shows it under **Version**. A `homepage` adds a globe button that opens in a new tab. When a plugin declares a `settings` path, clicking its name opens that settings screen.

A red note under the name means the plugin cannot be used as installed — the
manifest is missing or malformed. Fix the file (or remove the folder) and reload.

An amber note is the **last error**: the plugin was switched on, but its code
raised an error while loading. You can still disable it here.

When a plugin asks for sensitive access — reading environment variables, running
shell commands, writing files, making network requests and similar — you see it
**before** any of that code runs:

- The install message lists the capabilities a new package declares.
- Clicking **Enable** scans the plugin first and opens a dialog with the
  requested capabilities; its **Enable** button stays locked while the check
  runs, and when the code uses an access the manifest did not declare.
- Selecting several plugins and pressing **Enable** opens the same dialog for
  the whole selection, listing the requested capabilities plugin by plugin
  before any of them is activated. A single refusal blocks the batch.
- An update that adds capabilities the installed version did not have stops
  before it is applied and asks you to confirm that exact version.

The same names appear as amber badges in the **Capabilities** column (hidden by
default; enable it from **Columns**), so the list stays readable without losing
the information. Vale scans the plugin's code when you enable, install or update
it and refuses the action if the code uses an access it did not declare. This is
a safety check, not a guarantee: **do not install plugins from sources you do
not trust**. The scan only looks at declared, recognizable PHP calls; it cannot
judge intent, and a plugin that is already enabled is not re-scanned afterwards.

::: warning CAPABILITIES ARE NOT A SANDBOX
A plugin that declares **network** and **filesystem_write** can download code
while it runs and execute it later; the scan happens before activation, not on
every request. Treat that combination like full code execution and install such
plugins only from sources you fully trust.
:::

## Installing a plugin

Use the **Install plugin** card at the top of **System → Plugins** to upload a
plugin ZIP. The ZIP must contain `plugin.php` at its root or inside one
top-level folder. Vale validates the manifest and installs the files under
`content/plugins/<slug>/`; the slug comes from that folder name (or from the
uploaded file name when `plugin.php` is at the ZIP root).

This uploader installs **regular plugins only**: the ZIP must contain
`plugin.php`. Must-use drop-ins have no manifest and are not accepted here; they
are single files placed in `content/mu-plugins/` by the operator (see
**Must-use drop-ins** below).

From the command line, `php vale plugin:install path/to/plugin.zip` runs the same
validation and install; add `--dry-run` to validate a package without writing
anything. Both the web card and the CLI install the plugin **disabled**, so a
package cannot start running code just because it was uploaded. Review its row
and use **Enable** when you are ready. An existing plugin folder is never
overwritten: update installed plugins through their own **Update** action
instead.

Vale also scans the package's code before it is written: if it uses sensitive
access the manifest did not declare, the install is refused. Again, this only
catches undeclared, recognizable calls — only install packages from sources you
trust.

## Enabling and disabling

Use **Enable** / **Disable** on the row. Both actions keep the plugin's files and
its settings — disabling only stops it from loading.

- Enabling is refused when the plugin's folder is gone or when it asks for a Vale
  version this installation does not have; the reason is shown at the top of the
  screen.
- Clicking **Enable** runs the security scan and shows the requested
  capabilities in a dialog before anything is activated; the action is refused
  when the code uses access the manifest did not declare.
- A disabled plugin's public assets stop being served immediately.
- Both actions flush the full-page cache, so cached guest pages do not keep showing a plugin you just disabled (or hide one you enabled).
- If a plugin declares an admin menu entry, its sidebar link appears while the plugin is enabled and disappears when you disable it.

## Updating plugins

A plugin can point to its own update source. When it does, the page shows a
**Check for plugin updates** button next to the Vale version. Checking does not change
anything on the site; it only reads the plugin's release information. Vale also
checks those feeds automatically during cron, at most once every 24 hours, when
**Enable software updates** and **Automatic update checks** are on in
**Settings → Maintenance → Software Updates**.

The same checks and updates are available from the command line:

```bash
php vale plugin:check-updates              # every plugin with an update source
php vale plugin:check-updates acme-tax     # one plugin
php vale plugin:update acme-tax            # download, verify and install
```

`plugin:check-updates` only refreshes the cached result, exactly like **Check
for updates**. `plugin:update` applies the release and runs any pending plugin
migrations, and flushes the full-page cache.

When a newer release is available and the plugin is compatible, the row shows
an **Update available** note and an **Update** button. The update is refused
before anything is downloaded when:

- the release needs a newer Vale or PHP version;
- it requires a PHP extension this server does not have; or
- it needs another plugin that is missing, disabled or on the wrong version.
- the package uses sensitive access its manifest did not declare; or
- the new package declares capabilities the installed version does not have —
  in that case Vale asks you to confirm that exact version before applying it.

If a check cannot be completed, the reason appears under the plugin version.
Plugins without an update source simply show no update controls; **Check for
updates** reports that no sources are configured.

::: tip WHAT AN UPDATE DOES
Vale downloads the release package, verifies its SHA-256 checksum, backs up the
current plugin folder, replaces the files and runs any new plugin
migrations when the plugin is enabled. If installation or migration fails, the
previous files are restored automatically.
:::

Plugin update **checks** share Vale's automatic-update schedule, but applying an
update is always **manual**: Vale never installs a plugin update by itself. When
a check finds one or more updates, the dashboard shows a **Plugin updates**
status notice linking back here. See
[Developer: Plugins → Plugin updates](../../developer/plugins#plugin-updates)
for the `updates.json` format.

## Deleting a plugin

Each row carries a **Delete** action with an **Include settings and data**
checkbox. The confirmation message changes with that choice:

- **Unchecked (default):** the plugin is disabled and its directory is deleted.
  Its `plugin:<slug>:*` settings, last-error record, cached update result and
  migration bookkeeping stay in place for a later reinstall.
- **Checked:** applied migrations are rolled back first, then the plugin
  directory, settings, last-error record, cached update result and migration
  bookkeeping are deleted. This cannot be undone.

If a migration has no `down` callable or a rollback fails, deletion stops before
any files are removed and the reason is shown at the top of the screen.

## Migrations

The **Status** column of the plugin list shows how many migrations are still pending and the outcome of the most recent run — how many were applied or reverted and when, or the failure message. "Up to date" means the plugin has no pending files.

A plugin can ship its own database changes. Turning it on applies them right
away; if a plugin's files were updated with new migrations, the next cron run
applies those too. A failed migration is shown as an error (with the file name)
and the plugin stays enabled — fix the file and run `php vale plugin:migrate`. If a migration ships a `down` step, `php vale plugin:migrate --rollback <slug>` reverts the newest one (deactivating a plugin never touches its tables).

## Must-use drop-ins (mu-plugins)

The single PHP files in `content/mu-plugins/` appear in the same table as regular
plugins, with **Must-Use** in the Status column. They have no checkbox and their
**Delete** action is disabled: they load on every request and cannot be switched
off from the panel — by design, they carry rules a site should never run without
(HTTPS, legal headers). They have no manifest and no activation state, so
**Install plugin** does not accept them; place the file over the filesystem or
through your deployment pipeline, and remove it there when it is no longer
needed.

A mu-plugin can declare its display details in an optional comment at the top of
the file. It fills the same **Version**, **License** and **Website** fields as a
regular plugin, and can also set a friendly plugin name and one-line
description. Without that comment, the file name is shown and the other fields
stay empty. A website address must start with `http://` or `https://`.

## All plugins switched off

If the whole plugin set must be turned off — for example because one of them
keeps the admin panel from opening — the banner at the top explains that the
operator kill switch is active. Remove `content/plugins/.disabled` (or the
`VL_DISABLE_PLUGINS` environment variable) to load them again. Activation state
is kept either way.

::: tip CLI EQUIVALENTS
`php vale plugin:install <zip>`, `php vale plugin:list`,
`php vale plugin:check-updates`, `php vale plugin:update <slug>`,
`php vale plugin:enable <slug>` and `php vale plugin:disable <slug>` do the same
from the terminal — see [CLI Commands](./cli#plugins).
:::

Writing a plugin is a developer task: see
[Developer: Plugins](../../developer/plugins) for the manifest format, hooks,
routes and assets.
