# Cron Commands

Part of [CLI Commands](../cli).

Run Vale's scheduled jobs from the terminal or a system crontab instead of the page-load or HTTP cron modes.

::: tip IN THE ADMIN PANEL
**[Settings → Maintenance → Scheduled Tasks](../../settings/maintenance#scheduled-tasks-cron)** configures the cron mode, the secure HTTP URL and a manual run; this command is the alternative for a real system crontab.
:::

## Cron

### `cron:run`

Run all scheduled background tasks. Set this up as a system cron job; it must run every minute.

```bash
php vale cron:run
```

**System crontab entry:**
```bash
* * * * * php /var/www/vale/vale cron:run >> /dev/null 2>&1
```

Tasks dispatched by cron:
- Scheduled post and product publishing
- Post/page expiry and scheduled URL swaps (`posts_expired` / `swaps_processed` in the run summary)
- Newsletter campaign sending (one batch chunk per campaign per run; see below)
- Automation step processing
- Abandoned cart recovery emails
- Subscription reconciliation and trial expiry
- Exchange rate refresh
- Analytics data retention pruning
- Update manifest check

Newsletter campaigns send in chunks: each `cron:run` picks up every `queued`/`processing` campaign and dispatches a single chunk sized by **Settings → Mail → Max Batch Chunk Size** (capped per driver). Large lists therefore complete over multiple minute-cycles, and the `campaigns_sent` counter in the run summary counts processed chunks, not finished campaigns.

::: tip FEATURE FLAGS
Each task only runs when its feature is enabled: `blog_enabled` (scheduled posts), `shop_enabled` (scheduled products, exchange rates, abandoned carts), `newsletter_enabled` (campaigns & automations), `subscriptions_enabled` (reconciliation, trial expiry), and `analytics_enabled` (retention pruning). These feature flags correspond to the toggles in **[Settings](../../settings/) → [General](../../settings/general) → [Features](../../settings/general#features)**. The update check additionally respects the **Enable software updates** master switch in [Settings](../../settings/) → [Maintenance](../../settings/maintenance#updates-backups): when it is off, no automatic checks or auto-applies happen, even with `--force-update`.
:::

| Option | Description |
|---|---|
| `--force-rates` | Force an exchange rate refresh regardless of schedule (still requires shop + a configured FX provider) |
| `--force-update` | Force an update manifest check regardless of schedule (ignored when the **Enable software updates** master switch is off) |
| `--clean-cache` | Run cache pruning as part of this cron run |
| `--prune-revisions[=N]` | Prune old revisions across **all** content types: posts, pages and custom post types, keeping the latest N per item (default: 10) |
| `--dry-run` | Preview due jobs without executing them; shows how many campaigns, automation emails, scheduled posts/products are pending, plus cache and revision counts when the corresponding flags are passed |

::: tip SEE ALSO
[Updates & Backups](../updates): GUI-based backup and update management.
- [Settings](../../settings/) → [Maintenance](../../settings/maintenance): system updates, backups tooling, cache and cron.
:::
