/**
 * build-llms-txt.js
 *
 * Generates `build/llms.txt` — the https://llmstxt.org/ entry point — from the
 * VitePress sidebar instead of maintaining it by hand.
 *
 * Only the curated sidebar is emitted, not every markdown file: the sidebar
 * already encodes the grouping and reading order a reader (or an agent) needs,
 * and `scripts/check-sidebar.js` keeps that source honest, so the map can never
 * point at a page that does not exist.
 *
 * Page descriptions are omitted on purpose — no page carries `description`
 * frontmatter, and inventing them here would just create a second source of
 * truth. The absolute URL base comes from the sitemap hostname.
 *
 * Usage:
 *   node scripts/build-llms-txt.js     # after `vitepress build` (needs build/)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import config from '../.vitepress/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'build');
const OUT = path.join(OUT_DIR, 'llms.txt');

const SITE = (config.sitemap?.hostname ?? 'https://docs.getvale.org').replace(/\/+$/, '');

const HEADER = `# Vale Documentation

> Vale is a lightweight PHP CMS and e-commerce platform (AGPL-3.0): content, shop, orders, media, newsletter and a REST API. This file maps the documentation so an agent can jump straight to the right page.

- Admin Guide: running a Vale site day to day (content, shop, settings, updates).
- Developer Guide: architecture, REST API, themes, plugins, deployment.
- Machine-readable API contract: every installation serves its own OpenAPI 3.1 document at \`GET /api/v1/openapi.json\`; the REST API page below explains it.
- Working on Vale's own source: \`AGENTS.md\` in the repository, plus the \`vale-agents\` release pack for the agent skills.
`;

// Section titles come from the sidebar base path, not from the first group:
// a base can hold several groups (Basics, Architecture, Ship, …) where no
// single group title describes the whole section.
const SECTION_TITLES = {
  '/en/latest/': 'Overview',
  '/en/latest/admin/': 'Admin Guide',
  '/en/latest/developer/': 'Developer Guide',
  '/tr/latest/': 'Genel Bakış',
  '/tr/latest/admin/': 'Yönetici Rehberi',
  '/tr/latest/developer/': 'Geliştirici Rehberi',
};

// Versioned snapshots (en/v0.60/…) only exist after a release creates them and
// `check-sidebar.js` skips them for the same reason; pointing an agent at a
// frozen archive instead of `latest/` is never what is wanted.
const VERSIONED_LINK = /\/[a-z]{2}\/v\d+\.\d+(?:\.\d+)?\//;

const seenLinks = new Set();

function absolute(link) {
  return SITE + (link.startsWith('/') ? link : `/${link}`);
}

function renderEntry(item, depth) {
  const indent = '  '.repeat(depth);
  if (typeof item.link !== 'string') {
    return `${indent}- ${item.text}`;
  }

  const clean = item.link.split('#')[0].split('?')[0];
  if (VERSIONED_LINK.test(clean) || seenLinks.has(clean)) {
    return null;
  }
  seenLinks.add(clean);

  return `${indent}- [${item.text}](${absolute(clean)})`;
}

function renderItems(items, depth, out) {
  for (const item of items ?? []) {
    if (!item || typeof item !== 'object') continue;

    const line = renderEntry(item, depth);
    if (line !== null) out.push(line);

    if (Array.isArray(item.items)) {
      renderItems(item.items, depth + 1, out);
    }
  }

  return out;
}

function sectionTitle(groups, loose, base) {
  if (SECTION_TITLES[base]) return SECTION_TITLES[base];
  if (groups.length === 1) return groups[0].text;
  if (groups.length === 0 && loose.length > 0) return loose[0].text;

  const segment = base.replace(/\/$/, '').split('/').pop() ?? base;
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

function renderSidebar(sidebar, blocks, seenBases) {
  for (const [base, sections] of Object.entries(sidebar)) {
    // Frozen snapshots (en/v0.60/…) are never the right target for an agent.
    if (VERSIONED_LINK.test(base.endsWith('/') ? base : `${base}/`)) continue;

    // A locale may reuse the previous locale's sidebar object (or the config may
    // expose it twice); render every base path once.
    if (seenBases.has(base)) continue;
    seenBases.add(base);

    const groups = sections.filter((section) => Array.isArray(section.items));
    const loose = sections.filter((section) => !Array.isArray(section.items));

    const title = sectionTitle(groups, loose, base);
    const linksBefore = seenLinks.size;
    const lines = renderItems(loose, 0, []);
    for (const group of groups) {
      // The outermost group usually repeats the section title ("Admin Guide"),
      // so it becomes the H2 instead of a nested heading.
      if (group.text !== title) {
        lines.push(`### ${group.text}`);
      }
      renderItems(group.items, 0, lines);
    }

    // A heading with no fresh links (every entry already emitted elsewhere) is
    // noise — skip the block entirely.
    if (lines.length === 0 || seenLinks.size === linksBefore) continue;

    blocks.push(`## ${title}\n\n${lines.join('\n')}`);
  }
}

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    console.log('build/ not found — run `npm run docs:build` first. Skipping llms.txt.');
    return;
  }

  // The root locale and config.themeConfig can reference the same sidebar
  // object; a Set keeps it from being rendered twice.
  const sidebars = new Set();
  if (config.themeConfig?.sidebar) sidebars.add(config.themeConfig.sidebar);
  for (const locale of Object.values(config.locales ?? {})) {
    if (locale?.themeConfig?.sidebar) sidebars.add(locale.themeConfig.sidebar);
  }

  const blocks = [];
  const seenBases = new Set();
  for (const sidebar of sidebars) {
    renderSidebar(sidebar, blocks, seenBases);
  }

  if (blocks.length === 0) {
    console.error('❌ No sidebar entries found — llms.txt would be empty.');
    process.exit(1);
  }

  const content = `${HEADER}\n${blocks.join('\n\n')}\n`;
  fs.writeFileSync(OUT, content);

  console.log(`✅ llms.txt written: ${path.relative(ROOT, OUT)} (${seenLinks.size} links)`);
}

main();
