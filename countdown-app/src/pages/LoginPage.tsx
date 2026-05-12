import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: "1rem", fontFamily: "sans-serif" }}>
      <p style={{ fontSize: "2rem" }}>🎀</p>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Our Countdown</h1>
      <button onClick={signInWithGoogle} style={{ padding: "0.75rem 2rem", borderRadius: "8px", border: "none", background: "#e68ab6", color: "white", fontSize: "1rem", cursor: "pointer" }}>
        Googleでログイン
      </button>
    </div>
  );
}
