/**
 * Final targeted fix for the last 4 files with remaining Chinese
 */
const fs = require('fs');

const files = [
  'api-reference/en/zmodelVideo/byteplus/seedance-video.json',
  'api-reference/en/zmodelVideo/byteplus/seedance/seedance-video.json',
  'api-reference/en/zmodelVideo/byteplus/seedance-tasks-query.json',
  'api-reference/en/zmodelVideo/byteplus/seedance/seedance-tasks-query.json'
];

// Work on raw file content to handle all escaping issues
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;
  
  // Replace 鉴权 with Authentication (in info.description for tasks-query)
  content = content.replace(/## 鉴权/g, '## Authentication');
  content = content.replace(/## 模型能力/g, '## Model Capabilities');
  
  // 注意：-> Note:
  content = content.replace(/"注意：\\n/g, '"Note:\\n');
  content = content.replace(/"注意：\n/g, '"Note:\n');
  
  // 张图片 -> images in role description
  content = content.replace(/系列（1\\~9 张图片）/g, 'series (1~9 images)');
  
  // Replace the multimodal reference patterns that have different escaping
  // Pattern in root file: 参考音频（0\\\\~3）-> really depends on escaping
  // Let me just handle the key Chinese substrings that remain
  
  // Fix: 系列 Multimodal Reference-to-Video：1\~9 张
  content = content.replace(/系列 Multimodal Reference-to-Video：1\\~9 张/g, 'series Multimodal Reference-to-Video: 1~9 images');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }
  return false;
}

for (const f of files) {
  if (fs.existsSync(f)) {
    fixFile(f);
  }
}

// Check again
console.log('\n=== Rechecking ===');
const hasChinese = s => /[\u4e00-\u9fff]/.test(s);
let remaining = 0;
for (const f of files) {
  if (fs.existsSync(f)) {
    const c = fs.readFileSync(f, 'utf-8');
    if (hasChinese(c)) {
      console.log(`❌ Still has Chinese: ${f}`);
      remaining++;
    } else {
      console.log(`✅ Clean: ${f}`);
    }
  }
}
if (remaining === 0) console.log('\n✅ All files are clean!');
else console.log(`\n⚠️  ${remaining} files still need fixes`);