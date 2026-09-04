# Developer Guide

Welcome to the Vale Developer Guide. This section is specifically designed for **Theme Developers**, **Plugin & Integration Authors**, and **Core Contributors** who build themes, integrate external services via REST API/Webhooks, or extend Vale's PHP architecture.

Vale is built to be genuinely developer-friendly: a clean Domain-Driven Design codebase with zero framework dependencies in the domain layer, a full Symfony Console CLI for everything the admin panel does, Dockerized dev and production setups, PHPUnit suites with clear layer conventions, and AI-agent skills that scaffold gateways, themes, endpoints, and shortcodes following repo patterns. Everything is self-hosted with core features included, with no plugin marketplace to depend on: payments, memberships, newsletters, SEO, and AI-crawler control are all in core, with code you can read and override.

::: tip SITE & SYSTEM ADMINISTRATORS
Looking to manage content, configure store settings, run database migrations, or execute CLI operations? Head over to the **[Admin Guide](../admin/)**.
:::

## Key Focus Areas

- **Theme Development**: Design and build custom templates using Twig, Tailwind CSS, Alpine.js, and Vale's asset compilation workflow.
- **REST API & Integrations**: Integrate mobile apps or third-party platforms with Vale's REST API, webhooks, and SSO providers.
- **Architecture & Extending Vale**: Understand Domain-Driven Design (DDD), custom use cases, repository pattern, hooks, and shortcodes.

---

## Technology Stack

- **Backend**: Slim 4 (PSR-15 routing) · Doctrine DBAL · Twig 3 · PHP-DI · Phinx migrations
- **Frontend**: Alpine.js · Tailwind CSS · Tiptap 3 (ProseMirror) · esbuild

---

## Start Here

- **[Getting Started](./getting-started)**: Set up a local development environment from source (Composer, dependencies, demo seeder).
- **[Prerequisites](./prerequisites)**: Required PHP extensions, Node.js, and tool versions.
- **[Architecture](./architecture/)**: Domain model, use cases, and repository pattern architecture.
- **[Theme Development](./themes)**: Complete guide to theme structure, Twig functions, and assets.

## Integration & Extension Guides

- **[Theme Development](./themes)**: Complete guide to theme structure, Twig functions, and assets.
- **[Hooks & Events](./hooks)**: Event-driven PHP listeners and extension points.
- **[Plugins](./plugins)**: Site-specific drop-in extensions.
- **[REST API](./api)**: Authenticated API endpoints and schema.
- **[Shortcodes](./shortcodes)**: Dynamic content embeds for posts and pages.
- **[Webhooks](./webhooks)**: Outgoing HTTP payload notifications.
- **[SSO Integration](./sso)**: OAuth 2.0 single sign-on providers.
- **[Payment Gateways](./payment-gateways)**: Building custom payment provider drivers.

## Workflow, Security & Tooling

- **[Agent Skills](./agent-skills)**: AI-agent workflows and repository skills.
- **[Security](./security/)**: Application security practices and hardening.
- **[Deployment](./deployment/)** - Docker, CapRover, VPS, and deployment strategies. See also **[Publishing Images](./deployment/docker-registry)** for the Docker Hub tag scheme and the publish pipeline.
- **[Environment Variables](./env)**: Full reference for `.env` settings.
- **[Testing](./testing/)**: Running PHPUnit tests and test suites.
- **[Release Process](./releases)**: Release workflow and changelogs.
- **[Contributing](./contributing)**: Coding standards and pull request process.

Proceed to [Getting Started](./getting-started) to set up your local development environment.
