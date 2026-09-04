# Revisions

Vale keeps a history of saved content versions so you can inspect earlier states, compare changes, and restore content when needed. Revision history is available for editable posts and pages, and for other content types that support revisions.

## Opening Revision History

1. Open an existing post, page, or supported content item in the admin editor.
2. In the **Publish** box, click **Revision History**.
3. The revision list opens in a modal and shows:
   - The revision number
   - The date and time it was created
   - The author who created the snapshot
   - Actions to **View**, **Restore**, or **Delete** the revision

Revision history is created when an existing item is saved with changed content. Saving without changes does not create a duplicate snapshot.

## Viewing a Revision

Click **View** to open the revision details. The detail view includes:

- The revision number, date, and author
- The revision title, with title changes highlighted
- A readable view of the saved content body
- Controls for comparing the revision with another version

Viewing a revision does not change the current content.

## Comparing Changes with the Diff Viewer

The revision detail view includes a built-in **diff viewer**. This is useful for seeing exactly what changed instead of comparing two long versions manually.

### Compare with the Latest Version

Click **Compare changes with latest version** to compare the selected revision with the content currently stored on the item. This lets you see how the selected historical snapshot differs from the latest content.

### Compare with the Previous Revision

If an earlier revision exists, click **Compare changes with Revision #N** to compare the selected revision with the immediately preceding revision.

The comparison is loaded on demand and can be switched between the available comparison modes. The result includes a legend identifying each side of the comparison:

- **Red** marks content from the comparison baseline or content that was removed.
- **Green** marks content present in the selected revision or content that was added.

The diff is available for the title and body content. If there are no differences, Vale displays a **No changes** message. If a revision has no earlier revision, the previous-revision comparison is not available.

::: tip
The diff viewer is a visual comparison tool only. It does not modify either version and does not automatically restore or publish anything.
:::

## Restoring a Revision

To restore an earlier version:

1. Click **Restore** in the revision list, or click **Restore this Revision** while viewing a revision.
2. Confirm the restore operation.
3. Vale saves the current state as a new revision before applying the selected revision.

This safety snapshot means a restore can be undone by restoring the newly created revision. Restoring a revision changes the item’s editable content; it does not automatically publish a draft or change its publishing status.

::: warning
Restoring replaces the current title, body, and excerpt with the selected revision’s values. Review the revision carefully before confirming.
:::

## Deleting a Revision

Click **Delete** in the revision list or revision detail view and confirm the operation. Deleting a revision is permanent and cannot be undone. Deleting a revision does not delete or change the current post, page, or product.

## Revision Limits and Pruning

Revision retention is configured in [Settings](../settings/) → [Content](../settings/content) → [Revisions](../settings/content#revisions):

- **Enable revision history for posts and pages**: Turns revision storage on or off.
- **Maximum revisions per post**: Controls how many recent revisions are retained for each item.
- Set the maximum to `0` for unlimited revisions.

When a positive limit is reached, older saved snapshots are automatically removed as new revisions are created. You can also prune revisions in bulk from [Settings](../settings/) → [Maintenance](../settings/maintenance) → [Revisions](../settings/maintenance#revisions).

::: tip
Pruning affects saved history only. It does not affect the current content, published content, media files, or URLs.
:::

::: tip SEE ALSO
- [Posts](./posts) — creating and editing posts.
- [Pages](./pages) — managing static pages.
- [Content Settings](../settings/content) — enabling revision history and configuring retention.
- [Editor](./editor) — editing content and using Vale’s block editor.
:::
