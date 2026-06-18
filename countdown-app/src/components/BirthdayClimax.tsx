import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

// Happy Birthday 画面で開封できるプレゼント1つ分
export interface ClimaxGift {
  // ヒントの絵文字（複数可: "🚢🏨" など）
  emoji?: string;
  title: string;
  detail?: string;
}

interface Props {
  name: string;
  age: number | null;
  imageUrls: string[];
  accent?: string;
  // Happy Birthday 画面に並べる開封式プレゼント
  gifts?: ClimaxGift[];
  // 「このサイトについて」カードの見出し・本文（未指定なら既定文）
  aboutTitle?: string;
  aboutMessage?: string;
  // 「サイトを見る」/ スキップ で本編へ戻る
  onClose: () => void;
}

type Scene = "gift" | "celebrate" | "slideshow" | "about";

const SLIDE_MS = 4000;

const DEFAULT_ABOUT_TITLE = "このサイトについて";
const DEFAULT_ABOUT_MESSAGE =
  "これは大切な日をカウントダウンするアプリだよ。\n" +
  "イベントごとに写真やメッセージを残せて、毎年の思い出が少しずつ積み重なっていくよ。\n" +
  "これからの記念日も一緒に増やしていこうね。";

function launchConfetti() {
  confetti({ particleCount: 300, angle: 60, spread: 100, origin: { x: 0, y: 0.5 }, colors: ["#ff69b4", "#ffd700", "#87cefa"] });
  confetti({ particleCount: 300, angle: 120, spread: 100, origin: { x: 1, y: 0.5 }, colors: ["#ff69b4", "#ffd700", "#87cefa"] });
  confetti({ particleCount: 600, angle: 90, spread: 200, startVelocity: 50, origin: { x: 0.5, y: 0 }, colors: ["#ff69b4", "#ffffff", "#ffd700"] });
}

// 誕生日当日のクライマックス演出オーバーレイ。
// gift（タップで開封）→ celebrate（お祝い＋紙吹雪）→ slideshow（Ken Burns）→ about（アプリ説明）→ 本編へ。
export default function BirthdayClimax({
  name,
  age,
  imageUrls,
  accent = "#e68ab6",
  gifts = [],
  aboutTitle = DEFAULT_ABOUT_TITLE,
  aboutMessage = DEFAULT_ABOUT_MESSAGE,
  onClose,
}: Props) {
  const [scene, setScene] = useState<Scene>("gift");
  const [index, setIndex] = useState(0);
  const [openedGifts, setOpenedGifts] = useState<boolean[]>(() => gifts.map(() => false));
  const hasPhotos = imageUrls.length > 0;

  // 背景スクロールをロック
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // slideshow を自動送り。最後の1枚を表示し終えたら about へ。
  useEffect(() => {
    if (scene !== "slideshow") return;
    const t = setTimeout(() => {
      if (index < imageUrls.length - 1) setIndex(index + 1);
      else setScene("about");
    }, SLIDE_MS);
    return () => clearTimeout(t);
  }, [scene, index, imageUrls.length]);

  const openGift = () => {
    if (scene !== "gift") return;
    launchConfetti();
    setScene("celebrate");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "linear-gradient(160deg, #1b1230 0%, #3a1d4d 50%, #6d2b57 100%)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes bc-drop { 0% { transform: translateY(-120vh) rotate(-12deg); } 60% { transform: translateY(4vh) rotate(6deg); } 80% { transform: translateY(-2vh) rotate(-3deg); } 100% { transform: translateY(0) rotate(0); } }
        @keyframes bc-wobble { 0%,100% { transform: rotate(-4deg) scale(1); } 50% { transform: rotate(4deg) scale(1.05); } }
        @keyframes bc-pop { 0% { transform: scale(0.6); opacity: 0; } 60% { transform: scale(1.12); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes bc-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bc-kenburns { 0% { transform: scale(1.08) translate(2%, 1%); } 100% { transform: scale(1.28) translate(-2%, -2%); } }
        .bc-skip { transition: opacity 0.2s ease; opacity: 0.7; }
        .bc-skip:hover { opacity: 1; }
        .bc-btn { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .bc-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(0,0,0,0.35); }
      `}</style>

      {/* スキップ */}
      {scene !== "about" && (
        <button
          type="button"
          className="bc-skip"
          onClick={onClose}
          style={{
            position: "absolute", top: "1rem", right: "1rem", zIndex: 2,
            background: "rgba(255,255,255,0.15)", color: "#fff",
            border: "1px solid rgba(255,255,255,0.3)", borderRadius: "999px",
            padding: "0.35rem 0.9rem", fontSize: "0.8rem", cursor: "pointer",
            backdropFilter: "blur(6px)",
          }}
        >
          スキップ
        </button>
      )}

      {/* === gift === */}
      {scene === "gift" && (
        <div onClick={openGift} style={{ cursor: "pointer", padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ fontSize: "clamp(6rem, 30vw, 12rem)", lineHeight: 1, animation: "bc-drop 1.1s cubic-bezier(.5,1.4,.5,1) both" }}>
            🎁
          </div>
          <div style={{ animation: "bc-wobble 1.4s ease-in-out infinite", fontSize: "clamp(1.1rem, 5vw, 1.6rem)", fontWeight: 700, opacity: 0.95 }}>
            タップして開けてね 🎀
          </div>
        </div>
      )}

      {/* === celebrate === */}
      {scene === "celebrate" && (
        <div style={{ animation: "bc-pop 0.7s ease both", padding: "2rem 1.25rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", width: "100%", maxHeight: "100dvh", overflowY: "auto" }}>
          <div style={{ fontSize: "clamp(1.8rem, 8vw, 3rem)" }}>🎉🎂🎉</div>
          <div style={{ fontFamily: '"Dancing Script", cursive', fontSize: "clamp(2.6rem, 12vw, 5rem)", color: "#ffe3f1", lineHeight: 1.1 }}>
            Happy Birthday
          </div>
          <div style={{ fontFamily: '"Dancing Script", cursive', fontSize: "clamp(2rem, 9vw, 3.5rem)", color: "#fff" }}>
            {name}
          </div>
          {age !== null && (
            <div style={{ fontSize: "clamp(1rem, 5vw, 1.4rem)", opacity: 0.85, marginTop: "0.5rem" }}>
              🎈 {age} 歳おめでとう 🎈
            </div>
          )}

          {/* 開封式プレゼント */}
          {gifts.length > 0 && (
            <div style={{ marginTop: "1.5rem", width: "min(98vw, 760px)" }}>
              <div style={{ display: "flex", flexWrap: "nowrap", justifyContent: "center", gap: "0.6rem" }}>
                {gifts.map((g, i) => {
                  const opened = openedGifts[i];
                  return (
                    <button
                      key={i}
                      type="button"
                      className="bc-btn"
                      onClick={() => setOpenedGifts((prev) => prev.map((v, j) => (j === i ? true : v)))}
                      aria-expanded={opened}
                      style={{
                        flex: "1 1 0",
                        minWidth: 0,
                        aspectRatio: "1 / 1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: opened
                          ? `linear-gradient(135deg, ${accent}40, rgba(255,255,255,0.06))`
                          : "rgba(255,255,255,0.08)",
                        border: `1px solid ${accent}66`,
                        borderRadius: "18px",
                        padding: "0.4rem",
                        color: "#fff",
                        cursor: opened ? "default" : "pointer",
                        textAlign: "center",
                        overflow: "hidden",
                      }}
                    >
                      {opened ? (
                        <div style={{ animation: "bc-pop 0.4s ease both", display: "flex", flexDirection: "column", gap: "0.3rem", alignItems: "center", maxWidth: "100%" }}>
                          <div style={{ fontSize: "clamp(1.3rem, 6vw, 2.6rem)", lineHeight: 1.15 }}>{g.emoji ?? "🎁"}</div>
                          <div style={{ fontWeight: 700, fontSize: "clamp(0.78rem, 3.4vw, 1.15rem)" }}>{g.title}</div>
                          {g.detail && <div style={{ fontSize: "0.8rem", opacity: 0.9, lineHeight: 1.4, whiteSpace: "pre-line" }}>{g.detail}</div>}
                        </div>
                      ) : (
                        <div style={{ fontSize: "clamp(2.2rem, 11vw, 3.6rem)", lineHeight: 1, animation: "bc-wobble 1.6s ease-in-out infinite" }}>🎁</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="button"
            className="bc-btn"
            onClick={() => setScene(hasPhotos ? "slideshow" : "about")}
            style={{
              marginTop: "1.5rem", background: accent, color: "#fff", border: "none",
              borderRadius: "999px", padding: "0.6rem 1.6rem", fontSize: "0.95rem", fontWeight: 700,
              cursor: "pointer", boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            }}
          >
            つづける →
          </button>
        </div>
      )}

      {/* === slideshow（Ken Burns） === */}
      {scene === "slideshow" && hasPhotos && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#000" }}>
          <img
            key={index}
            src={imageUrls[index]}
            alt=""
            decoding="async"
            style={{
              width: "100%", height: "100%", objectFit: "contain",
              animation: `bc-kenburns ${SLIDE_MS + 400}ms ease-out both`,
            }}
          />
          {/* 進捗インジケータ */}
          <div style={{ position: "absolute", bottom: "1.2rem", left: 0, right: 0, display: "flex", justifyContent: "center", gap: "0.4rem" }}>
            {imageUrls.map((_, i) => (
              <span key={i} style={{
                width: i === index ? "1.6rem" : "0.5rem", height: "0.5rem", borderRadius: "999px",
                background: i === index ? accent : "rgba(255,255,255,0.5)", transition: "width 0.3s ease",
              }} />
            ))}
          </div>
          {/* 次へ / スキップ */}
          <button
            type="button"
            onClick={() => {
              if (index < imageUrls.length - 1) setIndex(index + 1);
              else setScene("about");
            }}
            style={{
              position: "absolute", bottom: "2.5rem", right: "1.2rem",
              background: "rgba(255,255,255,0.18)", color: "#fff",
              border: "1px solid rgba(255,255,255,0.35)", borderRadius: "999px",
              padding: "0.35rem 1rem", fontSize: "0.85rem", cursor: "pointer", backdropFilter: "blur(6px)",
            }}
          >
            次へ →
          </button>
        </div>
      )}

      {/* === about === */}
      {scene === "about" && (
        <div style={{ animation: "bc-fade 0.5s ease both", padding: "2rem 1.25rem", width: "min(92vw, 540px)", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.1rem" }}>
          <div style={{ fontSize: "2.5rem" }}>🎂</div>
          <h2 style={{ fontFamily: '"Dancing Script", cursive', fontSize: "clamp(2rem, 8vw, 2.8rem)", color: "#ffe3f1", margin: 0, whiteSpace: "nowrap" }}>
            {aboutTitle}
          </h2>
          <p style={{
            fontSize: "1rem",
            lineHeight: 1.95,
            opacity: 0.94,
            margin: 0,
            whiteSpace: "pre-line",
            textAlign: "center",
            textWrap: "pretty",
          }}>
            {aboutMessage}
          </p>
          <button
            type="button"
            className="bc-btn"
            onClick={onClose}
            style={{
              marginTop: "0.8rem", background: accent, color: "#fff", border: "none",
              borderRadius: "999px", padding: "0.7rem 2rem", fontSize: "1rem", fontWeight: 700,
              cursor: "pointer", boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            }}
          >
            サイトを見る →
          </button>
        </div>
      )}
    </div>
  );
}
