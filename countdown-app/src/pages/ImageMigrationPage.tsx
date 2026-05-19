import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { migrateAllImages, type MigrationProgress } from "../lib/imageMigration";

export default function ImageMigrationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<MigrationProgress | null>(null);
  const [done, setDone] = useState<{ total: number; failures: number; savedBytes: number } | null>(null);

  if (user.state !== "admin") {
    return <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>admin only</div>;
  }

  const start = async () => {
    if (!confirm(
      "全画像を再圧縮 + Cache-Control 付きで再アップします。\n" +
      "枚数によっては数分〜十数分かかります。実行しますか？",
    )) return;
    setRunning(true);
    setDone(null);
    setProgress(null);
    try {
      const result = await migrateAllImages(setProgress);
      setDone(result);
    } catch (e) {
      alert("失敗: " + String(e));
    } finally {
      setRunning(false);
    }
  };

  const mb = (bytes: number) => (bytes / 1024 / 1024).toFixed(2);
  const percent = progress ? (progress.done / Math.max(progress.total, 1)) * 100 : 0;

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <button
        onClick={() => navigate("/")}
        style={{
          marginBottom: "1.5rem", padding: "0.4rem 0.8rem",
          background: "none", border: "1px solid #ccc", borderRadius: "0.4rem", cursor: "pointer",
        }}
      >
        ← 戻る
      </button>
      <h1 style={{ fontSize: "1.5rem" }}>画像の一括最適化</h1>
      <p style={{ color: "#666", fontSize: "0.9rem", lineHeight: 1.6 }}>
        全イベントのアイコン・写真と、ギャラリーの全画像を新しい圧縮設定で再アップし、
        Cache-Control を1年に設定します。旧ファイルは Storage から削除されます。
      </p>

      <button
        onClick={start}
        disabled={running}
        style={{
          padding: "0.8rem 1.5rem", fontSize: "1rem",
          background: running ? "#ccc" : "#e68ab6", color: "#fff",
          border: "none", borderRadius: "0.5rem",
          cursor: running ? "default" : "pointer",
        }}
      >
        {running ? "実行中..." : "🚀 開始"}
      </button>

      {progress && (
        <div style={{ marginTop: "1.5rem" }}>
          <div style={{ fontSize: "0.95rem" }}>
            {progress.done} / {progress.total} ({Math.round(percent)}%)
          </div>
          <div style={{
            background: "#eee", height: 10, borderRadius: 5, overflow: "hidden", margin: "0.5rem 0",
          }}>
            <div style={{
              background: "#e68ab6", height: "100%", width: `${percent}%`, transition: "width 0.3s",
            }} />
          </div>
          <div style={{ fontSize: "0.85rem", color: "#666" }}>処理中: {progress.currentLabel}</div>
          <div style={{ fontSize: "0.85rem", color: "#666" }}>
            削減: {mb(progress.savedBytes)} MB / 失敗: {progress.failures}
          </div>
        </div>
      )}

      {done && (
        <div style={{
          marginTop: "1.5rem", padding: "1rem",
          background: "#f5f5f5", borderRadius: "0.5rem", lineHeight: 1.6,
        }}>
          完了！{done.total} 件処理・{mb(done.savedBytes)} MB 削減
          {done.failures > 0 && (
            <div style={{ color: "#c33" }}>
              {done.failures} 件失敗（Console を確認してください）
            </div>
          )}
        </div>
      )}
    </div>
  );
}
