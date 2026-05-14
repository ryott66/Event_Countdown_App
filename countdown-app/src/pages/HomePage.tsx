import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEvents } from "../hooks/useEvents";
import { useGalleries } from "../hooks/useGalleries";
import { uploadImage, addToGallery, removeFromGallery } from "../lib/eventService";
import EventCard from "../components/EventCard";

const css = `
  .hp-header {
    position: sticky; top: 0; z-index: 10;
    background: var(--header-bg); backdrop-filter: blur(8px);
    padding: 0.9rem 1.5rem;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .hp-logo {
    font-family: "Dancing Script", cursive;
    font-size: 1.8rem; color: var(--pink);
    flex: 1; text-decoration: none;
  }
  .hp-nav-btn {
    font-family: "Dancing Script", cursive;
    font-size: 1.1rem; padding: 0.35rem 0.9rem;
    background: rgba(230,138,182,0.15); color: var(--pink);
    border-radius: 20px; border: 1.5px solid var(--pink);
    text-decoration: none; white-space: nowrap;
  }
  .hp-nav-btn:hover { background: rgba(230,138,182,0.3); }
  .hp-icon-btn {
    background: var(--pink); color: #fff;
    border-radius: 50%; width: 2.2rem; height: 2.2rem;
    font-size: 1.2rem; line-height: 1; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    box-shadow: var(--shadow);
  }
  .hp-logout-btn {
    background: none; color: var(--text-light); font-size: 0.8rem;
    white-space: nowrap;
  }

  /* Events section */
  .hp-events { padding: 2.5rem 1.5rem 2rem; }
  .hp-section-title {
    font-family: "Dancing Script", cursive;
    font-size: 2.2rem; color: rgba(230,138,182,0.85);
    margin-bottom: 1.25rem;
  }
  .hp-sub-title {
    font-size: 1rem; color: var(--text-light); margin-bottom: 0.75rem;
  }
  .hp-cards { display: flex; flex-direction: column; gap: 0.75rem; }

  /* Galleries section */
  .hp-galleries-wrap {
    background: #f9f0d7; padding: 2.5rem 0 3rem;
  }
  .hp-galleries-inner {
    width: 90%; max-width: 860px; margin: 0 auto;
  }
  .hp-gallery-block { margin-bottom: 2.5rem; }
  .hp-gallery-block:last-child { margin-bottom: 0; }
  .hp-gallery-frame {
    background: linear-gradient(90deg, #b39855 0%, #fff9e6 50%, #b39855 100%);
    border: 0.35rem solid #c9c9c9;
    padding: 0.75rem 0.75rem 1.75rem;
  }
  .hp-gallery-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 0.25rem;
  }
  .hp-gallery-name {
    font-family: "Kaushan Script", cursive;
    font-size: 1.6rem; color: rgb(167,167,167);
  }
  .hp-gallery-add {
    font-size: 0.8rem; padding: 0.3rem 0.7rem;
    background: rgba(230,138,182,0.2); color: var(--pink);
    border-radius: 12px; border: 1px solid var(--pink);
  }
  .hp-gallery-add:hover { background: rgba(230,138,182,0.35); }
  .hp-gallery-scroll {
    display: flex; overflow-x: auto;
    scroll-snap-type: x mandatory; gap: 0.75rem;
    padding: 1rem 0.5rem 0.5rem;
  }
  .hp-gallery-img {
    height: 12rem; border: 2px solid rgb(128,128,128);
    border-radius: 0.5rem; object-fit: cover; display: block;
  }
  .hp-gallery-empty {
    color: rgb(167,167,167); font-size: 0.9rem;
    padding: 1.5rem 0.5rem; text-align: center;
  }

  @media (max-width: 767px) {
    .hp-logo { font-size: 1.4rem; }
    .hp-nav-btn { font-size: 0.95rem; padding: 0.3rem 0.65rem; }
    .hp-events { padding: 1.75rem 1rem 1.5rem; }
    .hp-section-title { font-size: 1.8rem; }
    .hp-galleries-inner { width: 95%; }
    .hp-gallery-name { font-size: 1.3rem; }
    .hp-gallery-img { height: 8rem; }
  }
`;

function GallerySection({
  title, urls, gallery, isAdmin,
}: {
  title: string;
  urls: string[];
  gallery: "mirror" | "cute";
  isAdmin: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList) => {
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadImage(file, "galleries", gallery);
      uploaded.push(url);
    }
    await addToGallery(gallery, uploaded);
  };

  return (
    <div className="hp-gallery-block">
      <div className="hp-gallery-frame">
        <div className="hp-gallery-header">
          <p className="hp-gallery-name">{title}</p>
          {isAdmin && (
            <>
              <input
                ref={fileInputRef} type="file" accept="image/*" multiple
                style={{ display: "none" }}
                onChange={(e) => e.target.files && handleUpload(e.target.files)}
              />
              <button className="hp-gallery-add" onClick={() => fileInputRef.current?.click()}>
                + 写真追加
              </button>
            </>
          )}
        </div>
        {urls.length > 0 ? (
          <div className="hp-gallery-scroll">
            {urls.map((src, i) => (
              <div key={i} style={{ position: "relative", flexShrink: 0 }}>
                <img src={src} alt="" className="hp-gallery-img" />
                {isAdmin && (
                  <button
                    onClick={() => { if (window.confirm("この写真を削除しますか？")) removeFromGallery(gallery, src); }}
                    style={{
                      position: "absolute", top: "-6px", right: "-6px",
                      background: "#e05", color: "#fff", borderRadius: "50%",
                      width: "22px", height: "22px", fontSize: "13px", lineHeight: "22px",
                    }}
                  >×</button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="hp-gallery-empty">写真がまだありません</p>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { user, signOutUser } = useAuth();
  const { events, loading } = useEvents();
  const { galleries } = useGalleries();
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const upcoming = events.filter((e) => e.date >= today);
  const past = events.filter((e) => e.date < today).reverse();
  const isAdmin = user.state === "admin";

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100svh", paddingBottom: "4rem" }}>
      <style>{css}</style>

      <header className="hp-header">
        <span className="hp-logo">Our Home</span>
        <a className="hp-nav-btn" onClick={() => scrollTo("hp-events")} style={{ cursor: "pointer" }}>Events</a>
        <a className="hp-nav-btn" onClick={() => scrollTo("hp-galleries")} style={{ cursor: "pointer" }}>Memories</a>
        {isAdmin && (
          <>
            <button className="hp-icon-btn" onClick={() => navigate("/events/new")}>+</button>
            <button
              className="hp-logout-btn"
              onClick={() => { if (window.confirm("ログアウトしますか？")) signOutUser(); }}
            >
              ログアウト
            </button>
          </>
        )}
      </header>

      <main id="hp-events" className="hp-events">
        <h2 className="hp-section-title">Events</h2>
        {loading ? (
          <p style={{ color: "var(--text-light)" }}>読み込み中...</p>
        ) : (
          <>
            <section style={{ marginBottom: "2rem" }}>
              <p className="hp-sub-title">これから</p>
              {upcoming.length === 0 ? (
                <p style={{ color: "var(--text-light)", fontSize: "0.9rem" }}>イベントがありません</p>
              ) : (
                <div className="hp-cards">
                  {upcoming.map((e) => <EventCard key={e.id} event={e} />)}
                </div>
              )}
            </section>
            {past.length > 0 && (
              <section>
                <p className="hp-sub-title">過去</p>
                <div className="hp-cards">
                  {past.map((e) => <EventCard key={e.id} event={e} isPast />)}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <div id="hp-galleries" className="hp-galleries-wrap">
        <div className="hp-galleries-inner">
          <h2 className="hp-section-title" style={{ marginBottom: "1.5rem" }}>Memories</h2>
          <GallerySection
            title="Mirror Moments"
            urls={galleries.mirrorUrls}
            gallery="mirror"
            isAdmin={isAdmin}
          />
          <GallerySection
            title="Cutest Moments"
            urls={galleries.cuteUrls}
            gallery="cute"
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </div>
  );
}
