# CLI Commands

::: tip AI AGENTS
Using an AI coding agent? Load the [`vale-cli-command`](../../developer/agent-skills) skill for the command skeleton, loader registration, `--dry-run`, and tests.
:::

Vale includes a powerful Symfony Console CLI for database management, cache, backups, cron, updates, users, and media operations.

## Running Commands

From the root of your Vale installation:

```bash
php vale <command> [arguments] [options]
```

List all available commands:
```bash
php vale list
```

Get detailed help for any command:
```bash
php vale help <command>
```

::: tip Docker Shortcut
Inside a Vale Docker container, `vale <command>` is a shortcut for `php vale <command>`: the images ship a `vale` wrapper binary. Inside docker, it also offers auto-completion, so you can use e.g. `vale d` and press TAB to complete `vale doctor`. This shortcut **only exists in the Docker images**; on a regular VPS or shared host, always use `php vale <command>`.

Docker commands run as `www-data`, the same user as the web server, so nothing the CLI writes (database journals, caches, logs, backups) ends up owned by root and locks the site out of its own storage.
:::

---

## Command Reference

| Area | Commands | Reference |
|---|---|---|
| Health & maintenance | `doctor`, `key:generate`, `cache:clear`, `cache:warm`, `update:check` | [Health, cache and updates](./cli/maintenance) |
| Database | `migrate`, `db:seed`, `db:reset`, `migrate:urls`, `db:optimize` | [Database commands](./cli/database) |
| Plugins | `plugin:install`, `plugin:list`, `plugin:enable`, `plugin:disable`, `plugin:migrate`, `plugin:check-updates`, `plugin:update` | [Plugin commands](./cli/plugins) |
| Backups | `backup:create`, `backup:list`, `backup:delete`, `backup:restore-all`, `backup:restore-db`, `backup:restore-files` | [Backup commands](./cli/backups) |
| Users & roles | `user:create`, `user:activate`, `user:set-role`, `user:reset-password`, `user:delete`, `role:list` | [User commands](./cli/users) |
| Media | `media:scan`, `media:webp-remove` | [Media commands](./cli/content) |
| Import & export | `import:*`, `export:products`, `export`, `import` | [Import and export](./cli/import-export) |
| Cron | `cron:run` | [Cron](./cli/cron) |
