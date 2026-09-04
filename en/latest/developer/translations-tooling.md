# Translations Tooling

Vale keeps its interface strings in JSON files under `resources/lang/`. **`en.json` is the source of truth** — it holds the complete set of keys — while every other language file (`fr.json`, `tr.json`, …) holds translations for those same keys.

The translation scripts keep the language files in sync with the actual strings used in the codebase:

- `scripts/extract-translations.php` — scans PHP, Twig and JS for translation keys, adds missing keys to `en.json`, and reports (or removes) unused ones.
- `scripts/manage-translations.php` — propagates the key set from `en.json` to all other language files and creates new languages.

## How Keys Are Detected

The extractor scans the following directories: `src/`, `app/`, `routes/`, `resources/views/`, `resources/js/` and `themes/`.

It picks up literal string keys from these call patterns:

| Pattern | Where |
|---|---|
| `__('key')` / `__("key")` | PHP and Twig templates |
| `$this->translator->get('key')` / `$translator->get('key')` | PHP (same as `__()`) |
| `tjs('key')` / `tjs("key")` | Admin JavaScript files **and** inline `<script>` blocks in Twig templates |

::: tip `tjs()` in the admin
Strings passed to `tjs()` must also be registered in `window.LP_I18N` in `resources/views/admin/layout.twig`, otherwise they fall back to the untranslated key. See the [Twig Functions](./twig/functions) reference.
:::

### Dynamic Keys (Preserve List)

Some keys are referenced through a variable instead of a literal — for example order statuses rendered through the `__()` helper in Twig, or `translator->get($status)` in PHP. These are covered by the **preserve list** in `scripts/translation-preserve.php`; keys on that list are never reported as unused, even if no literal call exists.

## Composer Commands

| Command | What it does |
|---|---|
| `composer translations` | Add all missing keys to `en.json` (new keys get the English text as their value). Reports unused keys but does **not** remove them. |
| `composer translations:sync` | Propagate the `en.json` key set to every other language file — adds missing keys (as empty strings) and removes orphaned ones. |
| `composer translations:prune` | Add missing keys **and** remove unused keys from `en.json` and all other language files. |
| `composer translations:check` | CI mode: writes nothing, exits `1` when keys are missing or unused, `0` when `en.json` is in sync. |
| `composer translations:create de` | Create a new empty language file (`de.json`) from `en.json`. |

The same functionality is available without Composer:

```bash
php scripts/extract-translations.php                 # add missing keys (en.json)
php scripts/extract-translations.php --prune         # also remove unused keys (all files)
php scripts/extract-translations.php --check         # CI check, exit code 1 when out of sync

php scripts/manage-translations.php sync             # propagate en.json to other languages
php scripts/manage-translations.php create de        # create a new language file
```

## Workflows

### Adding a New Translatable String

1. Add the string to your code with the full English text as the key:
   ```twig
   {{ __('Your new interface string') }}
   ```
2. Sync the key files:
   ```bash
   composer translations
   composer translations:sync
   ```
3. Optionally fill in the translations for the new key in the other language files.

### Adding a New Language

```bash
composer translations:create de
```

This creates `resources/lang/de.json` with every key set to an empty string. Empty values are safe — the `__()` helper falls back to the English key until a translator fills the value in.

### Checking in CI

```bash
composer translations:check
```

Run this after any code change that touches translatable strings. It fails the build when `en.json` is missing keys the code uses, or still contains keys the code no longer references.

## Best Practices

- **Never hand-edit the key set.** Run the scripts instead — they preserve formatting and keep all language files consistent.
- **Use the full English sentence as the key** (e.g. `Save Changes`), never cryptic abbreviations.
- **Use placeholders** (`:name`, `%d`) instead of concatenating dynamic values, so translations stay grammatically correct.
- **Empty string = not yet translated.** Leave a key empty instead of copying English into other languages.
- **Test both drivers** (MySQL and SQLite) before committing, as described in the [Testing](./testing/) guide.

::: tip SEE ALSO
- [Twig Functions](./twig/functions) — `__()` and the translation helpers available in templates.
- [Testing](./testing/) — running the test suite and CI checks.
:::
