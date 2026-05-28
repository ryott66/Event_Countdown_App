import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEvent } from "../hooks/useEvent";
import { createEvent, updateEvent, deleteEvent, uploadImage } from "../lib/eventService";
import { THEMES, THEME_KEYS, type ThemeKey } from "../constants/themes";

const EMOJI_PRESETS = ["🎂", "✈️", "🥂", "🍽️", "🎉", "🌸", "💍", "🎁", "🌊", "🏔️", "🎵", "❤️"];

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-light)", marginBottom: "0.4rem" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.65rem 0.9rem",
  borderRadius: "10px",
  border: "1.5px solid #f0d0e0",
  fontSize: "1rem",
  fontFamily: "inherit",
  background: "#fff",
  color: "var(--text)",
  outline: "none",
};

export default function EventFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { event, loading } = useEvent(isEdit ? id : null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const iconFileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [emoji, setEmoji] = useState("🎉");
  const [theme, setTheme] = useState<ThemeKey>("birthday");
  const [memo, setMemo] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [iconUploading, setIconUploading] = useState(false);
  const [heroUploading, setHeroUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [iconHover, setIconHover] = useState(false);
  const [heroHover, setHeroHover] = useState(false);

  // event が取得できたタイミングで一度だけフォームを初期化する。
  // useEffect 内で setState は React 19 ルール違反になるため、
  // render 時に「初期化済みID」と現在の event.id を比較する公式パターンで行う。
  const [initializedEventId, setInitializedEventId] = useState<string | null>(null);
  if (isEdit && !loading && event && initializedEventId !== event.id) {
    setInitializedEventId(event.id);
    setTitle(event.title);
    setDate(event.date);
    setEmoji(event.emoji);
    setTheme(event.theme);
    setMemo(event.memo ?? "");
    setIconUrl(event.iconUrl ?? "");
    setHeroImageUrl(event.heroImageUrl ?? "");
    setImageUrls(event.imageUrls ?? []);
  }

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    const prev = root.style.maxWidth;
    root.style.maxWidth = "100%";
    return () => { root.style.maxWidth = prev; };
  }, []);

  if (user.state !== "admin") return null;
  if (isEdit && loading) return <p style={{ padding: "2rem" }}>読み込み中...</p>;

  const handleIconUpload = async (files: FileList) => {
    if (!files[0]) return;
    setIconUploading(true);
    const tempId = isEdit ? id! : `temp_${Date.now()}`;
    const url = await uploadImage(files[0], tempId);
    setIconUrl(url);
    setIconUploading(false);
  };

  const handleHeroUpload = async (files: FileList) => {
    if (!files[0]) return;
    setHeroUploading(true);
    const tempId = isEdit ? id! : `temp_${Date.now()}`;
    const url = await uploadImage(files[0], tempId, "hero");
    setHeroImageUrl(url);
    setHeroUploading(false);
  };

  const handleGalleryUpload = async (files: FileList) => {
    setGalleryUploading(true);
    const tempId = isEdit ? id! : `temp_${Date.now()}`;
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadImage(file, tempId);
      urls.push(url);
    }
    setImageUrls((prev) => [...prev, ...urls]);
    setGalleryUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !date || !emoji) return;
    setSaving(true);
    const input = {
      title, date, emoji, theme, memo, iconUrl, heroImageUrl, imageUrls,
      useCustomPage: isEdit ? (event?.useCustomPage ?? false) : false,
      customPageKey: isEdit ? (event?.customPageKey ?? "") : "",
      createdBy: user.uid ?? "",
    };
    try {
      if (isEdit) {
        await updateEvent(id!, input);
      } else {
        await createEvent(input);
      }
      navigate("/");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("このイベントを削除しますか？")) return;
    await deleteEvent(id!);
    navigate("/");
  };

  return (
    <div style={{ minHeight: "100svh" }}>
      <header style={{
        background: "var(--header-bg)",
        padding: "1.25rem 1.5rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "sticky", top: 0, zIndex: 10,
        backdropFilter: "blur(8px)",
      }}>
        <button onClick={() => navigate("/")} style={{ background: "none", fontSize: "1.3rem", color: "var(--text-light)" }}>
          ←
        </button>
        <h1 style={{ fontSize: "2.5rem", color: "var(--pink)", fontFamily: '"Dancing Script", cursive', fontWeight: 600 }}>
          {isEdit ? "Edit Event" : "New Event"}
        </h1>
        <div style={{ width: "1.3rem" }} />
      </header>

      <form onSubmit={handleSubmit} style={{ maxWidth: "540px", margin: "0 auto", padding: "2rem 1.5rem 3rem" }}>
        <FormField label="タイトル *">
          <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="誕生日" />
        </FormField>

        <FormField label="日付 *">
          <input style={inputStyle} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </FormField>

        {/* ===== アイコン ===== */}
        <FormField label="アイコン *">
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>

            {/* 左: 写真アップロードエリア */}
            <div style={{ flexShrink: 0 }}>
              <input
                ref={iconFileInputRef} type="file" accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => e.target.files?.length && handleIconUpload(e.target.files)}
              />

              {/* プレビュー正方形 */}
              <div
                onClick={() => iconFileInputRef.current?.click()}
                onMouseEnter={() => setIconHover(true)}
                onMouseLeave={() => setIconHover(false)}
                style={{
                  width: "108px", height: "108px", borderRadius: "18px",
                  overflow: "hidden", cursor: "pointer", position: "relative",
                  border: iconUrl ? "2px solid #f0d0e0" : "2px dashed #f0d0e0",
                  background: iconUrl ? undefined : "linear-gradient(135deg, #fce4ec, #f8bbd0)",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: "0.3rem",
                }}
              >
                {iconUrl ? (
                  <img src={iconUrl} alt="" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <>
                    <span style={{ fontSize: "2.6rem", lineHeight: 1 }}>{emoji}</span>
                    <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
                      写真を追加
                    </span>
                  </>
                )}

                {/* ホバーオーバーレイ */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "rgba(0,0,0,0.32)",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: "0.25rem",
                  opacity: iconHover || iconUploading ? 1 : 0,
                  transition: "opacity 0.2s",
                }}>
                  <span style={{ fontSize: "1.6rem", lineHeight: 1 }}>
                    {iconUploading ? "⏳" : "📷"}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#fff", fontWeight: 600 }}>
                    {iconUploading ? "アップロード中..." : iconUrl ? "写真を変更" : "写真を追加"}
                  </span>
                </div>
              </div>

              {/* 写真を削除ボタン */}
              {iconUrl && (
                <button
                  type="button"
                  onClick={() => { if (confirm("アイコン写真を削除しますか？")) setIconUrl(""); }}
                  style={{
                    marginTop: "0.4rem", width: "108px",
                    padding: "0.3rem 0", fontSize: "0.75rem",
                    color: "#e05", background: "none",
                    border: "1px solid #e05", borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  写真を削除
                </button>
              )}
            </div>

            {/* 右: 絵文字ピッカー */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.85rem", color: "var(--text-light)", marginBottom: "0.4rem" }}>
                絵文字（写真なしの場合に表示）
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.5rem" }}>
                {EMOJI_PRESETS.map((e) => (
                  <button
                    key={e} type="button"
                    onClick={() => setEmoji(e)}
                    style={{
                      fontSize: "1.3rem", padding: "0.25rem 0.35rem", borderRadius: "8px",
                      background: emoji === e ? "var(--pink-light)" : "#fff",
                      border: emoji === e ? "2px solid var(--pink)" : "2px solid #f0d0e0",
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <input
                style={{ ...inputStyle, width: "5rem" }}
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                maxLength={2}
              />
            </div>
          </div>
        </FormField>

        <FormField label="テーマ *">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {THEME_KEYS.map((key) => (
              <button
                key={key} type="button"
                onClick={() => setTheme(key)}
                style={{
                  padding: "0.5rem 1rem", borderRadius: "20px", fontSize: "0.9rem",
                  background: theme === key ? "var(--pink)" : "#fff",
                  color: theme === key ? "#fff" : "var(--text)",
                  border: theme === key ? "2px solid var(--pink)" : "2px solid #f0d0e0",
                }}
              >
                {THEMES[key].label}
              </button>
            ))}
          </div>
        </FormField>

        <FormField label="ヒーロー背景画像">
          <input
            ref={heroFileInputRef} type="file" accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => e.target.files?.length && handleHeroUpload(e.target.files)}
          />
          <div
            onClick={() => heroFileInputRef.current?.click()}
            onMouseEnter={() => setHeroHover(true)}
            onMouseLeave={() => setHeroHover(false)}
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: "14px",
              overflow: "hidden",
              cursor: "pointer",
              position: "relative",
              border: heroImageUrl ? "2px solid #f0d0e0" : "2px dashed #f0d0e0",
              background: heroImageUrl ? undefined : "linear-gradient(135deg, #fce4ec, #f8bbd0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {heroImageUrl ? (
              <img src={heroImageUrl} alt="" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.95)", fontWeight: 600 }}>
                ページの背景にする画像
              </span>
            )}
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.32)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "0.25rem",
              opacity: heroHover || heroUploading ? 1 : 0,
              transition: "opacity 0.2s",
            }}>
              <span style={{ fontSize: "1.6rem", lineHeight: 1 }}>
                {heroUploading ? "⏳" : "📷"}
              </span>
              <span style={{ fontSize: "0.8rem", color: "#fff", fontWeight: 600 }}>
                {heroUploading ? "アップロード中..." : heroImageUrl ? "画像を変更" : "画像を追加"}
              </span>
            </div>
          </div>
          {heroImageUrl && (
            <button
              type="button"
              onClick={() => { if (confirm("ヒーロー背景画像を削除しますか？")) setHeroImageUrl(""); }}
              style={{
                marginTop: "0.5rem", width: "100%",
                padding: "0.4rem 0", fontSize: "0.8rem",
                color: "#e05", background: "none",
                border: "1px solid #e05", borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              画像を削除
            </button>
          )}
        </FormField>

        <FormField label="メモ">
          <textarea
            style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="一言メモ..."
          />
        </FormField>

        <FormField label="追加画像">
          <input
            ref={galleryFileInputRef} type="file" accept="image/*" multiple
            style={{ display: "none" }}
            onChange={(e) => e.target.files && handleGalleryUpload(e.target.files)}
          />
          <button
            type="button"
            onClick={() => galleryFileInputRef.current?.click()}
            style={{
              width: "100%", padding: "0.75rem", borderRadius: "10px",
              border: "2px dashed #f0d0e0", background: "#fff",
              color: "var(--text-light)", fontSize: "0.9rem",
            }}
          >
            {galleryUploading ? "アップロード中..." : "+ 画像を追加"}
          </button>
          {imageUrls.length > 0 && (
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
              {imageUrls.map((url, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={url} alt="" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
                  <button
                    type="button"
                    onClick={() => { if (confirm("この画像を削除しますか？")) setImageUrls((prev) => prev.filter((_, j) => j !== i)); }}
                    style={{
                      position: "absolute", top: "-6px", right: "-6px",
                      background: "#e05", color: "#fff", border: "none",
                      borderRadius: "50%", width: "1.4rem", height: "1.4rem",
                      fontSize: "0.8rem", lineHeight: "1.4rem", textAlign: "center",
                      cursor: "pointer",
                    }}
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </FormField>

        <button
          type="submit" disabled={saving || galleryUploading || iconUploading || heroUploading}
          style={{
            width: "100%", padding: "0.9rem", borderRadius: "12px",
            background: "var(--pink)", color: "#fff",
            fontFamily: '"Dancing Script", cursive', fontSize: "1.3rem",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "保存中..." : isEdit ? "Save" : "Create"}
        </button>

        {isEdit && (
          <button
            type="button" onClick={handleDelete}
            style={{
              width: "100%", marginTop: "1rem", padding: "0.75rem",
              borderRadius: "12px", background: "none",
              color: "#e05", fontSize: "0.85rem",
              border: "1.5px solid #e05",
            }}
          >
            削除
          </button>
        )}
      </form>
    </div>
  );
}
