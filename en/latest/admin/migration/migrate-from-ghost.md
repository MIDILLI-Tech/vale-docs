# Migrating from Ghost

Vale's `import:ghost` command imports content from a Ghost JSON export file — authors, tags, posts with HTML body, feature images, SEO metadata, and publishing dates.

::: tip More than a blog, without the subscription
Loved Ghost's clean writing experience? Keep it — and gain what Ghost charges extra for. Vale bundles **memberships, e-commerce, SEO, and AI-crawler control** in one lightweight, self-hosted install.
:::

## What Gets Imported

| Data | Source | Destination |
|---|---|---|
| Authors | Ghost `users` (all roles) | `vl_users` (deactivated `subscriber` role) |
| Tags | Ghost `tags` | `vl_tags` |
| Posts | Ghost `posts` (with `html`, `excerpt`, `feature_image`, `meta_title`, `meta_description`, `og_image`, `og_description`, `twitter_image`, `twitter_description`, `published_at`, `created_at`, `updated_at`) | `vl_posts` |
| Feature images | Ghost `posts.feature_image` URL | Downloaded to the media library → `vl_posts.featured_image_id` (with `--download-media`) |
| Inline images | `<img src="…">` inside post HTML | Downloaded and rewritten to local `/uploads/…` paths (with `--download-media`) |
| SEO metadata | Ghost `posts.meta_title`, `posts.meta_description`, OG/Twitter fields | `vl_posts` SEO columns |

## How to Import

### Step 1 — Export from Ghost

1. Go to **Settings → Export** in your Ghost admin.
2. Click **Export** to download your site's JSON export file.
3. Save the file (e.g., `ghost-export.json`).

### Step 2 — Import into Vale

```bash
php vale import:ghost --file=ghost-export.json
```

Running `import:ghost` **without any flags** on an interactive terminal starts a guided wizard that asks:

1. **Export file** — path to the Ghost JSON export (skipped when `--file` is given).
2. **Download media** — whether to download feature/OG/inline images and rewrite post HTML (skipped when `--download-media` is given).
3. **Ghost base URL** — the source site URL, only asked when downloading media and `--ghost-url` is not set.
4. **Dry run** — whether to preview without writing (skipped when `--dry-run` is given).

The wizard is only shown on an interactive terminal; non-interactive contexts keep the plain flag behaviour (e.g. in scripts and CI).

To also download images and make the import self-contained:

```bash
php vale import:ghost --file=ghost-export.json --download-media --ghost-url=https://my-old-blog.com
```

- `--download-media` fetches **feature images**, **OG images**, and every inline `<img>` in post HTML, stores them in Vale's media library, and rewrites post HTML to local `/uploads/…` paths.
- `--ghost-url` is the base URL of the original Ghost site. It resolves relative references such as `/content/images/2024/01/photo.jpg`. Absolute URLs are downloaded as-is; files that do not live under Ghost's `/content/images/` folder are placed under `uploads/ghost/`.
- After downloading, thumbnails and WebP variants are generated automatically (when WebP conversion is enabled under [Settings](../settings/) → [Content](../settings/content)).
- Failed downloads (unreachable host, non-image content) are skipped with a warning — the import itself continues.

### Dry Run

Preview the import without writing anything:

```bash
php vale import:ghost --file=ghost-export.json --dry-run
```

With media preview:

```bash
php vale import:ghost --file=ghost-export.json --download-media --ghost-url=https://my-old-blog.com --dry-run
```

## Options

| Option | Description |
|---|---|
| `--file=<path>` | Path to a Ghost JSON export file (required in non-interactive mode; prompted by the wizard otherwise) |
| `--download-media` | Download feature/OG/inline images and rewrite post HTML to local paths |
| `--ghost-url=<url>` | Base URL of the source Ghost site (resolves relative `/content/images/` URLs) |
| `--dry-run` | Preview changes without writing to the database |

::: tip Security: imported users start locked
Imported authors come **deactivated** and with a **random password** — they cannot sign in until they are activated and have set a real password (via the **Forgot password** link on the login page, or by an admin):

```bash
# Activate the imported user
php vale user:activate user@example.com

# Set a new password
php vale user:reset-password user@example.com
```

See [CLI reference](../system/cli.md#user-activate) or run `php vale user:activate --help` for all options.
:::

## Notes

- All Ghost users are imported as deactivated `subscriber` accounts in Vale — roles are intentionally not mapped (see the security tip above).
- User passwords are **not migrated** — see the tip above. The **Forgot password** link on the login page is an alternative to `user:reset-password`.
- Without `--download-media`, image references stay as-is in the HTML — they keep pointing at the original Ghost site and break once it goes offline.
- Ghost post slugs are preserved as-is.
- HTML body content, excerpts, and SEO fields are imported as-is (apart from the image URL rewriting described above).
