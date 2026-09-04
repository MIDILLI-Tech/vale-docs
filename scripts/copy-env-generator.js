/**
 * copy-env-generator.js
 *
 * Copies the canonical environment-generator.html from the sibling Vale
 * checkout (`../vale/scripts/`) to the docs root and — when it exists —
 * the build output. The docs root copy is what `docs:dev` serves; the build
 * chains overwrite both copies from the canonical file after syncing it.
 *
 * Never fails the build: missing sibling checkout prints a warning.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(__dirname, '..');
const SRC = path.resolve(__dirname, '..', '..', 'vale', 'scripts', 'environment-generator.html');

const dests = [
  path.join(DOCS_ROOT, 'environment-generator.html'),
  path.join(DOCS_ROOT, 'build', 'environment-generator.html'),
];

if (!fs.existsSync(SRC)) {
  console.log('Warning: ../vale/scripts/environment-generator.html not found, skipping copy');
} else {
  for (const dest of dests) {
    if (!fs.existsSync(path.dirname(dest))) continue;
    fs.copyFileSync(SRC, dest);
  }
  console.log('Copied environment-generator.html');
}
