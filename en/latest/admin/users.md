# Users & Roles

Manage your Vale team, control access to the admin panel, and assign precisely scoped roles and permissions.

## Managing Users

Go to **Users** to see a list of everyone with an account.
- **Add User**: Create a new account with an email and password.
- **Edit**: Update user information or change their password.
- **Assign Roles**: Control what the user can see and do by assigning one or more roles.

## Managing Users via CLI

For bulk operations, scripting, or remote server access, you can also manage users through the CLI. See [CLI Commands — Users](./system/cli#users) for `user:create`, `user:activate`, `user:set-role`, `user:reset-password`, and `user:delete`.

## Roles & Permissions

Vale uses a granular Role-Based Access Control (RBAC) system. Every administrative action in the panel is tied to a **permission slug** (e.g. `posts.edit`, `orders.delete`, `system.cache`) and every user inherits permissions through their role.

### Default Roles

| Role | Purpose | Default Permissions |
|---|---|---|
| **Super Admin** | Full system access | Everything; also bypasses all permission checks |
| **Admin** | Site administration | Everything (revocable via the Roles screen) |
| **Editor** | Content management | Posts & pages (full), media (full) |
| **Shop Manager** | E-commerce management | Products & categories (full), orders (full) |
| **Author** | Writes content | List/create/edit own posts, upload media |
| **Subscriber** | Front-end account only | None (cannot enter the admin panel) |

System roles cannot be deleted, but — except for Super Admin — their permissions can be adjusted at any time.

### Managing Roles

Open **Users → Roles** to view every role, its permission count, and the full permission catalogue grouped by module (Users, Content, Media, Shop, Settings, System, plus one group per custom content type).

- Creating, editing and deleting roles requires the dedicated **Manage Roles** (`roles.manage`) permission.
- Custom roles are fully supported: give a role any combination of permissions and assign it from the user form.
- Deleting a custom role immediately signs out users who held it.
- When you change a role's permissions, affected users are logged out automatically so the new permissions take effect on their next login.

### Content Type Permissions

Every custom content type gets its own permission set automatically when created (`list`, `create`, `edit`, `delete`, `publish`). These permissions appear under a dedicated group in the role editor and are granted to Admin roles by default.

### Administrator

The **Super Admin** role has unrestricted access and cannot be limited. The **Admin** role is seeded with every permission but, unlike Super Admin, its capabilities can be revoked per-permission — useful when an administrator should manage content but not system settings.

::: warning SECURITY
Always follow the "Principle of Least Privilege": only give users the permissions they absolutely need to do their job.
:::

### Automatic Session Invalidation

Permissions and roles are captured into the session at login. To prevent stale access, Vale bumps an internal session-version flag whenever:

- A user's role or password is changed
- A user is deactivated or anonymized
- Their role's permission set is modified
- The role itself is deleted

On the next request the session version no longer matches the database and the user is logged out on **all devices**, guaranteeing revoked permissions take effect immediately.

::: tip SEE ALSO
- Generate [API Tokens](./settings/advanced#api-tokens) for external apps.
- View [Security Settings](./settings/advanced).
- Developer reference: [Security — RBAC internals](../developer/security/#role-based-access-control-rbac).
:::

## Two-Factor Authentication (2FA)

Vale supports TOTP-based two-factor authentication to add a strong second layer of account security.

### Global Settings

Go to **Settings → Registration** to configure 2FA:

| Setting | Effect |
|---|---|
| **Enable 2FA for all users** | Makes 2FA available across the system. When unchecked, all 2FA features are hidden. |
| **Force 2FA for all users** | Requires every user to complete 2FA setup before accessing any page. Only visible when the above is checked. |

#### When 2FA is forced

If **Force 2FA** is enabled, a global middleware redirects any user with pending 2FA to the setup wizard — regardless of which page they try to visit (Shop, Blog, Admin, etc.). The following paths remain accessible during forced setup:

- `/assets/`, `/uploads/`, `/themes/` — static files
- `/logout` — so users can sign out

The middleware is locale-aware and correctly handles localized paths (e.g., `/tr/account/two-factor/setup`).

### Admin Workflow

#### Marking a user for 2FA setup (privacy-first)

When creating or editing a user, you can mark them for 2FA enrollment without seeing their secret or recovery codes:

1. Check **Mark for 2FA setup** on the user form.
2. Save the user. A pending flag is set on their account.
3. The user completes setup privately from their own account via the setup wizard at **My Account → Security → Two-Factor Authentication**.

This is the recommended workflow for privacy and security. The **Enable 2FA** checkbox (which generates and reveals secrets to the admin) is hidden when **Force 2FA** is active.

#### Resetting a user's 2FA

If a user loses their device, click **Reset 2FA** on their edit page. This:
- Clears their current 2FA secret
- Invalidates all sessions
- Sets their status to pending

The user can then re-enroll via the setup wizard on their next login.

#### Direct enable/disable

- **2FA is disabled**: An **Enable 2FA** checkbox is shown. When saved, recovery codes are generated and displayed **once** on the users list page — copy and share them securely.
- **2FA is enabled**: A status panel shows with **Disable** (turns 2FA off), **Recovery Codes** list, and **Regenerate** (generates a fresh set; old codes stop working instantly).

### User Enrollment Experience

Users access 2FA setup from **My Account → Security → Two-Factor Authentication**. The flow is:

1. **Setup** (`/account/two-factor/setup`) — Scan the QR code with an authenticator app (e.g., Google Authenticator, Authy) or enter the secret manually. The QR code is rendered with a white background for reliable scanning. The secret is saved immediately, so it remains valid even if verification fails on the first attempt.
2. **Verify** — Enter a 6-digit code from your authenticator app to confirm setup.
3. **Confirmed** (`/account/two-factor/confirmed`) — A confirmation page displays your **recovery codes** with a print button. Store them in a safe place.

### Recovery Codes

- Codes are 20-character hex strings (8 codes per set).
- They are **only displayed once** after generation.
- Each code can be used only once and is removed from the list upon consumption.
- Admins should retransmit codes via a secure channel (e.g. encrypted message).

### Automatic Session Invalidation

When 2FA is enabled, disabled, or recovery codes are regenerated for a user, the system increments a session version flag. On every subsequent request, the application compares the stored session version against the database. If they differ, the user is logged out on **all devices** and must authenticate again.
