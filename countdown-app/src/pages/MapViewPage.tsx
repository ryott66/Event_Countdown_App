import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, Marker, Popup, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEvents } from "../hooks/useEvents";
import MapAutoResize from "../components/MapAutoResize";
import MapBaseLayer, { type PrefectureSelection } from "../components/MapBaseLayer";
import { emojiIcon, MAP_CSS } from "../lib/mapIcon";
import { pointInFeature } from "../lib/geo";
import type { Event } from "../types";

// ピンが1つもないときの初期表示（日本全体）
const JAPAN_CENTER: [number, number] = [36.5, 138.0];
const JAPAN_ZOOM = 5;

// 今日の日付を "YYYY-MM-DD"（ローカル）で返す。event.date と文字列比較できる
function todayStr(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

// event.date までの残り日数（過去は負）
function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// 全ピンが収まるように表示範囲を調整する。
// ピン0個: 日本全体のまま / 1個: その場所を中心に / 2個以上: fitBounds
// 初期表示はデフォルメ地図（overview）のままにしたいので、ズームは
// MapBaseLayer の詳細切り替えが発動しない範囲（6）までに抑える。
function FitToPins({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 6);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [56, 56], maxZoom: 6 });
  }, [map, points]);
  return null;
}

function EventPin({ event, isUpcoming }: { event: Event; isUpcoming: boolean }) {
  const navigate = useNavigate();
  const loc = event.location!;
  return (
    <Marker position={[loc.lat, loc.lng]} icon={emojiIcon(event.emoji, event.iconUrl, { upcoming: isUpcoming })}>
      <Popup>
        <div
          onClick={() => navigate(`/events/${event.id}`)}
          style={{ cursor: "pointer", textAlign: "center", minWidth: "158px" }}
        >
          <div style={{ fontSize: "1.6rem", lineHeight: 1, marginBottom: "0.35rem" }}>
            {event.emoji}
          </div>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.15rem", letterSpacing: "0.01em" }}>
            {event.title}
          </div>
          <div style={{
            fontFamily: '"Dancing Script", cursive',
            fontSize: "1.05rem", color: "var(--pink)", marginBottom: "0.3rem",
          }}>
            {event.date}
          </div>
          {loc.name && (
            <div style={{ fontSize: "0.78rem", color: "var(--text-light)", marginBottom: "0.55rem" }}>
              📍 {loc.name}
            </div>
          )}
          <div style={{
            display: "inline-block",
            fontSize: "0.82rem",
            fontWeight: 600,
            color: "#fff",
            background: "linear-gradient(135deg, var(--pink, #e68ab6), #f0a5c9)",
            borderRadius: "999px",
            padding: "0.4rem 1.1rem",
            boxShadow: "0 4px 12px rgba(214, 104, 158, 0.35)",
          }}>
            ページを見る →
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

// 残り日数 / 思い出のバッジ
function DateBadge({ event, today }: { event: Event; today: string }) {
  const base: React.CSSProperties = {
    flexShrink: 0,
    fontSize: "0.72rem",
    fontWeight: 600,
    borderRadius: "999px",
    padding: "0.25rem 0.7rem",
    whiteSpace: "nowrap",
  };
  if (event.date === today) {
    return <span style={{ ...base, color: "#fff", background: "linear-gradient(135deg, var(--pink, #e68ab6), #f0a5c9)" }}>🎉 今日！</span>;
  }
  if (event.date < today) {
    return <span style={{ ...base, color: "#9c8496", background: "#f3edf1" }}>思い出</span>;
  }
  return <span style={{ ...base, color: "var(--pink)", background: "#ffeaf3" }}>あと{daysUntil(event.date)}日</span>;
}

// 都道府県クリックで表示するイベントリスト（ボトムシート）
function PrefectureSheet({
  pref,
  events,
  today,
  onClose,
}: {
  pref: PrefectureSelection;
  events: Event[];
  today: string;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div style={{
      position: "absolute", left: "50%", bottom: 0, transform: "translateX(-50%)",
      zIndex: 1000,
      width: "min(560px, 100%)",
      maxHeight: "44%",
      display: "flex", flexDirection: "column",
      background: "linear-gradient(180deg, #ffffff, #fff6fa)",
      borderRadius: "24px 24px 0 0",
      border: "1.5px solid #f6cfe2",
      borderBottom: "none",
      boxShadow: "0 -8px 30px rgba(214, 104, 158, 0.25)",
    }}>
      {/* ヘッダー */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.9rem 1.25rem 0.6rem",
      }}>
        <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)" }}>
          📍 {pref.name}のイベント
          <span style={{ fontSize: "0.8rem", fontWeight: 400, color: "var(--text-light)", marginLeft: "0.4rem" }}>
            {events.length}件
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--pink)", fontSize: "1.2rem", lineHeight: 1, padding: "0.2rem",
          }}
          aria-label="閉じる"
        >
          ×
        </button>
      </div>

      {/* リスト */}
      <div style={{ overflowY: "auto", padding: "0 0.75rem 0.9rem" }}>
        {events.length === 0 ? (
          <p style={{ fontSize: "0.85rem", color: "var(--text-light)", textAlign: "center", padding: "1rem 0 1.4rem" }}>
            この県のイベントはまだありません
          </p>
        ) : (
          events.map((e) => (
            <button
              key={e.id}
              onClick={() => navigate(`/events/${e.id}`)}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                width: "100%", padding: "0.55rem 0.6rem",
                background: "none", border: "none", cursor: "pointer",
                borderRadius: "14px", textAlign: "left",
                fontFamily: "inherit",
              }}
            >
              {/* アイコン（写真 or 絵文字） */}
              <div style={{
                flexShrink: 0, width: "2.6rem", height: "2.6rem",
                borderRadius: "50%", overflow: "hidden",
                border: "2px solid #f6cfe2",
                background: "linear-gradient(160deg, #ffffff, #ffeef6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.3rem",
                backgroundImage: e.iconUrl ? `url(${e.iconUrl})` : undefined,
                backgroundSize: "cover", backgroundPosition: "center",
              }}>
                {!e.iconUrl && e.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: "0.92rem", fontWeight: 600, color: "var(--text)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {e.title}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>
                  {e.date}{e.location?.name ? ` ・ ${e.location.name}` : ""}
                </div>
              </div>
              <DateBadge event={e} today={today} />
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default function MapViewPage() {
  const navigate = useNavigate();
  const { events, loading } = useEvents();
  const [selectedPref, setSelectedPref] = useState<PrefectureSelection | null>(null);
  // 地図の主目的は思い出（過去イベント）。これからのイベントはトグルで表示する
  const [showUpcoming, setShowUpcoming] = useState(false);

  // 地図を画面全幅で見せたいので #root の max-width を解除する（詳細ページと同じパターン）
  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    const prev = root.style.maxWidth;
    root.style.maxWidth = "100%";
    return () => { root.style.maxWidth = prev; };
  }, []);

  const today = todayStr();
  const located = useMemo(() => events.filter((e) => e.location), [events]);
  // 表示対象: 基本は過去イベント（思い出）のみ。トグルONでこれからのイベントも
  const visible = useMemo(
    () => (showUpcoming ? located : located.filter((e) => e.date < today)),
    [located, showUpcoming, today],
  );
  const points = useMemo(
    () => visible.map((e) => [e.location!.lat, e.location!.lng] as [number, number]),
    [visible],
  );
  const unlocatedCount = events.length - located.length;

  // 選択中の県に含まれる表示対象イベント。未来（日付の近い順）→ 過去（新しい順）で並べる
  const prefEvents = useMemo(() => {
    if (!selectedPref) return [];
    const inPref = visible.filter((e) =>
      pointInFeature(e.location!.lng, e.location!.lat, selectedPref.feature),
    );
    const upcoming = inPref.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
    const past = inPref.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date));
    return [...upcoming, ...past];
  }, [selectedPref, visible, today]);

  return (
    <div style={{ position: "relative", height: "100svh" }}>
      <style>{MAP_CSS}</style>

      <MapContainer
        center={JAPAN_CENTER}
        zoom={JAPAN_ZOOM}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
        // 県クリック時の着地ズームを細かく調整できるよう fractional zoom を許可
        zoomSnap={0.25}
      >
        {/* 左上は戻るボタンと重なるため、ズームボタンは右下に置く */}
        <ZoomControl position="bottomright" />
        <MapAutoResize />
        <MapBaseLayer
          onPrefectureSelect={setSelectedPref}
          onOverview={() => setSelectedPref(null)}
          // ボトムシートと重ならないように、県へのズームは下側に余白を取る
          flyPaddingBottom={220}
        />
        <FitToPins points={points} />
        {visible.map((e) => <EventPin key={e.id} event={e} isUpcoming={e.date >= today} />)}
      </MapContainer>

      {/* 戻るボタン（地図の上にフロート表示） */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute", top: "1rem", left: "1rem", zIndex: 1000,
          width: "2.7rem", height: "2.7rem", borderRadius: "50%",
          background: "linear-gradient(160deg, #ffffff, #fff0f7)",
          color: "var(--pink)", fontSize: "1.15rem",
          border: "1.5px solid #f6cfe2",
          boxShadow: "0 6px 18px rgba(214, 104, 158, 0.28)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}
      >
        ←
      </button>

      {/* タイトル */}
      <div style={{
        position: "absolute", top: "1rem", left: "50%", transform: "translateX(-50%)", zIndex: 1000,
        background: "linear-gradient(160deg, #ffffff, #fff0f7)",
        borderRadius: "999px", padding: "0.4rem 1.5rem",
        border: "1.5px solid #f6cfe2",
        boxShadow: "0 6px 18px rgba(214, 104, 158, 0.28)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", gap: "0.5rem",
        whiteSpace: "nowrap",
      }}>
        <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>🗺️</span>
        <span style={{
          fontFamily: '"Dancing Script", cursive',
          fontSize: "1.5rem", fontWeight: 600, color: "var(--pink)",
          lineHeight: 1.2,
        }}>
          Memory Map
        </span>
      </div>

      {/* これからのイベント表示トグル（タイトルの下） */}
      <button
        onClick={() => setShowUpcoming((v) => !v)}
        style={{
          position: "absolute", top: "4.3rem", left: "50%", transform: "translateX(-50%)", zIndex: 1000,
          display: "flex", alignItems: "center", gap: "0.35rem",
          padding: "0.35rem 1rem",
          borderRadius: "999px",
          background: showUpcoming
            ? "linear-gradient(135deg, #9fb0e8, #c3cdf2)"
            : "linear-gradient(160deg, #ffffff, #fff0f7)",
          border: showUpcoming ? "1.5px solid #8fa2e3" : "1.5px solid #f6cfe2",
          boxShadow: showUpcoming
            ? "0 6px 18px rgba(122, 141, 214, 0.35)"
            : "0 6px 18px rgba(214, 104, 158, 0.22)",
          color: showUpcoming ? "#fff" : "var(--text-light)",
          fontSize: "0.78rem", fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
          fontFamily: "inherit",
        }}
      >
        ✨ これからのイベント{showUpcoming ? "も表示中" : "を見る"}
      </button>

      {/* 県のイベントリスト（ボトムシート） */}
      {selectedPref && (
        <PrefectureSheet
          pref={selectedPref}
          events={prefEvents}
          today={today}
          onClose={() => setSelectedPref(null)}
        />
      )}

      {/* ステータス（読み込み中 / 場所未設定の件数）。シート表示中は隠す */}
      {!selectedPref && (loading || located.length === 0 || unlocatedCount > 0) && (
        <div style={{
          position: "absolute", bottom: "1.4rem", left: "50%", transform: "translateX(-50%)", zIndex: 1000,
          background: "linear-gradient(135deg, var(--pink, #e68ab6), #f0a5c9)",
          borderRadius: "999px", padding: "0.5rem 1.25rem",
          boxShadow: "0 6px 18px rgba(214, 104, 158, 0.4)",
          fontSize: "0.8rem", fontWeight: 600, color: "#fff",
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
          maxWidth: "calc(100% - 2rem)",
          overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {loading
            ? "読み込み中..."
            : located.length === 0
              ? "📍 場所が設定されたイベントはまだありません"
              : `📍 あと ${unlocatedCount} 件のイベントに場所を追加できます`}
        </div>
      )}
    </div>
  );
}
