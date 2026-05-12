import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import EventFormPage from "./pages/EventFormPage";
import EventDetailPage from "./pages/EventDetailPage";

export default function App() {
  const { user } = useAuth();

  if (user.state === "loading") {
    return <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>読み込み中...</div>;
  }

  if (user.state === "unauthorized") {
    return <LoginPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/events/:id" element={<EventDetailPage />} />
      <Route path="/events/new" element={<EventFormPage />} />
      <Route path="/events/:id/edit" element={<EventFormPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
