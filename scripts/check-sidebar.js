/**
 * check-sidebar.js
 *
 * Validates that every internal `link` in `.vitepress/config.js` nav/sidebar
 * resolves to a real markdown page.
 *
 * Why this exists: `npm run docs:build` previously missed a dead sidebar
 * entry (`/en/latest/admin/settings/exchange-rates` 404 — the page lives at
 * `/en/latest/admin/ecommerce/exchange-rates`). Neither pipeline stage covers
 * config links:
 *   - `scripts/check-anchors.js` only scans markdown body links under `en/latest`
 *     and skips absolute (`/...`) hrefs,
 *   - VitePress' built-in dead-link check only covers markdown body content,
 *     not `themeConfig.sidebar` / `nav` entries.
 *
 * Resolution mirrors VitePress routing: `/a/page` -> `/a/page.md`,
 * `/a/dir/` -> `/a/dir/index.md`, `/a/page.html` -> `/a/page.md`.
 * Versioned links (`/<lang>/vX.Y.Z/...`) are validated against their `latest`
 * equivalent, because `sync-latest.js` creates snapshots as copies of
 * `latest/`. Only locales present in the VitePress config are checked —
 * `.vitepress/config.js` includes a locale only when its `latest/` folder
 * exists, so absent languages (e.g. `tr/` before translation starts) never
 * reach this script and need no skip rule (same as `ignoreDeadLinks`).
 *
 * Usage:
 *   node scripts/check-sidebar.js     # plain build check (fail on errors)
 *   npm run check:sidebar
 *
 * Exit code 1 + non-zero list when broken sidebar links are found.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import config from '../.vitepress/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// Only `LICENSE` links are skipped. Locales without a `latest/` folder are
// already excluded from the VitePress config itself, and versioned snapshots
// don't exist locally (see below).
const SKIP = [/LICENSE/];

function collectLinks(node, out = []) {
  if (Array.isArray(node)) {
    for (const item of node) collectLinks(item, out);
    return out;
  }
  if (node && typeof node === 'object') {
    if (typeof node.link === 'string') out.push(node.link);
    // Sidebar is keyed by path prefix, nav groups nest arbitrarily —
    // recurse into every nested object/array.
    for (const value of Object.values(node)) {
      if (value && typeof value === 'object') collectLinks(value, out);
    }
  }
  return out;
}

function stripFragment(link) {
  return link.split('#')[0].split('?')[0];
}

function candidateFiles(relativePath) {
  // `relativePath` has no leading slash and no `.html` suffix.
  if (relativePath.endsWith('/')) return [`${relativePath}index.md`];
  return [`${relativePath}.md`, `${relativePath}/index.md`];
}

function main() {
  const errors = [];
  let skipped = 0;
  let skippedVersioned = 0;
  const seen = new Set();

  for (const locale of Object.values(config.locales ?? {})) {
    const themeConfig = locale?.themeConfig;
    if (!themeConfig) continue;
    for (const link of collectLinks([themeConfig.nav, themeConfig.sidebar])) {
      if (seen.has(link)) continue;
      seen.add(link);
      if (!link.startsWith('/')) continue; // external URL
      if (SKIP.some((re) => re.test(link))) {
        skipped += 1;
        continue;
      }

      let checkLink = stripFragment(link);
      // Versioned snapshots don't exist locally (created at release time by
      // sync-latest.js as copies of latest/), so they can't be validated
      // against files — count and report separately instead of failing.
      // Note: CURRENT_VERSION may be `vX.Y` or `vX.Y.Z`, in any locale.
      if (/^\/[a-z]{2}\/v\d+\.\d+(?:\.\d+)?(\/.*)$/.test(checkLink)) {
        skippedVersioned += 1;
        continue;
      }
      if (checkLink.endsWith('.html')) checkLink = checkLink.slice(0, -5);

      const rel = checkLink.replace(/^\//, '');
      const found = candidateFiles(rel).some((c) =>
        fs.existsSync(path.join(ROOT, c))
      );
      if (!found) errors.push(link);
    }
  }

  if (errors.length > 0) {
    console.error(`❌ Found ${errors.length} broken sidebar link(s):`);
    for (const link of errors) console.error(`  ${link}`);
    process.exit(1);
  }

  console.log(
    `✅ Sidebar links OK — checked ${seen.size - skipped - skippedVersioned} link(s), ` +
      `skipped ${skippedVersioned} versioned (no local snapshot)`
  );
}

main();
