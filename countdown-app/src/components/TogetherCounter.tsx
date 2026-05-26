import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { TOGETHER_START_DATE } from "../constants/together";

const ICON_SRC = `${import.meta.env.BASE_URL}images/together.webp`;

type Breakdown = { totalDays: number; years: number; months: number; days: number };

function calcTogether(startStr: string): Breakdown {
  const start = new Date(startStr);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalDays = Math.max(0, Math.floor((today.getTime() - start.getTime()) / 86_400_000));

  let years = today.getFullYear() - start.getFullYear();
  let months = today.getMonth() - start.getMonth();
  let days = today.getDate() - start.getDate();
  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { totalDays, years, months, days };
}

const css = `
  .tc-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
  }
  .tc-trigger {
    background: rgba(229,166,220,0.18);
    border: 1px solid rgba(200, 185, 225, 0.55);
    border-radius: 50%;
    width: 2.6rem;
    height: 2.6rem;
    font-size: 1.3rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    padding: 0;
    overflow: hidden;
    box-shadow: 0 0 0 2px rgba(200, 185, 225, 0.18);
  }
  .tc-trigger:hover {
    background: rgba(229,166,220,0.32);
    transform: scale(1.05);
    border-color: rgba(200, 185, 225, 0.75);
    box-shadow: 0 0 0 2px rgba(200, 185, 225, 0.28), 0 2px 8px rgba(200, 185, 225, 0.3);
  }
  .tc-trigger[aria-expanded="true"] {
    background: rgba(229,166,220,0.4);
    border-color: rgba(200, 185, 225, 0.75);
  }
  .tc-trigger-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .tc-popover {
    position: absolute;
    top: calc(100% + 0.55rem);
    left: 50%;
    transform: translateX(-50%);
    min-width: 16rem;
    padding: 1rem 1.25rem 1.05rem;
    background: rgba(255, 235, 245, 0.85);
    backdrop-filter: blur(12px) saturate(140%);
    -webkit-backdrop-filter: blur(12px) saturate(140%);
    border: 1px solid rgba(230, 138, 182, 0.4);
    border-radius: 1rem;
    box-shadow:
      0 12px 32px rgba(230, 138, 182, 0.18),
      0 2px 6px rgba(230, 138, 182, 0.08);
    text-align: center;
    z-index: 20;
    animation: tc-fadein 0.18s ease-out;
    pointer-events: auto;
  }
  /* 矢印: ポップオーバーと同じ枠線がVの字に繋がるように
     border-top + border-left だけを付ける（rotate(45deg)後に上向きの角になる辺） */
  .tc-popover::before {
    content: '';
    position: absolute;
    top: -0.42rem;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 0.75rem;
    height: 0.75rem;
    background: rgba(255, 235, 245, 0.85);
    backdrop-filter: blur(12px) saturate(140%);
    -webkit-backdrop-filter: blur(12px) saturate(140%);
    border-top: 1px solid rgba(230, 138, 182, 0.4);
    border-left: 1px solid rgba(230, 138, 182, 0.4);
  }
  @keyframes tc-fadein {
    from { opacity: 0; transform: translateX(-50%) translateY(-4px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  .tc-label {
    font-family: "Dancing Script", cursive;
    font-size: 1.3rem;
    color: var(--pink);
    line-height: 1;
    letter-spacing: 0.03em;
  }
  .tc-count {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 0.35rem;
    margin: 0.3rem 0 0.25rem;
  }
  .tc-days {
    font-family: "Dancing Script", cursive;
    font-size: 2.6rem;
    color: var(--pink-dark);
    line-height: 1;
  }
  .tc-unit {
    font-family: "Dancing Script", cursive;
    font-size: 1.05rem;
    color: var(--text-light);
  }
  .tc-sub {
    font-size: 0.82rem;
    color: var(--text-light);
    line-height: 1.4;
  }
  .tc-since {
    display: block;
    opacity: 0.6;
    font-size: 0.72rem;
    margin-top: 0.15rem;
  }

  @media (max-width: 767px) {
    .tc-trigger { width: 2.2rem; height: 2.2rem; font-size: 1.15rem; border-width: 1.2px; }
    .tc-popover { min-width: 14rem; padding: 0.85rem 1rem 0.95rem; }
    .tc-days { font-size: 2.2rem; }
    .tc-label { font-size: 1.15rem; }
  }
  @media (max-width: 480px) {
    .tc-trigger { width: 1.95rem; height: 1.95rem; font-size: 1rem; }
  }
`;

export default function TogetherCounter() {
  const [state, setState] = useState<Breakdown>(() => calcTogether(TOGETHER_START_DATE));
  const [open, setOpen] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 日付ロールオーバーに追従
  useEffect(() => {
    const id = window.setInterval(() => setState(calcTogether(TOGETHER_START_DATE)), 60_000);
    return () => window.clearInterval(id);
  }, []);

  // マイルストーン演出（100日刻み / 記念日）
  useEffect(() => {
    const { totalDays, months, days } = state;
    if (totalDays <= 0) return;
    const isAnniversary = months === 0 && days === 0;
    const isHundred = totalDays % 100 === 0;
    if (!isAnniversary && !isHundred) return;

    const fire = () =>
      confetti({
        particleCount: 70,
        spread: 65,
        colors: ["#e68ab6", "#ffd1e0", "#fff0f5", "#f9c8d9", "#ff9ec4"],
        origin: { y: 0.25 },
      });
    fire();
    const t = window.setTimeout(fire, 1800);
    return () => window.clearTimeout(t);
    // 初回マウント時のみ判定すれば十分
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // モバイル用：ポップオーバー外タップで閉じる
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  const { totalDays, years, months, days } = state;
  const breakdown = [
    years > 0 ? `${years}年` : "",
    months > 0 ? `${months}ヶ月` : "",
    `${days}日`,
  ]
    .filter(Boolean)
    .join("");

  return (
    <div
      ref={ref}
      className="tc-wrap"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <style>{css}</style>
      <button
        type="button"
        className="tc-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label="Together counter"
        aria-expanded={open}
      >
        {imgFailed ? (
          "👫"
        ) : (
          <img
            src={ICON_SRC}
            alt=""
            className="tc-trigger-img"
            onError={() => setImgFailed(true)}
            draggable={false}
          />
        )}
      </button>
      {open && (
        <div className="tc-popover" role="tooltip">
          <div className="tc-label">✨ Together ✨</div>
          <div className="tc-count">
            <span className="tc-days">{totalDays.toLocaleString()}</span>
            <span className="tc-unit">days</span>
          </div>
          <div className="tc-sub">
            {breakdown}
            <span className="tc-since">since {TOGETHER_START_DATE}</span>
          </div>
        </div>
      )}
    </div>
  );
}
