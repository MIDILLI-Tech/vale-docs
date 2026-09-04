/**
 * check-external-links.js
 *
 * Checks external (http/https) links in `latest/` docs for availability.
 *
 * Why a separate script: `npm run docs:build` only validates internal links,
 * and external sites are slow/flaky — they must never block a build. Run
 * this periodically (e.g. weekly CI) instead:
 *
 *   node scripts/check-external-links.js            # warn-only, exit 0
 *   node scripts/check-external-links.js --strict   # exit 1 on unreachable URLs
 *   npm run check:external [-- --strict]
 *
 * Placeholder/example hosts are skipped via SKIP_HOSTS below. Bot-protection
 * responses (403/429) are reported as SKIP, not failures — too many sites
 * block headless requests to be a reliable signal.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const strict = process.argv.includes('--strict');

// Example/fictional hosts used in docs samples — never checked.
const SKIP_HOSTS = [
  'example.com',
  'example.org',
  'yoursite.com',
  'your-server',
  'localhost',
  'foopay.com',
  'yourcompany.com',
  'via.placeholder.com', // temporary placeholder artwork
  // Sample hosts used in CLI/security examples (old/new-domain, your-domain).
  'old-domain.com',
  'new-domain.com',
  'old.com',
  'new.com',
  'yourdomain.com',
  'your-domain.com',
  'your-domain',
  'acmecargo.com', // fictional carrier in tracking examples
  'my-old-blog.com',
  'old-host.com',
];

const TIMEOUT_MS = 10000;
const CONCURRENCY = 5;
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function collectMarkdown(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectMarkdown(full, out);
    else if (entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

function localeLatestDirs() {
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^[a-z]{2}$/.test(e.name))
    .map((e) => path.join(ROOT, e.name, 'latest'))
    .filter((d) => fs.existsSync(d));
}

function extractUrls(text, file, out) {
  const re = /https?:\/\/[^\s)"'<>\]`\[]+/g;
  for (const m of text.matchAll(re)) {
    let url = m[0].replace(/[.,;:!?)\]*_~|]+$/, '');
    let host;
    try {
      host = new URL(url).hostname.toLowerCase();
    } catch {
      continue;
    }
    if (SKIP_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) continue;
    if (!out.has(url)) out.set(url, file);
  }
}

async function check(url) {
  for (const method of ['HEAD', 'GET']) {
    try {
      const res = await fetch(url, {
        method,
        redirect: 'follow',
        headers: { 'User-Agent': UA },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (method === 'HEAD' && (res.status === 405 || res.status === 501)) continue;
      return res.status;
    } catch (err) {
      if (method === 'HEAD') continue; // some hosts refuse HEAD — retry with GET
      return err?.cause?.code ?? err?.name ?? 'FETCH_ERROR';
    }
  }
  return 'FETCH_ERROR';
}

async function main() {
  const files = localeLatestDirs().flatMap((d) => collectMarkdown(d));
  const urls = new Map();
  for (const file of files) {
    extractUrls(fs.readFileSync(file, 'utf8'), path.relative(ROOT, file), urls);
  }

  const entries = [...urls.entries()];
  const results = [];
  for (let i = 0; i < entries.length; i += CONCURRENCY) {
    const batch = await Promise.all(
      entries.slice(i, i + CONCURRENCY).map(async ([url, file]) => [url, file, await check(url)])
    );
    results.push(...batch);
  }

  let errors = 0;
  for (const [url, file, status] of results) {
    if (typeof status === 'number' && status >= 200 && status < 400) {
      console.log(`✅ ${status} ${url} (${file})`);
    } else if (status === 403 || status === 429) {
      console.log(`⏭️  ${status} ${url} (${file}) — bot protection, skipped`);
    } else {
      console.log(`❌ ${status} ${url} (${file})`);
      errors += 1;
    }
  }

  console.log(
    `\nChecked ${results.length} external URL(s) across ${files.length} file(s): ${errors} unreachable.`
  );
  if (errors > 0 && strict) process.exit(1);
}

main();
