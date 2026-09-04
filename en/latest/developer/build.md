# Build Process

Vale's build and release process — frontend assets, PHP dependencies, packaging, signing, and the CI/CD pipeline — is documented in the [Release Process](./releases) guide.

Quick reference:

- **Full release:** `php scripts/orchestrate-release.php --version=x.y.z --tag --changelog --build`
- **Assets only:** `npm install && npm run build`
- **Package only:** see [Release Process → The Build Script](./releases#the-build-script-prepare-release-php)
