import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

const LoginPage = lazy(() => import("./pages/LoginPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const EventFormPage = lazy(() => import("./pages/EventFormPage"));
const EventDetailPage = lazy(() => import("./pages/EventDetailPage"));
const ImageMigrationPage = lazy(() => import("./pages/ImageMigrationPage"));

function PageFallback() {
  return <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>読み込み中...</div>;
}

export default function App() {
  const { user } = useAuth();

  if (user.state === "loading") {
    return <PageFallback />;
  }

  if (user.state === "unauthorized") {
    return (
      <Suspense fallback={<PageFallback />}>
        <LoginPage />
      </Suspense>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/events/new" element={<EventFormPage />} />
          <Route path="/events/:id/edit" element={<EventFormPage />} />
          <Route path="/admin/optimize" element={<ImageMigrationPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </>
  );
}
