import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Event } from "../types";

interface Props {
  event: Event;
  isPast?: boolean;
  isAdmin?: boolean;
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
  const [thumbUrl, setThumbUrl] = useState<string>(event.iconUrl ?? "");

  useEffect(() => {
    setThumbUrl(event.iconUrl ?? "");
  }, [event.iconUrl]);

  return (
    <div
      className="ec-card"
      style={{ opacity: isPast ? 0.5 : 1 }}
      onClick={() => navigate(`/events/${event.id}`)}
    >
      <div className="ec-media">
        {thumbUrl
          ? <img src={thumbUrl} alt="" className="ec-photo" loading="eager" decoding="async" fetchPriority="high" />
          : <div className="ec-emoji-bg">{event.emoji}</div>
        }
      </div>
      <div className="ec-info">
        <div className="ec-title">{event.title}</div>
        <div className="ec-date">{event.date}</div>
        {event.memo && (
          <div className="ec-memo">{event.memo}</div>
        )}
        <div className="ec-countdown">
          {days === 0 ? (
            <span className="ec-today">Today 🎉</span>
          ) : isPast ? (
            <span className="ec-past-days">{Math.abs(days)}日前</span>
          ) : (
            <>
              <div className="ec-days">{days}</div>
              <div className="ec-days-label">days</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
