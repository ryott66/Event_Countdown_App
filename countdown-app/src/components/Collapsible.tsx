import { useId, useState, type ReactNode } from "react";

interface Props {
  title: string;
  accent?: string;
  defaultOpen?: boolean;
  // 見出しの文字サイズ
  titleSize?: string;
  children: ReactNode;
}

// 見出しバー（タップで開閉できると一目で分かるアコーディオン）。
export default function Collapsible({
  title,
  accent = "#e68ab6",
  defaultOpen = true,
  titleSize = "clamp(1.5rem, 5vw, 2.2rem)",
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1.5rem 0.75rem 0" }}>
      <style>{`
        .cl-bar { transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease; }
        .cl-bar:hover { transform: translateY(-1px); box-shadow: 0 10px 26px rgba(0,0,0,0.12); }
        .cl-bar:active { transform: translateY(0); }
        .cl-chev { transition: transform 0.25s ease; }
        .cl-body { animation: clFade 0.25s ease; }
        @keyframes clFade { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
      `}</style>

      <button
        type="button"
        className="cl-bar"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "0.7rem 0.9rem 0.7rem 1.4rem",
          background: "#fff",
          border: `1.5px solid ${accent}40`,
          borderRadius: "999px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.07)",
          cursor: "pointer",
        }}
      >
        <span style={{ fontFamily: '"Dancing Script", cursive', color: accent, fontSize: titleSize, lineHeight: 1.1 }}>
          {title}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: accent, opacity: 0.75, fontSize: "0.72rem", fontWeight: 600, whiteSpace: "nowrap" }}>
            {open ? "閉じる" : "開く"}
          </span>
          <span
            className="cl-chev"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "2.1rem",
              height: "2.1rem",
              borderRadius: "50%",
              background: accent,
              color: "#fff",
              fontSize: "1rem",
              lineHeight: 1,
              flexShrink: 0,
              transform: open ? "rotate(180deg)" : "none",
            }}
          >
            ▾
          </span>
        </span>
      </button>

      {open && (
        <div id={panelId} className="cl-body" style={{ marginTop: "1rem" }}>
          {children}
        </div>
      )}
    </div>
  );
}
