import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Helper to recursively make file/directory writable
function makeWritable(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    const stat = fs.statSync(dirPath);
    
    // Check if it's a directory
    if (stat.isDirectory()) {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            makeWritable(path.join(dirPath, file));
        }
    }
    
    // chmod 0o666 (writable for all)
    try {
        fs.chmodSync(dirPath, 0o666);
    } catch (e) {
        // Ignore permission change errors
    }
}

// Helper to recursively make file/directory read-only
function makeReadOnly(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    const stat = fs.statSync(dirPath);
    
    if (stat.isDirectory()) {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            makeReadOnly(path.join(dirPath, file));
        }
    }
    
    // chmod 0o444 (read-only for all)
    try {
        fs.chmodSync(dirPath, 0o444);
    } catch (e) {
        // Ignore permission change errors
    }
}

// Helper to recursively copy a directory
function copyDirRecursive(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDirRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Helper to recursively remove a directory
function removeDirRecursive(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    makeWritable(dirPath);
    fs.rmSync(dirPath, { recursive: true, force: true });
}

/**
 * Extract UPDATE_PUBLIC_KEY_ED25519 from .env.example file
 * Returns the key value or null if not found / file missing
 */
function getPublicKeyFromEnvExample(docsRoot) {
    const valeRoot = path.resolve(docsRoot, '..', 'vale');
    const envExamplePath = path.join(valeRoot, '.env.example');
    
    if (!fs.existsSync(envExamplePath)) {
        console.log("    ../vale/.env.example not found — skipping (using existing values)");
        return null;
    }
    
    try {
        const content = fs.readFileSync(envExamplePath, 'utf8');
        const match = content.match(/^UPDATE_PUBLIC_KEY_ED25519=(.+)$/m);
        if (!match) return null;
        // Strip inline comment (everything after # or //)
        let key = match[1].trim();
        key = key.split(/\s+[#\/]{1,2}/)[0].trim();
        return key;
    } catch (e) {
        console.warn('Warning: Could not read .env.example:', e.message);
        return null;
    }
}

/**
 * Update environment-generator.html with the current public key
 *
 * The canonical copy lives in the sibling Vale checkout (../vale/scripts/),
 * which sync-env-locales.js and copy-env-generator.js also touch. Syncing the
 * canonical file keeps the key in place after the copy step; the docs-root and
 * build copies are updated too for dev/build parity.
 */
function updateEnvironmentGenerator(docsRoot, publicKey) {
    if (!publicKey) return;

    const valeRoot = path.resolve(docsRoot, '..', 'vale');
    const generatorPaths = [
        path.join(valeRoot, 'scripts', 'environment-generator.html'),
        path.join(docsRoot, 'environment-generator.html'),
        path.join(docsRoot, 'build', 'environment-generator.html')
    ];

    // Two locations carry the key: the form input default and the JS fallback.
    const inputRegex = /(id="UPDATE_PUBLIC_KEY_ED25519"[^>]*value=")[^"]*(")/;
    const fallbackRegex = /(var updateKeyEd = val\('UPDATE_PUBLIC_KEY_ED25519'\) \|\| ')[^']*(')/;

    for (const genPath of generatorPaths) {
        if (!fs.existsSync(genPath)) continue;

        try {
            let content = fs.readFileSync(genPath, 'utf8');
            let newContent = content.replace(inputRegex, `$1${publicKey}$2`);
            newContent = newContent.replace(fallbackRegex, `$1${publicKey}$2`);

            if (newContent !== content) {
                fs.writeFileSync(genPath, newContent, 'utf8');
                console.log(`    Updated public key in ${path.relative(docsRoot, genPath) || genPath}`);
            } else {
                console.log(`    Public key unchanged in ${path.relative(docsRoot, genPath) || genPath}`);
            }
        } catch (e) {
            console.warn(`Warning: Could not update ${genPath}:`, e.message);
        }
    }
}

/**
 * Update config.js VARIANTS with the current public key
 * The VARIANTS value in config.js should be manually kept in sync with .env.example.
 * Run: sed -i "s/updatePublicKeyEd25519: '.*'/updatePublicKeyEd25519: 'NEW_KEY'/" .vitepress/config.js
 */
function updateConfigJs(docsRoot, publicKey) {
    if (!publicKey) return;
    
    const configPath = path.join(docsRoot, '.vitepress', 'config.js');
    if (!fs.existsSync(configPath)) return;
    
    try {
        let content = fs.readFileSync(configPath, 'utf8');
        // Check if the current VARIANTS value matches
        const regex = /updatePublicKeyEd25519:\s*'([^']+)'/;
        const match = content.match(regex);
        const writeRegex = /updatePublicKeyEd25519:\s*'[^']*'/;
        if (!writeRegex.test(content)) {
            console.warn('    Warning: updatePublicKeyEd25519 not found in .vitepress/config.js (VARIANTS)');
            return;
        }

        if (match && match[1] === publicKey) {
            console.log(`    Public key already synced in .vitepress/config.js (VARIANTS)`);
            return;
        }

        const newContent = content.replace(writeRegex, `updatePublicKeyEd25519: '${publicKey}'`);
        if (newContent !== content) {
            fs.writeFileSync(configPath, newContent, 'utf8');
            console.log(`    Updated public key in .vitepress/config.js (VARIANTS)`);
            console.log(`    Previous: ${match ? match[1] : 'NOT FOUND'}`);
            console.log(`    Current:  ${publicKey}`);
        } else {
            console.log(`    Public key unchanged in .vitepress/config.js (VARIANTS)`);
        }
    } catch (e) {
        console.warn('Warning: Could not check config.js:', e.message);
    }
}

function syncPublicKey(docsRoot) {
    console.log("==> Syncing UPDATE_PUBLIC_KEY_ED25519 from ../vale/.env.example");
    const publicKey = getPublicKeyFromEnvExample(docsRoot);
    
    if (publicKey) {
        console.log(`    Found key: ${publicKey.substring(0, 20)}...`);
        updateEnvironmentGenerator(docsRoot, publicKey);
        updateConfigJs(docsRoot, publicKey);
    } else {
        console.log("    ../vale/.env.example not found or key missing — skipping (using existing values)");
    }
}

function main() {
    const docsRoot = process.cwd();
    
    // ALWAYS sync public key from ../vale/.env.example (runs on every build)
    syncPublicKey(docsRoot);
    
    // Parse arguments
    let version = '';
    
    // Check command line arguments (e.g. node scripts/sync-latest.js --version=0.10.2 or --version 0.10.2)
    const args = process.argv.slice(2);
    for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith('--version=')) {
            version = args[i].split('=')[1];
        } else if (args[i] === '--version' && i + 1 < args.length) {
            version = args[i + 1];
            i++;
        }
    }
    
    // Support npm flag forwarding (npm_config_version)
    if (!version && process.env.npm_config_version) {
        version = process.env.npm_config_version;
    }
    
    // Non-interactive default: skip version creation when no version is provided
    if (!version) {
        console.log("No version provided. Skipped version creation.");
        process.exit(0);
    }
    
    // Normalize: strip leading 'v' then re-add it
    version = 'v' + version.replace(/^v+/i, '');
    
    if (!/^v\d+\.\d+\.\d+$/.test(version)) {
        console.error(`ERROR: Invalid version format '${version}'. Expected e.g. v0.10.2`);
        process.exit(1);
    }
    
    // Get Locale Directories
    const excludedDirs = ['node_modules', '.vitepress', 'public'];
    const localeDirs = fs.readdirSync(docsRoot, { withFileTypes: true })
        .filter(entry => 
            entry.isDirectory() && 
            !/^[\._]/.test(entry.name) && 
            !excludedDirs.includes(entry.name)
        );
        
    for (const localeDir of localeDirs) {
        console.log(`==> Locale: ${localeDir.name}`);
        
        const latestDir = path.join(docsRoot, localeDir.name, 'latest');
        if (!fs.existsSync(latestDir)) {
            console.log("    latest/ not found, skipping");
            continue;
        }
        
        // Ensure latest/ is writable
        makeWritable(latestDir);
        console.log("    latest/ is writable (ensured)");
        
        // Copy latest/ -> vX.Y.Z/
        const targetDir = path.join(docsRoot, localeDir.name, version);
        if (fs.existsSync(targetDir)) {
            console.log(`    ${version} already exists, overwriting ...`);
            removeDirRecursive(targetDir);
        }
        
        console.log(`    Copying latest/ -> ${version} ...`);
        copyDirRecursive(latestDir, targetDir);
        console.log("    Copy OK");
        
        // Set ALL versioned dirs (including the one just created) to read-only
        const subDirs = fs.readdirSync(path.join(docsRoot, localeDir.name), { withFileTypes: true });
        for (const subDir of subDirs) {
            if (subDir.isDirectory() && /^v\d+\.\d+\.\d+$/.test(subDir.name)) {
                const versionedPath = path.join(docsRoot, localeDir.name, subDir.name);
                makeReadOnly(versionedPath);
                console.log(`    ${subDir.name} -> read-only OK`);
            }
        }
    }
    
    // Update CURRENT_VERSION in config.js
    const configPath = path.join(docsRoot, '.vitepress', 'config.js');
    if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, 'utf8');
        const newContent = content.replace(/const CURRENT_VERSION = 'v[\d\.]+'/, `const CURRENT_VERSION = '${version}'`);
        if (content !== newContent) {
            console.log(`==> Updating CURRENT_VERSION to ${version} in config.js`);
            fs.writeFileSync(configPath, newContent, 'utf8');
        } else {
            console.log(`==> CURRENT_VERSION already ${version}`);
        }
    }
    
    console.log("Done.");
}

main();
