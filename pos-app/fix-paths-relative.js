const fs = require('fs');
const path = require('path');

function replaceInFiles(dir, baseDir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      replaceInFiles(fullPath, baseDir);
    } else if (entry.name.endsWith('.html') || entry.name.endsWith('.txt') || entry.name.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('/assets/')) {
        // Calculate relative path from this file's directory to the root 'out' directory
        const relativeToRoot = path.relative(dir, baseDir).replace(/\\/g, '/');
        // If it's the root directory, relativeToRoot is ''
        // So prefix becomes './'
        // If it's 'dashboard', relativeToRoot is '..'
        // So prefix becomes '../'
        const prefix = relativeToRoot === '' ? '.' : relativeToRoot;
        
        // Replace absolute /assets/ with relative prefix/assets/
        content = content.replaceAll('/assets/', `${prefix}/assets/`);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed relative path in: ${fullPath} (prefix: ${prefix})`);
      }
    }
  }
}

// Ensure the directory exists
const outDir = path.join(__dirname, 'out');
if (fs.existsSync(outDir)) {
  replaceInFiles(outDir, outDir);
  console.log('All absolute /assets/ paths converted to relative paths!');
}
