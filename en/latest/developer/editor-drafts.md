# Editor Draft Recovery

The block editor keeps a crash-safe copy of unsaved content in the browser. If the tab crashes, the browser is closed, or a save request never completes, reopening the editor restores the draft and shows a banner above the form with **Show differences** and **Discard draft**.

Site managers only need the user-facing behavior; see the [Editor admin guide](../admin/content/editor/).

| File | Responsibility |
|------|----------------|
| `resources/js/editor/draft.js` | Autosave, recovery banner, discard/dismiss, storage pruning |
| `resources/js/editor/draft-diff.js` | `renderDraftDiff()` and the comparison modal |
| `resources/js/editor/styles.js` | Banner, diff rows and legend styles (with `.dark` variants) |
| `resources/views/admin/layout.twig` | `window.VL_I18N` strings used through `tjs()` |
| `resources/js/editor/index.js` | Calls `initEditorDraftRecovery()` once per editor instance |

No dependency is involved: storage, formatting and both diff passes are hand-written.

## Storage layout

Drafts live in `localStorage` under a single prefix:

```text
vl_editor_draft_v1:<form action>|<field name>
```

For example, the body of page 1 is stored as `vl_editor_draft_v1:/admin/pages/1/edit|body`. Each record is a JSON object:

```json
{ "v": 1, "html": "<p>…</p>", "savedAt": 1763456789012 }
```

- **Scope:** the key combines the form's `action` with the field name (falling back to `id`, then `body`). A draft is therefore bound to one screen and one field — a page draft never appears in the post editor, and a revision screen never inherits the main editor's draft.
- **Per browser:** `localStorage` is per origin and browser profile. Drafts are never uploaded, never shared between devices, and invisible to other users.
- **Cap:** the newest 20 drafts are kept (`MAX_DRAFTS`); older keys are dropped on write, ordered by `savedAt`.
- **Validation:** a record with a different `v`, a non-string `html`, or unparsable JSON is deleted on read instead of being surfaced.
- **Best effort:** every storage call is wrapped in `try/catch`, so private mode or a full quota degrades to "no drafts" rather than an error.

Because the key contains the form action, renaming an admin route orphans its drafts — they stay in storage until the 20-draft cap evicts them.

## Lifecycle

| Event | Behavior |
|-------|----------|
| `input` inside the editor wrapper | Debounced save (`SAVE_DELAY_MS` = 900 ms). Every edit path (ProseMirror, the hidden textarea, the HTML-source textarea) bubbles an input event, so one listener covers all of them. |
| `pagehide`, `visibilitychange` → hidden | Immediate flush, so a closed tab or a backgrounded mobile browser does not lose the last keystrokes. |
| Flush | If the content equals the server-rendered value (after newline/whitespace normalization) the key is deleted; otherwise it is written with a fresh `savedAt`. A successful save therefore cleans up after itself. |
| Mount with a stored draft | If the draft differs from the server value it is applied to the editor and the banner appears; if it matches, the key is silently removed. |
| Mount on a different screen | `pruneSettledDrafts()` drops drafts from other screens whose content already equals the current screen's saved value — the leftover create-page draft after a successful "create" lands on the edit URL. |

The restore is applied on a `setTimeout(…, 0)` so the page's dirty guard arms first and the recovered content correctly marks the form dirty.

### Opting a field out

```html
<textarea name="body" data-editor data-draft-autosave="off">…</textarea>
```

`initEditorDraftRecovery()` returns immediately for such a field: nothing is written, nothing is restored.

The banner names the field. `data-draft-label` wins, then the matching `<label for="…">` text, then the textarea `name`, then the localizable fallback "Content".

## The recovery banner

The banner is inserted as the **first child of `<main>`** (falling back to the wrapper's parent, then `<body>`) and carries `role="status"`, so screen readers announce the recovery.

It reports the field and the save time, formatted with `toLocaleString(document.documentElement.lang)`, for example:

> **Unsaved draft found**
> body — This content was restored from a draft saved in this browser at 11/18/2026, 9:52:12 AM. Discard it to use the saved version.
> [Show differences] [Discard draft] [×]

| Action | Effect |
|--------|--------|
| **Show differences** | Opens the comparison modal (see below) |
| **Discard draft** | Confirms, puts the saved version back on screen (`applyHtml(savedHtml, { emitInput: false })`), deletes the key, resets `window.vlDirtyGuardApi`, hides the banner |
| **×** (dismiss) | Hides the banner only — the draft stays stored and comes back on the next load |

## The comparison modal

`openDraftDiff({ savedHtml, draftHtml, savedAt, onDiscard })` renders a structured editor modal (`vl-modal--draft-diff`) and is only reachable from the banner. The rendering is split from the DOM so it can be exercised in isolation:

```js
import { renderDraftDiff } from './draft-diff.js';

const { html, removed, added, changed } = renderDraftDiff(savedHtml, draftHtml);
```

### Alignment

1. Both sides are tokenized with `/<[^>]*>|[^\s<]+|\s+/g` — tags, words and whitespace are separate tokens, so a markup change inside an edited block stays visible in the row.
2. **Myers** shortest-edit-script over the tokens, capped at `MAX_EDIT_DISTANCE` = 1200. Beyond that the two documents are shown as one removed and one added block rather than a misleading partial diff.
3. Documents over 6000 tokens (`WORD_TOKEN_LIMIT`) switch to block-level tokens to keep the pass cheap.
4. The op stream is grouped into **rows**, one per block element (`p`, `div`, `h1`–`h6`, `li`, `tr`, `table`, `blockquote`, `pre`, `figure`, `br`, `hr`, …) plus newline boundaries. Equal tokens land on both sides, which keeps unchanged rows aligned.
5. A row present on one side only renders as a single `-` or `+` row. A row that changed on both sides runs a second Myers pass over just that row's tokens and renders a `-`/`+` pair with **word-level highlighting** for the differing tokens. Whitespace at the edges of a highlight is moved outside the span, so the colored background starts and ends on the word.
6. Rows are compared by **visible text** — tags dropped, common entities decoded, whitespace collapsed. Media elements (`img`, `video`, `audio`, `iframe`, `hr`, …) are the exception: they carry content without text, so their markup is compared and each counts as one change. A row that only differs in spacing, `&nbsp;` or formatting markup renders as an unchanged row, so the `−removed / +added` counters always match the highlighted content (a formatting-only edit reports "No changes.").

All content is HTML-escaped per token before it is inserted, so drafted markup can never execute in the modal.

### Presentation contract

The modal reuses the revision history diff chrome instead of introducing a second visual language:

| Piece | Class |
|-------|-------|
| Row | `.vl-diff-line` + `.vl-diff-same` / `.vl-diff-add` / `.vl-diff-del` |
| Gutter marker | `.vl-diff-marker` (`-`, `+`, empty for unchanged) |
| Word highlight | `.vl-w-del` / `.vl-w-add` |
| Legend swatch | `.vl-diff-swatch-del` / `.vl-diff-swatch-add` |

Colors come from the shared `--vl-diff-*` tokens (`public/assets/css/admin-style.css`), which already have `.dark` values. `styles.js` adds scoped rules with the same token names plus light/dark fallbacks, so the modal stays legible even when it renders outside an admin page. The legend labels are **Saved version** and **Draft**, with the `−removed / +added` counters on the right.

## Draft diff vs. revision diff

Both surfaces show "what changed", but they answer different questions and do not share an implementation.

| | Draft comparison | Revision comparison |
|---|---|---|
| Code | `resources/js/editor/draft-diff.js` (browser) | `src/Domain/Content/DiffHelper.php` (server) |
| Compares | Unsaved editor HTML vs. the saved value | A stored revision vs. the current or previous revision |
| Input | Word/tag tokens of the raw HTML | HTML reduced to one plain-text line per block (tags stripped) |
| Algorithm | Myers O(ND) | LCS dynamic programming (262,144 cell budget, positional fallback) |
| Markup changes | Visible inside a block whose text also changed | Invisible — a formatting-only edit is "no changes" |
| Delivery | Computed locally on click | Requested from `…/revisions/{id}/diff/{type}` as JSON |

Keeping them separate is deliberate: the revision view should describe editorial changes, while a draft must also reveal that only the markup changed, because that markup is what would be lost.

## Adding draft recovery to a new editor

1. Give the editor a `<textarea data-editor name="…">` inside its wrapper and keep the form `action` stable.
2. Call `initEditorDraftRecovery({ textarea, wrapper, applyHtml })` after the editor mounts. `applyHtml(html, opts)` must set the editor content without emitting an input event when `opts.emitInput === false` — that is what discard relies on.
3. Opt out with `data-draft-autosave="off"` on any field whose content should not be recoverable (for example a field driven entirely by server state).
4. If you add strings, register them in `window.VL_I18N` in `resources/views/admin/layout.twig` and add translations via the [translation workflow](./translations-tooling) — `tjs()` only translates keys present there.

## Limits

- Drafts are browser-local and **last-writer-wins**: two tabs editing the same record share one key, so the tab that saves last overwrites the other's draft.
- Recovery only applies to the editor's own content field; relation fields, taxonomies and publish settings are not drafted.
- Nothing is queued for the server: if a save fails, the draft simply remains until the next successful save or an explicit discard.
