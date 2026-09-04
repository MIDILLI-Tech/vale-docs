# Users & Roles

Manage your Vale team, control who can access the admin panel, and decide what each person is allowed to do.

## Managing Users

Go to **Users** to see everyone with an account.

- **Add User**: Create a new account with a name, email, password, and role.
- **Edit**: Update user information, change their password, or change their role.
- **Assign Roles**: Control what the user can see and do by assigning a role.

A few safety rules to know:

- You cannot delete or anonymize your own account.
- Only a Super Admin can modify or delete another Super Admin account.
- Deleting a user preserves their orders and anonymizes their comments.

## Managing Users via CLI

For bulk operations, scripting, or remote server access, you can also manage users through the CLI. See [CLI Commands: Users](./system/cli#users) for `user:create`, `user:activate`, `user:set-role`, `user:reset-password`, and `user:delete`.

## Roles & Permissions

Vale controls what each user can do through **roles**. Each role bundles a set of permissions, and each user inherits their permissions from their role.

### Default Roles

| Role | Purpose | What they can do by default |
|---|---|---|
| **Super Admin** | Full system access | Everything; cannot be limited |
| **Admin** | Site administration | Everything (can be limited per permission on the Roles screen) |
| **Editor** | Content management | Manage posts and pages, upload and manage media, manage forms and newsletter |
| **Shop Manager** | E-commerce management | Manage products and orders |
| **Author** | Writes content | Create and edit their own posts, upload media |
| **Subscriber** | Front-end account only | None (cannot enter the admin panel) |

System roles cannot be deleted, but, except for Super Admin, their permissions can be adjusted at any time.

### Managing Roles

Open **Users → Roles** to view every role and the full permission list grouped by area (Users, Content, Media, Shop, Forms, Newsletter, Settings, System, plus one group per custom content type).

- Custom roles are fully supported: combine any permissions you need and assign the role from the user form.
- Deleting a custom role immediately signs out users who held it.
- When you change a role's permissions, affected users are signed out automatically so the new permissions take effect on their next login.

### Content Type Permissions

Every custom content type gets its own permission set automatically when created. These appear under a dedicated group in the role editor and are granted to Admin roles by default.

### Publish Permissions

Publishing is controlled separately from editing. Users need publishing rights to set an item to *Published* or *Unlisted*, whether in the editor, via bulk actions, or through the API. Without it, they can only save drafts. Scheduling counts as publishing because the item goes live automatically when its date arrives.

### Forms & Newsletter Permissions

**Forms** and **Newsletter** each have a single permission covering the whole area: list, create, edit, delete, and bulk actions. They are granted to Super Admin, Admin, and Editor by default; Authors do not receive them. The form picker inside the block editor stays available to anyone who can edit content, so embedded forms keep working.

### Administrator

The **Super Admin** role has unrestricted access and cannot be limited. The **Admin** role starts with every permission but, unlike Super Admin, individual permissions can be taken away, which is useful when an administrator should manage content but not system settings.

::: warning SECURITY
Always follow the "Principle of Least Privilege": only give users the permissions they absolutely need to do their job.
:::

### Automatic Sign-Out

To keep access safe, Vale signs users out on **all devices** whenever something security-relevant changes, for example when their role or password is changed, when they are deactivated, or when their role's permissions are modified. They simply sign in again with the new permissions.

::: tip SEE ALSO
- Generate [API Tokens](./settings/advanced#api-tokens) for external apps.
- View [Security Settings](./settings/advanced).
- Developer reference: [Security: RBAC internals](../developer/security/#role-based-access-control-rbac).
:::

## Two-Factor Authentication (2FA)

Vale adds an extra layer of account security with two-factor authentication using an authenticator app (for example Google Authenticator or Authy).

### Global Settings

Go to **[Settings](./settings/) → [Registration](./settings/registration#two-factor-authentication)** to configure 2FA:

| Setting | Effect |
|---|---|
| **Enable 2FA for all users** | Makes 2FA available across the system. When off, all 2FA features are hidden. |
| **Force 2FA for all users** | Requires every user to complete 2FA setup before using the site. Only visible when the above is on. |

When 2FA is forced, users with pending setup are sent to the setup wizard no matter which page they open. Static files and sign-out stay accessible during setup.

### Admin Workflow

**Set up 2FA for a user:**

1. Open the user for editing and check **Enable Two-Factor Authentication**.
2. Save. Recovery codes are generated and shown **once**; copy and share them through a secure channel.
3. The user completes setup privately from their own account at **My Account → Security → Two-Factor Authentication**.

This keeps secrets private: the admin never sees the user's authenticator secret. When 2FA is forced for everyone, the enable checkbox is hidden because users set up 2FA themselves on their next login.

**If a user loses their device**, click **Reset 2FA** on their edit page. This clears their current setup and signs them out everywhere. They re-enroll on their next login.

**Manage an existing setup** from the user's edit page:

- **Disable** turns 2FA off for that user (shown as **Reset 2FA** when 2FA is forced for everyone).
- **Regenerate** creates a fresh set of recovery codes; old codes stop working immediately.

### How Users Enroll

Users set up 2FA from **My Account → Security → Two-Factor Authentication**:

1. **Setup**: Scan the QR code with an authenticator app or enter the secret manually.
2. **Verify**: Enter the 6-digit code from the app to confirm.
3. **Confirmed**: A confirmation page shows **recovery codes** with a print button. Store them somewhere safe.

### Recovery Codes

- Each code can be used only once.
- They are **only displayed once** after generation.
- Admins should forward codes through a secure channel (for example an encrypted message).
