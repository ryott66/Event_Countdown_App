import { useState, useRef, useEffect } from "react";
import { MapContainer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { emojiIcon, MAP_CSS } from "../lib/mapIcon";
import MapAutoResize from "./MapAutoResize";
import MapBaseLayer from "./MapBaseLayer";

// 日本全体が収まる初期表示（ピン未設置時）
const JAPAN_CENTER: [number, number] = [36.5, 138.0];
const JAPAN_ZOOM = 5;
const PINNED_ZOOM = 15;

interface Pin {
  lat: number;
  lng: number;
}

// Nominatim (OpenStreetMap公式ジオコーディングAPI) の検索結果。
// APIキー不要・無料。施設名（例: 日光東照宮）や駅名・地名で検索できる。
interface SearchResult {
  name: string;
  displayName: string;
  lat: number;
  lng: number;
}

async function searchPlaces(query: string): Promise<SearchResult[]> {
  const url =
    "https://nominatim.openstreetmap.org/search" +
    `?format=jsonv2&limit=5&accept-language=ja&q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Nominatim error: ${res.status}`);
  const data: Array<{ name?: string; display_name: string; lat: string; lon: string }> =
    await res.json();
  return data.map((d) => ({
    name: d.name || d.display_name.split(",")[0],
    displayName: d.display_name,
    lat: Number(d.lat),
    lng: Number(d.lon),
  }));
}

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// 検索結果の選択時だけ地図を移動させる（地図クリックでのピン移動では動かさない）
function FlyTo({ target }: { target: Pin | null }) {
  const map = useMap();
  const lastRef = useRef<Pin | null>(null);
  useEffect(() => {
    if (target && target !== lastRef.current) {
      lastRef.current = target;
      map.flyTo([target.lat, target.lng], PINNED_ZOOM, { duration: 0.8 });
    }
  }, [target, map]);
  return null;
}

// 場所検索 + 地図クリックでピンを置くピッカー。
// 検索で候補を選ぶとピン設置と同時に onSearchSelect で場所名を親へ渡す。
// 場所名入力欄やクリアは親（フォーム）側で管理する。
export default function LocationPicker({
  pin,
  emoji,
  iconUrl,
  onPick,
  onSearchSelect,
}: {
  pin: Pin | null;
  emoji: string;
  iconUrl?: string;
  onPick: (lat: number, lng: number) => void;
  onSearchSelect?: (name: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [flyTarget, setFlyTarget] = useState<Pin | null>(null);

  const center: [number, number] = pin ? [pin.lat, pin.lng] : JAPAN_CENTER;
  const zoom = pin ? PINNED_ZOOM : JAPAN_ZOOM;

  const handleSearch = async () => {
    const q = query.trim();
    if (!q || searching) return;
    setSearching(true);
    setSearchError("");
    try {
      const found = await searchPlaces(q);
      setResults(found);
      if (found.length === 0) setSearchError("見つかりませんでした。別のキーワードをお試しください。");
    } catch {
      setSearchError("検索に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setSearching(false);
    }
  };

  const handleSelect = (r: SearchResult) => {
    onPick(r.lat, r.lng);
    onSearchSelect?.(r.name);
    setFlyTarget({ lat: r.lat, lng: r.lng });
    setResults([]);
    setQuery("");
  };

  return (
    <div>
      <style>{MAP_CSS}</style>

      {/* 検索ボックス */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          // フォーム内の Enter は submit になるため、検索実行に差し替える
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
          placeholder="施設名・駅名・地名で検索"
          style={{
            flex: 1, minWidth: 0,
            padding: "0.55rem 0.8rem",
            borderRadius: "10px",
            border: "1.5px solid #f0d0e0",
            fontSize: "0.95rem",
            fontFamily: "inherit",
            background: "#fff",
            color: "var(--text)",
            outline: "none",
          }}
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching || !query.trim()}
          style={{
            flexShrink: 0,
            padding: "0.55rem 1rem",
            borderRadius: "10px",
            border: "none",
            background: "var(--pink)",
            color: "#fff",
            fontSize: "0.9rem",
            opacity: searching || !query.trim() ? 0.6 : 1,
            cursor: "pointer",
          }}
        >
          {searching ? "検索中..." : "🔍 検索"}
        </button>
      </div>

      {searchError && (
        <p style={{ fontSize: "0.8rem", color: "#e05", marginBottom: "0.5rem" }}>{searchError}</p>
      )}

      {/* 検索候補 */}
      {results.length > 0 && (
        <div style={{
          marginBottom: "0.5rem",
          border: "1.5px solid #f0d0e0",
          borderRadius: "10px",
          overflow: "hidden",
          background: "#fff",
        }}>
          {results.map((r, i) => (
            <button
              key={`${r.lat},${r.lng}`}
              type="button"
              onClick={() => handleSelect(r)}
              style={{
                display: "block", width: "100%",
                padding: "0.6rem 0.9rem",
                background: "none", border: "none",
                borderTop: i > 0 ? "1px solid #f8e4ee" : "none",
                textAlign: "left", cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <span style={{ fontSize: "0.9rem", color: "var(--text)", display: "block" }}>
                📍 {r.name}
              </span>
              <span style={{
                fontSize: "0.72rem", color: "var(--text-light)", display: "block",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {r.displayName}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* 地図 */}
      <div
        style={{
          width: "100%",
          height: "260px",
          borderRadius: "18px",
          overflow: "hidden",
          border: "2px solid #f6cfe2",
          boxShadow: "0 6px 20px rgba(214, 104, 158, 0.15)",
        }}
      >
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ width: "100%", height: "100%" }}
          // 県クリック時の着地ズームを細かく調整できるよう fractional zoom を許可
          zoomSnap={0.25}
        >
          <MapBaseLayer />
          <MapAutoResize />
          <ClickHandler onPick={onPick} />
          <FlyTo target={flyTarget} />
          {pin && <Marker position={[pin.lat, pin.lng]} icon={emojiIcon(emoji, iconUrl)} />}
        </MapContainer>
      </div>
      <p style={{ fontSize: "0.75rem", color: "var(--text-light)", marginTop: "0.35rem" }}>
        検索で場所を選ぶか、地図をタップしてピンを置いてください（もう一度タップで移動）。
      </p>
    </div>
  );
}
