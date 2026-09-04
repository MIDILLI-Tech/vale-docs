# Migration

Already running another platform? The Migration section walks you through bringing your existing content and data into Vale. Dedicated importers handle WordPress and Ghost, including posts, pages, and media.

Moving between Vale installations, for example to a new server, is covered too, using Vale's own export and import format.

::: tip Why teams switch to Vale
Leave the plugin juggling and maintenance chores behind. Vale ships a modern, **lightweight CMS + e-commerce stack** with built-in SEO, JSON-LD structured data that AI agents understand, and a full e-commerce engine, with no plugin marketplace required.
:::

## What Keeps Working After You Move

Whatever you import, Vale keeps everything connected out of the box:

- **SEO & redirects**: your meta data travels with your content, and automatic 301s handle any slug changes.
- **Media that just works**: images are downloaded (WordPress/Ghost) and served from Vale's own optimized media pipeline.
- **Your URL structure**: after a server move or a switch to a subdirectory, `migrate:urls` rewrites every old base-path reference in one command (see [CLI Commands → `migrate:urls`](../system/cli#migrate-urls)).

## What You Can Do

- **From WordPress**: Import posts, pages, media, products, users, and SEO data from a WordPress site, including WooCommerce, Yoast, Rank Math, MailPoet, and Polylang.
- **From Ghost**: Import your Ghost content: authors, tags, posts, featured images, and SEO metadata.
- **From / To Vale**: Export and import content between Vale installations, perfect for server moves, staging environments, and go-live.

## Explore the Docs

- **[From WordPress](./migrate-from-wordpress)**: Importing a WordPress site.
- **[From Ghost](./migrate-from-ghost)**: Importing a Ghost site.
- **[From / To Vale](./migrate-from-vale)**: Exporting and importing Vale data.