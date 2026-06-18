/**
 * update-refs.mjs
 * Updates all image references in .astro files under src/
 * 1. Redirects duplicate images to their "kept" counterpart
 * 2. Updates .jpg / .jpeg extensions to .webp for non-duplicate images
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, extname } from 'path';

const SRC_DIR = new URL('../src/', import.meta.url).pathname;

// Duplicate redirect map: old-stem → new-stem (will become .webp)
const REDIRECT_MAP = {
  // group 1: keep img-1
  'img-23': 'img-1',
  'img-38': 'img-1',
  'img-53': 'img-1',
  'img-93': 'img-1',
  // group 2: keep img-2
  'img-10': 'img-2',
  'img-19': 'img-2',
  'img-39': 'img-2',
  'img-64': 'img-2',
  // group 3: keep img-11
  'img-37': 'img-11',
  'img-46': 'img-11',
  'img-49': 'img-11',
  'img-62': 'img-11',
  // group 4: keep img-16
  'img-35': 'img-16',
  'img-51': 'img-16',
  'img-61': 'img-16',
  // group 5: keep img-7
  'img-15': 'img-7',
  'img-79': 'img-7',
  // group 6: keep img-8
  'img-22': 'img-8',
  'img-89': 'img-8',
  // group 7: keep img-55
  'img-56': 'img-55',
  // group 8: keep img-57
  'img-60': 'img-57',
  'img-65': 'img-57',
  // group 9: keep img-12
  'img-58': 'img-12',
  'img-63': 'img-12',
};

function getAllAstroFiles(dir) {
  const results = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllAstroFiles(fullPath));
    } else if (extname(entry.name) === '.astro') {
      results.push(fullPath);
    }
  }
  return results;
}

function processFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  let changed = false;
  const original = content;

  // 1. Replace duplicate image references first
  for (const [oldStem, newStem] of Object.entries(REDIRECT_MAP)) {
    // Match img-XX followed by .jpg, .jpeg, or .webp (in case already converted)
    const regex = new RegExp(`${escapeRegex(oldStem)}\\.(jpg|jpeg|webp)`, 'g');
    const replacement = `${newStem}.webp`;
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      changed = true;
    }
  }

  // 2. Update remaining .jpg / .jpeg references to .webp (for kept images)
  const jpgRegex = /(img-\d+)\.(jpg|jpeg)/g;
  if (jpgRegex.test(content)) {
    content = content.replace(/(img-\d+)\.(jpg|jpeg)/g, '$1.webp');
    changed = true;
  }

  if (changed) {
    writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✅ Updated: ${filePath.replace(SRC_DIR, 'src/')}`);
  }
}

function escapeRegex(str) {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

const files = getAllAstroFiles(SRC_DIR);
console.log(`Found ${files.length} .astro files\n`);
files.forEach(processFile);
console.log('\nAll references updated!');
