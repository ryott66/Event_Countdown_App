// アップロード前にブラウザ側で画像を圧縮する。
// 用途プロファイル（icon/gallery/hero）ごとに最大辺・品質を切り替え、
// 出力は WebP を優先（非対応環境は JPEG にフォールバック）。

export type ImageProfile = "icon" | "gallery" | "hero";

interface ProfileConfig {
  maxDimension: number;
  quality: number;
}

const PROFILES: Record<ImageProfile, ProfileConfig> = {
  icon: { maxDimension: 400, quality: 0.82 },
  gallery: { maxDimension: 1280, quality: 0.80 },
  hero: { maxDimension: 1920, quality: 0.88 },
};

export interface CompressedImage {
  blob: Blob;
  contentType: string;
  ext: string;
}

export async function compressImage(file: File, profile: ImageProfile = "gallery"): Promise<CompressedImage> {
  if (!file.type.startsWith("image/")) {
    return { blob: file, contentType: file.type || "application/octet-stream", ext: extFromName(file.name) };
  }

  const { maxDimension, quality } = PROFILES[profile];
  const dataUrl = await fileToDataUrl(file);
  const img = await loadImage(dataUrl);

  let { width, height } = img;
  if (width > maxDimension || height > maxDimension) {
    const ratio = Math.min(maxDimension / width, maxDimension / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { blob: file, contentType: file.type, ext: extFromName(file.name) };
  ctx.drawImage(img, 0, 0, width, height);

  const webpBlob = await canvasToBlob(canvas, "image/webp", quality);
  if (webpBlob) return { blob: webpBlob, contentType: "image/webp", ext: "webp" };

  const jpegBlob = await canvasToBlob(canvas, "image/jpeg", quality);
  if (jpegBlob) return { blob: jpegBlob, contentType: "image/jpeg", ext: "jpg" };

  return { blob: file, contentType: file.type, ext: extFromName(file.name) };
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

function extFromName(name: string): string {
  const m = name.match(/\.([^.]+)$/);
  return m ? m[1].toLowerCase() : "bin";
}
