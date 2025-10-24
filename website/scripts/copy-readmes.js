import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Language mapping from filename to language code
const languageMapping = {
  'README.md': 'en',
  'README.zh-CN.md': 'zh-CN',
  'README.ja.md': 'ja',
  'README.ko.md': 'ko',
  'README.es.md': 'es',
  'README.fr.md': 'fr',
  'README.de.md': 'de',
  'README.pt-BR.md': 'pt-BR'
};

// Language display names for the switcher
export const languageNames = {
  'en': '🇬🇧 English',
  'zh-CN': '🇨🇳 简体中文',
  'ja': '🇯🇵 日本語',
  'ko': '🇰🇷 한국어',
  'es': '🇪🇸 Español',
  'fr': '🇫🇷 Français',
  'de': '🇩🇪 Deutsch',
  'pt-BR': '🇧🇷 Português (BR)'
};

function extractTitle(content) {
  // Extract the first H1 heading
  const h1Match = content.match(/^#\s+(.+)$/m);
  return h1Match ? h1Match[1].replace(/\*\*/g, '').trim() : 'TrendSignal';
}

function generateFrontmatter(lang, title) {
  return `---
lang: ${lang}
title: "${title}"
---
`;
}

function fixAssetPaths(content) {
  // Convert relative asset paths to absolute paths for Astro
  // e.g., "assets/image.svg" -> "/assets/image.svg"
  return content.replace(/!\[([^\]]*)\]\(assets\//g, '![$1](/assets/');
}

function copyAssets() {
  const sourceAssetsDir = path.join(process.cwd(), '..', 'assets');
  const targetAssetsDir = path.join(process.cwd(), 'public', 'assets');

  // Ensure the target directory exists
  if (!fs.existsSync(targetAssetsDir)) {
    fs.mkdirSync(targetAssetsDir, { recursive: true });
  }

  // Copy all files from source assets to public/assets
  if (fs.existsSync(sourceAssetsDir)) {
    const files = fs.readdirSync(sourceAssetsDir);
    files.forEach(file => {
      const sourcePath = path.join(sourceAssetsDir, file);
      const targetPath = path.join(targetAssetsDir, file);

      if (fs.statSync(sourcePath).isFile()) {
        fs.copyFileSync(sourcePath, targetPath);
      }
    });
    console.log(`✓ Copied assets to public/assets/`);
  }
}

function processReadmeFile(filename, targetLang) {
  const sourcePath = path.join(process.cwd(), '..', filename);
  const targetPath = path.join(process.cwd(), 'src', 'content', 'readme', `${targetLang}.md`);

  try {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const title = extractTitle(content);
    const frontmatter = generateFrontmatter(targetLang, title);

    // Fix asset paths to use absolute paths
    const contentWithFixedPaths = fixAssetPaths(content);
    const processedContent = frontmatter + contentWithFixedPaths;

    // Ensure the target directory exists
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(targetPath, processedContent, 'utf8');
    console.log(`✓ Processed ${filename} -> ${targetLang}.md`);
    return true;
  } catch (error) {
    console.error(`✗ Error processing ${filename}:`, error.message);
    return false;
  }
}

function main() {
  console.log('📄 Processing README files...\n');

  // Copy assets first
  copyAssets();
  console.log();

  const results = [];

  for (const [filename, targetLang] of Object.entries(languageMapping)) {
    const success = processReadmeFile(filename, targetLang);
    results.push({ filename, targetLang, success });
  }

  console.log('\n📊 Processing Summary:');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`✅ Successfully processed: ${successful}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed === 0) {
    console.log('\n🎉 All README files processed successfully!');
  } else {
    console.log('\n⚠️  Some files failed to process. Please check the errors above.');
    process.exit(1);
  }
}

// Export for use in other modules
export { processReadmeFile, languageMapping };

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}