import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import HTMLFlipBook from "react-pageflip";
import { handleButtonClick } from "../utils/handleButtonClick";
import { useAuth } from "../contexts/AuthContext";
import SeriesArchive from "../components/SeriesArchive";
import EventGallery from "../components/EventGallery";
import Collapsible from "../components/Collapsible";
import type { Event } from "../types";

// ========================================
// Birthday template (year-agnostic)
// 年ごとの差分は event.customData (BirthdayCustomData) で受け取り、
// 1枚のテンプレートで毎年のイベントを描画する。
// ========================================

interface Props {
  event: Event;
}

// 各年の誕生日イベントが event.customData に持つ差分データの形。
export interface BirthdayCustomData {
  // 主役の名前（"Happy Birthday {name}" / "{name}'s Birthday" に使用）
  name?: string;
  // ヒーロー上部に出すカップル名など（例: "Ryo & Remina"）
  coupleName?: string;
  // 生まれ年。これと event.date の年から年齢を自動計算する。
  birthYear?: number;
  // フリップブックに表示する画像URL（順序どおり）。空ならブック節を非表示。
  bookImages?: string[];
  // 旅行/デート情報。無ければ該当セクションを非表示。heading は折りたたみ見出し。
  trip?: { heading?: string; title?: string; dates?: string; message?: string };
  // フッターの一言。無ければ非表示。
  footerMessage?: string;
}

const BASE = import.meta.env.BASE_URL;

function launchConfetti() {
  confetti({ particleCount: 300, angle: 60, spread: 100, origin: { x: 0, y: 0.5 }, colors: ["#ff69b4", "#ffd700", "#87cefa"] });
  confetti({ particleCount: 300, angle: 120, spread: 100, origin: { x: 1, y: 0.5 }, colors: ["#ff69b4", "#ffd700", "#87cefa"] });
  confetti({ particleCount: 600, angle: 90, spread: 200, startVelocity: 50, origin: { x: 0.5, y: 0 }, colors: ["#ff69b4", "#ffffff", "#ffd700"] });
}

function useCountdown(dateStr: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isToday: false });
  const [celebrated, setCelebrated] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      const target = new Date(dateStr);
      const isToday =
        now.getFullYear() === target.getFullYear() &&
        now.getMonth() === target.getMonth() &&
        now.getDate() === target.getDate();

      if (isToday) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isToday: true });
        if (!celebrated) { launchConfetti(); setCelebrated(true); }
        return;
      }

      const diff = target.getTime() - now.getTime();
      if (diff > 0) {
        const s = Math.floor(diff / 1000);
        setTimeLeft({ days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60, isToday: false });
      }
    }, 1000);
    return () => clearInterval(id);
  }, [celebrated, dateStr]);

  return timeLeft;
}

export default function BirthdayTemplate({ event }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { days, hours, minutes, seconds, isToday } = useCountdown(event.date);
  const [cakeAnimating, setCakeAnimating] = useState(false);
  const [heartAnimating, setHeartAnimating] = useState(false);
  const cakeRef = useRef<HTMLElement>(null);
  const heartRef = useRef<HTMLElement>(null);
  const [winWidth, setWinWidth] = useState(() => window.innerWidth);
  // admin 用: 日付に関係なく当日（お祝い）表示をプレビューする
  const [previewToday, setPreviewToday] = useState(false);
  const showCelebration = isToday || previewToday;

  // ===== 年差分データの取り出し（無い場合は安全にフォールバック）=====
  const data = (event.customData ?? {}) as BirthdayCustomData;
  const eventYear = new Date(event.date).getFullYear();
  const name = data.name ?? event.title;
  const coupleName = data.coupleName ?? event.title;
  const age = typeof data.birthYear === "number" ? eventYear - data.birthYear : null;
  const bookImages = data.bookImages ?? [];
  const trip = data.trip;
  const hasTrip = !!(trip && (trip.title || trip.dates || trip.message));
  const tripHeading = trip?.heading ?? "思い出";
  const footerMessage = data.footerMessage ?? "";

  // このページだけ #root の幅制限を外す
  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    const prev = root.style.maxWidth;
    root.style.maxWidth = "100%";
    return () => { root.style.maxWidth = prev; };
  }, []);

  useEffect(() => {
    const handler = () => setWinWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const isPortrait = winWidth < 768;
  const bookPageWidth = isPortrait ? Math.min(winWidth - 80, 250) : 400;
  const bookPageHeight = Math.round(bookPageWidth * 1.4);

  // PCはReact_pageの設計を忠実に再現、モバイルは@mediaで上書き
  const css = `
    html { font-size: clamp(2px, 1.25vw, 16px); }
    .b26-body { background-color: #fff0f5; font-family: sans-serif; margin: 0; overflow-x: hidden; }

    /* === Header === */
    .b26-header {
      height: 5rem; width: 100%;
      background-color: rgba(207,220,231,0.4);
      position: fixed; top: 0; z-index: 10;
    }
    .b26-back-btn {
      font-size: 1.5rem; padding: 0.5rem 1rem;
      background: none; border: none; color: #e68ab6; cursor: pointer;
      float: left; margin-left: 0.5rem;
    }
    .b26-edit-btn {
      font-size: 1.6rem; font-family: 'Dancing Script', sans-serif;
      float: left; margin: 0.7rem 0 0 0.5rem;
      padding: 0.55rem 1.3rem;
      background-color: rgba(229,166,220,0.55); color: #fff;
      border-radius: 0.9rem; box-shadow: 0 0.3rem #cbcbcb;
      border: none; cursor: pointer;
    }
    .b26-edit-btn:active { position: relative; top: 0.3rem; box-shadow: none; }
    .b26-edit-btn:hover { background-color: rgba(229,166,220,0.78); }
    .b26-header-left { float: left; margin: 0 1.5rem; }
    #b26-cake {
      font-size: 4rem; color: #e2a8c4; margin: 0.7rem 0;
      transition: transform 0.2s ease, color 0.2s ease; cursor: pointer;
    }
    #b26-cake.bigcake { color: rgb(252,127,167); transform: scale(1.1); }
    .b26-header nav { float: left; }
    .b26-header-btn {
      font-size: 2rem; font-family: 'Dancing Script', sans-serif;
      float: left; margin: 0.7rem 1.5rem; padding: 0.7rem 2rem;
      background-color: rgba(229,166,220,0.7); color: #fff;
      border-radius: 1rem; box-shadow: 0 0.3rem #cbcbcb;
      border: none; cursor: pointer; text-decoration: none;
      display: inline-block;
    }
    .b26-header-btn:active { position: relative; top: 0.3rem; box-shadow: none; }
    .b26-header-btn:hover { background-color: rgba(229,166,220,0.85); }
    .b26-header-right {
      float: left; transition: all 0.5s;
      margin-top: 1rem; margin-right: 2rem;
    }
    .b26-header-right a {
      color: #e68ab6; font-size: 2rem; font-weight: bold;
      opacity: 0.8; text-decoration: none;
    }

    /* 中間幅では右端の名前リンクがヘッダ内に収まらず折り返すため非表示 */
    @media (max-width: 1100px) {
      .b26-header-right { display: none; }
    }

    /* === Main === */
    .b26-main {
      height: auto; min-height: calc(100vh - 5rem); width: 100%; margin-top: 5rem;
      background-image: url("${BASE}images/background_main.webp");
      background-size: cover; background-position: center 15%;
      background-repeat: no-repeat;
      text-align: center;
      display: flex; flex-direction: column; justify-content: center;
    }
    #b26-first {
      font-size: 8rem; font-family: 'Dancing Script', sans-serif;
      letter-spacing: 0.8rem; color: rgb(241,230,238); opacity: 0.9;
      padding: 3rem 0 8rem 0; margin: 0;
    }
    #b26-countdown {
      padding: 3rem 0; font-size: 6rem;
      font-family: 'Dancing Script', sans-serif; font-weight: bold;
      background-color: rgba(255,255,255,0.3);
      color: rgb(200,247,255); opacity: 0.9; letter-spacing: 0.1rem;
    }
    .b26-cdtime { font-family: sans-serif; font-size: 4rem; }
    .b26-birthday-script { font-size: 8rem; font-weight: 1000; color: rgb(200,247,255); }
    .b26-birthday-num { font-family: 'HappyBirthday'; font-size: 12rem; font-weight: 100; color: rgb(200,247,255); }

    /* === Book === */
    .b26-book-section {
      width: 100%; height: 60rem;
      background-color: #f9f0d7; text-align: center;
    }
    .book { margin: 0 auto; }
    .b26-booksection-title {
      font-family: 'Dancing Script', cursive;
      color: rgba(230,138,182,0.8);
      font-size: 5rem;
      padding-top: 8rem; padding-bottom: 3rem; margin: 0;
    }

    /* === Memories === */
    .b26-memories {
      padding: 5rem 0 8rem 0; height: auto;
      text-align: center; width: 85%; margin: 0 auto;
    }
    .b26-memory-title {
      font-family: 'Dancing Script', cursive;
      color: rgba(230,138,182,0.8);
      font-size: 5rem;
      padding-top: 8rem; padding-bottom: 3rem; margin: 0;
    }
    .b26-galleries {
      background: linear-gradient(90deg, #b39855 0%, #fff9e6 50%, #b39855 100%);
      border: 0.7rem solid #c9c9c9;
      padding: 1rem 1rem 3rem 1rem;
      margin-bottom: 8rem;
    }
    .b26-gallery-title {
      font-size: 3rem; font-family: 'Kaushan Script', cursive;
      color: rgb(167,167,167);
    }
    .b26-pic-gallery {
      display: flex; overflow-x: auto;
      scroll-snap-type: x mandatory; gap: 1rem; padding: 2rem;
    }
    .b26-pic-gallery img {
      height: 20rem; border: 0.25rem solid rgb(128,128,128);
      border-radius: 1rem; scroll-snap-align: start;
      object-fit: cover; flex-shrink: 0;
    }

    /* === Trip === */
    #b26-trip {
      height: 50rem; margin: 0;
      background-image: url("${BASE}images/Trip.webp");
      background-size: cover; background-position: center;
      background-repeat: no-repeat;
    }
    .b26-trip-title {
      text-align: center; font-family: 'Dancing Script', cursive;
      font-size: 4.5rem; color: rgb(224,143,81);
      padding-top: 6rem; margin: 0;
    }
    .b26-trip-message {
      text-align: center; font-style: italic;
      font-family: 'Dancing Script', cursive;
      margin: 0 8rem; padding: 2rem; line-height: 1.8;
      color: rgb(255,255,255); font-size: 5rem;
      animation: b26blink 2s infinite;
    }
    @keyframes b26blink { 0%,100%{opacity:1} 50%{opacity:0.4} }

    /* === New memories (Storage) === */
    .b26-new-memories {
      padding: 5rem 0 8rem 0; text-align: center;
      width: 85%; margin: 0 auto;
    }
    .b26-new-gallery {
      display: flex; overflow-x: auto;
      scroll-snap-type: x mandatory; gap: 1rem; padding: 2rem;
    }
    .b26-new-gallery img {
      height: 20rem; border-radius: 1rem;
      scroll-snap-align: start;
      object-fit: cover; flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      cursor: zoom-in;
      transition: transform 0.2s ease;
    }
    .b26-new-gallery img:hover { transform: scale(1.02); }

    .b26-lightbox {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.85); display: flex;
      align-items: center; justify-content: center;
      padding: 1rem;
    }
    .b26-lightbox-inner {
      position: relative; max-width: 95%; max-height: 95%;
      width: 100%; display: flex; align-items: center; justify-content: center;
    }
    .b26-lightbox-inner img {
      max-width: 100%; max-height: 100%; border-radius: 1rem;
      box-shadow: 0 0 40px rgba(0,0,0,0.4);
    }
    .b26-lightbox-close {
      position: absolute; top: 0.75rem; right: 0.75rem;
      z-index: 1; border: none; background: rgba(255,255,255,0.95);
      color: #333; font-size: 2rem; width: 3rem; height: 3rem;
      border-radius: 50%; cursor: pointer; line-height: 1; padding: 0;
    }
    .b26-lightbox-close:hover { background: rgba(255,255,255,1); }

    /* === Footer === */
    .b26-footer { height: 12rem; padding-top: 3rem; }
    .b26-footer-left {
      font-size: 5rem; color: rgb(249,119,156);
      margin-left: 5rem; float: left;
    }
    #b26-heart { transition: transform 0.2s ease, color 0.2s ease; cursor: pointer; }
    #b26-heart.bigheart { color: rgb(246,73,128); transform: scale(1.1); }
    .b26-footer-right {
      font-size: 2.5rem; padding-top: 2rem; padding-left: 5rem;
      float: left; color: rgb(254,139,181);
    }
    .b26-footer-end {
      font-size: 2rem; font-family: 'Dancing Script', cursive;
      margin-top: 7rem; margin-right: 3rem; float: right;
    }

    /* ========== Mobile (<= 767px) ========== */
    @media (max-width: 767px) {
      html { font-size: 13px; }

      /* Header: 1行に収まるようサイズダウン、右リンクは非表示 */
      .b26-header {
        height: auto; min-height: 3.5rem;
        padding: 0.3rem 0.2rem;
        display: flex; flex-wrap: wrap; align-items: center;
      }
      .b26-header-left, .b26-header nav, .b26-header-right { float: none; }
      .b26-header-left { margin: 0 0.4rem; }
      .b26-back-btn { float: none; font-size: 1.2rem; padding: 0.3rem 0.5rem; margin: 0; }
      .b26-edit-btn { float: none; font-size: 1rem; padding: 0.3rem 0.7rem; margin: 0.2rem 0.25rem; box-shadow: 0 0.15rem #cbcbcb; }
      .b26-header-btn {
        float: none; font-size: 1rem; padding: 0.35rem 0.8rem;
        margin: 0.2rem 0.25rem; border-radius: 0.6rem;
        box-shadow: 0 0.15rem #cbcbcb;
      }
      #b26-cake { font-size: 1.8rem; margin: 0.2rem 0.3rem; }
      .b26-header-right { display: none; }

      /* Main: タイトルとカウントダウンを画面に収める */
      .b26-main { margin-top: 5rem; min-height: 50vh; padding: 0 0.5rem; }
      #b26-first {
        font-size: 3.5rem; letter-spacing: 0.15rem;
        padding: 1.5rem 0 2.5rem 0;
      }
      #b26-countdown {
        font-size: 2.3rem; padding: 1.5rem 0.6rem;
        border-radius: 0.5rem; letter-spacing: 0;
      }
      .b26-cdtime { font-size: 1.8rem; }
      .b26-birthday-script { font-size: 3rem; }
      .b26-birthday-num { font-size: 5rem; }

      /* Book: 動的サイズに合わせて高さauto */
      .b26-book-section {
        height: auto; padding: 2.5rem 0 3rem;
      }
      .b26-booksection-title {
        font-size: 2.8rem;
        padding-top: 0; padding-bottom: 2rem;
      }

      /* Memories */
      .b26-memories, .b26-new-memories {
        width: 95%; padding: 2.5rem 0 4rem;
      }
      .b26-memory-title {
        font-size: 2.8rem;
        padding-top: 2rem; padding-bottom: 2rem;
      }
      .b26-galleries {
        padding: 0.5rem 0.4rem 1.2rem;
        margin-bottom: 3rem; border-width: 0.25rem;
      }
      .b26-gallery-title { font-size: 1.6rem; }
      .b26-pic-gallery { padding: 1rem 0.5rem; gap: 0.5rem; }
      .b26-pic-gallery img { height: 10rem; border-width: 0.15rem; border-radius: 0.5rem; }
      .b26-new-gallery { padding: 1rem 0.5rem; gap: 0.5rem; }
      .b26-new-gallery img { height: 11rem; }

      /* Trip */
      #b26-trip {
        height: auto; min-height: 22rem;
        padding: 3rem 0; display: flex;
        flex-direction: column; justify-content: center;
      }
      .b26-trip-title { font-size: 2.5rem; padding-top: 0; }
      .b26-trip-message {
        font-size: 2rem; margin: 0 1rem;
        padding: 1rem; line-height: 1.5;
      }

      /* Footer: floatを解除してflex */
      .b26-footer {
        height: auto; padding: 1.2rem 1rem;
        display: flex; flex-wrap: wrap;
        align-items: center; gap: 0.8rem;
      }
      .b26-footer-left {
        font-size: 2.2rem; margin-left: 0;
        float: none; line-height: 1;
      }
      .b26-footer-right {
        font-size: 1.1rem; padding: 0;
        float: none; flex: 1; min-width: 8rem;
      }
      .b26-footer-end {
        font-size: 1rem; margin: 0;
        float: none; margin-left: auto;
      }
    }
  `;

  return (
    <div className="b26-body">
      <style>{css}</style>

      {/* Header */}
      <header className="b26-header">
        <button className="b26-back-btn" onClick={() => navigate("/")}>←</button>
        {user.state === "admin" && (
          <button className="b26-edit-btn" onClick={() => navigate(`/events/${event.id}/edit`)}>Edit</button>
        )}
        <div className="b26-header-left">
          <i ref={cakeRef} id="b26-cake" className="fa-solid fa-cake-candles"
            onClick={() => handleButtonClick(cakeRef.current, setCakeAnimating, cakeAnimating, "bigcake")} />
        </div>
        <nav>
          <a href="#b26-countdown" className="b26-header-btn"
            onClick={(e) => { e.preventDefault(); document.getElementById("b26-countdown")?.scrollIntoView({ behavior: "smooth" }); }}>
            Countdown
          </a>
          {hasTrip && (
            <a href="#b26-trip" className="b26-header-btn"
              onClick={(e) => { e.preventDefault(); document.getElementById("b26-trip")?.scrollIntoView({ behavior: "smooth" }); }}>
              Date
            </a>
          )}
        </nav>
        <div className="b26-header-right">
          <a href="#b26-first"
            onClick={(e) => { e.preventDefault(); document.getElementById("b26-first")?.scrollIntoView({ behavior: "smooth" }); }}>
            {name}'s Birthday
          </a>
        </div>
      </header>

      {/* Main Section */}
      <div className="b26-main">
        <h1 id="b26-first">{coupleName}</h1>
        <div id="b26-countdown">
          {showCelebration ? (
            <>
              🎉 <span className="b26-birthday-script">Happy Birthday</span> 🎉<br />
              <span className="b26-birthday-script">{"　"}{name}</span>
              {age !== null && <span className="b26-birthday-num">{age}</span>}
            </>
          ) : (
            <>
              Countdown to Birthday:<br />
              <span className="b26-cdtime">
                {days} days {String(hours).padStart(2, "0")}:
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Book Section（折りたたみ） */}
      {bookImages.length > 0 && (
        <Collapsible title="Book" accent="rgba(230,138,182,0.9)" defaultOpen>
        <div className="b26-book-section" style={{ height: "auto", paddingBottom: "3rem" }}>
          {/* @ts-expect-error swipeDistance prop is required by typings but works fine without it */}
          <HTMLFlipBook
            width={bookPageWidth} height={bookPageHeight} size="fixed"
            minWidth={150} maxWidth={1000} minHeight={200} maxHeight={1536}
            maxShadowOpacity={isPortrait ? 0.3 : 0.5}
            showCover={false} mobileScrollSupport={true}
            startPage={0} drawShadow={true} flippingTime={isPortrait ? 600 : 1000}
            usePortrait={isPortrait} startZIndex={0} autoSize={false}
            clickEventForward={true} useMouseEvents={true}
            showPageCorners={true} disableFlipByClick={false}
            style={{}} className="book"
          >
            {bookImages.map((src, i) => (
              <div key={i} className="page">
                <img
                  src={src} width={bookPageWidth} height={bookPageHeight} alt=""
                  loading={i === 0 ? "eager" : "lazy"} decoding="async"
                />
              </div>
            ))}
          </HTMLFlipBook>
        </div>
        </Collapsible>
      )}

      {/* Trip Section（折りたたみ・既定で閉じる） */}
      {hasTrip && (
        <Collapsible title={tripHeading} accent="rgb(224,143,81)" defaultOpen={false}>
          <div id="b26-trip">
            <h2 className="b26-trip-title">
              {trip?.title}
              {trip?.dates && <><br />{trip.dates}</>}
            </h2>
            {trip?.message && (
              <div className="b26-trip-message">
                <p>{trip.message}</p>
              </div>
            )}
          </div>
        </Collapsible>
      )}

      {/* Memories（現在 + 同シリーズの過去年を統合したギャラリー） */}
      <div style={{ padding: "3rem 0" }}>
        <EventGallery event={event} accent="#e68ab6" title="Memories" />
      </div>

      {/* 同シリーズ（過去年）の思い出アーカイブ */}
      <SeriesArchive event={event} accent="#e68ab6" />

      {/* Footer */}
      <footer className="b26-footer">
        <div className="b26-footer-left">
          <i ref={heartRef} id="b26-heart" className="fa-solid fa-heart"
            onClick={() => handleButtonClick(heartRef.current, setHeartAnimating, heartAnimating, "bigheart")} />
        </div>
        {footerMessage && <div className="b26-footer-right">{footerMessage}</div>}
        <p className="b26-footer-end">Created by Ryo</p>
      </footer>

      {/* 動作確認用: 当日（お祝い）表示プレビュー切替。開発時のみ表示され、本番ビルドには含まれない */}
      {import.meta.env.DEV && (
        <button
          type="button"
          onClick={() => setPreviewToday((v) => !v)}
          style={{
            position: "fixed",
            right: "1rem",
            bottom: "1rem",
            zIndex: 50,
            padding: "0.5rem 0.9rem",
            borderRadius: "999px",
            border: "none",
            background: previewToday ? "#e68ab6" : "rgba(255,255,255,0.92)",
            color: previewToday ? "#fff" : "#e68ab6",
            fontSize: "0.8rem",
            fontWeight: 700,
            boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
            cursor: "pointer",
            backdropFilter: "blur(6px)",
          }}
        >
          {previewToday ? "🎉 当日プレビュー中" : "🎂 当日表示をプレビュー"}
        </button>
      )}
    </div>
  );
}
