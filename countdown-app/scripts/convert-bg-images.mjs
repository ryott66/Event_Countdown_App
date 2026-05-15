import { stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const IMAGES_DIR = join(__dirname, "..", "public", "images");
const QUALITY = 82;

const TARGETS = ["background_main.jpg", "Trip.jpg"];

for (const file of TARGETS) {
  const src = join(IMAGES_DIR, file);
  const dest = join(IMAGES_DIR, file.replace(/\.(jpg|png)$/i, ".webp"));
  const before = (await stat(src)).size;
  await sharp(src).webp({ quality: QUALITY }).toFile(dest);
  const after = (await stat(dest)).size;
  const reduction = (((before - after) / before) * 100).toFixed(1);
  console.log(
    `${file}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB (-${reduction}%)`,
  );
}
