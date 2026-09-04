/**
 * sync-env-locales.js
 *
 * Rewrites the APP_LOCALE <select> options (and the matching output comment)
 * in environment-generator.html from the language files that actually exist
 * in the sibling Vale checkout (`../vale/resources/lang/*.json`).
 *
 *   node ./scripts/sync-env-locales.js
 *
 * Never fails the build: when the sibling checkout is missing (docs-only
 * environment), it prints a warning that the language list may be
 * inconsistent and exits 0. Run as part of `docs:build` / `docs:build-copy`
 * before the file is copied to the output.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(__dirname, '..');
const VALE_ROOT = path.resolve(__dirname, '..', '..', 'vale');

const LABELS = {
  en: 'English',
  tr: 'Türkçe',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  pt: 'Português',
  nl: 'Nederlands',
  ar: 'العربية',
  ru: 'Русский',
  pl: 'Polski',
  zh: '中文',
};

function main() {
  const langDir = path.join(VALE_ROOT, 'resources', 'lang');
  if (!fs.existsSync(langDir)) {
    console.log(
      'Warning: sibling Vale checkout not found — APP_LOCALE list not updated, ' +
        'it may be inconsistent with resources/lang/*.json.'
    );
    return;
  }

  const codes = fs
    .readdirSync(langDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => path.basename(f, '.json'))
    .sort((a, b) => (a === 'en' ? -1 : b === 'en' ? 1 : a.localeCompare(b)));

  if (codes.length === 0) {
    console.log('Warning: no language files found — APP_LOCALE list left untouched.');
    return;
  }

  const options = codes
    .map(
      (code, i) =>
        `          <option value="${code}"${i === 0 ? ' selected' : ''}>${LABELS[code] ?? code} (${code})</option>`
    )
    .join('\n');
  const selectRe = /(<select id="APP_LOCALE" name="APP_LOCALE">)[\s\S]*?(<\/select>)/;
  const commentRe = /'Default locale: [^']*'/;
  const commentNew = `'Default locale: ${codes.join(' | ')}'`;

  const targets = [path.join(VALE_ROOT, 'scripts', 'environment-generator.html')];

  for (const file of targets) {
    if (!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, 'utf8');
    const next = html
      .replace(selectRe, `$1\n${options}\n        $2`)
      .replace(commentRe, commentNew);
    if (next !== html) {
      fs.writeFileSync(file, next);
      console.log(`Synced APP_LOCALE list (${codes.join(', ')}) in ${path.relative(DOCS_ROOT, file) || file}.`);
    } else {
      console.log(`APP_LOCALE list already in sync in ${path.relative(DOCS_ROOT, file) || file}.`);
    }
  }
}

main();
