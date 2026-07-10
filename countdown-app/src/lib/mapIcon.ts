import L from "leaflet";

// 地図タイルの共通設定。OSM Japan の maptiler-basic-ja は白/グレー基調の
// ミニマルで上品な配色（黄色い幹線道路がない）で、ラベルが日本語優先・全世界カバー。
// 無料・APIキー不要（要 OSM の帰属表示）。{r} は Retina 端末で @2x に置換される。
export const TILE_URL =
  "https://tile.openstreetmap.jp/styles/maptiler-basic-ja/{z}/{x}/{y}{r}.png";
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Leaflet のデフォルトマーカーは Vite バンドルで画像パスが壊れる既知問題があるため、
// divIcon を使った共通ヘルパーを提供する。白いバブル + しずく型の尻尾でピンらしく見せ、
// イベントのアイコン写真（あれば丸くくり抜き）か emoji を中に入れて世界観に馴染ませる。
export function emojiIcon(emoji: string, iconUrl?: string, opts?: { upcoming?: boolean }): L.DivIcon {
  // 写真は <img> ではなく background-image で敷く。img 要素はアプリや Leaflet の
  // グローバルスタイルの影響で歪みやすいため、確実に正円いっぱいに表示できるこちらを使う。
  const inner = iconUrl
    ? `<div class="emoji-map-pin__img" style="background-image:url('${iconUrl}')"></div>`
    : (emoji || "📍");
  return L.divIcon({
    // 地図の主役は過去イベント（思い出）なので通常ピンはピンク。
    // これからのイベントは ✨ + ラベンダーの縁で「未来」を区別する
    className: `emoji-map-pin${opts?.upcoming ? " emoji-map-pin--upcoming" : ""}`,
    html: `
      <div class="emoji-map-pin__wrap">
        <div class="emoji-map-pin__bubble">${inner}</div>
        <div class="emoji-map-pin__tail"></div>
      </div>`,
    iconSize: [46, 56],
    iconAnchor: [23, 54], // しずくの先端を座標に合わせる
    popupAnchor: [0, -50],
  });
}

// 地図まわりの共通スタイル。マップを使うコンポーネントで一度読み込めばよい。
// - ピン: 白バブル + ピンクの縁 + しずく型の尻尾
// - タイル: 彩度を落として暖色に寄せ、アプリのパステルピンクの世界観に馴染ませる
// - ポップアップ / ズームボタン: 角丸 + ピンクでかわいく統一
export const MAP_CSS = `
.emoji-map-pin { background: none; border: none; }
.emoji-map-pin__wrap {
  position: relative;
  width: 46px; height: 56px;
  filter: drop-shadow(0 5px 8px rgba(214, 104, 158, 0.38));
  transition: transform 0.15s ease;
}
.emoji-map-pin__wrap:hover { transform: translateY(-3px) scale(1.06); }
.emoji-map-pin__bubble {
  position: relative;
  width: 46px; height: 46px;
  box-sizing: border-box;
  background: linear-gradient(160deg, #ffffff 0%, #ffeef6 100%);
  border: 2.5px solid var(--pink, #e68ab6);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; line-height: 1;
  overflow: hidden;
}
/* 写真は絶対配置 + background-image でバブルの正方形いっぱいに敷き、
   cover で正円に切り抜く。 */
.emoji-map-pin__img {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.emoji-map-pin__tail {
  position: absolute; bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 0; height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 12px solid var(--pink, #e68ab6);
}
/* これからのイベント: ラベンダーの縁 + ✨ バッジで未来を区別する */
.emoji-map-pin--upcoming .emoji-map-pin__bubble { border-color: #9fb0e8; }
.emoji-map-pin--upcoming .emoji-map-pin__tail { border-top-color: #9fb0e8; }
.emoji-map-pin--upcoming .emoji-map-pin__wrap::after {
  content: "✨";
  position: absolute;
  top: -6px; right: -6px;
  font-size: 1rem;
  line-height: 1;
}

/* タイルを淡いパステル調に補正する。海の青・公園の緑など元の色分けは
   残したまま（見やすさ優先）、彩度を落として明るくやわらかい印象にする。
   ピンクの世界観はピンやポップアップなどの UI 側で出す。 */
.leaflet-tile-pane {
  filter: saturate(0.92) brightness(1.03) contrast(0.97) sepia(0.05);
}

.leaflet-popup-content-wrapper {
  border-radius: 20px;
  border: 1.5px solid #f6cfe2;
  background: linear-gradient(180deg, #ffffff 0%, #fff6fa 100%);
  box-shadow: 0 10px 30px rgba(214, 104, 158, 0.28);
}
.leaflet-popup-content {
  margin: 1rem 1.1rem 0.9rem;
  font-family: inherit;
  line-height: 1.5;
}
.leaflet-popup-tip {
  background: #fff6fa;
  border: 1.5px solid #f6cfe2;
  box-shadow: none;
}
.leaflet-popup-close-button {
  color: var(--pink, #e68ab6) !important;
  font-size: 1.1rem !important;
  padding: 6px 8px 0 0 !important;
}

.leaflet-control-zoom.leaflet-bar {
  border: 1.5px solid #f6cfe2;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(214, 104, 158, 0.22);
}
.leaflet-control-zoom a {
  background: rgba(255, 255, 255, 0.92);
  color: var(--pink, #e68ab6);
  border-bottom-color: #f6cfe2 !important;
  width: 34px; height: 34px; line-height: 34px;
  font-size: 1.05rem;
}
.leaflet-control-zoom a:hover {
  background: #fff0f7;
  color: var(--pink, #e68ab6);
}

.leaflet-container {
  font-family: inherit;
  /* デフォルメ表示（都道府県ポリゴン）のときの海の色。
     詳細タイル読み込み中の背景色も兼ねる。 */
  background: #e9f3f9;
}
`;
