const fs = require('fs');

const files = [
  'api-reference/en/zmodelVideo/byteplus/seedance-video.json',
  'api-reference/en/zmodelVideo/byteplus/seedance/seedance-video.json'
];

for (const filePath of files) {
  console.log('=== ' + filePath + ' ===');
  const c = fs.readFileSync(filePath, 'utf-8');
  
  // Find all lines with Chinese
  const lines = c.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (/[\u4e00-\u9fff]/.test(lines[i])) {
      console.log('Line ' + (i+1) + ' (chars ' + lines[i].length + '): ' + lines[i].trim());
    }
  }
}