// Deploy the VitePress build to the docs web root.
//
// Files are copied one by one rather than with a single fs.cpSync per top-level
// entry: over SMB a whole-directory copy can sit silently for minutes, while
// per-file copying lets the progress line move and names the file it is on.
//
// The default stages the build inside the docroot and then renames each top-level
// entry over the old one: the site keeps serving the previous build for the whole
// copy, the swap itself takes milliseconds, and the docroot directory is never
// renamed. That last point matters on a web root that is a server mount point,
// where a directory rename is impossible and a partial copy leaves the site down.
// Entries the build no longer has go to the backup too, so removed pages stop
// being served.
//
// --overwrite copies over the files without staging, and --swap renames the whole
// directory instead of its entries. --swap only works when the web server
// re-resolves its document root on every request: Apache and IIS keep a handle on
// the docroot directory, so renaming it away leaves them serving an empty
// directory until they are restarted.
//
// Usage:
//   node scripts/deploy-docs.js              (overwrite the files in place)
//   node scripts/deploy-docs.js --in-place   (clear the target, then copy)
//   node scripts/deploy-docs.js --swap       (stage next to the target, then swap)
//   DOCS_DEPLOY_TARGET=... node scripts/deploy-docs.js
import fs from 'node:fs';
import path from 'node:path';

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`Usage: node scripts/deploy-docs.js [options]

  (no flag)   stage inside the docroot, then rename the entries in place:
              the site keeps serving the old build until a millisecond swap
  --overwrite copy over the existing files, nothing staged or cleared
  --in-place  clear the target, then copy into it directly
  --swap      stage next to the target and swap the whole directory with two
              renames (breaks servers that hold the docroot directory open)
  --swap-contents
              same as no flag (explicit form)
  --keep      same as --overwrite (kept for compatibility)
  --help, -h  show this help

Target: DOCS_DEPLOY_TARGET env var, default \\\\srv\\www\\html\\getvale.org\\vale-docs`);
  process.exit(0);
}

// A typo such as --in-plce must not silently start a real deploy.
const KNOWN_FLAGS = ['--overwrite', '--keep', '--in-place', '--swap', '--swap-contents', '--help', '-h'];
const unknownFlags = process.argv.slice(2).filter((arg) => !KNOWN_FLAGS.includes(arg));
if (unknownFlags.length > 0) {
  console.error(`✗ Unknown option: ${unknownFlags.join(', ')}`);
  console.error('  Run with --help to see the available options.');
  process.exit(1);
}

const source = path.resolve('build');
const target = process.env.DOCS_DEPLOY_TARGET || '\\\\srv\\www\\html\\getvale.org\\vale-docs';
const keepExisting = process.argv.includes('--overwrite') || process.argv.includes('--keep');
const inPlace = process.argv.includes('--in-place');

// Staging and backup sit next to the target so both renames stay on one volume.
const targetRoot = target.replace(/[\\/]+$/, '');
const stagingDir = `${targetRoot}.staging`;
const backupDir = `${targetRoot}.old`;
// A docroot that is a mount point cannot be renamed at all, so --swap-contents
// stages and backs up inside it and renames the top-level entries instead.
const innerStaging = path.join(targetRoot, '.deploy-staging');
const innerBackup = path.join(targetRoot, '.deploy-old');
const useSwap = process.argv.includes('--swap') && !keepExisting && !inPlace;
// Content swap is the default: it never renames the docroot directory itself,
// which is the only mode that is safe when the web root is a server mount point.
const useContentSwap = !useSwap && !keepExisting && !inPlace;

if (!fs.existsSync(path.join(source, 'index.html'))) {
  console.error(`✗ ${source}/index.html is missing — run "npm run docs:build" first.`);
  process.exit(1);
}

if (!fs.existsSync(targetRoot)) {
  console.error(`✗ Deploy target does not exist: ${targetRoot}`);
  process.exit(1);
}

// Renaming a link only moves the link: the web server keeps serving whatever it
// points at, and the deployed files would land in a directory nobody serves.
if (useSwap && isLink(targetRoot)) {
  console.error(`✗ Deploy target is a symlink/junction: ${targetRoot}`);
  console.error('  Swapping would only rename the link, so the files would not be served.');    console.error('  Point DOCS_DEPLOY_TARGET at the real directory, or drop --swap.');
  process.exit(1);
}

function countFiles(p) {
  if (!fs.statSync(p).isDirectory()) return 1;
  let total = 0;
  for (const entry of fs.readdirSync(p, { withFileTypes: true })) {
    const full = path.join(p, entry.name);
    total += entry.isDirectory() ? countFiles(full) : 1;
  }
  return total;
}

function isLink(p) {
  try {
    return fs.lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
}

// A junction/symlink must be removed as a link. Recursive deletion on Windows can
// walk into the directory a junction points at and empty it, which would wipe the
// live docroot instead of the throwaway copy.
function removeTree(dir) {
  if (isLink(dir)) {
    fs.rmSync(dir, { force: true, maxRetries: 5, retryDelay: 150 });
    return;
  }
  fs.rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 150 });
}

const entries = fs.readdirSync(source);
const sourceCount = countFiles(source);
console.log(`Source: ${source} (${sourceCount} files)`);
const mode = useSwap
  ? 'staged swap'
  : useContentSwap
    ? 'content swap'
    : inPlace
      ? 'cleared, then copied'
      : 'overwriting in place';
console.log(`Target: ${targetRoot} (${mode})`);
if (useSwap) console.log(`Staging: ${stagingDir}`);
if (useContentSwap) console.log(`Staging: ${innerStaging}`);

const copyRoot = useSwap ? stagingDir : useContentSwap ? innerStaging : targetRoot;

if (useSwap) {
  console.log('Preparing staging directory...');
  removeTree(stagingDir);
  removeTree(backupDir);
  fs.mkdirSync(stagingDir, { recursive: true });
} else if (useContentSwap) {
  console.log('Preparing staging directory inside the docroot...');
  removeTree(innerStaging);
  removeTree(innerBackup);
  fs.mkdirSync(innerStaging, { recursive: true });
} else if (inPlace) {
  console.log('Clearing target...');
  for (const entry of fs.readdirSync(targetRoot)) {
    removeTree(path.join(targetRoot, entry));
  }
}

const failures = [];
let copiedFiles = 0;
let currentPath = '';
let lastTick = 0;
let lineWidth = 0;
const startedAt = Date.now();
const TICK_MS = 2000;
const canRewrite = Boolean(process.stdout.isTTY);

function progress() {
  const percent = sourceCount === 0 ? 100 : Math.floor((copiedFiles / sourceCount) * 100);
  const seconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
  return `[${String(percent).padStart(3)}% ${copiedFiles}/${sourceCount} ${seconds}s]`;
}

// Live line, rewritten in place at most every TICK_MS, so a slow network share
// never looks like a hang.
function tick(force = false) {
  const now = Date.now();
  if (!force && now - lastTick < TICK_MS) return;
  lastTick = now;
  const line = `  … ${progress()} ${currentPath}`;
  if (canRewrite) {
    lineWidth = Math.max(lineWidth, line.length);
    process.stdout.write(`\r${line.padEnd(lineWidth)}`);
  } else if (force) {
    console.log(line);
  }
}

// Clears the live line before printing a line that stays.
function report(text) {
  if (canRewrite && lineWidth > 0) {
    process.stdout.write(`\r${' '.repeat(lineWidth)}\r`);
    lineWidth = 0;
  }
  console.log(text);
}

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

// A network share throws EBUSY/EACCES at random when antivirus or the web server
// touches a file mid-copy, so retry those with a small backoff.
function copyFileWithRetry(from, to, attempts = 5) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      fs.copyFileSync(from, to);
      return;
    } catch (error) {
      const transient = ['EBUSY', 'EPERM', 'EACCES', 'EMFILE', 'ENFILE'].includes(error.code);
      if (!transient || attempt >= attempts) throw error;
      sleepSync(150 * attempt);
    }
  }
}

function copyPath(from, to, relative) {
  try {
    if (fs.lstatSync(from).isDirectory()) {
      fs.mkdirSync(to, { recursive: true });
      for (const name of fs.readdirSync(from)) {
        copyPath(path.join(from, name), path.join(to, name), `${relative}/${name}`);
      }
      return;
    }
    currentPath = relative;
    fs.mkdirSync(path.dirname(to), { recursive: true });
    copyFileWithRetry(from, to);
    copiedFiles += 1;
    tick();
  } catch (error) {
    const code = error.code || '?';
    failures.push({ entry: relative, code, message: error.message });
    report(`  ✗ ${progress()} ${relative}: ${code} ${error.message}`);
  }
}

console.log('Copying files...');
for (const entry of entries) {
  const before = failures.length;
  currentPath = entry;
  tick(true);
  copyPath(path.join(source, entry), path.join(copyRoot, entry), entry);
  report(`  ${failures.length === before ? '✓' : '✗'} ${progress()} ${entry}`);
}

const copiedCount = countFiles(copyRoot);
const expected = [
  'index.html',
  '404.html',
  path.join('en', 'latest', 'index.html'),
  path.join('en', 'latest', 'developer', 'collaboration.html'),
];

console.log('');
console.log(`Copied ${copiedCount}/${sourceCount} files.`);

// Overwriting in place leaves unrelated files behind on purpose (old pages, extra
// assets), so an exact file count only proves a complete copy when the target was
// cleared or staged.
const exactCount = useSwap || useContentSwap || inPlace;
let ok = failures.length === 0 && (!exactCount || copiedCount === sourceCount);
for (const relative of expected) {
  if (!fs.existsSync(path.join(copyRoot, relative))) {
    ok = false;
    console.error(`✗ Missing after copy: ${relative}`);
  }
}

if (!ok) {
  console.error('');
  console.error('✗ Deploy incomplete.');
  if (useSwap) {
    console.error(`  The live site was not touched; the staged copy is at ${stagingDir}.`);
    console.error('  Fix the cause and re-run — the staging directory is rebuilt from scratch.');
  } else if (useContentSwap) {
    removeTree(innerStaging);
    console.error('  The live site was not touched; the staging folder inside the docroot was removed.');
    console.error('  Fix the cause and re-run.');
  } else {
    console.error('  Re-run to retry (already copied files are overwritten again),');
    console.error('  or check share permissions / antivirus locks on the target.');
  }
  process.exit(1);
}

if (useContentSwap) {
  console.log('Swapping new files into place...');
  fs.mkdirSync(innerBackup, { recursive: true });
  const swapErrors = [];
  const swapStarted = Date.now();

  for (const entry of entries) {
    const current = path.join(targetRoot, entry);
    const staged = path.join(copyRoot, entry);
    const previous = path.join(innerBackup, entry);
    let movedAside = false;
    try {
      if (fs.existsSync(current)) {
        fs.renameSync(current, previous);
        movedAside = true;
      }
      fs.renameSync(staged, current);
    } catch (error) {
      if (movedAside) {
        try {
          fs.renameSync(previous, current);
        } catch (rollbackError) {
          swapErrors.push(`${entry} (rollback failed: ${rollbackError.code || '?'})`);
          continue;
        }
      }
      swapErrors.push(`${entry} (${error.code || '?'}: ${error.message})`);
    }
  }

  // Top-level entries the build no longer has (a removed page, an old asset
  // folder) go to the backup as well: otherwise a deleted doc would stay live.
  const stale = fs
    .readdirSync(targetRoot)
    .filter(
      (name) =>
        !entries.includes(name) &&
        name !== path.basename(innerStaging) &&
        name !== path.basename(innerBackup),
    );
  for (const entry of stale) {
    try {
      fs.renameSync(path.join(targetRoot, entry), path.join(innerBackup, entry));
    } catch (error) {
      swapErrors.push(`${entry} (${error.code || '?'}: ${error.message})`);
    }
  }
  if (stale.length > 0) console.log(`  ✓ ${stale.length} stale entr${stale.length === 1 ? 'y' : 'ies'} moved aside: ${stale.join(', ')}`);

  const swapMs = Date.now() - swapStarted;
  if (swapErrors.length > 0) {
    console.error('');
    console.error(`✗ Could not swap ${swapErrors.length} entr${swapErrors.length === 1 ? 'y' : 'ies'}:`);
    for (const message of swapErrors) console.error(`  ${message}`);
    console.error(`  Rolled back where possible. New files: ${innerStaging}, previous files: ${innerBackup}`);
    process.exit(1);
  }

  console.log(`  ✓ ${entries.length} entries swapped in ${swapMs} ms`);
  try {
    removeTree(innerBackup);
    console.log('  ✓ previous files removed');
  } catch (error) {
    console.warn(`  ! previous files left at ${innerBackup}: ${error.code || ''} ${error.message}`);
  }
  removeTree(innerStaging);
}

if (useSwap) {
  console.log('Swapping new build into place...');
  try {
    fs.renameSync(targetRoot, backupDir);
  } catch (error) {
    console.error('');
    console.error(`✗ Could not move the current build aside: ${error.code || ''} ${error.message}`);
    console.error(`  The live site is unchanged; the staged copy is at ${stagingDir}.`);
    console.error('  Run without --swap to copy in place instead.');
    process.exit(1);
  }

  try {
    fs.renameSync(stagingDir, targetRoot);
  } catch (error) {
    try {
      fs.renameSync(backupDir, targetRoot);
      console.error('');
      console.error(`✗ Could not swap the new build in: ${error.code || ''} ${error.message}`);
      console.error(`  The live site is unchanged; the staged copy is at ${stagingDir}.`);
    } catch (rollbackError) {
      console.error('');
      console.error(`✗ Swap failed (${error.code || '?'}) and the rollback failed too (${rollbackError.code || '?'}).`);
      console.error(`  Previous build: ${backupDir}`);
      console.error(`  New build:      ${stagingDir}`);
      console.error(`  Rename one of them to ${targetRoot} to recover.`);
    }
    process.exit(1);
  }

  console.log('  ✓ new build is live');
  try {
    removeTree(backupDir);
    console.log('  ✓ previous build removed');
  } catch (error) {
    console.warn(`  ! previous build left at ${backupDir}: ${error.code || ''} ${error.message}`);
  }
}

console.log('✓ Deploy complete: https://docs.getvale.org/');
