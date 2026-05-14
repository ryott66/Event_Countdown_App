import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEvent } from "../hooks/useEvent";
import { createEvent, updateEvent, deleteEvent, uploadImage } from "../lib/eventService";

const THEMES = [
  { value: "birthday", label: "🎂 Birthday" },
  { value: "travel", label: "✈️ Travel" },
  { value: "anniversary", label: "🥂 Anniversary" },
  { value: "date", label: "🍽️ Date" },
] as const;

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
  const { event, loading } = useEvent(isEdit ? id! : "__skip__");
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mirrorInputRef = useRef<HTMLInputElement>(null);
  const cuteInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [emoji, setEmoji] = useState("🎉");
  const [theme, setTheme] = useState<"birthday" | "travel" | "anniversary" | "date">("birthday");
  const [memo, setMemo] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [mirrorUrls, setMirrorUrls] = useState<string[]>([]);
  const [cuteUrls, setCuteUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 編集時：ロード完了後に初期値をセット
  useEffect(() => {
    if (isEdit && !loading && event) {
      setTitle(event.title);
      setDate(event.date);
      setEmoji(event.emoji);
      setTheme(event.theme);
      setMemo(event.memo ?? "");
      setImageUrls(event.imageUrls ?? []);
      setMirrorUrls(event.mirrorUrls ?? []);
      setCuteUrls(event.cuteUrls ?? []);
    }
  }, [isEdit, loading, event?.id]);

  if (user.state !== "admin") return null;
  if (isEdit && loading) return <p style={{ padding: "2rem" }}>読み込み中...</p>;

  const handleImageUpload = async (files: FileList) => {
    setUploading(true);
    const tempId = isEdit ? id! : `temp_${Date.now()}`;
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadImage(file, tempId);
      urls.push(url);
    }
    setImageUrls((prev) => [...prev, ...urls]);
    setUploading(false);
  };

  const handleGalleryUpload = async (files: FileList, folder: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setUploading(true);
    const tempId = isEdit ? id! : `temp_${Date.now()}`;
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadImage(file, tempId, folder);
      urls.push(url);
    }
    setter((prev) => [...prev, ...urls]);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !emoji) return;
    setSaving(true);
    const input = {
      title, date, emoji, theme, memo, imageUrls, mirrorUrls, cuteUrls,
      useCustomPage: isEdit ? (event?.useCustomPage ?? false) : false,
      customPageKey: isEdit ? (event?.customPageKey ?? "") : "",
      recurring: false,
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
      {/* ヘッダー */}
      <header style={{
        background: "var(--header-bg)",
        padding: "1.25rem 1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <button onClick={() => navigate("/")} style={{ background: "none", fontSize: "1.3rem", color: "var(--text-light)" }}>
          ←
        </button>
        <h1 style={{ fontSize: "1.6rem", color: "var(--pink)" }}>
          {isEdit ? "Edit Event" : "New Event"}
        </h1>
      </header>

      <form onSubmit={handleSubmit} style={{ padding: "1.5rem" }}>
        <FormField label="タイトル *">
          <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Reminaの誕生日" />
        </FormField>

        <FormField label="日付 *">
          <input style={inputStyle} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </FormField>

        <FormField label="絵文字 *">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
            {EMOJI_PRESETS.map((e) => (
              <button
                key={e} type="button"
                onClick={() => setEmoji(e)}
                style={{
                  fontSize: "1.5rem", padding: "0.3rem 0.5rem", borderRadius: "8px",
                  background: emoji === e ? "var(--pink-light)" : "#fff",
                  border: emoji === e ? "2px solid var(--pink)" : "2px solid #f0d0e0",
                }}
              >
                {e}
              </button>
            ))}
          </div>
          <input style={{ ...inputStyle, width: "6rem" }} value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength={2} />
        </FormField>

        <FormField label="テーマ *">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {THEMES.map((t) => (
              <button
                key={t.value} type="button"
                onClick={() => setTheme(t.value)}
                style={{
                  padding: "0.5rem 1rem", borderRadius: "20px", fontSize: "0.9rem",
                  background: theme === t.value ? "var(--pink)" : "#fff",
                  color: theme === t.value ? "#fff" : "var(--text)",
                  border: theme === t.value ? "2px solid var(--pink)" : "2px solid #f0d0e0",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </FormField>

        <FormField label="メモ">
          <textarea
            style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="一言メモ..."
          />
        </FormField>

        <FormField label="画像">
          <input
            ref={fileInputRef} type="file" accept="image/*" multiple
            style={{ display: "none" }}
            onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: "100%", padding: "0.75rem", borderRadius: "10px",
              border: "2px dashed #f0d0e0", background: "#fff",
              color: "var(--text-light)", fontSize: "0.9rem",
            }}
          >
            {uploading ? "アップロード中..." : "+ 画像を追加"}
          </button>
          {imageUrls.length > 0 && (
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
              {imageUrls.map((url, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={url} alt="" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
                  <button
                    type="button"
                    onClick={() => setImageUrls((prev) => prev.filter((_, j) => j !== i))}
                    style={{
                      position: "absolute", top: "-6px", right: "-6px",
                      background: "#e05", color: "#fff", borderRadius: "50%",
                      width: "20px", height: "20px", fontSize: "12px", lineHeight: "20px",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </FormField>

        <FormField label="Mirror Moments ギャラリー">
          <input
            ref={mirrorInputRef} type="file" accept="image/*" multiple
            style={{ display: "none" }}
            onChange={(e) => e.target.files && handleGalleryUpload(e.target.files, "mirror", setMirrorUrls)}
          />
          <button
            type="button"
            onClick={() => mirrorInputRef.current?.click()}
            style={{
              width: "100%", padding: "0.75rem", borderRadius: "10px",
              border: "2px dashed #f0d0e0", background: "#fff",
              color: "var(--text-light)", fontSize: "0.9rem",
            }}
          >
            {uploading ? "アップロード中..." : "+ Mirror写真を追加"}
          </button>
          {mirrorUrls.length > 0 && (
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
              {mirrorUrls.map((url, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={url} alt="" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
                  <button
                    type="button"
                    onClick={() => setMirrorUrls((prev) => prev.filter((_, j) => j !== i))}
                    style={{
                      position: "absolute", top: "-6px", right: "-6px",
                      background: "#e05", color: "#fff", borderRadius: "50%",
                      width: "20px", height: "20px", fontSize: "12px", lineHeight: "20px",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </FormField>

        <FormField label="Cutest Moments ギャラリー">
          <input
            ref={cuteInputRef} type="file" accept="image/*" multiple
            style={{ display: "none" }}
            onChange={(e) => e.target.files && handleGalleryUpload(e.target.files, "cute", setCuteUrls)}
          />
          <button
            type="button"
            onClick={() => cuteInputRef.current?.click()}
            style={{
              width: "100%", padding: "0.75rem", borderRadius: "10px",
              border: "2px dashed #f0d0e0", background: "#fff",
              color: "var(--text-light)", fontSize: "0.9rem",
            }}
          >
            {uploading ? "アップロード中..." : "+ Cute写真を追加"}
          </button>
          {cuteUrls.length > 0 && (
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
              {cuteUrls.map((url, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={url} alt="" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
                  <button
                    type="button"
                    onClick={() => setCuteUrls((prev) => prev.filter((_, j) => j !== i))}
                    style={{
                      position: "absolute", top: "-6px", right: "-6px",
                      background: "#e05", color: "#fff", borderRadius: "50%",
                      width: "20px", height: "20px", fontSize: "12px", lineHeight: "20px",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </FormField>

        <button
          type="submit" disabled={saving || uploading}
          style={{
            width: "100%", padding: "0.9rem", borderRadius: "12px",
            background: "var(--pink)", color: "#fff",
            fontFamily: '"Dancing Script", cursive', fontSize: "1.2rem",
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
              color: "#e05", fontSize: "0.9rem",
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
