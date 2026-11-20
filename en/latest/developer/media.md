# Media

This page documents two developer-facing media behaviors: the shared **drag-drop upload engine** used by every admin media picker, and the **subtitle/CC badge transform** applied to self-hosted videos at render time.

Site managers only need the user-facing behavior. See the [Media admin guide](../admin/content/media).

## Drag-drop upload engine

`public/assets/js/media-upload.js` is a plain, build-less script loaded once with `defer` from `resources/views/admin/layout.twig`. It powers drag-and-drop upload in every media picker (featured/OG image, product gallery, download-file and variation pickers, and the editor media library). The engine owns the visual layer (drag overlay, progress bar, feedback strip) and the transport to `POST /admin/media/upload-json-multi`.

### Wiring styles

There are two ways to attach a drop zone. Both are race-free (no load-order dependency); declarative zones are auto-registered via a `MutationObserver`, so Alpine `x-teleport` timing does not matter.

**Declarative (Alpine templates).** Put the drop attributes on the modal **panel**. Never use the full-viewport backdrop root, or the absolutely-positioned overlay/progress bars would span the screen:

```html
<div class="…modal panel…"
     data-vl-media-drop
     data-vl-media-filter="image/,video/"
     @vl:media-uploaded="handleDroppedFiles($event.detail)">
  …
</div>
```

- `data-vl-media-drop`: marks the zone for auto-registration.
- `data-vl-media-filter`: optional; a browse-json `type` value (`image/`, `video/`, `application/,audio/,text/`, `text/vtt,application/x-subrip`, or `""` for all). Mirrors what the surface's grid can show/select.
- `@vl:media-uploaded`: **required**. The engine dispatches a `vl:media-uploaded` CustomEvent (with `bubbles: true`, so the handler may live on an ancestor Alpine scope) carrying the parsed `upload-json-multi` result. A zone without any listener uploads files into the void (they land in the library, but nothing selects or refreshes); with `APP_DEBUG` on, the engine logs a console warning for such a zone.

**Programmatic (editor picker).** `resources/js/editor/media/browse.js` wires the modal imperatively:

```js
window.vlMediaUpload.dropZone(el, {
  filter:    (file) => window.vlMediaUpload.matchesFilter(file, currentMime),
  onDone:    async (result) => { /* refresh + select */ },
  onError:   (msg) => {},      // optional; overrides the built-in strip
  conflictMode: 'suffix',      // optional; passed to the server
});
```

Calling `dropZone()` again on the **same element** only swaps the options (`el.__vlMediaDropOpts`); the DOM is wired once. `filter`, `onDone`, `conflictMode` and `onError` are re-read per batch via an internal `curOpts()`. This is what makes modals that reuse one DOM node across opens safe: each open re-registers with fresh closures (current type tab, current selection) instead of running against a stale one.

### Feedback tones

Feedback goes through `showError(message, tone)` and renders in the shared strip:

| `tone` | Palette | Use |
|--------|---------|-----|
| omitted / `'error'` | red: `--vl-callout-red-*` | Real failures: no permission, rejected extension, upload failed |
| `'info'` | blue: `--vl-callout-blue-*` | Progress notices: the "N file(s) queued" message when a drop lands mid-upload |

Both token sets are redefined under `.dark`, so the strip stays legible in dark mode without a separate rule. Queuing is expected flow, not an error, which is why it uses the info tone.

### Queue and per-file errors

- **Queue:** drops that land while an upload is in flight are queued (an internal `pending` array) and stream through the same progress bar in order, never silently swallowed.
- **Per-file errors:** `upload-json-multi` responds `200` with `uploaded:[…], errors:[…]` for partial success. Rows with `file !== '*'` are surfaced in the strip as `name: reason` (capped at 3, then "N more file(s) failed."); a `file === '*'` row is fatal and shown on its own.

### Permission

`window.VL_CAN_UPLOAD_MEDIA` (set in `admin/layout.twig` from the `media.upload` permission) is checked at **drop** time. A user without the permission gets an explicit message, never a silent no-op. This is a UI guard only; the server enforces the same permission on `/admin/media/upload-json*` via `PermissionMiddleware` (`routes/admin.php`). Uploads also pass the full server-side validation in `MediaUploadService` (extension/MIME allow-lists, finfo content detection, double-extension and blocked-extension checks, SVG/image sanitization, size and rate limits).

## Subtitle / CC badge transform

At render time, `ShortcodeProcessor::process()` (`src/Infrastructure/Content/ShortcodeProcessor.php`) adds a decorative **CC badge** to every self-hosted `<video>` that carries a `<track>` element, so visitors can tell captions exist without opening the player's caption menu.

- Each matching video is wrapped in `<div class="vl-video-sub-wrap" style="position:relative">` with a `<span class="vl-video-sub-badge">CC</span>` overlay (top-right). The badge uses inline styles, so no theme CSS is required; its `aria-label`/`title` is the translated "This video has subtitles".
- **Scope:** the match is confined to a single `<video>…</video>` block by a tempered lazy glob (`(?:(?!<\/video>)[\s\S])*?`). A trackless video followed by a subtitled one is handled correctly: only the subtitled video is wrapped.
- **Idempotent:** already-wrapped videos are detected and left alone, so content that reaches the pass twice in one request (excerpt + full body) never gets a double wrapper.
- **Not applied to:** YouTube/Vimeo iframes, carousel clips, or videos without a `<track>`.
- **Reach:** the badge is added by `process()`, which the `|shortcodes` Twig filter runs for the visible body/teaser. It does **not** reach RSS/Atom feeds (those use `ShortcodeProcessor::stripForFeed()`), and on membership-locked posts only the teaser before `<!--more-->` is processed, so the locked body never leaks a badge.

Uploaded `.srt` / `.sub` subtitle files are converted to WebVTT at ingest (`SubtitleConverter`) and stored under the `.vtt` name. See the [Media admin guide](../admin/content/media) for the user-facing note.

## Profile pictures

User avatars are deliberately **not** media-library entries. They live in their own namespace so they never show up in the media browser and are never touched by the unused-media cleanup.

| Concern | Implementation |
|---|---|
| Storage | `storage/uploads/avatars/` with a random 32-character hex name; `users.avatar` stores the relative path (`avatars/….jpg` or `avatars/….png`) |
| Validation | JPEG/PNG only (`getimagesize`), size from the `avatar_max_kb` setting (default 1024 KB), clamped by `AvatarStorage::maxKilobytes()` to 64–10240 KB and never above PHP's `upload_max_filesize` |
| Processing | GD decode → centre crop to a square → resize to 256×256 → re-encode, which strips EXIF/GPS and neutralises polyglot payloads (`Infrastructure\Media\AvatarStorage`); the output is WebP while **Convert images to WebP** is on and the source format (`.jpg`/`.png`) otherwise |
| Rendering | `AvatarStorage::versionedUrl()` (Twig `avatar_url()`) returns provider URLs unchanged and resolves local paths to `/uploads/…?v=<file mtime>`, so a replaced picture is not served from the browser cache; the header avatar comes from the `user` Twig global built in `FlashMiddleware` |
| Entry points | `POST {account}/profile/avatar` and `POST {account}/profile/avatar/delete` (`AccountController`), plus the admin user edit form (`UserController::update()`) and the admin/CLI anonymize paths |
| Rate limit | `RateLimiter` bucket `avatar-upload`, keyed per user, `avatar_upload_limit` attempts per hour (default 1, 0 = unlimited) |
| Comments | `user_avatar_url(userId)` resolves the avatar once per request instead of per comment |
| Lazy loading | Content avatars (posts, listings, custom types, comments) carry `loading="lazy"` while the media **Enable Lazy Loading** setting is on (`media_lazy_loading` Twig global); header and account-menu avatars are above the fold and never lazy |

The settings form shows the effective server ceiling next to the size field (`avatar_server_max_kb` Twig global), and the front-end hints use the effective `avatar_max_kb` global, so the advertised size always matches what is accepted. A configured value above the server ceiling is stored clamped by `SettingsController::update()`.

`php vale media:scan` skips `avatars/` (`MediaScanService::findFiles()`), so the files never become `vl_media` rows and the unused-media filter cannot delete a live avatar.

### SSO precedence

Provider logins (Steam, Facebook, Google, GitHub) go through `AuthController::applySsoAvatar()`. It writes the provider URL only when the user has no avatar or the stored value is already a remote `http(s)` URL — a locally uploaded picture is never overwritten by a later sign-in. Always render through `avatar_url()`; never assume `users.avatar` is a URL.

### Cache

Avatars are part of guest-visible HTML (author bylines, comment lists), which the [page cache](./page-cache) stores. Filenames are random, so every upload produces a new URL and the previous file is deleted immediately; every avatar write path therefore calls `PageCache::flush()` so no cached page keeps pointing at a removed file. The header avatar is per-session and is never served from the page cache.

See the [Users admin guide](../admin/users#profile-pictures) for the user-facing workflow.