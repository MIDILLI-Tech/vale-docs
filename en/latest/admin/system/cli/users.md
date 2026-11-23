# User and Role Commands

Part of [CLI Commands](../cli).

Create accounts, activate or deactivate them, assign roles, reset passwords and remove users without opening the panel.

::: tip IN THE ADMIN PANEL
**[Users & Roles](../../users)** in the admin sidebar manages accounts and roles; password resets are on each user's edit screen.
:::

## Users

### `user:create`

Create a new user. Supports both interactive and non-interactive modes:

```bash
# Interactive
php vale user:create

# Non-interactive (CI/CD, scripts)
php vale user:create --name="John Doe" --email=john@example.com --password=secret --role=admin
```

| Option | Description |
|---|---|
| `--name` | User name |
| `--email` | User email |
| `--password` | User password |
| `--role` | User role: super_admin, admin, editor, author, subscriber (default: admin) |
| `--dry-run` | Show what would be created without writing to the database |

### `user:activate`

Activate or deactivate a user account. Omitting `--email` prompts for it interactively.

```bash
# Activate (default)
php vale user:activate --email=user@example.com

# Deactivate
php vale user:activate --email=user@example.com --deactivate

# Interactive: the command asks for the email
php vale user:activate
```

| Option | Description |
|---|---|
| `--email` | User email address (prompted interactively when omitted) |
| `--deactivate` | Deactivate instead of activate |
| `--dry-run` | Show what would change without updating the database |

### `user:set-role`

Replace all existing roles for a user with a single role.

```bash
php vale user:set-role --email=user@example.com --role=editor
```

| Option | Description |
| |---|
| `--email` | User email address |
| `--role` | Role slug (e.g. super_admin, admin, editor, author, subscriber) |
| `--dry-run` | Show which role would be assigned without writing to the database |

### `user:reset-password`

Reset a user's password.

```bash
php vale user:reset-password [--email=<email>]
```

Options: `--dry-run` (validates the new password and shows the target user without changing anything)

### `user:delete`

Delete a user by email.

```bash
# Interactive (asks for confirmation)
php vale user:delete

# Using email
php vale user:delete --email=user@example.com

# Permanent delete
php vale user:delete --email=user@example.com --force
```

| Option | Description |
|---|---|
| `--email` | User email address |
| `--force` | Permanently delete without confirmation |
| `--dry-run` | Show whether the user would be permanently deleted or anonymized, without changing anything |

::: tip Default behavior
Without `--force`, the account is **anonymized** (name becomes "Deleted User", email is replaced with a random address, and all personal data is cleared). The user's order history is preserved. This is the same behavior as the "Delete Account" option in the front-end account settings.
:::

::: warning Hard delete
Use `--force` only when you want to permanently remove the user and all associated data without keeping any records.
:::

::: tip CLI-created users are verified
Users created with `user:create` are automatically marked **active** and **email-verified**, so they can log in immediately; no verification email is sent.
:::

### `role:list`

List all roles with user and permission counts. Useful for finding valid role slugs before running `user:create --role=...` or `user:set-role`.

```bash
php vale role:list
```

```text
+----+--------------+--------------+--------+-------+-------------+-------------------------------+
| ID | Slug         | Name         | System | Users | Permissions | Description                   |
+----+--------------+--------------+--------+-------+-------------+-------------------------------+
| 1  | super_admin  | Super Admin  | yes    | 1     | 30          | Full system access            |
| 2  | admin        | Admin        | yes    | 0     | 30          | Site administration           |
| 3  | editor       | Editor       | yes    | 0     | 0           | Content management            |
| ...                                                                            |
+----+--------------+--------------+--------+-------+-------------+-------------------------------+
```

---

