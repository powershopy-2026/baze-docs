const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DOCS_JSON_PATH = path.join(ROOT_DIR, 'docs.json');

function getAllMdxFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...getAllMdxFiles(fullPath));
    } else if (file.endsWith('.mdx')) {
      results.push(fullPath);
    }
  }
  return results;
}

function updateMdxFrontmatter(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const hasBom = raw.charCodeAt(0) === 0xfeff;
  const content = hasBom ? raw.slice(1) : raw;

  if (/^hidden:\s*true/m.test(content)) {
    return { updated: false, reason: 'already hidden' };
  }

  const match = content.match(/^---(\r?\n[\s\S]*?\r?\n)---/);
  if (!match) {
    throw new Error(`Invalid frontmatter in file: ${filePath}`);
  }

  const innerFm = match[1];
  const eol = innerFm.includes('\r\n') ? '\r\n' : '\n';
  const newInnerFm = innerFm.replace(/(\r?\n)$/, `${eol}hidden: true$1`);
  const newContent = `---${newInnerFm}---` + content.slice(match[0].length);

  const finalOutput = (hasBom ? '\ufeff' : '') + newContent;
  fs.writeFileSync(filePath, finalOutput, 'utf8');
  return { updated: true };
}

function normalizeDocPath(fullPath) {
  const rel = path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/');
  return rel.replace(/\.mdx$/, '');
}

function run() {
  console.log('Applying standalone i18n configuration...');

  const enFiles = getAllMdxFiles(path.join(ROOT_DIR, 'en', 'standalone'));
  const zhFiles = getAllMdxFiles(path.join(ROOT_DIR, 'zh-Hans', 'standalone'));

  console.log(`Found ${enFiles.length} en standalone files.`);
  console.log(`Found ${zhFiles.length} zh-Hans standalone files.`);

  let enUpdated = 0;
  for (const f of enFiles) {
    if (updateMdxFrontmatter(f).updated) enUpdated++;
  }

  let zhUpdated = 0;
  for (const f of zhFiles) {
    if (updateMdxFrontmatter(f).updated) zhUpdated++;
  }

  console.log(`Frontmatter updated: ${enUpdated} en files, ${zhUpdated} zh-Hans files.`);

  const enPages = enFiles.map(normalizeDocPath).sort();
  const zhPages = zhFiles.map(normalizeDocPath).sort();

  const docsJsonRaw = fs.readFileSync(DOCS_JSON_PATH, 'utf8');
  const docsJson = JSON.parse(docsJsonRaw);

  const enLang = docsJson.navigation.languages.find(l => l.language === 'en');
  const zhLang = docsJson.navigation.languages.find(l => l.language === 'zh-Hans');

  if (!enLang || !zhLang) {
    throw new Error('Could not find en or zh-Hans in docs.json');
  }

  // Update en tabs
  let enStandaloneTab = enLang.tabs.find(t => t.tab === 'Standalone');
  if (enStandaloneTab) {
    enStandaloneTab.hidden = true;
    enStandaloneTab.pages = enPages;
  } else {
    enLang.tabs.push({
      tab: 'Standalone',
      hidden: true,
      pages: enPages
    });
  }

  // Update zh-Hans tabs
  let zhStandaloneTab = zhLang.tabs.find(t => t.tab === 'Standalone');
  if (zhStandaloneTab) {
    zhStandaloneTab.hidden = true;
    zhStandaloneTab.pages = zhPages;
  } else {
    zhLang.tabs.push({
      tab: 'Standalone',
      hidden: true,
      pages: zhPages
    });
  }

  fs.writeFileSync(DOCS_JSON_PATH, JSON.stringify(docsJson, null, 2) + '\n', 'utf8');
  console.log('Successfully updated docs.json and all standalone MDX files.');
}

run();
