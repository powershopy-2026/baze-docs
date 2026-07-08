const fs = require('fs');
const path = require('path');

const zhDir = 'd:\\phpstudy_pro\\WWW\\go\\baze-docs\\api-reference\\zh-Hans\\zmodelVideo\\byteplus';
const refPath = path.join(zhDir, 'seedance', 'seedance-video.json');
const ref = JSON.parse(fs.readFileSync(refPath, 'utf8'));

// Extract the full responses object from seedance-video.json
const refResponses = JSON.parse(JSON.stringify(ref.paths['/byteplus/api/v3/contents/generations/tasks'].post.responses));

// Extract the VideoTaskResponse schema
const videoTaskResponseSchema = JSON.parse(JSON.stringify(ref.components.schemas.VideoTaskResponse));

// Get all target JSON files: seedance-1-0-pro-*, seedance-1-5-pro-*, and dreamina-seedance-2-0-* files
const files = fs.readdirSync(zhDir).filter(f => {
  if (!f.endsWith('.json')) return false;
  return (
    f.startsWith('seedance-1-0-pro-') ||
    f.startsWith('seedance-1-5-pro-') ||
    f.startsWith('dreamina-seedance-2-0-') ||
    f === 'seedance-tasks-query.json'
  );
});

console.log('Files to process:', files.length);
for (const f of files) {
  console.log('  ' + f);
}

let updatedCount = 0;

for (const file of files) {
  const filePath = path.join(zhDir, file);
  let doc = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let modified = false;

  // For each path in the doc, replace the responses
  for (const pathKey in doc.paths) {
    for (const method in doc.paths[pathKey]) {
      const operation = doc.paths[pathKey][method];
      if (!operation.responses) continue;

      // Replace responses with reference structure
      operation.responses = JSON.parse(JSON.stringify(refResponses));
      modified = true;
    }
  }

  // Always replace VideoTaskResponse schema with reference one
  doc.components.schemas.VideoTaskResponse = JSON.parse(JSON.stringify(videoTaskResponseSchema));
  modified = true;

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(doc, null, 2) + '\n', 'utf8');
    console.log('Updated: ' + file);
    updatedCount++;
  }
}

console.log('\nDone! Updated ' + updatedCount + ' files.');