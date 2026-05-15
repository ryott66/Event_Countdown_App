import { readdir, stat } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const TARGET_DIR = join(__dirname, "..", "public", "images", "book-image");
const QUALITY = 82;

async function convert() {
  const files = await readdir(TARGET_DIR);
  const pngs = files.filter((f) => extname(f).toLowerCase() === ".png");

  if (pngs.length === 0) {
    console.log("No PNG files found.");
    return;
  }

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of pngs) {
    const srcPath = join(TARGET_DIR, file);
    const destPath = join(TARGET_DIR, basename(file, ".png") + ".webp");

    const before = (await stat(srcPath)).size;
    await sharp(srcPath).webp({ quality: QUALITY }).toFile(destPath);
    const after = (await stat(destPath)).size;

    totalBefore += before;
    totalAfter += after;

    const reduction = (((before - after) / before) * 100).toFixed(1);
    console.log(
      `${file}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB (-${reduction}%)`
    );
  }

  const totalReduction = (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1);
  console.log("---");
  console.log(
    `Total: ${(totalBefore / 1024 / 1024).toFixed(2)}MB -> ${(totalAfter / 1024 / 1024).toFixed(2)}MB (-${totalReduction}%)`
  );
}

convert().catch((err) => {
  console.error(err);
  process.exit(1);
});
