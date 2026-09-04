#!/usr/bin/env node
/**
 * sync-readme.js
 *
 * Reads VARIANTS from .vitepress/config.js and syncs version badges
 * in ../vale/README.md. Also syncs updatePublicKeyEd25519 if present.
 *
 * If ../vale or ../vale/README.md is missing, prints info and exits 0.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// --- Resolve sibling vale directory ---
const siblingCandidates = [
  path.resolve(rootDir, '..', 'vale'),
  path.resolve(rootDir, '..', '..', 'vale'),
];

let valeDir = null;
for (const candidate of siblingCandidates) {
  if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
    valeDir = candidate;
    break;
  }
}

if (!valeDir) {
  console.log('ℹ️  Sibling vale directory not found (looked for ../vale or ../../vale). Skipping README sync.');
  process.exit(0);
}

const readmePath = path.join(valeDir, 'README.md');
if (!fs.existsSync(readmePath)) {
  console.log(`ℹ️  README.md not found at ${readmePath}. Skipping sync.`);
  process.exit(0);
}

// --- Read VARIANTS from .vitepress/config.js ---
const configPath = path.join(rootDir, '.vitepress', 'config.js');
if (!fs.existsSync(configPath)) {
  console.log('ℹ️  .vitepress/config.js not found. Skipping sync.');
  process.exit(0);
}

const configContent = fs.readFileSync(configPath, 'utf-8');

// Extract VARIANTS object using regex
const variantsMatch = configContent.match(/const\s+VARIANTS\s*=\s*\{([\s\S]*?)\};/);
if (!variantsMatch) {
  console.log('ℹ️  VARIANTS object not found in .vitepress/config.js. Skipping sync.');
  process.exit(0);
}

// Parse VARIANTS entries
const variantsBlock = variantsMatch[1];
const variants = {};
const entryRegex = /(\w+)\s*:\s*['"]([^'"]+)['"]/g;
let match;
while ((match = entryRegex.exec(variantsBlock)) !== null) {
  variants[match[1]] = match[2];
}

console.log('📋 VARIANTS found:', JSON.stringify(variants, null, 2));

// --- Read README.md ---
let readmeContent = fs.readFileSync(readmePath, 'utf-8');
const originalContent = readmeContent;

// --- Sync version badges ---
// Map VARIANTS keys to badge patterns in README
const badgeMappings = [
  {
    key: 'phpVersion',
    // Matches: PHP-^8.3 or PHP-8.3 or PHP-8.3+
    pattern: /PHP-\^?[\d.]+\+?/g,
    replacement: (v) => `PHP-${v}`,
  },
  {
    key: 'mysqlVersion',
    pattern: /MySQL-[\d.]+\+?/g,
    replacement: (v) => `MySQL-${v}+`,
  },
  {
    key: 'mariadbVersion',
    pattern: /MariaDB-[\d.]+\+?/g,
    replacement: (v) => `MariaDB-${v}+`,
  },
  {
    key: 'pgsqlVersion',
    pattern: /PostgreSQL-[\d.]+\+?/g,
    replacement: (v) => `PostgreSQL-${v}+`,
  },
  {
    key: 'nodeVersion',
    pattern: /Node\.js-[\d.]+\+?/g,
    replacement: (v) => `Node.js-${v}+`,
  },
  {
    key: 'composerVersion',
    pattern: /Composer-[\d.]+\+?/g,
    replacement: (v) => `Composer-${v}`,
  },
];

let updatedCount = 0;
for (const mapping of badgeMappings) {
  if (!variants[mapping.key]) continue;
  
  const newContent = readmeContent.replace(mapping.pattern, (match) => {
    const replacement = mapping.replacement(variants[mapping.key]);
    if (match !== replacement) {
      console.log(`  🔄 ${mapping.key}: "${match}" → "${replacement}"`);
      updatedCount++;
    }
    return replacement;
  });
  readmeContent = newContent;
}

// --- Sync updatePublicKeyEd25519 if present in README ---
if (variants.updatePublicKeyEd25519) {
  // Look for any ed25519 public key pattern in README
  const keyPattern = /ed25519[_-]?public[_-]?key[_-]?[:=]\s*['"]?([A-Za-z0-9+/=]+)['"]?/gi;
  const newContent = readmeContent.replace(keyPattern, (match, oldKey) => {
    if (oldKey !== variants.updatePublicKeyEd25519) {
      console.log(`  🔄 updatePublicKeyEd25519: "${oldKey}" → "${variants.updatePublicKeyEd25519}"`);
      updatedCount++;
      return match.replace(oldKey, variants.updatePublicKeyEd25519);
    }
    return match;
  });
  readmeContent = newContent;
}

// --- Write back if changed ---
if (readmeContent !== originalContent) {
  fs.writeFileSync(readmePath, readmeContent, 'utf-8');
  console.log(`\n✅ README.md updated (${updatedCount} changes) at ${readmePath}`);
} else {
  console.log('\n✅ README.md already up to date.');
}
