/**
 * check-anchors.js
 *
 * Validates that every `[text](./path#anchor)` and `[text](#anchor)` link
 * inside `en/latest/` resolves to a real heading slug on the target page.
 *
 * VitePress' built-in dead-link check only verifies file targets, not the
 * `#anchor` fragment. This script closes that gap by reproducing VitePress'
 * heading slug generation (`slugify` from vitepress/dist/node) and comparing
 * every in-file anchor fragment against the slugs present in the target
 * document.
 *
 * Usage:
 *   node ./check-anchors.js            # plain build check (fail on errors)
 *   npm run check:anchors
 *
 * Exit code 1 + non-zero list when broken anchors are found.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LATEST_DIR = path.join(__dirname, 'en', 'latest');

const rCombining = /[\u0300-\u036F]/g;
const rControl = /[\u0000-\u001f]/g;
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g;

function slugify(str) {
  return str
    .normalize('NFKD')
    .replace(rCombining, '')
    .replace(rControl, '')
    .replace(rSpecial, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^(\d)/, '_$1')
    .toLowerCase();
}

function collectMdFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...collectMdFiles(full));
    else if (entry.name.endsWith('.md')) results.push(full);
  }
  return results;
}

// Extract heading slugs from a markdown file's raw content, mirroring
// VitePress' markdown-it-anchor rendering: duplicate headings get `-1`, `-2`,
// ... suffixes (uniqueSlugStartIndex = 1), and duplicate custom {#id} attrs
// are a hard build error. Handles ATX headings (# ...), setext headings
// (===/---), and explicit {#custom-anchor} attributes. Fenced code blocks are
// skipped.
function extractHeadingSlugs(content) {
  const slugs = new Set();
  const usedIds = new Map();
  const errors = [];
  const lines = content.split('\n');
  let inFence = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^\s*(```|~~~)/.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const atx = /^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (atx) {
      addHeadingSlug(atx[2], slugs, usedIds, errors);
      continue;
    }

    // Setext headings: a line of === or --- directly under a text line.
    if (/^\s{0,3}(=+|-+)\s*$/.test(line) && i > 0) {
      const prev = lines[i - 1];
      if (prev.trim() && !/^\s*#{1,6}\s/.test(prev) && !/^```/.test(prev.trim())) {
        addHeadingSlug(prev, slugs, usedIds, errors);
      }
    }
  }

  return { slugs, errors };
}

function addHeadingSlug(text, slugs, usedIds, errors) {
  const trimmed = text.trim();
  const custom = /\{ *#([a-zA-Z0-9_-]+) *\}$/.exec(trimmed);
  if (custom) {
    if (usedIds.has(custom[1])) {
      errors.push(`heading {#${custom[1]}} is duplicated on this page (VitePress build error)`);
      return;
    }
    usedIds.set(custom[1], true);
    slugs.add(custom[1]);
    return;
  }
  const stripped = trimmed
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*?([^*]+)\*\*?/g, '$1')
    .replace(/\[(.*?)\]\((?:[^)]+)\)/g, '$1')
    .replace(/[.!?;,:-]$/, '');
  const base = slugify(stripped);
  const id = uniqueSlugId(base, usedIds);
  usedIds.set(id, true);
  slugs.add(id);
}

function uniqueSlugId(base, usedIds) {
  if (!usedIds.has(base)) return base;
  let suffix = 1;
  let id = `${base}-${suffix}`;
  while (usedIds.has(id)) {
    suffix += 1;
    id = `${base}-${suffix}`;
  }
  return id;
}

function main() {
  const files = collectMdFiles(LATEST_DIR);
  const byPath = new Map(files.map((f) => [path.resolve(f), f]));
  const errors = [];
  const linkRe = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

  const slugCache = new Map();
  const headingErrors = [];
  for (const file of files) {
    const { slugs, errors } = extractHeadingSlugs(fs.readFileSync(file, 'utf8'));
    slugCache.set(path.resolve(file), slugs);
    for (const err of errors) {
      headingErrors.push({ file, href: err, kind: 'duplicate-heading-id' });
    }
  }

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const slugs = slugCache.get(path.resolve(file));

    for (const match of content.matchAll(linkRe)) {
      const href = match[1].trim();
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('/')) continue;

      const hashIdx = href.indexOf('#');
      const filePart = hashIdx === -1 ? href : href.slice(0, hashIdx);
      const frag = hashIdx === -1 ? null : href.slice(hashIdx + 1);
      if (!frag) continue;

      if (!filePart) {
        // Same-page anchor.
        if (!slugs.has(decodeURIComponent(frag))) {
          errors.push({ file, href, kind: 'same-page' });
        }
        continue;
      }

      if (!/\.md$/.test(filePart)) {
        // Not a markdown target; let VitePress handle it.
        continue;
      }

      const targetResolved = path.resolve(path.dirname(file), filePart);
      const targetSlugs = slugCache.get(targetResolved);
      if (!targetSlugs) continue; // handled by VitePress dead-link check
      if (!targetSlugs.has(decodeURIComponent(frag))) {
        errors.push({ file, href, kind: 'cross-page' });
      }
    }
  }

  if (errors.length > 0 || headingErrors.length > 0) {
    const allErrors = headingErrors.concat(errors);
    console.error(`❌ Found ${allErrors.length} problem(s):`);
    for (const err of allErrors) {
      console.error(`  ${path.relative(__dirname, err.file)}`);
      console.error(`    ${err.href} (${err.kind})`);
    }
    process.exit(1);
  }

  console.log('✅ Anchors OK — checked ' + files.length + ' markdown files');
}

main();