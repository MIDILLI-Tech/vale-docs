# Deployment

Vale can be deployed to a variety of environments, from shared hosting to dedicated virtual servers. This page walks through installing from source step by step, then covers the most common targets: classic shared hosting panels, an Nginx-powered VPS, official Docker images, and one-click CapRover deployments.

Whichever route you take, the [production optimization](#production-optimization) checklist at the bottom applies: environment flags, local assets, OPcache, and the cron job that drives scheduled posts and automations.

## Installation From Source

If you've cloned the repository from GitHub, follow [Getting Started](../getting-started). It is the single source of truth for source setup (prerequisites, Composer/Node install, `.env`, migrations, admin user, demo seeder). The notes below cover only what is specific to each deployment target.

## Shared Hosting (cPanel/Plesk)

1. **Upload**: Upload all files to your web server (usually `public_html`).
2. **Move Public**: For best security, your project root should be *above* the web root, with only the `public/` directory exposed. If you cannot do this, ensure the `.htaccess` file is working correctly.
3. **Writable Folders**: Ensure the `storage/` and `public/assets/build/` directories are writable by the server.
4. **PHP Version**: Ensure your host is running PHP @phpVersion@ or higher.

## Virtual Private Server (VPS) - Nginx

**Recommended Stack**: Nginx + PHP-FPM @phpVersion@+ + MySQL @mysqlVersion@ / PostgreSQL @pgsqlVersion@+

**Nginx Configuration Example**:

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/vale/public;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

## Docker

Vale ships with official `Dockerfile`s and `docker-compose.yml` files for both local development and
production, covering Apache + Nginx variants and self-managed and immutable image builds.

- **Run a published image (no checkout needed)**: pull from Docker Hub: `@dockerImage@:latest`
  (immutable Apache), `@dockerImage@:nginx` (immutable Nginx), `@dockerImage@:mutable-apache` /
  `@dockerImage@:mutable-nginx` (self-managed, bind-mounted code).
- **Build from source**: requires a checkout of the repository and the Compose stacks.

- [Docker Deployment](./docker): pulling, building, running, and configuring the containers
- [Publishing Images](./docker-registry): tag scheme, publish script, CI workflows

## CapRover

Deploy Vale to CapRover using the built-in `captain-definition` file. The container handles `.env` creation and database migrations automatically on first boot.

See [CapRover Deployment](./caprover) for the full guide.

## Production Optimization

1. **`APP_ENV`**: Always set to `production` in `.env`.
2. **`APP_DEBUG`**: Always set to `false`.
3. **`ASSETS_USE_CDN`**: Set to `false` and ensure you have run `npm run build` to generate local assets.
4. **OPcache**: Ensure PHP OPcache is enabled for best performance.
5. **Document Root Protection**: Point the web root to `public/` and verify `.env` is not publicly accessible. See [Web Server & Document Root Protection](../security/#web-server-document-root-protection).

::: tip CRON JOB
For automations and scheduled posts, add the following cron job to your server:
```bash
* * * * * cd /path-to-vale && php vale cron:run >> /dev/null 2>&1
```
:::
