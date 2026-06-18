/**
 * image-cleanup.mjs
 * 1. Converts all .jpg / .jpeg images to .webp
 * 2. Deletes the duplicate images that map to a "kept" image
 */
import sharp from 'sharp';
import { readdirSync, unlinkSync, existsSync } from 'fs';
import { join, extname, basename } from 'path';

const IMAGES_DIR = new URL('../public/images/', import.meta.url).pathname;

// Duplicate groups: duplicates → keeper (after conversion, keeper will be .webp)
const DUPLICATES_TO_DELETE = [
  // group 1: keep img-1
  'img-23', 'img-38', 'img-53', 'img-93',
  // group 2: keep img-2
  'img-10', 'img-19', 'img-39', 'img-64',
  // group 3: keep img-11
  'img-37', 'img-46', 'img-49', 'img-62',
  // group 4: keep img-16
  'img-35', 'img-51', 'img-61',
  // group 5: keep img-7
  'img-15', 'img-79',
  // group 6: keep img-8
  'img-22', 'img-89',
  // group 7: keep img-55
  'img-56',
  // group 8: keep img-57
  'img-60', 'img-65',
  // group 9: keep img-12
  'img-58', 'img-63',
];

const DUPLICATE_SET = new Set(DUPLICATES_TO_DELETE);

async function run() {
  const files = readdirSync(IMAGES_DIR);
  let converted = 0;
  let deleted = 0;
  let skipped = 0;

  for (const file of files) {
    const ext = extname(file).toLowerCase();
    const nameWithoutExt = basename(file, extname(file));
    const fullPath = join(IMAGES_DIR, file);

    // Skip already-correct formats
    if (ext === '.webp' || ext === '.avif' || ext === '.svg' || ext === '.png' || ext === '.ico') {
      console.log(`  ⏭  Skip (keep as-is): ${file}`);
      skipped++;
      continue;
    }

    if (ext === '.jpg' || ext === '.jpeg') {
      const isDuplicate = DUPLICATE_SET.has(nameWithoutExt);
      const webpPath = join(IMAGES_DIR, nameWithoutExt + '.webp');

      if (isDuplicate) {
        // Just delete – no need to convert a duplicate
        unlinkSync(fullPath);
        console.log(`  🗑  Deleted duplicate: ${file}`);
        deleted++;
        // Also delete webp version if it exists
        if (existsSync(webpPath)) {
          unlinkSync(webpPath);
          console.log(`  🗑  Deleted duplicate webp: ${nameWithoutExt}.webp`);
          deleted++;
        }
      } else {
        // Convert to webp
        try {
          await sharp(fullPath)
            .webp({ quality: 82 })
            .toFile(webpPath);
          unlinkSync(fullPath);
          console.log(`  ✅ Converted: ${file} → ${nameWithoutExt}.webp`);
          converted++;
        } catch (err) {
          console.error(`  ❌ Failed to convert ${file}:`, err.message);
        }
      }
    }
  }

  console.log(`\nDone! Converted: ${converted}, Deleted duplicates: ${deleted}, Skipped: ${skipped}`);
}

run().catch(console.error);
