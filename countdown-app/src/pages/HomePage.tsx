import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEvents } from "../hooks/useEvents";
import EventCard from "../components/EventCard";

export default function HomePage() {
  const { user, signOutUser } = useAuth();
  const { events, loading } = useEvents();
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const upcoming = events.filter((e) => e.date >= today);
  const past = events.filter((e) => e.date < today).reverse();

  return (
    <div style={{ minHeight: "100svh", paddingBottom: "4rem" }}>
      {/* ヘッダー */}
      <header style={{
        background: "var(--header-bg)",
        backdropFilter: "blur(8px)",
        padding: "1.25rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <h1 style={{ fontSize: "1.8rem", color: "var(--pink)" }}>Our Events</h1>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {user.state === "admin" && (
            <>
              <button
                onClick={() => navigate("/events/new")}
                style={{
                  background: "var(--pink)",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "2.5rem",
                  height: "2.5rem",
                  fontSize: "1.4rem",
                  lineHeight: 1,
                  boxShadow: "var(--shadow)",
                }}
              >
                +
              </button>
              <button
                onClick={() => { if (window.confirm("ログアウトしますか？")) signOutUser(); }}
                style={{ background: "none", color: "var(--text-light)", fontSize: "0.8rem" }}
              >
                ログアウト
              </button>
            </>
          )}
        </div>
      </header>

      <main style={{ padding: "1.5rem" }}>
        {loading ? (
          <p style={{ textAlign: "center", color: "var(--text-light)", marginTop: "3rem" }}>読み込み中...</p>
        ) : (
          <>
            {/* これから */}
            <section style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.2rem", color: "var(--text-light)", marginBottom: "1rem" }}>これから</h2>
              {upcoming.length === 0 ? (
                <p style={{ color: "var(--text-light)", fontSize: "0.9rem" }}>イベントがありません</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {upcoming.map((e) => <EventCard key={e.id} event={e} />)}
                </div>
              )}
            </section>

            {/* 過去 */}
            {past.length > 0 && (
              <section>
                <h2 style={{ fontSize: "1.2rem", color: "var(--text-light)", marginBottom: "1rem" }}>過去</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {past.map((e) => <EventCard key={e.id} event={e} isPast />)}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
