import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_IMAGES = path.join(ROOT, 'public', 'images');
const SRC_DIR = '/Users/atinsharma/Downloads/Atin/crockery /WhatsApp Unknown 2026-11-17 at 12.08.54 PM';

if (!fs.existsSync(SRC_DIR)) {
  console.error(`Source directory not found: ${SRC_DIR}`);
  process.exit(1);
}

// Helper to ensure target dir exists
function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function convertImage(srcFile, crop, width, height, destRelPath, quality = 75) {
  const srcPath = path.join(SRC_DIR, srcFile);
  const destPath = path.join(PUBLIC_IMAGES, destRelPath);
  ensureDir(destPath);

  let pipeline = sharp(srcPath);
  if (crop) {
    pipeline = pipeline.extract(crop);
  }
  pipeline = pipeline.resize(width, height, { fit: 'cover' }).webp({ quality, effort: 6 });

  await pipeline.toFile(destPath);
  const stats = fs.statSync(destPath);
  console.log(`✓ ${destRelPath.padEnd(40)} -> ${(stats.size / 1024).toFixed(1)} KB`);
}

async function main() {
  console.log('--- Processing Proprietor and Real Shop Images ---');

  // 1. Proprietor
  await convertImage(
    'propator .jpeg',
    { left: 60, top: 40, width: 840, height: 1050 },
    640,
    800,
    'about/owner.webp',
    75
  );

  // 2. Shop Front
  await convertImage(
    'shop image .jpeg',
    { left: 0, top: 180, width: 1200, height: 800 },
    960,
    640,
    'about/shop-front.webp',
    72
  );
  await convertImage(
    'shop image .jpeg',
    { left: 0, top: 180, width: 1200, height: 800 },
    800,
    600,
    'gallery/gallery-7.webp',
    72
  );

  // 3. Shop Stock / Shelves
  await convertImage(
    'shop image .jpeg',
    { left: 50, top: 520, width: 1100, height: 825 },
    960,
    640,
    'about/stock.webp',
    72
  );
  await convertImage(
    'shop image .jpeg',
    { left: 50, top: 520, width: 1100, height: 825 },
    800,
    600,
    'gallery/gallery-3.webp',
    72
  );

  console.log('\n--- Processing Category Showcase Images ---');
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.38 PM.jpeg',
    { left: 0, top: 120, width: 720, height: 720 },
    500,
    500,
    'categories/bowls.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.39 PM (1).jpeg',
    { left: 50, top: 180, width: 850, height: 850 },
    500,
    500,
    'categories/pattal.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.41 PM (2).jpeg',
    { left: 0, top: 80, width: 1200, height: 950 },
    500,
    500,
    'categories/thali.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.33 PM.jpeg',
    { left: 20, top: 100, width: 920, height: 920 },
    500,
    500,
    'categories/glasses.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.41 PM.jpeg',
    { left: 30, top: 60, width: 1140, height: 960 },
    500,
    500,
    'categories/foil.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.39 PM (2).jpeg',
    { left: 10, top: 120, width: 700, height: 700 },
    500,
    500,
    'categories/spoons.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.39 PM.jpeg',
    { left: 30, top: 100, width: 660, height: 660 },
    500,
    500,
    'categories/dona.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.41 PM (1).jpeg',
    { left: 20, top: 150, width: 1160, height: 1160 },
    500,
    500,
    'categories/combo.webp',
    75
  );

  console.log('\n--- Processing Product Images ---');
  // Clear and Yellow Plastic Katoris
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.38 PM.jpeg',
    { left: 0, top: 120, width: 720, height: 720 },
    600,
    600,
    'products/plastic-katori-1.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.38 PM (1).jpeg',
    { left: 0, top: 70, width: 720, height: 720 },
    600,
    600,
    'products/plastic-katori-2.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.38 PM (1).jpeg',
    { left: 0, top: 70, width: 720, height: 720 },
    600,
    600,
    'products/silver-katori-1.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.42 PM (1).jpeg',
    { left: 0, top: 160, width: 1200, height: 1200 },
    600,
    600,
    'products/silver-katori-2.webp',
    75
  );

  // Paper Tea Cups & Ripple Cups
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.33 PM.jpeg',
    { left: 20, top: 100, width: 920, height: 920 },
    600,
    600,
    'products/paper-tea-cup-150ml-1.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.33 PM.jpeg',
    { left: 20, top: 100, width: 920, height: 920 },
    600,
    600,
    'products/paper-tea-cup-150ml-2.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.40 PM (1).jpeg',
    { left: 30, top: 30, width: 660, height: 660 },
    600,
    600,
    'products/paper-glass-250ml-1.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.40 PM (1).jpeg',
    { left: 30, top: 30, width: 660, height: 660 },
    600,
    600,
    'products/paper-glass-250ml-2.webp',
    75
  );

  // Paper Bowls & Ice Cream Cups
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.34 PM.jpeg',
    { left: 0, top: 70, width: 720, height: 720 },
    600,
    600,
    'products/paper-bowl-180ml-1.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.39 PM.jpeg',
    { left: 30, top: 100, width: 660, height: 660 },
    600,
    600,
    'products/paper-bowl-180ml-2.webp',
    75
  );

  // Sal Leaf Pattal & Green Leaf Printed Plate
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.39 PM (1).jpeg',
    { left: 50, top: 180, width: 850, height: 850 },
    600,
    600,
    'products/sal-leaf-pattal-1.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.40 PM (2).jpeg',
    { left: 0, top: 170, width: 1200, height: 1200 },
    600,
    600,
    'products/sal-leaf-pattal-2.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.40 PM (2).jpeg',
    { left: 0, top: 170, width: 1200, height: 1200 },
    600,
    600,
    'products/paper-plate-9-inch-1.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.41 PM (1).jpeg',
    { left: 20, top: 150, width: 1160, height: 1160 },
    600,
    600,
    'products/paper-plate-9-inch-2.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.41 PM (1).jpeg',
    { left: 20, top: 150, width: 1160, height: 1160 },
    600,
    600,
    'products/silver-pattal-10-inch-1.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.41 PM (1).jpeg',
    { left: 20, top: 150, width: 1160, height: 1160 },
    600,
    600,
    'products/silver-pattal-10-inch-2.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.42 PM (2).jpeg',
    { left: 200, top: 0, width: 1200, height: 1200 },
    600,
    600,
    'products/silver-pattal-12-inch-1.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.41 PM (1).jpeg',
    { left: 20, top: 150, width: 1160, height: 1160 },
    600,
    600,
    'products/silver-pattal-12-inch-2.webp',
    75
  );

  // Sugarcane & Areca Leaf Eco Plates
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.42 PM (2).jpeg',
    { left: 200, top: 0, width: 1200, height: 1200 },
    600,
    600,
    'products/sugarcane-plate-1.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.37 PM (1).jpeg',
    { left: 0, top: 110, width: 720, height: 640 },
    600,
    600,
    'products/sugarcane-plate-2.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.37 PM (1).jpeg',
    { left: 0, top: 110, width: 720, height: 640 },
    600,
    600,
    'products/areca-leaf-plate-1.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.39 PM (1).jpeg',
    { left: 50, top: 180, width: 850, height: 850 },
    600,
    600,
    'products/areca-leaf-plate-2.webp',
    75
  );

  // Thalis & Compartment Trays
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.43 PM.jpeg',
    { left: 200, top: 0, width: 1200, height: 1200 },
    600,
    600,
    'products/thali-4-compartment-1.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.42 PM.jpeg',
    { left: 0, top: 40, width: 1200, height: 1200 },
    600,
    600,
    'products/thali-4-compartment-2.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.41 PM (2).jpeg',
    { left: 0, top: 80, width: 1200, height: 950 },
    600,
    600,
    'products/thali-5-compartment-1.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.43 PM.jpeg',
    { left: 200, top: 0, width: 1200, height: 1200 },
    600,
    600,
    'products/thali-5-compartment-2.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.40 PM.jpeg',
    { left: 0, top: 0, width: 720, height: 850 },
    600,
    600,
    'products/thali-6-compartment-eco-1.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.41 PM (2).jpeg',
    { left: 0, top: 80, width: 1200, height: 950 },
    600,
    600,
    'products/thali-6-compartment-eco-2.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.42 PM.jpeg',
    { left: 0, top: 40, width: 1200, height: 1200 },
    600,
    600,
    'products/silver-compartment-thali-1.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.43 PM.jpeg',
    { left: 200, top: 0, width: 1200, height: 1200 },
    600,
    600,
    'products/silver-compartment-thali-2.webp',
    75
  );

  // Food Containers
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.41 PM.jpeg',
    { left: 30, top: 60, width: 1140, height: 960 },
    600,
    600,
    'products/foil-container-250ml-1.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.41 PM.jpeg',
    { left: 30, top: 60, width: 1140, height: 960 },
    600,
    600,
    'products/foil-container-250ml-2.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.41 PM.jpeg',
    { left: 30, top: 60, width: 1140, height: 960 },
    600,
    600,
    'products/foil-container-750ml-1.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.41 PM.jpeg',
    { left: 30, top: 60, width: 1140, height: 960 },
    600,
    600,
    'products/foil-container-750ml-2.webp',
    75
  );

  // Cutlery (Wooden forks & spoons)
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.39 PM (2).jpeg',
    { left: 10, top: 120, width: 700, height: 700 },
    600,
    600,
    'products/wooden-spoon-1.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.39 PM (2).jpeg',
    { left: 10, top: 120, width: 700, height: 700 },
    600,
    600,
    'products/wooden-spoon-2.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.39 PM (2).jpeg',
    { left: 10, top: 120, width: 700, height: 700 },
    600,
    600,
    'products/plastic-fork-1.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.39 PM (2).jpeg',
    { left: 10, top: 120, width: 700, height: 700 },
    600,
    600,
    'products/plastic-fork-2.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.39 PM (2).jpeg',
    { left: 10, top: 120, width: 700, height: 700 },
    600,
    600,
    'products/plastic-spoon-1.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.39 PM (2).jpeg',
    { left: 10, top: 120, width: 700, height: 700 },
    600,
    600,
    'products/plastic-spoon-2.webp',
    75
  );

  // Donas
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.39 PM.jpeg',
    { left: 30, top: 100, width: 660, height: 660 },
    600,
    600,
    'products/sal-leaf-dona-1.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.39 PM (1).jpeg',
    { left: 50, top: 180, width: 850, height: 850 },
    600,
    600,
    'products/sal-leaf-dona-2.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.40 PM (2).jpeg',
    { left: 0, top: 170, width: 1200, height: 1200 },
    600,
    600,
    'products/printed-paper-dona-1.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.40 PM (2).jpeg',
    { left: 0, top: 170, width: 1200, height: 1200 },
    600,
    600,
    'products/printed-paper-dona-2.webp',
    75
  );

  console.log('\n--- Processing Gallery Images ---');
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.42 PM (2).jpeg',
    { left: 200, top: 0, width: 1200, height: 1200 },
    800,
    800,
    'gallery/gallery-1.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.33 PM.jpeg',
    { left: 20, top: 100, width: 920, height: 920 },
    800,
    800,
    'gallery/gallery-4.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.41 PM (2).jpeg',
    { left: 0, top: 80, width: 1200, height: 950 },
    800,
    800,
    'gallery/gallery-6.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.41 PM (1).jpeg',
    { left: 20, top: 150, width: 1160, height: 1160 },
    800,
    800,
    'gallery/gallery-8.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.41 PM.jpeg',
    { left: 30, top: 60, width: 1140, height: 960 },
    800,
    800,
    'gallery/gallery-10.webp',
    75
  );
  await convertImage(
    'WhatsApp Image 2026-11-17 at 12.08.38 PM.jpeg',
    { left: 0, top: 120, width: 720, height: 720 },
    800,
    800,
    'gallery/gallery-12.webp',
    75
  );

  console.log('\n--- Processing Hero Slider Banner ---');
  await convertImage(
    'shop image .jpeg',
    { left: 0, top: 160, width: 1200, height: 675 },
    1280,
    720,
    'hero/hero-1.webp',
    70
  );

  console.log('\nAll images successfully processed and optimized for slow networks!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
