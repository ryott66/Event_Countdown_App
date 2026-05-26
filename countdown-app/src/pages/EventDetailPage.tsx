import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import confetti from "canvas-confetti";
import { useAuth } from "../contexts/AuthContext";
import { useEvent } from "../hooks/useEvent";
import { customPageRegistry } from "../custom-pages";
import { THEMES } from "../constants/themes";
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
    <div style={{ textAlign: "center" }}>
      <div style={{
        background: bg,
        borderRadius: "16px",
        padding: "0.75rem 1rem",
        minWidth: "4.5rem",
        backdropFilter: "blur(4px)",
      }}>
        <div style={{ color, fontFamily: '"Dancing Script", cursive', fontSize: "clamp(2rem, 8vw, 3rem)", lineHeight: 1 }}>
          {String(value).padStart(2, "0")}
        </div>
      </div>
      <div style={{ color: accent, opacity: 0.7, fontSize: "0.75rem", marginTop: "0.4rem" }}>{label}</div>
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
  }, [isToday]);

  return (
    <div style={{ minHeight: "100svh", background: theme.bg }}>
      {/* ヘッダー */}
      <div style={{ padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => navigate("/")} style={{ background: "none", fontSize: "1.3rem", color: theme.accent }}>
          ←
        </button>
        {user.state === "admin" && (
          <button
            onClick={() => navigate(`/events/${event.id}/edit`)}
            style={{ background: "none", color: theme.accent, fontSize: "0.9rem", border: `1.5px solid ${theme.accent}`, borderRadius: "20px", padding: "0.3rem 0.9rem" }}
          >
            編集
          </button>
        )}
      </div>

      {/* メイン */}
      <div style={{ padding: "1rem 1.5rem 3rem", textAlign: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>{event.emoji}</div>
        <h1 style={{ color: theme.accent, fontSize: "clamp(1.8rem, 6vw, 2.4rem)", marginBottom: "0.5rem" }}>
          {event.title}
        </h1>
        <p style={{ color: theme.accent, opacity: 0.7, marginBottom: "2.5rem", fontSize: "0.95rem" }}>{event.date}</p>

        {/* カウントダウン */}
        {isToday ? (
          <div style={{ margin: "2rem 0" }}>
            <div style={{ fontFamily: '"Dancing Script", cursive', fontSize: "clamp(2.5rem, 10vw, 4rem)", color: theme.accent }}>
              🎉 Happy Day! 🎉
            </div>
          </div>
        ) : isPast ? (
          <p style={{ color: theme.accent, opacity: 0.6, fontSize: "1.1rem" }}>素敵な思い出になりました ✨</p>
        ) : (
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem" }}>
            <CountdownUnit value={days} label="days" color={theme.numColor} bg={theme.numBg} accent={theme.accent} />
            <CountdownUnit value={hours} label="hours" color={theme.numColor} bg={theme.numBg} accent={theme.accent} />
            <CountdownUnit value={minutes} label="min" color={theme.numColor} bg={theme.numBg} accent={theme.accent} />
            <CountdownUnit value={seconds} label="sec" color={theme.numColor} bg={theme.numBg} accent={theme.accent} />
          </div>
        )}

        {/* メモ */}
        {event.memo && (
          <div style={{
            background: "rgba(255,255,255,0.6)",
            borderRadius: "16px",
            padding: "1rem 1.25rem",
            margin: "1.5rem 0",
            backdropFilter: "blur(4px)",
            textAlign: "left",
            color: "var(--text)",
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
          }}>
            {event.memo}
          </div>
        )}

        {/* 画像ギャラリー */}
        {event.imageUrls?.length > 0 && (
          <div style={{
            display: "flex",
            gap: "0.75rem",
            overflowX: "auto",
            marginTop: "1.5rem",
            paddingBottom: "0.5rem",
            scrollSnapType: "x mandatory",
          }}>
            {event.imageUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt=""
                loading="lazy"
                decoding="async"
                style={{
                  width: "min(75vw, 300px)",
                  height: "min(75vw, 300px)",
                  objectFit: "cover",
                  borderRadius: "16px",
                  flexShrink: 0,
                  scrollSnapAlign: "start",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { event, loading } = useEvent(id!);

  if (loading) return <p style={{ padding: "2rem" }}>読み込み中...</p>;
  if (!event) return <p style={{ padding: "2rem" }}>イベントが見つかりません</p>;

  if (event.useCustomPage && event.customPageKey) {
    const CustomPage = customPageRegistry[event.customPageKey];
    if (CustomPage) return <CustomPage event={event} />;
  }

  return <TemplateDetail event={event} />;
}
