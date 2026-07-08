const fs = require('fs');
const path = require('path');

const zhDir = 'd:\\phpstudy_pro\\WWW\\go\\baze-docs\\api-reference\\zh-Hans\\zmodelVideo\\byteplus';
const refPath = path.join(zhDir, 'seedance', 'seedance-video.json');
const ref = JSON.parse(fs.readFileSync(refPath, 'utf8'));

// Build reference descriptions from zh-Hans seedance-video.json
const refDesc = {};
const refProps = ref.components.schemas.CreateVideoTaskRequest.properties;
for (const [key, val] of Object.entries(refProps)) {
  refDesc[key] = val.description || '';
}

// Mapping from root-level param names to reference param names
const paramMapping = {
  'model': 'model',
  'seconds': 'duration',
  'size': 'resolution',
  'ratio': 'ratio',
  'seed': 'seed',
  'watermark': 'watermark',
  'generate_audio': 'generate_audio',
  'return_last_frame': 'return_last_frame',
  'safety_identifier': 'safety_identifier',
  'callback_url': 'callback_url',
  'priority': 'priority',
  'tools': 'tools',
  'draft': 'draft',
  'service_tier': 'service_tier',
  'duration': 'duration',
  'resolution': 'resolution',
  'media': 'media',
  'camera_fixed': 'camera_fixed'
};

// Get all root-level JSON files (excluding seedance directory)
const files = fs.readdirSync(zhDir).filter(f => f.endsWith('.json') && f !== 'seedance-video.json');
console.log('Files to process:', files.length);
for (const f of files) {
  console.log('  ' + f);
}

let updatedCount = 0;
let unchangedCount = 0;

for (const file of files) {
  const filePath = path.join(zhDir, file);
  let doc = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let modified = false;
  
  // Navigate through paths to find the request body schema
  for (const pathKey in doc.paths) {
    for (const method in doc.paths[pathKey]) {
      const operation = doc.paths[pathKey][method];
      if (!operation.requestBody) continue;
      
      const content = operation.requestBody.content;
      if (!content['application/json']) continue;
      
      const schema = content['application/json'].schema;
      if (!schema || !schema.$ref) continue;
      
      // Get the schema name from $ref
      const schemaName = schema.$ref.split('/').pop();
      const requestSchema = doc.components.schemas[schemaName];
      if (!requestSchema || !requestSchema.properties) continue;
      
      // Update each property description if we have a matching reference
      for (const [propName, propValue] of Object.entries(requestSchema.properties)) {
        const refKey = paramMapping[propName];
        if (refKey && refDesc[refKey]) {
          propValue.description = refDesc[refKey];
          modified = true;
        }
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(doc, null, 2) + '\n', 'utf8');
    console.log('Updated: ' + file);
    updatedCount++;
  } else {
    console.log('No changes: ' + file);
    unchangedCount++;
  }
}

console.log('\nDone! Updated ' + updatedCount + ' files, unchanged ' + unchangedCount + ' files.');