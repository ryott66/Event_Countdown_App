// ホームのメモリーセクションに表示する2つのギャラリー定義。
// 新しいギャラリーを増やすときはここに 1 行追加するだけ。
export const GALLERIES = {
  mirror: { field: "mirrorUrls", title: "Mirror Moments" },
  cute: { field: "cuteUrls", title: "Cutest Moments" },
} as const;

export type GalleryKey = keyof typeof GALLERIES;
export const GALLERY_KEYS = Object.keys(GALLERIES) as GalleryKey[];
export type GalleryField = (typeof GALLERIES)[GalleryKey]["field"];
