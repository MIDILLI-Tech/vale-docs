# Introduction

Welcome to the Vale Developer Guide. This section is intended for developers looking to build themes, integrate with the API, or extend Vale's core functionality.

## Set Up Your Environment

To set up a local development environment from source — cloning the repository, installing dependencies, configuring `.env`, and seeding the database — see [Getting Started](./getting-started).

## Technology Stack

Vale is built using modern, stable, and high-performance technologies:

### Backend
- **Slim 4**: A lightweight PSR-15 compliant micro-framework for routing and middleware.
- **Doctrine DBAL**: A powerful database abstraction layer for reliable persistence.
- **Twig 3**: The industry-standard templating engine for secure and flexible views.
- **PHP-DI**: Dependency injection container for clean architecture.
- **Phinx**: Database migrations and seeding.

### Frontend
- **Alpine.js**: A minimal framework for composing JavaScript behavior directly in your markup.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Tiptap 3** (ProseMirror): A headless, extensible rich-text editor that powers Vale's advanced content creation experience.
- **esbuild**: An extremely fast JavaScript bundler and minifier.

## Core Architecture

Vale follows **Domain-Driven Design (DDD)** principles:

- `src/Domain/`: Entities, value objects, and repository interfaces.
- `src/Application/`: Application services and use cases.
- `src/Infrastructure/`: Concrete implementations (Repositories, Framework adapters).
- `app/`: Framework glue (Controllers, Middleware, CLI).

See the [Architecture](./architecture/) section for a deep dive into each layer.

## Next Steps

1. [Getting Started](./getting-started) — install dependencies and set up your environment.
2. [Theme Development](./themes) — customize your site's appearance.
