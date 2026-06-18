import { useNavigate } from "react-router-dom";
import { useEventSeries } from "../hooks/useEventSeries";
import type { Event } from "../types";

interface Props {
  event: Event;
  // ページのテーマに合わせるアクセントカラー
  accent?: string;
}

function coverOf(e: Event): string | null {
  return e.heroImageUrl || e.imageUrls?.[0] || e.iconUrl || null;
}

function yearOf(dateStr: string): number {
  return new Date(dateStr).getFullYear();
}

// 同じ seriesId のイベント（過去年など）へ飛べる「思い出アーカイブ」。
// 各年の表紙・写真枚数・メモを一覧し、タップでその年の詳細へ遷移する。
export default function SeriesArchive({ event, accent = "#e68ab6" }: Props) {
  const navigate = useNavigate();
  const { events } = useEventSeries(event.seriesId);

  // シリーズに自分しかいない / seriesId 未設定なら何も出さない
  if (!event.seriesId || events.length <= 1) return null;

  return (
    <section style={{ padding: "2.5rem 1.25rem 3rem" }}>
      <style>{`
        .sa-scroll::-webkit-scrollbar { height: 6px; }
        .sa-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }
        .sa-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .sa-card.sa-link:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,0.16); }
        .sa-clamp { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      <div style={{ maxWidth: "880px", margin: "0 auto" }}>
        <p style={{ textAlign: "center", color: accent, opacity: 0.85, fontSize: "clamp(1.3rem, 5vw, 1.9rem)", fontWeight: 700, margin: "0 0 1.5rem", letterSpacing: "0.05em" }}>
          🕘 過去のイベント
        </p>

        <div
          className="sa-scroll"
          style={{
            display: "flex",
            gap: "1rem",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            padding: "0.5rem 0.25rem 1rem",
          }}
        >
          {events.map((e) => {
            const isCurrent = e.id === event.id;
            const cover = coverOf(e);
            const photoCount = e.imageUrls?.length ?? 0;
            return (
              <div
                key={e.id}
                className={isCurrent ? "sa-card" : "sa-card sa-link"}
                onClick={isCurrent ? undefined : () => navigate(`/events/${e.id}`)}
                style={{
                  flex: "0 0 auto",
                  width: "clamp(11rem, 60vw, 14rem)",
                  scrollSnapAlign: "start",
                  background: "#fff",
                  borderRadius: "18px",
                  overflow: "hidden",
                  border: isCurrent ? `2px solid ${accent}` : "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                  cursor: isCurrent ? "default" : "pointer",
                }}
              >
                {/* 表紙 */}
                <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3", background: `linear-gradient(135deg, ${accent}22, #fff)` }}>
                  {cover ? (
                    <img src={cover} alt="" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>
                      {e.emoji}
                    </div>
                  )}
                  {/* 年バッジ */}
                  <div style={{
                    position: "absolute", top: "0.6rem", left: "0.6rem",
                    background: accent, color: "#fff",
                    fontSize: "0.85rem", fontWeight: 700,
                    padding: "0.15rem 0.6rem", borderRadius: "999px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  }}>
                    {yearOf(e.date)}
                  </div>
                  {isCurrent && (
                    <div style={{
                      position: "absolute", top: "0.6rem", right: "0.6rem",
                      background: "#fff", color: accent,
                      fontSize: "0.7rem", fontWeight: 700,
                      padding: "0.15rem 0.55rem", borderRadius: "999px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    }}>
                      今年
                    </div>
                  )}
                </div>

                {/* 情報 */}
                <div style={{ padding: "0.7rem 0.85rem 0.95rem" }}>
                  <div style={{ fontWeight: 700, color: "var(--text, #444)", fontSize: "0.95rem", marginBottom: "0.15rem" }}>
                    {e.title}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: accent, opacity: 0.8, fontSize: "0.78rem", marginBottom: "0.4rem" }}>
                    <span>{e.date}</span>
                    {photoCount > 0 && <span>📷 {photoCount}</span>}
                  </div>
                  {e.memo && (
                    <div className="sa-clamp" style={{ color: "var(--text-light, #888)", fontSize: "0.8rem", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                      {e.memo}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
