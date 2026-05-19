import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (e) {
      const code = (e as { code?: string }).code;
      // ユーザー操作で閉じた系は無視、それ以外は表示
      if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") {
        setError("ログインに失敗しました。もう一度お試しください。");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: "1rem", fontFamily: "sans-serif" }}>
      <p style={{ fontSize: "2rem" }}>🎀</p>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Our Countdown</h1>
      <button
        onClick={handleLogin}
        disabled={loading}
        style={{ padding: "0.75rem 2rem", borderRadius: "8px", border: "none", background: "#e68ab6", color: "white", fontSize: "1rem", cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "ログイン中..." : "Googleでログイン"}
      </button>
      {error && (
        <p style={{ color: "#c33", fontSize: "0.85rem" }}>{error}</p>
      )}
    </div>
  );
}
