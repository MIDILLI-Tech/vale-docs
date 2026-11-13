# Page Cache

Vale stores the rendered HTML of public pages as flat files so anonymous visitors skip routing, queries and Twig rendering entirely. Two classes own the behaviour:

- `Infrastructure\Cache\PageCache` — read, write, invalidate and flush the stored files.
- `App\Middleware\PageCacheMiddleware` — decides whether a request may be served from (or written to) the cache.

Writers never clear the cache by hand. `Infrastructure\Cache\PageCacheInvalidator` maps a content change to the public URLs it can affect, and is called from the domain event listeners in `bootstrap/events.php`, so an admin save, a plugin and a scheduled publish invalidate the same paths.

## What is cached

A response is stored only when **all** of these hold:

- the request is `GET`, and the visitor has no signed-in session;
- no flash message is pending (for example right after add-to-cart);
- the path is not excluded (`/admin*`, `/api/*`, `/pay/*`, `/webhooks/*`, `/cron/*`, `/preview/*`, plus the configured cart, checkout, account, login, register, logout, password and membership prefixes — localized prefixes included);
- the response is `200` with an HTML content type;
- the body contains no `vl-embedded-form` or `vl-newsletter-form` marker, so per-visitor CSRF tokens never land in shared HTML.

The file name is `md5(path)_md5(query)_md5(role)`, so filters, pagination and locale variants (`?_locale=…`) are separate entries. `X-Vale-Cache` reports `HIT`, `MISS` or `SKIP` on the response.

Invalidating a path removes **every** query and role variant of it, plus the trailing-slash form — which is why invalidating a listing base path also covers its filtered and paginated pages.

## Invalidation surfaces

| Writer | Code path | Dropped |
|---|---|---|
| Post, page or custom post type saved, published or deleted | `post.created` / `post.published` / `post.updated` / `post.deleted` → `PageCacheInvalidator::forPost()` | Home, blog or custom-type listing, `/feed`, the item page, and the archives of its categories and tags |
| Admin bulk actions | `PostController::bulk()` fires `post.updated`, or `post.published` when the new status is published | Same as above |
| Scheduled publish | `CronService` → the same `forPost()` call | Same as above |
| Product created, updated, published, expired or deleted | `product.created` / `product.updated` / `product.deleted` → `forProduct()` / `forDeletedProduct()` | Home, shop listing (all filters), the product page, the Google Merchant feed |
| Stock change on `order.paid` and `order.reversed` | Listener invalidates directly through `PageCache` | Shop listing and the affected product pages |
| Comment or review created, moderated, updated or deleted | `forComment()` resolves the entity, then reuses `forPost()` / `forProduct()` | The commented page or product |
| Menus | `MenuController` (create, update, delete, clone) | Full flush |
| Post categories, tags, product categories | `CategoryController`, `TagController`, `ProductCategoryController` | Full flush |
| Content types | `ContentTypeController` (create, update, delete, activate/deactivate) | Full flush |
| Theme and appearance | `ThemeController`, `AppearanceController` | Full flush |
| Settings | `SettingsController` for groups that feed the front end | Full flush |
| Plugins | Enable, disable, install, update, delete (admin and CLI) | Full flush |
| Operator action | `php vale cache:clear` | Selected caches, `pages` includes the page cache |

Taxonomies, menus, themes, content types and settings flush instead of invalidating single paths because their output (term names, navigation labels, layout, route prefixes) appears on **every** page. Content changes stay targeted so a large catalogue does not lose its whole cache on every save.

### Prefixes come from settings

`forPost()` reads `routing_blog_prefix`, `routing_category_prefix`, `routing_tag_prefix`, `routing_shop_prefix` and `routing_page_prefix` at call time, so a renamed prefix invalidates the URLs that are live now. Custom post types use their own `getPublicBasePath()` and category/tag prefixes, and their feed only when the type supports `rss`.

## Extending the invalidation

If your code changes front-end content outside the admin controllers:

1. **Fire a domain event** (`post.updated`, `post.published`, `product.updated`) from application code. The core listeners then handle both the outbound webhook and the cache, and your change behaves like an admin save.
2. **Inject `PageCacheInvalidator`** when you need a specific response. It is bound in `config/services.php` with an explicit factory; do not rely on autowiring, because its optional constructor arguments would stay `null`.
3. **Call `PageCache::flush()`** when the change is visible on every page (navigation, layout, global settings, routes). Injecting `PageCache` as an optional last constructor argument and calling `flush()` is the pattern the admin controllers use.
4. **Guard new surfaces with a test.** `tests/Unit/Infrastructure/Cache/PageCacheInvalidatorTest.php` and `tests/Unit/App/Controllers/Admin/MenuCacheInvalidationTest.php` assert against a real `PageCache` in a temporary directory, which is the cheapest way to prove a writer clears what it should.

## Known limits

- Media file deletion removes the file and the media record, but does not touch the page cache: cached pages keep rendering the old `<img>` tag until the entry expires (24 hours by default) or is flushed.
- Writes that bypass the event system (direct SQL, a migration) do not invalidate anything.
- A plugin that changes its own front-end output without going through the lifecycle actions above must flush the cache itself.

## See also

- [Hooks & Events](./hooks): the action system and where core listeners are registered.
- [Plugins](./plugins): activation and update flush the full-page cache.
- [Architecture: Use Cases](./architecture/use-cases): where to fire events from application code.
