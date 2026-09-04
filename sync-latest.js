import fs from 'fs';
import path from 'path';

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

function main() {
    const docsRoot = process.cwd();
    
    // Parse arguments
    let version = '';
    
    // Check command line arguments (e.g. node sync-latest.js --version=0.10.2 or --version 0.10.2)
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
