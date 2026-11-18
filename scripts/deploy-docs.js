// Deploy the VitePress build to the docs web root.
//
// Replaces the old pair of `node -e` one-liners in package.json: those were
// chained with `&&`, so a failed entry (e.g. the `en/` tree) stopped the copy
// silently and left the site with a partial build.
//
// Usage:
//   node scripts/deploy-docs.js            (clear target, then copy)
//   node scripts/deploy-docs.js --keep     (overwrite in place, clear nothing)
//   DOCS_DEPLOY_TARGET=... node scripts/deploy-docs.js
import fs from 'node:fs';
import path from 'node:path';

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`Usage: node scripts/deploy-docs.js [options]

  (no flag)   clear the target, then copy build/ into it
  --keep      copy over the existing files without clearing
  --help, -h  show this help

Target: DOCS_DEPLOY_TARGET env var, default \\\\srv\\www\\html\\getvale.org\\vale-docs`);
  process.exit(0);
}

const source = path.resolve('build');
const target = process.env.DOCS_DEPLOY_TARGET || '\\\\srv\\www\\html\\getvale.org\\vale-docs';
const keepExisting = process.argv.includes('--keep');

if (!fs.existsSync(path.join(source, 'index.html'))) {
  console.error(`✗ ${source}/index.html is missing — run "npm run docs:build" first.`);
  process.exit(1);
}

if (!fs.existsSync(target)) {
  console.error(`✗ Deploy target does not exist: ${target}`);
  process.exit(1);
}

function countFiles(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    total += entry.isDirectory() ? countFiles(full) : 1;
  }
  return total;
}

const sourceCount = countFiles(source);
console.log(`Source: ${source} (${sourceCount} files)`);
console.log(`Target: ${target}${keepExisting ? ' (keeping existing files)' : ''}`);

if (!keepExisting) {
  console.log('Clearing target...');
  for (const entry of fs.readdirSync(target)) {
    fs.rmSync(path.join(target, entry), { recursive: true, force: true, maxRetries: 5, retryDelay: 150 });
  }
}

const failures = [];
for (const entry of fs.readdirSync(source)) {
  const from = path.join(source, entry);
  const to = path.join(target, entry);
  try {
    fs.cpSync(from, to, { recursive: true, force: true, maxRetries: 5, retryDelay: 150 });
    console.log(`  ✓ ${entry}`);
  } catch (error) {
    failures.push({ entry, code: error.code || '?', message: error.message });
    console.error(`  ✗ ${entry}: ${error.code || ''} ${error.message}`);
  }
}

const targetCount = countFiles(target);
const expected = [
  'index.html',
  '404.html',
  path.join('en', 'latest', 'index.html'),
  path.join('en', 'latest', 'developer', 'collaboration.html'),
];

console.log('');
console.log(`Copied ${targetCount}/${sourceCount} files.`);

let ok = failures.length === 0 && targetCount === sourceCount;
for (const relative of expected) {
  if (!fs.existsSync(path.join(target, relative))) {
    ok = false;
    console.error(`✗ Missing after copy: ${relative}`);
  }
}

if (!ok) {
  console.error('');
  console.error('✗ Deploy incomplete. Re-run with --keep to retry only the missing entries,');
  console.error('  or check share permissions / antivirus locks on the target.');
  process.exit(1);
}

console.log('✓ Deploy complete: https://docs.getvale.org/');
