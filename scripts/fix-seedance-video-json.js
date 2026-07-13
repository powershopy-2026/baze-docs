const fs = require('fs');
const path = require('path');

function fixFile(file) {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    // Try parsing
    try {
      JSON.parse(content);
      console.log('  Valid: ' + path.basename(file));
      return true;
    } catch (parseErr) {
      console.log('  Fixing: ' + path.basename(file) + ' - ' + parseErr.message);
      
      // Fix unescaped double quotes within string values
      // The problematic pattern is: brand "Peace & Sweet" in a JSON string
      // We need a more targeted approach: read the raw content and fix specific known issues
      
      // Fix "Peace & Sweet" unescaped quotes
      content = content.replace(
        /seedance brand "Peace & Sweet" Apple Fruit Tea/g,
        'seedance brand \\"Peace & Sweet\\" Apple Fruit Tea'
      );
      // Fix "Freshly Cut, Freshly Shaken" 
      content = content.replace(
        /background audio: "Freshly Cut, Freshly Shaken"/g,
        'background audio: \\"Freshly Cut, Freshly Shaken\\"'
      );
      content = content.replace(
        /background audio "Take a Fresh Sip"/g,
        'background audio \\"Take a Fresh Sip\\"'
      );
      // Fix "AI Generated" watermark description
      content = content.replace(
        /"AI 生成" 水印/g,
        '\\"AI Generated\\" watermark'
      );
      
      // Try parsing again
      try {
        JSON.parse(content);
        fs.writeFileSync(file, content, 'utf-8');
        console.log('  Fixed successfully');
        return true;
      } catch (e2) {
        console.log('  Still invalid: ' + e2.message);
        // Try more aggressive approach - find all unescaped quotes in values  
        return false;
      }
    }
  } catch (e) {
    console.error('  Error reading: ' + file + ' - ' + e.message);
    return false;
  }
}

// Fix Chinese source files
console.log('=== Checking Chinese source files ===');
fixFile(path.join(__dirname, '..', 'api-reference', 'zh-Hans', 'zmodelVideo', 'byteplus', 'seedance', 'seedance-video.json'));
fixFile(path.join(__dirname, '..', 'api-reference', 'zh-Hans', 'zmodelVideo', 'byteplus', 'seedance-video.json'));

// Fix English target files  
console.log('\n=== Checking English target files ===');
fixFile(path.join(__dirname, '..', 'api-reference', 'en', 'zmodelVideo', 'byteplus', 'seedance', 'seedance-video.json'));
fixFile(path.join(__dirname, '..', 'api-reference', 'en', 'zmodelVideo', 'byteplus', 'seedance-video.json'));