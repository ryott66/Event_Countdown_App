import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
// @ts-ignore
import HTMLFlipBook from "react-pageflip";
import { handleButtonClick } from "../utils/handleButtonClick";
import { useAuth } from "../contexts/AuthContext";
import type { Event } from "../types";

// ========================================
// Remina's Birthday 2026
// 去年のReact_Pageを引き継いだカスタムページ
// ========================================

interface Props {
  event: Event;
}

const BASE = import.meta.env.BASE_URL;
const MIRROR_IMAGES = Array.from({ length: 17 }, (_, i) => `${BASE}images/mirror-gallery/mirror${String(i + 1).padStart(2, "0")}.jpeg`);
const CUTE_IMAGES = Array.from({ length: 27 }, (_, i) => `${BASE}images/cute-gallery/cute${String(i + 1).padStart(2, "0")}.jpg`);
const BOOK_IMAGES = [
  `${BASE}images/book-image/first.png`,
  `${BASE}images/book-image/book1.png`,
  `${BASE}images/book-image/book2.png`,
  `${BASE}images/book-image/book3.png`,
  `${BASE}images/book-image/book4.png`,
  `${BASE}images/book-image/book5.png`,
  `${BASE}images/book-image/book6.png`,
  `${BASE}images/book-image/book7.png`,
  `${BASE}images/book-image/book8.png`,
  `${BASE}images/book-image/last.png`,
];

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

export default function Birthday2026({ event }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { days, hours, minutes, seconds, isToday } = useCountdown(event.date);
  const [cakeAnimating, setCakeAnimating] = useState(false);
  const [heartAnimating, setHeartAnimating] = useState(false);
  const cakeRef = useRef<HTMLElement>(null);
  const heartRef = useRef<HTMLElement>(null);

  // このページだけ #root の幅制限を外す
  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    const prev = root.style.maxWidth;
    root.style.maxWidth = "100%";
    return () => { root.style.maxWidth = prev; };
  }, []);

  // インラインスタイル（去年のCSSを移植）
  const css = `
    html { font-size: clamp(2px, 1.25vw, 16px); }
    .b26-body { background-color: #fff0f5; font-family: sans-serif; margin: 0; overflow-x: hidden; }
    .b26-header { height: 5rem; width: 100%; background-color: rgba(207,220,231,0.4); position: fixed; top: 0; z-index: 10; display:flex; align-items:center; }
    .b26-back-btn { font-size: 1.5rem; margin: 0 0.5rem; padding: 0.5rem 1rem; background: none; border: none; color: #e68ab6; cursor: pointer; }
    .b26-header-btn { font-size: 2rem; font-family: 'Dancing Script', sans-serif; margin: 0.7rem 0.8rem; padding: 0.7rem 2rem; background-color: rgba(229,166,220,0.7); color: #fff; border-radius: 1rem; box-shadow: 0 0.3rem #cbcbcb; border: none; cursor: pointer; text-decoration: none; }
    .b26-header-btn:active { position: relative; top: 0.3rem; box-shadow: none; }
    .b26-header-right a { color: #e68ab6; font-size: 2rem; font-weight: bold; opacity: 0.8; text-decoration: none; margin-left: 1rem; }
    #b26-cake { font-size: 4rem; color: #e2a8c4; margin: 0.7rem 0.5rem; transition: transform 0.2s ease, color 0.2s ease; cursor: pointer; }
    #b26-cake.bigcake { color: rgb(252,127,167); transform: scale(1.1); }
    .b26-main { width: 100%; margin-top: 5rem; background-image: url("${BASE}images/background_main.jpg"); background-size: cover; background-repeat: no-repeat; text-align: center; }
    #b26-first { font-size: 8rem; font-family: 'Dancing Script', sans-serif; letter-spacing: 0.8rem; color: rgb(241,230,238); opacity: 0.9; padding: 3rem 0 8rem; margin: 0; }
    #b26-countdown { padding: 3rem 1rem; font-size: 5rem; font-family: 'Dancing Script', sans-serif; font-weight: bold; background-color: rgba(255,255,255,0.3); color: rgb(200,247,255); opacity: 0.9; letter-spacing: 0.1rem; }
    .b26-cdtime { font-family: sans-serif; font-size: 3rem; }
    .b26-birthday-script { font-size: 7rem; font-weight: 1000; color: rgb(200,247,255); }
    .b26-birthday-num { font-family: 'HappyBirthday'; font-size: 10rem; font-weight: 100; color: rgb(200,247,255); }
    .b26-book-section { width: 100%; height: 60rem; background-color: #f9f0d7; text-align: center; display: flex; flex-direction: column; align-items: center; }
    .book { margin: 0 auto; }
    .b26-booksection-title { font-family: 'Dancing Script', cursive; color: rgba(230,138,182,0.8); font-size: 5rem; padding-top: 8rem; padding-bottom: 3rem; margin: 0; }
    .b26-memories { padding: 5rem 0 8rem; height: auto; text-align: center; width: 85%; margin: 0 auto; }
    .b26-memory-title { font-family: 'Dancing Script', cursive; color: rgba(230,138,182,0.8); font-size: 5rem; padding-top: 8rem; padding-bottom: 3rem; margin: 0; }
    .b26-galleries { background: linear-gradient(90deg, #b39855 0%, #fff9e6 50%, #b39855 100%); border: 0.7rem solid #c9c9c9; padding: 1rem 1rem 3rem; margin-bottom: 8rem; }
    .b26-gallery-title { font-size: 3rem; font-family: 'Kaushan Script', cursive; color: rgb(167,167,167); }
    .b26-pic-gallery { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 1rem; padding: 2rem; }
    .b26-pic-gallery img { height: 20rem; border: 0.25rem solid rgb(128,128,128); border-radius: 1rem; scroll-snap-align: start; object-fit: cover; flex-shrink: 0; }
    #b26-trip { height: 50rem; background-image: url("${BASE}images/Trip.jpg"); background-size: cover; background-repeat: no-repeat; }
    .b26-trip-title { text-align: center; font-family: 'Dancing Script', cursive; font-size: 4.5rem; color: rgb(224,143,81); padding-top: 6rem; margin: 0; }
    .b26-trip-message { text-align: center; font-style: italic; font-family: 'Dancing Script', cursive; margin: 0 8rem; padding: 2rem; line-height: 1.8; color: rgb(255,255,255); font-size: 5rem; animation: b26blink 2s infinite; }
    @keyframes b26blink { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .b26-footer { height: 12rem; padding-top: 3rem; }
    .b26-footer-left { font-size: 5rem; color: rgb(249,119,156); margin-left: 5rem; float: left; }
    #b26-heart { transition: transform 0.2s ease, color 0.2s ease; cursor: pointer; }
    #b26-heart.bigheart { color: rgb(246,73,128); transform: scale(1.1); }
    .b26-footer-right { font-size: 2.5rem; padding-top: 2rem; padding-left: 5rem; float: left; color: rgb(254,139,181); }
    .b26-footer-end { font-size: 2rem; font-family: 'Dancing Script', cursive; margin-top: 7rem; margin-right: 3rem; float: right; }
    .b26-new-memories { padding: 5rem 0 8rem; text-align: center; width: 85%; margin: 0 auto; }
    .b26-new-gallery { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 1rem; padding: 2rem; }
    .b26-new-gallery img { height: 20rem; border-radius: 1rem; scroll-snap-align: start; object-fit: cover; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  `;

  return (
    <div className="b26-body">
      <style>{css}</style>

      {/* Header */}
      <header className="b26-header">
        <button className="b26-back-btn" onClick={() => navigate("/")}>←</button>
        {user.state === "admin" && (
          <button className="b26-back-btn" onClick={() => navigate(`/events/${event.id}/edit`)}>Edit</button>
        )}
        <div>
          <i ref={cakeRef} id="b26-cake" className="fa-solid fa-cake-candles"
            onClick={() => handleButtonClick(cakeRef.current, setCakeAnimating, cakeAnimating, "bigcake")} />
        </div>
        <nav>
          <a href="#b26-countdown" className="b26-header-btn"
            onClick={(e) => { e.preventDefault(); document.getElementById("b26-countdown")?.scrollIntoView({ behavior: "smooth" }); }}>
            Countdown
          </a>
          <a href="#b26-memories" className="b26-header-btn"
            onClick={(e) => { e.preventDefault(); document.getElementById("b26-memories")?.scrollIntoView({ behavior: "smooth" }); }}>
            Memories
          </a>
          <a href="#b26-trip" className="b26-header-btn"
            onClick={(e) => { e.preventDefault(); document.getElementById("b26-trip")?.scrollIntoView({ behavior: "smooth" }); }}>
            Date
          </a>
        </nav>
        <div className="b26-header-right">
          <a href="#b26-first"
            onClick={(e) => { e.preventDefault(); document.getElementById("b26-first")?.scrollIntoView({ behavior: "smooth" }); }}>
            Remina's Birthday
          </a>
        </div>
      </header>

      {/* Main Section */}
      <div className="b26-main">
        <h1 id="b26-first">Ryo &amp; Remina</h1>
        <div id="b26-countdown">
          {isToday ? (
            <>
              🎉 <span className="b26-birthday-script">Happy Birthday</span> 🎉<br />
              <span className="b26-birthday-script">　Remina</span>
              {/* 年齢：来年は24に変える */}
              <span className="b26-birthday-num">23</span>
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

      {/* Book Section */}
      <div className="b26-book-section">
        <h2 className="b26-booksection-title">Book</h2>
        {/* @ts-ignore */}
        <HTMLFlipBook
          width={400} height={560} size="fixed"
          minWidth={315} maxWidth={1000} minHeight={400} maxHeight={1536}
          maxShadowOpacity={0.5} showCover={true} mobileScrollSupport={true}
          startPage={0} drawShadow={true} flippingTime={1000}
          usePortrait={false} startZIndex={0} autoSize={true}
          clickEventForward={true} useMouseEvents={true}
          showPageCorners={true} disableFlipByClick={false}
          style={{}} className="book"
        >
          {BOOK_IMAGES.map((src, i) => (
            <div key={i} className="page">
              <img src={src} width={400} height={560} alt="" />
            </div>
          ))}
        </HTMLFlipBook>
      </div>

      {/* Memories（去年の固定ギャラリー） */}
      <div id="b26-memories" className="b26-memories">
        <h2 className="b26-memory-title">Memories</h2>
        <div className="b26-galleries">
          <p className="b26-gallery-title">Mirror Moments</p>
          <div className="b26-pic-gallery">
            {MIRROR_IMAGES.map((src, i) => <img key={i} src={src} alt={`Mirror ${i + 1}`} />)}
          </div>
        </div>
        <div className="b26-galleries">
          <p className="b26-gallery-title">Cutest Moments</p>
          <div className="b26-pic-gallery">
            {CUTE_IMAGES.map((src, i) => <img key={i} src={src} alt={`Cute ${i + 1}`} />)}
          </div>
        </div>
      </div>

      {/* Trip Section */}
      <div id="b26-trip">
        {/* タイトルと内容はここを変えてください */}
        <h2 className="b26-trip-title">Karuizawa<br />6/26~6/27</h2>
        <div className="b26-trip-message">
          <p>Thank you</p>
        </div>
      </div>

      {/* 2026 Memories（Storageの新しい写真） */}
      {event.imageUrls?.length > 0 && (
        <div className="b26-new-memories">
          <h2 className="b26-memory-title">2026 Memories</h2>
          <div className="b26-new-gallery">
            {event.imageUrls.map((url, i) => <img key={i} src={url} alt="" />)}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="b26-footer">
        <div className="b26-footer-left">
          <i ref={heartRef} id="b26-heart" className="fa-solid fa-heart"
            onClick={() => handleButtonClick(heartRef.current, setHeartAnimating, heartAnimating, "bigheart")} />
        </div>
        <div className="b26-footer-right">大好きなれみちゃん、いつもありがとう😄</div>
        <p className="b26-footer-end">Created by Ryo</p>
      </footer>
    </div>
  );
}
