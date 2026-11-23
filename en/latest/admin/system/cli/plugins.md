# Plugin Commands

Part of [CLI Commands](../cli).

Install, activate, update and remove the drop-in plugins that live outside Vale's core files.

::: tip IN THE ADMIN PANEL
**[System → Plugins](../plugins)** covers day-to-day management: install a ZIP, enable/disable, hide from navigation, check and apply updates, and delete. The operator kill switch (`.disabled` or `DISABLE_PLUGINS`) has no panel control by design.
:::

## Plugins

Site-specific drop-in extensions living in `content/plugins/` and `content/mu-plugins/`. See [Plugins](../../../developer/plugins) for the manifest format and the available extension points.

### `plugin:install`

Validates a plugin ZIP and installs it under `content/plugins/<slug>/`. The package must contain `plugin.php` at its root or inside one top-level folder; the slug comes from that folder name (or from the ZIP file name when `plugin.php` is at the ZIP root). Plugins are installed **disabled**, and an existing directory is never overwritten.

```bash
php vale plugin:install path/to/plugin.zip
php vale plugin:install path/to/plugin.zip --dry-run   # validate only
```

### `plugin:list`

Lists every installed plugin with its version, required Vale version, activation state and last recorded error.

```bash
php vale plugin:list
```

### `plugin:enable`

Activates an installed plugin. Refuses plugins whose directory or manifest is missing, or whose `requires_vale` / `requires_php` does not match this installation.

```bash
php vale plugin:enable acme-tax
php vale plugin:enable acme-tax --dry-run
```

### `plugin:disable`

Deactivates a plugin without deleting its files or its settings. This also works when a broken plugin keeps the admin panel from opening.

```bash
php vale plugin:disable acme-tax
```

### `plugin:migrate`

Runs the pending database migrations a plugin ships in `content/plugins/<slug>/migrations/`. Migrations also run automatically when a plugin is activated and on every cron run; use this command after deploying updated plugin files, or to retry a failed migration.

```bash
php vale plugin:migrate --dry-run      # list pending migrations
php vale plugin:migrate                # every enabled plugin
php vale plugin:migrate acme-tax       # one plugin
```

A failing migration is reported with its file name and stays pending, so you can fix it and run the command again.

If a migration declares a `down` step, it can be reverted:

```bash
php vale plugin:migrate --rollback acme-tax --dry-run   # show what would be reverted
php vale plugin:migrate --rollback acme-tax             # newest migration only
php vale plugin:migrate --rollback --all acme-tax       # every applied migration, newest first
```

Rollback is always explicit — deactivating a plugin keeps its tables. A migration without a `down` step cannot be reverted automatically and stays recorded.

### `plugin:check-updates`

Refreshes the cached update result for plugins that declare an update source. It never downloads or installs anything.

```bash
php vale plugin:check-updates            # every plugin with an update source
php vale plugin:check-updates acme-tax   # one plugin
```

### `plugin:update`

Downloads, verifies and installs one plugin update, then runs any pending plugin migrations. The current plugin folder is backed up first, and restored if installation or migration fails. A package that declares capabilities the installed version did not have is refused until you pass `--acknowledge-capabilities`.

```bash
php vale plugin:update acme-tax
php vale plugin:update acme-tax --acknowledge-capabilities
```

To switch off **every** plugin at once — including must-use drop-ins — create `content/plugins/.disabled`, or start the process with `DISABLE_PLUGINS=1` (for example `DISABLE_PLUGINS=1 php vale plugin:list`). Remove the file (or the variable) to re-enable them; activation state is kept either way.

---

