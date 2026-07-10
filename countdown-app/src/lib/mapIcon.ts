import L from "leaflet";

// 地図タイルの共通設定。CARTO Voyager はパステル調のモダンな配色で、
// 無料・APIキー不要（要 OSM + CARTO の帰属表示）。{r} は Retina 端末で @2x に置換される。
export const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

// Leaflet のデフォルトマーカーは Vite バンドルで画像パスが壊れる既知問題があるため、
// 絵文字を使った divIcon を共通ヘルパーとして提供する。イベントの emoji を流用すると
// アプリの世界観にも馴染む。
export function emojiIcon(emoji: string): L.DivIcon {
  return L.divIcon({
    className: "emoji-map-pin",
    html: `<div class="emoji-map-pin__inner">${emoji || "📍"}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 38], // ピン下端を座標に合わせる
    popupAnchor: [0, -34],
  });
}

// emoji-map-pin のスタイル。マップを使うコンポーネントで一度読み込めばよい。
export const EMOJI_PIN_CSS = `
.emoji-map-pin { background: none; border: none; }
.emoji-map-pin__inner {
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.9rem; line-height: 1;
  filter: drop-shadow(0 2px 3px rgba(0,0,0,0.35));
  transform: translateY(-2px);
}
`;
