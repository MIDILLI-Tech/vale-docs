# Publishing Docker Images

Vale's four images are published to the [`@dockerImage@`](https://hub.docker.com/r/@dockerImage@) Docker Hub
repository by `scripts/publish-docker.php`, the "publishDocker" script. This page covers the tag scheme, the
script itself, local verification, and the CI workflows that drive it.

For building and running the images, see [Docker Deployment](./docker).

## Prebuilt Images

Pulling is faster than building if you only need a running site:

```bash
docker pull @dockerImage@:latest       # immutable, Apache + mod_php (recommended)
docker pull @dockerImage@:nginx        # immutable, Nginx + PHP-FPM
```

::: tip Immutable vs mutable tags
`latest`, `apache`, `nginx` and every version tag are **immutable** images. The code is baked in at build
time, a redeploy pulls a new image, and the in-app updater is a no-op. The `mutable-*` tags are the
opposite: they expect the codebase to be bind-mounted from the host so Vale's in-app auto-updater can write
back to it. Choose mutable for a single self-updating VPS, immutable for Kubernetes, Swarm, a PaaS, or any
deploy that pins an image tag.
:::

## Tag Scheme

Three rules define every tag:

1. **Apache is the default variant**, so it carries the unsuffixed tags. Nginx always carries a `-nginx`
   suffix.
2. **Version tags are prefixes** - `<version>`, `<major>.<minor>`, `<major>`.
   For 0.x releases the bare `<major>` tag (and its `-apache` / `-nginx` variants) is intentionally **not** published: it would move on every minor release and only duplicate `latest`. It appears once the version reaches 1.0.0.
3. **Lifecycle prefixes name the flavor**: `mutable-` for self-managed images, `edge` for unreleased builds.

### Immutable Images: Apache

| Tag | Kind | Moves |
|---|---|---|
| `@dockerImage@:<version>` | pinned release | never |
| `@dockerImage@:<version>-apache` | pinned release (explicit variant) | never |
| `@dockerImage@:latest` | floating | on each release |
| `@dockerImage@:apache` | floating (same digest as `latest`) | on each release |
| `@dockerImage@:<major>.<minor>` | floating within the minor line | on each patch release |
| `@dockerImage@:<major>` | floating within the major line | on each release |
| `@dockerImage@:<major>.<minor>-apache` | floating | on each patch release |
| `@dockerImage@:<major>-apache` | floating | on each release |
| `@dockerImage@:<sha>-apache` | pinned build (only with `--sha-tags`) | never |

### Immutable Images: Nginx

| Tag | Kind | Moves |
|---|---|---|
| `@dockerImage@:<version>-nginx` | pinned release | never |
| `@dockerImage@:nginx` | floating | on each release |
| `@dockerImage@:<major>.<minor>-nginx` | floating | on each patch release |
| `@dockerImage@:<major>-nginx` | floating | on each release |
| `@dockerImage@:<sha>-nginx` | pinned build (only with `--sha-tags`) | never |

### Self-managed (mutable)

| Tag | Moves |
|---|---|
| `@dockerImage@:mutable-apache` | on each release and each master push |
| `@dockerImage@:mutable-nginx` | on each release and each master push |

Mutable images deliberately carry **no version tags**: their code comes from the host bind-mount, so pinning
one by version would promise something the image cannot keep.

### Edge (unreleased master builds)

| Tag | Moves |
|---|---|
| `@dockerImage@:edge` | on each master push that changes runtime code |
| `@dockerImage@:edge-apache` | same digest as `edge` |
| `@dockerImage@:edge-nginx` | on each master push that changes runtime code |

Edge builds never touch `latest`, `apache`, `nginx` or any version tag. Unreleased code is never presented
as a stable release.

### Which tag should I use?

- **Production, reproducible** → `@dockerImage@:<version>-nginx` (or `<version>` for Apache).
- **Always current, low maintenance** → `@dockerImage@:latest` or `@dockerImage@:nginx`.
- **Self-updating single VPS** → `@dockerImage@:mutable-apache`.
- **Try the next version** → `@dockerImage@:edge-nginx`.

## The Publish Script

`scripts/publish-docker.php` is a plain PHP CLI script with no Composer dependencies, so it runs on a
developer machine (Windows included) and on a bare CI runner alike.

```bash
php scripts/publish-docker.php --help
```

### Options

| Option | Meaning |
|---|---|
| `--version=<x.y.z>` | Release version. Default: an exact git tag on `HEAD`, then `version.php`. |
| `--registry=<name>` | Image name. Default: `midillitech/vale`. |
| `--flavor=all\|immutable\|mutable` | Which lifecycle to build. Default: `all`. |
| `--variants=apache,nginx` | Which web servers to build. Default: both. |
| `--platforms=linux/amd64` | Build platforms. Default: `linux/amd64`. |
| `--only=<target>` | One target: `immutable-apache`, `immutable-nginx`, `mutable-apache`, `mutable-nginx`. |
| `--sha-tags` | Also tag every image with the short commit SHA. |
| `--edge` | Force edge tags even when a release version is known. |
| `--push` | Push to the registry. Without it the script only builds. |
| `--smoke` | Start each image and verify that `GET /api/v1/health?deep=1` returns HTTP 200 with `"status":"ok"`. |
| `--port=<n>` | Fixed host port for the smoke test. Default: a free port chosen per image. |
| `--keep` | Keep the smoke container running when the test fails, for log inspection. |
| `--no-cache` | Build without the Docker layer cache. |
| `--dry-run` | Print the resolved plan and every command without running anything. |

### Composer shortcuts

| Command | Equivalent |
|---|---|
| `composer docker:plan` | `--dry-run` |
| `composer docker:build` | build all four images, no push |
| `composer docker:test` | build + smoke-test the immutable Apache image |
| `composer docker:publish` | `--push` |

### Version resolution

The version is resolved in this order, which is a superset of what the release pipeline uses:

1. `--version=<x.y.z>`: what CI passes from the release tag.
2. An exact git tag on `HEAD`.
3. `version.php` at the repository root: the same fallback `scripts/prepare-release.php` uses.

Any of those produces the full release tag set. Only when none of them yields a version does the run fall
back to edge mode, which moves the `edge*` tags and leaves `latest` and every version tag untouched.
`--edge` forces that behaviour deliberately, which is what the master-push workflow uses.

::: warning Publishing from a working tree with uncommitted changes
The script warns when `--push` is combined with a dirty working tree, because the resulting image no longer
corresponds to any commit. CI always builds a clean checkout, so this only ever appears on manual runs.
:::

### What a publishing run does

1. Resolves the version and computes the tag matrix.
2. Builds each target with `docker buildx build`, applying OCI metadata labels
   (`org.opencontainers.image.*`: version, revision, source, licenses) from `composer.json`.
3. With `--smoke`, starts each image, waits for the entrypoint to finish its migrations, and polls the deep
   health endpoint until it reports `"status":"ok"` (up to 180 seconds per image).
4. With `--push` **and** `--smoke`, pushes the pinned tags first and the floating tags only afterwards, so a
   floating tag can never point at an image that failed the smoke test.
5. Prints the tag matrix and exits non-zero on the first failure.

Without `--smoke`, `--push` sends all tags in a single `buildx --push` call.

::: warning Multi-platform builds cannot be smoke-tested locally
A multi-platform build is pushed straight to the registry, because buildx cannot load it into the local
engine. `--smoke` is therefore rejected together with `--platforms` containing more than one value.
:::

## Local Verification

Everything below builds into your local Docker engine only. A run never pushes unless you pass `--push`, so
`composer docker:build` and every `--only` example here are safe to repeat.

Always dry-run first: it prints the resolved tags and the exact `docker buildx` command without building
anything.

```bash
composer docker:plan
```

### Building one image at a time

Each target shares one parameterized Dockerfile, `docker/Dockerfile`, and differs only by build args:

| Target | Build args | Image |
|---|---|---|
| `immutable-apache` | `VARIANT=apache FLAVOR=immutable` | Apache + mod_php, code baked in |
| `immutable-nginx` | `VARIANT=nginx FLAVOR=immutable` | Nginx + PHP-FPM, code baked in |
| `mutable-apache` | `VARIANT=apache FLAVOR=mutable` | Apache, host bind-mount, self-updating |
| `mutable-nginx` | `VARIANT=nginx FLAVOR=mutable` | Nginx, host bind-mount, self-updating |

```bash
php scripts/publish-docker.php --only=immutable-apache
php scripts/publish-docker.php --only=immutable-nginx
php scripts/publish-docker.php --only=mutable-apache
php scripts/publish-docker.php --only=mutable-nginx
```

`--only` takes precedence over the two group filters, so use those when you want more than one image:

```bash
php scripts/publish-docker.php --flavor=immutable              # both immutable images
php scripts/publish-docker.php --variants=nginx                # both nginx images
php scripts/publish-docker.php --only=immutable-nginx --no-cache   # ignore the layer cache
composer docker:build                                          # all four
```

The immutable images rebuild in seconds once the base layers are cached. The mutable pair bundles the full
source tree, so expect a slow first build and roughly a gigabyte per image.

### Building and testing in one step

Add `--smoke` to build, start the image, wait for the entrypoint to finish its migrations, and poll the deep
health endpoint:

```bash
php scripts/publish-docker.php --only=immutable-apache --smoke
composer docker:test          # the same for the primary image
```

When a check fails, `--keep` leaves the container and its logs in place for inspection:

```bash
php scripts/publish-docker.php --only=immutable-nginx --smoke --keep
docker logs -f vale-smoke-immutable-nginx-<port>
```

::: tip Keep local builds out of the published tag names
A build with no `--version`, no tag on `HEAD` and a `version.php` in place resolves to the **release** tag set,
so a plain local build also tags `midillitech/vale:latest`, including over an image you had pulled. Pass a
scratch name to keep the two apart:

```bash
php scripts/publish-docker.php --only=immutable-apache --registry=vale-local
# → vale-local:0.75.0, vale-local:latest, ...
```
:::

### Running a local build by hand

The smoke test is a thin wrapper around plain Docker. To run a built image yourself, or to reproduce a failed
check:

```bash
docker run --rm -p 8080:80 \
  -e APP_URL=http://localhost:8080 \
  -e APP_KEY=$(php -r "echo bin2hex(random_bytes(32));") \
  -e DB_DRIVER=sqlite \
  -e DB_NAME=storage/database.sqlite \
  -v vale-verify-storage:/var/www/html/storage \
  vale-local:latest

curl -s http://localhost:8080/api/v1/health?deep=1   # → {"status":"ok",...}

docker volume rm vale-verify-storage
```

Swap `vale-local:latest` for `@dockerImage@:latest` to run a published image instead. The mutable images expect
the code bind-mount described in [Self-Managed vs. Immutable](./docker#self-managed-vs-immutable); they boot
without it, but the in-app updater has nowhere to write.

### Verifying a published image

Digests are what you should pin in production, because a tag can move:

```bash
docker pull @dockerImage@:<version>
docker inspect --format='{{index .RepoDigests 0}}' @dockerImage@:<version>
# @dockerImage@@sha256:...
```

The OCI labels travel with the image and tell you what you are running:

```bash
docker inspect --format='{{json .Config.Labels}}' @dockerImage@:<version>
```

## CI Workflows

Three workflows under `.github/workflows/` publish and validate the images.

| Workflow | Trigger | Publishes |
|---|---|---|
| `docker-publish.yml` | push of a `v*` tag, manual dispatch, or a call from `release-manual.yml` | the full release tag set of the selected flavor |
| `docker-edge.yml` | master push touching runtime code, or manual dispatch | `edge`, `edge-apache`, `edge-nginx`, `mutable-*` |
| `docker-rebuild.yml` | weekly (Monday 04:00 UTC) or manual dispatch | floating tags only (`latest`, `apache`, `nginx`, `<major>.<minor>`, `mutable-*`, …) with patched base images - pinned release tags are never touched |
| `docker-build.yml` | pull request touching runtime code, or manual dispatch | nothing - build validation only |

::: tip Weekly security rebuild
`docker-rebuild.yml` runs every Monday at 04:00 UTC (and on manual dispatch). It checks out the latest release
tag, rebuilds all floating tags with a fresh base image (so Debian security updates for packages like
`apache2` and `expat` are picked up) and runs the smoke test before pushing. **Pinned release tags are never
moved** - only floating tags (`latest`, `apache`, `nginx`, `<major>.<minor>`, `mutable-*`, …) change. This is
the mechanism that closes CVEs without cutting a new release.
:::

::: tip A tag created by a workflow does not trigger another workflow
`docker-publish.yml` listens for a tag **push**. GitHub suppresses workflow runs started by the default
`GITHUB_TOKEN`, so a tag created by [`release-manual.yml`](../releases) through `action-gh-release` would not
publish images on its own. That is why `docker-publish.yml` also exposes a `workflow_call` interface: the manual
release calls it as a second job (`needs: release`) in the **same** run, which is not subject to that
suppression. The tag-push path needs none of this. A tag pushed by a maintainer with a personal credential
(the `orchestrate-release.php --tag` path) starts `release.yml` and `docker-publish.yml` side by side.
:::

### Required secrets

Add both to the repository secrets (Settings → Secrets and variables → Actions):

| Secret | Value |
|---|---|
| `DOCKERHUB_USERNAME` | The Docker Hub account that owns the `@dockerImage@` repository, which is the namespace in the image name. |
| `DOCKERHUB_TOKEN` | A Docker Hub **access token** with **Read & Write** scope (Account settings → Security → New access token), not the account password. |

Both workflows that push (`docker-publish.yml` and `docker-edge.yml`) need both secrets; `docker-build.yml` never
pushes and therefore does not.

The `@dockerImage@` repository is created automatically by the first successful push when the token has
write access.

Running `composer docker:publish` from your own machine uses your local Docker credentials
instead of these secrets. Run `docker login` once and the push works. The repository secrets only matter to the workflows.

### Manual runs

`docker-publish.yml` accepts a version, a flavor, and a push toggle, so a maintainer can re-publish a
release or produce build-only artifacts from the Actions tab. `docker-build.yml` accepts a flavor and never
pushes, which makes it the cheapest way to confirm that a Dockerfile still builds after a dependency bump.

The **Build & Release (Manual)** workflow has an **Also publish the Docker images** dropdown (default **yes**).
With `yes` it calls `docker-publish.yml` after the release job, builds from the new tag and pushes the immutable
plus mutable images, the same set a tag push produces. Choose `no` when the release assets should go out first,
or when the images are published separately.

## Adding a New Image Variant

To publish an additional image (say an Alpine build):

1. Add the Dockerfile under `docker/`.
2. Register the target in `targets()` in `scripts/publish-docker.php`.
3. Add its tag rules to `computeTags()`: pinned tags first, floating tags second.
4. Add the path filter (`docker/**`) coverage to `docker-publish.yml` and `docker-build.yml` if needed.
5. Document the tags on this page and in [Docker Deployment → Image Variants](./docker#image-variants).

The script, the workflows and the tags all derive from that one `targets()` table.

## See Also

- [Docker Deployment](./docker): building, running, and configuring the containers
- [Deployment Overview](./): VPS, shared hosting, and bare-metal setups
- [Release Process](../releases): how a release tag is cut
- [CLI Reference](../../admin/system/cli): `doctor`, `migrate`, and the rest of the `vale` CLI
