# Real-Time Collaboration

Several admins can edit the same page or post at the same time. Vale ships the client half (Yjs document + presence carets) and a small Docker image for the server half (Hocuspocus, the backend maintained by the Tiptap team).

The saved HTML stays the source of truth: the editor keeps writing its content into the same textarea, so saving, revisions, previews and every existing block converter work exactly as before. Collaboration only changes how the editor document is kept in sync while a tab is open.

Site managers only need the switches; see [Content Settings](../admin/settings/content#collaboration) and the [Editor guide](../admin/content/editor/#real-time-collaboration).

| File | Responsibility |
|------|----------------|
| `docker/collaboration/Dockerfile` | Node 22 image for the Hocuspocus server |
| `docker/collaboration/server.mjs` | `new Server({ port, onAuthenticate })`, token check, `await server.listen()` |
| `docker/collaboration/package.json` | Single dependency: `@hocuspocus/server` |
| `resources/js/editor/collaboration.js` | Session creation, document name, initial content seeding |
| `resources/js/editor/index.js` | Adds `Collaboration` + `CollaborationCaret`, disables local undo history and draft recovery |
| `resources/views/admin/layout.twig` | Emits `window.VL_COLLAB` (enabled, URL, secret, user) |
| `config/services.php` | Exposes the three settings as Twig globals |

## Server

Build and run the image (Docker Desktop is enough for a local trial):

```bash
docker build -t vale-collaboration docker/collaboration
docker run --rm -p 1234:1234 -e COLLAB_SECRET=dev-secret vale-collaboration
```

### Several installations on one server

One Hocuspocus process can serve many Vale installations. Give each one its own token and namespace, and bind the token to the namespace on the server:

```bash
docker run --rm -p 1234:1234 \
  -e COLLAB_SECRETS='site-a:tokenA,site-b:tokenB' \
  vale-collaboration
```

Site A then sets **Shared secret** `tokenA` and **Room prefix** `site-a`; site B uses `tokenB` / `site-b`. `onAuthenticate` resolves the token to its tenant and rejects any room that does not start with `<tenant>/`, so a leaked token cannot open the other site's documents — the prefix alone would only *name* rooms differently, it would not be an access boundary.

Use the shared secret rather than `APP_KEY` for this: `APP_KEY` also encrypts stored credentials, it must never be handed to a third-party server, and rotating it would silently move every room. A plain token and an explicit prefix keep both concerns separate.

The settings screen also has a **Server** dropdown and a **Test connection** button. Providers come from the `collaboration_servers` catalog in `config/reference-data.php` — today only `private` (the image above) — with `name`, `url_placeholder` and `requires_url`; adding an entry is enough for it to appear in the admin, no template change. The test posts the URL currently typed in the form to `/admin/settings/collaboration-test`, which runs the same one-second TCP probe as the dashboard notice: it verifies the PHP host can reach the address, not that the shared secret matches (that is only checked when an editor connects).

Upstream server documentation: [Hocuspocus](https://tiptap.dev/docs/hocuspocus).

| Variable | Default | Meaning |
|----------|---------|---------|
| `PORT` | `1234` | Listen port |
| `COLLAB_SECRET` | empty | Single accepted token. Empty (and no `COLLAB_SECRETS`) accepts anyone who can reach the port |
| `COLLAB_SECRETS` | empty | Comma-separated tokens, optionally tenant-bound (`site-a:tokenA,site-b:tokenB`). Merged with `COLLAB_SECRET` |

Then set **Settings → Content → Collaboration**:

- **Enable collaboration** — turns the client on. When off, `window.VL_COLLAB.enabled` is `false` and the editor behaves exactly as before.
- **Server URL** — the WebSocket address, e.g. `ws://localhost:1234`. On an HTTPS site the browser refuses plain `ws://`, so use `wss://collab.example.com` behind a TLS-terminating proxy. While the feature is enabled, this origin is added to the Content-Security-Policy `connect-src` automatically (`https:` does not cover `wss:`); changing the URL keeps the policy in sync.
- **Shared secret** — must equal `COLLAB_SECRET`. Leave both empty for a throwaway local trial.

The dashboard shows a notice when collaboration is enabled but the URL is missing, or when the host/port does not accept a TCP connection within one second. That probe result is cached for five minutes; Hocuspocus has no HTTP health endpoint, so the check is a plain socket connect.

### Server logs

`server.mjs` writes one timestamped line per event to stdout, so `docker logs <container>` is the whole log surface. Tokens are never printed:

```text
2026-11-18T09:12:03.113Z [vale-collaboration] auth accepted room=admin/pages/5/edit
2026-11-18T09:12:03.140Z [vale-collaboration] connect room=admin/pages/5/edit editors=1
2026-11-18T09:12:41.905Z [vale-collaboration] connect room=admin/pages/5/edit editors=2
2026-11-18T09:18:22.007Z [vale-collaboration] disconnect room=admin/pages/5/edit editors=1
2026-11-18T09:19:10.442Z [vale-collaboration] disconnect room=admin/pages/5/edit editors=0 room closed
```

`auth` lines report `accepted`, `accepted (no COLLAB_SECRET set)` or `rejected`; connect/disconnect lines carry the room name and the live editor count for that room. Nothing is persisted — the lines exist only in the container log.

::: warning
The shared secret is rendered into the admin page (`window.VL_COLLAB.secret`) and stored as plain text in the `vl_settings` row for the content group. It keeps random clients out of the room; it is not per-user authorization. Rotate it in both places if it leaks.
:::

## Deploying it

The image is intentionally **not** published with the Vale release tags. It is a separate Node process with its own version, its own deployment target and a much smaller surface than the PHP app, so tying it to every Vale release would add support and supply-chain burden for an optional feature. `docker/collaboration` is the source of truth; build it where you deploy it.

```yaml
# docker-compose.yml (next to the site's own service)
services:
  collab:
    build: ./docker/collaboration
    restart: unless-stopped
    environment:
      COLLAB_SECRETS: site-a:tokenA,site-b:tokenB
    expose:
      - '1234'
```

- Put it behind the same reverse proxy as the site and terminate TLS there; the admin setting needs `wss://…`, never `ws://`, on an HTTPS site.
- `restart: unless-stopped` matters because documents live in memory: a crash drops the live rooms, while saved content is untouched.
- No ports published with `-p` are needed when the proxy is on the same network; `expose` is enough.
- CI runs `docker/collaboration` through a **build-only** workflow (`.github/workflows/collaboration-image.yml`) plus a boot smoke test. Publishing an image is a deliberate choice per deployment, not a release artefact.

## How the client connects

`createCollaborationSession()` runs before the editor is constructed and returns `null` unless every condition holds:

1. `window.VL_COLLAB.enabled` is true and `url` is non-empty.
2. The current path ends in `/<id>/edit` (for example `/admin/pages/12/edit` or, under a base path, `/sub/admin/posts/7/edit`).

The room name is that path without its leading slash, so the name is stable across reloads and shared by everyone editing the same record. The optional **Room prefix** setting (`collaboration_room_prefix`) is prepended, so two Vale installations can share one server without colliding: `site-a/admin/pages/5/edit` versus `site-b/admin/pages/5/edit`. **Create screens have no record ID yet and therefore stay single-user** — collaboration starts on the first edit after saving.

With a session, the editor is built with:

```js
StarterKit.configure({ link: false, undoRedo: false }),
Collaboration.configure({ document: session.document, field: 'default' }),
CollaborationCaret.configure({ provider: session.provider, user: session.user }),
```

Undo/redo is owned by Yjs while collaborating; the caret extension draws remote selections with the user's name and a color derived from it.

### Initial content

The database content is not pushed into the room blindly — two tabs opening an empty room would both write it. Instead `seedCollaborationContent()` waits for the provider's `synced` event and writes the saved HTML only when the Yjs fragment is still empty:

```js
if (session.document.getXmlFragment('default').length === 0) {
    editor.commands.setContent(initialHtml, { emitUpdate: false });
}
```

`emitUpdate: false` keeps the seeding out of the dirty-state guard. If the provider is still not synced after three seconds — server stopped, wrong address, blocked WebSocket — the saved content is seeded locally so the editor is never blank; those edits merge into the room when the connection returns.

### Presence

`initCollaborationPresence()` subscribes to the provider's awareness and renders a `N online` count plus one colored initial per connected editor directly above the canvas. Caret and selection colors must be **hex**: y-prosemirror rejects anything else (`unsupported color format` in the console) and paints the caret transparent, which is why `USER_COLORS` in `collaboration.js` is a fixed hex palette picked by a hash of the user name.

The strip reports the socket state from the provider's `status` event, not only the awareness map: while disconnected the awareness map still contains our own state, so a naive count would claim “1 online”. Instead the count and chips are replaced by a **!** badge with a hover tooltip (tooltip “Collaboration not available — changes are saved when you save the form.”, or “Connecting…” while the first connection is still being made), and jump/follow state resets. When the socket returns, the badge disappears and the real presence count comes back.

Each chip is a button: the first click scrolls the viewport to that editor's caret (tooltip “Click to jump to …”), a second click on the same chip starts **follow** mode, where the viewport keeps tracking their cursor as they type (tooltip “Following … — click to stop”), and a third click stops. Switching to another editor restarts at the jump step. The position comes from the awareness `cursor` relative position mapped through `relativePositionToAbsolutePosition` with the `ySyncPluginKey` binding, so following needs no DOM matching and survives remote edits. Your own chip is inert.

### Saving and drafts

`onUpdate` still serializes `editor.getHTML()` through the existing converter chain into the hidden textarea, so the form's normal submit persists the merged document. Remote changes also flow through `onUpdate`, which marks the form dirty — a collaborator should save after others edit.

Draft recovery is skipped while a session exists (`initEditorDraftRecovery({ disabled })`): a browser-local draft cannot be merged with a shared Yjs document, and restoring one would silently overwrite remote work. On create screens the session is absent, so drafts keep working there.

If the server is unreachable the provider retries in the background, the saved content appears after the three-second fallback and editing continues locally. Opening a room that already holds someone else's work while offline can duplicate paragraphs once the connection returns — Yjs merges both histories instead of choosing one.

## Trying it locally

1. Start the container above.
2. Enable collaboration, set `ws://localhost:1234` and the same secret, save the settings.
3. Open the edit screen of the same saved page or post in two windows (two tabs of the same session already form two clients; two profiles additionally show distinct names).
4. Type in one window: text, carets and block changes appear in the other.
5. Save in either window; both forms then hold the same HTML.

## Limits and failure modes

| Area | Behavior |
|------|----------|
| Persistence | The server keeps documents in memory. Restarting it drops the live room; content already saved in the database is unaffected. Add `@hocuspocus/extension-database` and a store for durable rooms. |
| Scaling | One Node process. Multiple instances need the Redis extension so rooms are shared between nodes. |
| Schema | Every client must run the same editor bundle. A stale tab (older custom node/attribute definitions) can mangle blocks it does not know: reload after a deploy. |
| Access control | The room name comes from the URL and the token is shared. Anyone who can open an admin edit screen can join its room; there is no per-user or per-document server policy. |
| Concurrent saves | Two people saving at once still go through the normal form submit — last write wins for the whole HTML body, exactly as without collaboration. |
| Offline | No offline/IndexedDB persistence is configured. The editor seeds the saved content locally after three seconds without a connection and reconnects when the network returns; offline edits then merge with whatever the room holds. |
| Mixed content | `ws://` from an HTTPS admin page is blocked by the browser. Use `wss://` in production. |
| Probe | The dashboard notice checks TCP reachability only; a port that accepts connections but speaks no Hocuspocus protocol still reports as reachable. |

## Troubleshooting

| Symptom | Check |
|---------|-------|
| No carets, no live updates, no console errors | `window.VL_COLLAB` in the browser console: is `enabled` true, `url` set, and is the path an `…/<id>/edit` screen? |
| `Collaboration authentication failed` in the console | The setting and `COLLAB_SECRET` differ, or the server was started without the variable while a secret is configured |
| Connection refused / dashboard warning | Container not running, wrong host or port, or the URL is not reachable from the admin's network |
| Editor loads empty | The room is empty **and** the textarea had no content; saving an empty document is what created that state. Restore a revision if needed |
| Duplicate content after opening two windows | Both wrote initial content into an empty room because seeding did not wait for `synced`; upgrade the bundle |
| Everything is slow with large documents | The Yjs document grows with every keystroke for the session; very long posts are better edited by one person at a time |
