import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import confetti from "canvas-confetti";
import { useAuth } from "../contexts/AuthContext";
import { useEvent } from "../hooks/useEvent";
import { customPageRegistry } from "../custom-pages";
import { THEMES } from "../constants/themes";
import { getCurrentSeason } from "../constants/seasonal";
import SeasonalDecoration from "../components/SeasonalDecoration";
import type { Event } from "../types";

function useCountdown(dateStr: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isToday: false, isPast: false });

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const target = new Date(dateStr);
      target.setHours(0, 0, 0, 0);
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);

      const diffMs = target.getTime() - now.getTime();
      const isToday = target.getTime() === todayStart.getTime();
      const isPast = target.getTime() < todayStart.getTime();

      if (isToday || isPast) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isToday, isPast });
        return;
      }

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds, isToday: false, isPast: false });
    };

    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [dateStr]);

  return timeLeft;
}

function CountdownUnit({ value, label, color, bg, accent }: { value: number; label: string; color: string; bg: string; accent: string }) {
  return (
    <div style={{ flex: "1 1 0", minWidth: "5rem", maxWidth: "9rem", textAlign: "center" }}>
      <div style={{
        background: bg,
        borderRadius: "20px",
        padding: "1rem 0.5rem",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.5)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
      }}>
        <div style={{ color, fontFamily: '"Dancing Script", cursive', fontSize: "clamp(2.2rem, 9vw, 3.4rem)", lineHeight: 1 }}>
          {String(value).padStart(2, "0")}
        </div>
      </div>
      <div style={{ color: accent, opacity: 0.7, fontSize: "0.8rem", marginTop: "0.45rem", letterSpacing: "0.05em" }}>{label}</div>
    </div>
  );
}

function TemplateDetail({ event }: { event: Event }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = THEMES[event.theme] ?? THEMES.birthday;
  const { days, hours, minutes, seconds, isToday, isPast } = useCountdown(event.date);

  useEffect(() => {
    if (!isToday) return;
    const fire = () => confetti({ particleCount: 80, spread: 70, colors: [...theme.confettiColors], origin: { y: 0.6 } });
    fire(); // 1回目: ページ表示直後
    const id = window.setTimeout(fire, 3000); // 2回目: 3秒後で打ち止め
    return () => window.clearTimeout(id);
  }, [isToday, theme.confettiColors]);

  // event.date の月から季節を決める。閲覧時点の今日ではなく、イベントの世界観に合わせる。
  const eventSeason = getCurrentSeason(new Date(event.date));

  const hasHero = !!event.heroImageUrl;
  const heroBgStyle: React.CSSProperties = hasHero
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.40) 100%), url(${event.heroImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {};
  const glassButtonStyle: React.CSSProperties = {
    background: hasHero ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)",
    color: theme.accent,
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.6)",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  };

  return (
    // isolation: SeasonalDecoration (z-index:-1) を背景色とコンテンツの間に挟むため
    <div style={{ minHeight: "100svh", background: theme.bg, isolation: "isolate" }}>
      <SeasonalDecoration season={eventSeason} />

      {/* ヒーロー */}
      <section style={{
        position: "relative",
        minHeight: "92svh",
        display: "flex",
        flexDirection: "column",
        ...heroBgStyle,
      }}>
        {/* ヘッダー: 戻る←を左上、編集を右上の画面端に寄せる */}
        <div style={{ width: "100%", padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => navigate("/")} style={{ ...glassButtonStyle, fontSize: "1.1rem", borderRadius: "50%", width: "2.4rem", height: "2.4rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
            ←
          </button>
          {user.state === "admin" && (
            <button
              onClick={() => navigate(`/events/${event.id}/edit`)}
              style={{ ...glassButtonStyle, fontSize: "0.9rem", borderRadius: "20px", padding: "0.4rem 1rem" }}
            >
              編集
            </button>
          )}
        </div>

        {/* ヒーロー中身: emoji + title + date + countdown */}
        <div style={{ maxWidth: "720px", width: "100%", margin: "0 auto", padding: "0.5rem 1.5rem 2.5rem", textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "1.5rem" }}>
          {/* タイトル・日付の塗りつぶしフレーム */}
          <div style={{
            background: "linear-gradient(135deg, #ffffff, #fff6fa)",
            borderRadius: "22px",
            padding: "0.9rem 1.4rem 0.9rem 1rem",
            width: "fit-content",
            maxWidth: "100%",
            margin: "0 auto",
            border: `2px solid ${theme.accent}`,
            boxShadow: `0 0 0 5px rgba(255,255,255,0.55), 0 10px 24px rgba(0,0,0,0.12)`,
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}>
            <div style={{
              flexShrink: 0,
              width: "clamp(3.2rem, 13vw, 4.2rem)",
              height: "clamp(3.2rem, 13vw, 4.2rem)",
              borderRadius: "16px",
              overflow: "hidden",
              background: event.iconUrl ? undefined : `linear-gradient(135deg, ${theme.numBg}, #fff)`,
              border: `1.5px solid ${theme.accent}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {event.iconUrl ? (
                <img src={event.iconUrl} alt="" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              ) : (
                <span style={{ fontSize: "clamp(1.8rem, 7vw, 2.4rem)", lineHeight: 1 }}>{event.emoji}</span>
              )}
            </div>
            <div style={{ textAlign: "left", minWidth: 0 }}>
              <h1 style={{ color: theme.accent, fontSize: "clamp(1.6rem, 5.5vw, 2.2rem)", marginBottom: "0.25rem", letterSpacing: "0.01em" }}>
                {event.title}
              </h1>
              <p style={{ color: theme.accent, opacity: 0.8, fontSize: "0.9rem", letterSpacing: "0.05em" }}>{event.date}</p>
            </div>
          </div>

          {/* カウントダウン */}
          {isToday ? (
            <div style={{
              padding: "1.5rem 1.25rem",
              background: "rgba(255,255,255,0.45)",
              borderRadius: "24px",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.55)",
              boxShadow: "0 10px 32px rgba(0,0,0,0.12)",
            }}>
              <div style={{ fontFamily: '"Dancing Script", cursive', fontSize: "clamp(2.5rem, 10vw, 4rem)", color: theme.accent }}>
                🎉 Happy Day! 🎉
              </div>
            </div>
          ) : isPast ? (
            <div style={{
              padding: "1.25rem",
              background: "rgba(255,255,255,0.45)",
              borderRadius: "24px",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.55)",
              boxShadow: "0 10px 32px rgba(0,0,0,0.12)",
            }}>
              <p style={{ color: theme.accent, opacity: 0.75, fontSize: "1.1rem" }}>素敵な思い出になりました ✨</p>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "0.85rem", justifyContent: "center", flexWrap: "wrap" }}>
              <CountdownUnit value={days} label="days" color={theme.numColor} bg={theme.numBg} accent={theme.accent} />
              <CountdownUnit value={hours} label="hours" color={theme.numColor} bg={theme.numBg} accent={theme.accent} />
              <CountdownUnit value={minutes} label="min" color={theme.numColor} bg={theme.numBg} accent={theme.accent} />
              <CountdownUnit value={seconds} label="sec" color={theme.numColor} bg={theme.numBg} accent={theme.accent} />
            </div>
          )}
        </div>
      </section>

      {/* 下のセクション: メモ / 画像ギャラリー */}
      {(event.memo || event.imageUrls?.length > 0) && (
        <div style={{ padding: "2rem 0 3rem" }}>
          {event.memo && (
            <div style={{
              maxWidth: "560px",
              margin: "0 auto",
              padding: "0 1.5rem",
            }}>
              <div style={{
                position: "relative",
                background: "linear-gradient(180deg, #fffbf5 0%, #fff5ee 100%)",
                borderRadius: "18px",
                padding: "2rem 1.75rem 1.75rem",
                border: `1.5px dashed ${theme.accent}`,
                boxShadow: "0 6px 22px rgba(0,0,0,0.08)",
                color: "var(--text)",
                lineHeight: 1.9,
                whiteSpace: "pre-wrap",
                fontSize: "1rem",
                textAlign: "center",
                letterSpacing: "0.02em",
              }}>
                <div style={{
                  position: "absolute",
                  top: "-0.95rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: theme.accent,
                  color: "#fff",
                  width: "1.9rem",
                  height: "1.9rem",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.95rem",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.18)",
                  border: "2px solid #fffbf5",
                }}>♡</div>
                {event.memo}
              </div>
            </div>
          )}

          {event.imageUrls?.length > 0 && (
            <div style={{
              marginTop: event.memo ? "1.5rem" : 0,
              background: `linear-gradient(90deg, ${theme.accent} 0%, #fff9e6 50%, ${theme.accent} 100%)`,
              border: "0.35rem solid #c9c9c9",
              borderLeft: "none",
              borderRight: "none",
              padding: "0.6rem 0.4rem 1.2rem",
            }}>
              <div style={{
                display: "flex",
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                gap: "0.6rem",
                padding: "0.8rem 0.5rem 0.5rem",
              }}>
                {event.imageUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style={{
                      height: "clamp(15rem, 55vw, 24rem)",
                      border: "0.15rem solid rgb(128,128,128)",
                      borderRadius: "0.6rem",
                      objectFit: "cover",
                      display: "block",
                      scrollSnapAlign: "start",
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { event, loading } = useEvent(id!);

  // 詳細ページは theme.bg を画面全幅で見せたいので #root の max-width を解除する
  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    const prev = root.style.maxWidth;
    root.style.maxWidth = "100%";
    return () => { root.style.maxWidth = prev; };
  }, []);

  if (loading) return <p style={{ padding: "2rem" }}>読み込み中...</p>;
  if (!event) return <p style={{ padding: "2rem" }}>イベントが見つかりません</p>;

  if (event.useCustomPage && event.customPageKey) {
    const CustomPage = customPageRegistry[event.customPageKey];
    if (CustomPage) return <CustomPage event={event} />;
  }

  return <TemplateDetail event={event} />;
}
