import { useEffect } from "react";
import { useMap } from "react-leaflet";

// Leaflet は初期化時点のコンテナサイズしか知らないため、あとから
// コンテナが広がる（例: #root の max-width 解除が useEffect で地図の
// マウント後に走る）と、広がった分のタイルが読み込まれずグレーのまま残る。
// ResizeObserver でサイズ変化を検知して invalidateSize() を呼び、
// Leaflet に正しい表示領域を再計算させる。
export default function MapAutoResize() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);

  return null;
}
