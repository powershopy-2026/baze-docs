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

  // Remove legacy monolithic 'Standalone' tab and any previous standalone tabs
  enLang.tabs = enLang.tabs.filter(t => t.tab !== 'Standalone' && !t.tab.startsWith('standalone:'));
  zhLang.tabs = zhLang.tabs.filter(t => t.tab !== 'Standalone' && !t.tab.startsWith('standalone:'));

  // Register each standalone page as an isolated hidden tab to prevent cross-model prefetching
  for (const page of enPages) {
    const rel = page.replace(/^en\/standalone\//, '');
    enLang.tabs.push({
      tab: `standalone:${rel}`,
      hidden: true,
      pages: [page]
    });
  }

  for (const page of zhPages) {
    const rel = page.replace(/^zh-Hans\/standalone\//, '');
    zhLang.tabs.push({
      tab: `standalone:${rel}`,
      hidden: true,
      pages: [page]
    });
  }

  fs.writeFileSync(DOCS_JSON_PATH, JSON.stringify(docsJson, null, 2) + '\n', 'utf8');
  console.log(`Successfully updated docs.json with ${enPages.length} isolated en tabs and ${zhPages.length} isolated zh-Hans tabs.`);
}

run();
