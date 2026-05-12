import { useNavigate } from "react-router-dom";
import type { Event } from "../types";

interface Props {
  event: Event;
  isPast?: boolean;
}

function daysUntil(dateStr: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function EventCard({ event, isPast }: Props) {
  const navigate = useNavigate();
  const days = daysUntil(event.date);

  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      style={{
        background: "var(--card-bg)",
        borderRadius: "16px",
        padding: "1.25rem 1.5rem",
        boxShadow: "var(--shadow)",
        cursor: "pointer",
        opacity: isPast ? 0.5 : 1,
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        transition: "transform 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
    >
      <span style={{ fontSize: "2.5rem" }}>{event.emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: '"Dancing Script", cursive', fontSize: "1.3rem", color: "var(--text)" }}>
          {event.title}
        </div>
        <div style={{ fontSize: "0.85rem", color: "var(--text-light)", marginTop: "0.25rem" }}>
          {event.date}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        {days === 0 ? (
          <div style={{ color: "var(--pink)", fontFamily: '"Dancing Script", cursive', fontSize: "1.4rem" }}>Today 🎉</div>
        ) : isPast ? (
          <div style={{ color: "var(--text-light)", fontSize: "0.9rem" }}>{Math.abs(days)}日前</div>
        ) : (
          <>
            <div style={{ color: "var(--pink)", fontFamily: '"Dancing Script", cursive', fontSize: "2rem", lineHeight: 1 }}>
              {days}
            </div>
            <div style={{ color: "var(--text-light)", fontSize: "0.75rem" }}>days</div>
          </>
        )}
      </div>
    </div>
  );
}
