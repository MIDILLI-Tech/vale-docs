# Dependency Scan

Vale continuously monitors its dependencies to keep them **secure**, **up to date**, and **free of End-Of-Life (EOL)** components. The checks below run automatically in CI and can also be executed manually at any time with Composer.

## Checks

| Check | Command | What it catches |
|---|---|---|
| Secret scan | `gitleaks detect` (incremental range) | API keys, passwords and tokens introduced in new commits |
| Security audit | `composer audit` | Known security vulnerabilities in Composer packages |
| npm audit | `npm audit` | Known security vulnerabilities in JavaScript packages (when `package.json` exists) |
| Freshness | `composer outdated --strict --direct` | Direct Composer dependencies that are out of date |
| npm freshness | `npm outdated` | Direct npm dependencies that are out of date |
| EOL audit | `composer run audit:eol` | Platform components that have reached End-Of-Life |

## Automatic (CI)

The **Dependency Scan** workflow (`.github/workflows/dependency-scan.yml`) runs automatically on every push to `main`/`master` and on every pull request.

The workflow:

1. **Scans the incoming commits with [gitleaks](https://github.com/gitleaks/gitleaks)**: only the diff introduced by the push/PR is scanned (`before..sha` for pushes, `base..HEAD` for pull requests), using the repository's `.gitleaks.toml` rules. Any leaked secret fails the build immediately, before dependencies are even installed. This mirrors the local pre-commit hook, but also catches direct pushes and bypassed hooks.
2. Installs Composer dependencies (`composer install`) and npm dependencies.
3. Runs `php scripts/dependency-scan.php`, which executes `composer audit` and, if a `package.json` exists, `npm audit`. The scan fails when **critical/high** security vulnerabilities are found; moderate findings are reported as warnings.
4. Runs `composer outdated --strict --direct` and `npm outdated`, failing the build if any **direct** dependency is out of date.
5. Runs `composer run audit:eol` and fails the build if a running platform component has reached EOL.

A failing dependency scan blocks the pull request until the flagged package or platform component is updated.

::: info WHY INCREMENTAL SCANNING
Full-history scans would fail permanently on any secret that ever landed in git history. The CI scans only the range a commit introduces; the local pre-commit hook covers staged changes the same way. If you suspect an old leak, run a full scan locally: `gitleaks detect --source . --config .gitleaks.toml`.
:::

## Manual (Composer)

Run the exact same checks locally:

```bash
# Security vulnerabilities in Composer packages
composer audit

# JavaScript dependencies (if package.json exists)
npm audit

# Direct dependencies that are out of date
# Exit code 0 = all up to date, 1 = at least one outdated
composer outdated --strict --direct

# Platform End-Of-Life audit
composer run audit:eol
```

`composer audit` reports known vulnerabilities in the installed packages. `composer outdated` compares the locked versions against the latest available on Packagist and, with `--strict`, returns a non-zero exit code when packages are outdated.

## EOL Audit

`composer run audit:eol` runs `scripts/audit-eol.php`, which fetches release data from [endoflife.date](https://endoflife.date) and checks these components:

- **PHP**: the currently running version.
- **Composer**: the currently installed Composer version.
- **SQLite**: the running SQLite version (rolling release, supported through 2050).
- **MySQL / MariaDB / PostgreSQL**: the required minimum versions from `config/reference-data.php` and, when a `.env` database connection is available, the **active** database version.

The audit exits with code `1` when an active component has reached EOL. Example output:

```text
+----------------------+-------+---------+--------+------------+-----------+--------------------+
| Component            | Cycle | Version | Latest | EOL Date   | Remaining | Status             |
+----------------------+-------+---------+--------+------------+-----------+--------------------+
| PHP (Running)        | 8.3   | 8.3.33  | 8.3.33 | 2027-12-31 | 504 days  | Supported          |
| Composer (Running)   | 2.8   | 2.8.3   | 2.8.12 | 2025-11-13 | Expired   | EOL (Deprecated)   |
+----------------------+-------+---------+--------+------------+-----------+--------------------+
```

### Fixing EOL components

- **Composer**: update the Composer binary itself:
  ```bash
  composer self-update
  ```
  (On Windows, run this from an **Administrator** terminal when Composer is installed in `ProgramData`.)
- **PHP / MySQL / MariaDB / PostgreSQL**: upgrade the platform component to a supported cycle. For the active database, upgrade the server (e.g. MySQL `8.0` → `8.4`) and re-run the audit to confirm.

## Keeping Dependencies Up to Date

- Update Composer packages (locks to new versions in `composer.lock`):
  ```bash
  composer update
  ```
- Update only the direct dependencies:
  ```bash
  composer update --with-dependencies
  ```
- Update npm packages (locks to new versions in `package-lock.json`) and rebuild assets:
  ```bash
  npm update && npm run build
  ```
- Update the Composer binary itself:
  ```bash
  composer self-update
  ```

::: tip SEE ALSO
- [Testing](./testing/): the PHPUnit test suite and CI setup.
- [Security](./security/): secret scanning and other repository security measures.
- [Deployment](./deployment/): supported platform versions for production.
:::
