/**
 * check-parens.js
 *
 * Scans markdown files for odd/unbalanced parentheses `()` (and optionally
 * square brackets `[]` and curly braces `{}`).
 *
 * Usage:
 *   node scripts/check-parens.js           # scan all markdown files in repository
 *   npm run check:parens
 *
 * Exit code 1 when non-even/unbalanced parentheses are found, 0 otherwise.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const IGNORE_DIRS = new Set(['node_modules', '.git', 'build', '.vitepress/cache', '.vitepress/dist']);

function collectMdFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) {
        collectMdFiles(path.join(dir, entry.name), fileList);
      }
    } else if (entry.name.endsWith('.md')) {
      fileList.push(path.join(dir, entry.name));
    }
  }
  return fileList;
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  const openP = (content.match(/\(/g) || []).length;
  const closeP = (content.match(/\)/g) || []).length;
  const totalP = openP + closeP;

  const openB = (content.match(/\[/g) || []).length;
  const closeB = (content.match(/\]/g) || []).length;
  const totalB = openB + closeB;

  const openC = (content.match(/\{/g) || []).length;
  const closeC = (content.match(/\}/g) || []).length;
  const totalC = openC + closeC;

  const errors = [];

  // Check round parentheses ()
  if (totalP % 2 !== 0 || openP !== closeP) {
    errors.push({
      type: '()',
      open: openP,
      close: closeP,
      total: totalP,
      odd: totalP % 2 !== 0,
    });
  }

  // Check square brackets []
  if (totalB % 2 !== 0 || openB !== closeB) {
    errors.push({
      type: '[]',
      open: openB,
      close: closeB,
      total: totalB,
      odd: totalB % 2 !== 0,
    });
  }

  // Check curly braces {}
  if (totalC % 2 !== 0 || openC !== closeC) {
    errors.push({
      type: '{}',
      open: openC,
      close: closeC,
      total: totalC,
      odd: totalC % 2 !== 0,
    });
  }

  return { errors };
}

function main() {
  const files = collectMdFiles(ROOT);
  const fileErrors = [];

  for (const file of files) {
    const relativePath = path.relative(ROOT, file);
    const { errors } = checkFile(file);

    if (errors.length > 0) {
      fileErrors.push({ file: relativePath, errors });
    }
  }

  if (fileErrors.length > 0) {
    let totalProblems = 0;
    console.error(`❌ Found parenthesis problem(s) in ${fileErrors.length} file(s):\n`);
    for (const { file, errors } of fileErrors) {
      console.error(`  📄 ${file}`);
      for (const err of errors) {
        totalProblems++;
        const reason = err.odd ? 'odd count' : 'mismatched count';
        console.error(
          `     ${err.type} -> open: ${err.open}, close: ${err.close}, total: ${err.total} (${reason})`
        );
      }
    }
    console.error(`\nFound ${totalProblems} error(s). Please fix non-even/unbalanced parentheses.`);
    process.exit(1);
  }

  console.log(`✅ Parentheses OK — checked ${files.length} markdown file(s)`);
}

main();
