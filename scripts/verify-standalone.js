const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DOCS_JSON_PATH = path.join(ROOT_DIR, 'docs.json');

function verify() {
  console.log('Verifying standalone setup...');

  const docsJson = JSON.parse(fs.readFileSync(DOCS_JSON_PATH, 'utf8'));

  const enLang = docsJson.navigation.languages.find(l => l.language === 'en');
  const zhLang = docsJson.navigation.languages.find(l => l.language === 'zh-Hans');

  if (docsJson.navigation.languages[0].language !== 'en') {
    throw new Error('Default language is not en');
  }

  const legacyEnStandalone = enLang.tabs.find(t => t.tab === 'Standalone');
  const legacyZhStandalone = zhLang.tabs.find(t => t.tab === 'Standalone');
  if (legacyEnStandalone || legacyZhStandalone) {
    throw new Error('Legacy monolithic Standalone tab still exists; should be isolated tabs');
  }

  const enStandaloneTabs = enLang.tabs.filter(t => t.tab.startsWith('standalone:'));
  const zhStandaloneTabs = zhLang.tabs.filter(t => t.tab.startsWith('standalone:'));

  if (enStandaloneTabs.length === 0) {
    throw new Error('en standalone tabs are missing');
  }
  if (zhStandaloneTabs.length === 0) {
    throw new Error('zh-Hans standalone tabs are missing');
  }

  for (const t of [...enStandaloneTabs, ...zhStandaloneTabs]) {
    if (!t.hidden) throw new Error(`Tab ${t.tab} is missing hidden: true`);
    if (!t.pages || t.pages.length !== 1) throw new Error(`Tab ${t.tab} must contain exactly 1 page`);
  }

  console.log(`en isolated standalone tabs: ${enStandaloneTabs.length}`);
  console.log(`zh-Hans isolated standalone tabs: ${zhStandaloneTabs.length}`);

  function checkPages(pages) {
    let missing = [];
    for (const item of pages) {
      if (typeof item === 'string') {
        const pMdx = path.join(ROOT_DIR, `${item}.mdx`);
        const pMd = path.join(ROOT_DIR, `${item}.md`);
        if (!fs.existsSync(pMdx) && !fs.existsSync(pMd)) {
          missing.push(item);
        }
      } else if (item && item.pages) {
        missing.push(...checkPages(item.pages));
      }
    }
    return missing;
  }

  const enMissing = checkPages(enLang.tabs);
  const zhMissing = checkPages(zhLang.tabs);

  if (enMissing.length > 0) throw new Error(`Missing en pages: ${enMissing.join(', ')}`);
  if (zhMissing.length > 0) throw new Error(`Missing zh pages: ${zhMissing.join(', ')}`);

  console.log('✓ All referenced pages exist on disk.');

  function getAllMdxFiles(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) results.push(...getAllMdxFiles(full));
      else if (f.endsWith('.mdx')) results.push(full);
    }
    return results;
  }

  const allStandalone = [
    ...getAllMdxFiles(path.join(ROOT_DIR, 'en', 'standalone')),
    ...getAllMdxFiles(path.join(ROOT_DIR, 'zh-Hans', 'standalone'))
  ];

  for (const f of allStandalone) {
    const raw = fs.readFileSync(f, 'utf8');
    if (!/hidden:\s*true/.test(raw)) {
      throw new Error(`File missing hidden: true: ${f}`);
    }
  }

  console.log(`✓ All ${allStandalone.length} standalone MDX files have hidden: true.`);
  console.log('Verification completed successfully! Everything is in order.');
}

verify();
