import { useEffect, useState } from "react";
import { useEventSeries } from "../hooks/useEventSeries";
import type { Event } from "../types";

interface Props {
  event: Event;
  // ページのテーマに合わせるアクセントカラー
  accent?: string;
  // ギャラリー見出し（省略時は "Memories"）
  title?: string;
}

interface PhotoGroup {
  id: string;
  date: string;
  year: number;
  isCurrent: boolean;
  images: string[];
}

function yearOf(dateStr: string): number {
  return new Date(dateStr).getFullYear();
}

// 現在のイベントと、同じ seriesId の過去イベントの追加画像を「1つのギャラリー」に統合表示する。
// 年フィルタ（チップ）で絞り込みでき、過去の写真には年バッジを付ける。
export default function EventGallery({ event, accent = "#e68ab6", title = "Memories" }: Props) {
  const { events } = useEventSeries(event.seriesId);
  // 選択中の年フィルタ: "all" または対象イベントの id
  const [selected, setSelected] = useState<string>("all");
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // ライトボックス: ESCで閉じる + 背景スクロールをロック
  useEffect(() => {
    if (!lightboxUrl) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxUrl(null); };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxUrl]);

  // グループ化: 現在のイベント + 同シリーズの過去イベント（いずれも画像があるもの）
  const series = event.seriesId ? events : [];
  const currentImages = event.imageUrls ?? [];
  const groups: PhotoGroup[] = [
    ...(currentImages.length > 0
      ? [{ id: event.id, date: event.date, year: yearOf(event.date), isCurrent: true, images: currentImages }]
      : []),
    ...series
      .filter((e) => e.id !== event.id && (e.imageUrls?.length ?? 0) > 0)
      .map((e) => ({ id: e.id, date: e.date, year: yearOf(e.date), isCurrent: false, images: e.imageUrls })),
  ].sort((a, b) => b.date.localeCompare(a.date)); // 新しい年が先頭

  if (groups.length === 0) return null;

  const hasPast = groups.length > 1;
  const visibleGroups = selected === "all" ? groups : groups.filter((g) => g.id === selected);
  // 念のため: 選択中グループが消えた場合は全件にフォールバック
  const shownGroups = visibleGroups.length > 0 ? visibleGroups : groups;

  return (
    <section style={{ padding: "2rem 0 0" }}>
      <style>{`
        .eg-scroll::-webkit-scrollbar { height: 6px; }
        .eg-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }
        .eg-chip { transition: background 0.15s ease, color 0.15s ease; }
      `}</style>

      {title && (
        <h2 style={{
          textAlign: "center",
          color: accent,
          fontFamily: '"Dancing Script", cursive',
          fontSize: "clamp(2.6rem, 9vw, 4rem)",
          margin: "0 0 1.1rem",
        }}>
          {title}
        </h2>
      )}

      {/* 年フィルタ（過去がある時だけ） */}
      {hasPast && (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.4rem", padding: "0 1.25rem 1rem" }}>
          <FilterChip label="すべて" active={selected === "all"} accent={accent} onClick={() => setSelected("all")} />
          {groups.map((g) => (
            <FilterChip
              key={g.id}
              label={g.isCurrent ? `${g.year}（今年）` : `🕘 ${g.year}`}
              active={selected === g.id}
              accent={accent}
              onClick={() => setSelected(g.id)}
            />
          ))}
        </div>
      )}

      {/* 統合ギャラリー（横スクロール・新しい年→古い年の順） */}
      <div style={{
        background: `linear-gradient(90deg, ${accent} 0%, #fff9e6 50%, ${accent} 100%)`,
        border: "0.35rem solid #c9c9c9",
        borderLeft: "none",
        borderRight: "none",
        padding: "0.6rem 0.4rem 1.2rem",
      }}>
        <div className="eg-scroll" style={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          gap: "0.6rem",
          padding: "0.8rem 0.5rem 0.5rem",
        }}>
          {shownGroups.flatMap((g) =>
            g.images.map((url, i) => (
              <div key={`${g.id}-${i}`} style={{ position: "relative", flexShrink: 0, scrollSnapAlign: "start" }}>
                <img
                  src={url}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onClick={() => setLightboxUrl(url)}
                  style={{
                    height: "clamp(15rem, 55vw, 24rem)",
                    border: "0.15rem solid rgb(128,128,128)",
                    borderRadius: "0.6rem",
                    objectFit: "cover",
                    display: "block",
                    cursor: "zoom-in",
                  }}
                />
                {/* 過去の写真には年バッジを付けて「以前のもの」と分かるようにする */}
                {!g.isCurrent && (
                  <span style={{
                    position: "absolute", top: "0.5rem", left: "0.5rem",
                    background: "rgba(0,0,0,0.55)", color: "#fff",
                    fontSize: "0.72rem", fontWeight: 600,
                    padding: "0.1rem 0.5rem", borderRadius: "999px",
                    backdropFilter: "blur(4px)",
                  }}>
                    🕘 {g.year}
                  </span>
                )}
              </div>
            )),
          )}
        </div>
      </div>

      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.85)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div style={{ position: "relative", maxWidth: "95%", maxHeight: "95%", display: "flex" }} onClick={(ev) => ev.stopPropagation()}>
            <button
              type="button"
              onClick={() => setLightboxUrl(null)}
              aria-label="Close"
              style={{
                position: "absolute", top: "0.6rem", right: "0.6rem",
                border: "none", background: "rgba(255,255,255,0.95)", color: "#333",
                fontSize: "1.6rem", width: "2.6rem", height: "2.6rem",
                borderRadius: "50%", cursor: "pointer", lineHeight: 1, padding: 0,
              }}
            >×</button>
            <img src={lightboxUrl} alt="Expanded memory" style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "1rem", boxShadow: "0 0 40px rgba(0,0,0,0.4)" }} />
          </div>
        </div>
      )}
    </section>
  );
}

function FilterChip({ label, active, accent, onClick }: { label: string; active: boolean; accent: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="eg-chip"
      onClick={onClick}
      style={{
        fontSize: "0.8rem",
        fontWeight: 600,
        padding: "0.3rem 0.85rem",
        borderRadius: "999px",
        border: `1.5px solid ${accent}`,
        background: active ? accent : "#fff",
        color: active ? "#fff" : accent,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
