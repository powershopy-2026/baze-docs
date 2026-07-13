const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'api-reference', 'en', 'zmodelVideo', 'byteplus');

function findFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(fullPath));
    } else if (entry.name.endsWith('.json')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = findFiles(dir);
const chineseRange = /[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  let hasChinese = false;
  for (let i = 0; i < lines.length; i++) {
    if (chineseRange.test(lines[i])) {
      if (!hasChinese) {
        console.log(`\n=== ${path.relative(dir, file)} ===`);
        hasChinese = true;
      }
      console.log(`  Line ${i + 1}: ${lines[i].trim().substring(0, 150)}`);
    }
  }
}

console.log('\nDone.');