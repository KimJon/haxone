const fs = require('fs');
const path = require('path');

function replaceInFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      replaceInFiles(fullPath);
    } else if (entry.name.endsWith('.html') || entry.name.endsWith('.txt') || entry.name.endsWith('.js') || entry.name.endsWith('.css') || entry.name.endsWith('.map')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('/_next/')) {
        content = content.replaceAll('/_next/', '/assets/');
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

const outDir = path.join(__dirname, 'out');
if (fs.existsSync(outDir)) {
  replaceInFiles(outDir);
  console.log('All absolute /_next/ paths converted to /assets/ safely!');
}
