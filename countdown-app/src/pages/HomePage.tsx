import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DndContext, closestCenter, PointerSensor, TouchSensor,
  useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, rectSortingStrategy, useSortable, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAuth } from "../contexts/AuthContext";
import { useEvents } from "../hooks/useEvents";
import { useGalleries } from "../hooks/useGalleries";
import { uploadImage, addToGallery, updateGalleryOrder } from "../lib/eventService";
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
    flex: 1;
  }
  .hp-nav-btn {
    font-family: "Dancing Script", cursive;
    font-size: 1.1rem; padding: 0.35rem 0.9rem;
    background: rgba(230,138,182,0.15); color: var(--pink);
    border-radius: 20px; border: 1.5px solid var(--pink);
    white-space: nowrap; cursor: pointer;
  }
  .hp-nav-btn:hover { background: rgba(230,138,182,0.3); }
  .hp-icon-btn {
    background: var(--pink); color: #fff;
    border-radius: 50%; width: 2.2rem; height: 2.2rem;
    font-size: 1.2rem; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    box-shadow: var(--shadow);
  }
  .hp-logout-btn {
    background: none; color: var(--text-light); font-size: 0.8rem; white-space: nowrap;
  }

  .hp-events { padding: 2.5rem 1.5rem 2rem; }
  .hp-section-title {
    font-family: "Dancing Script", cursive;
    font-size: 2.2rem; color: rgba(230,138,182,0.85);
    margin-bottom: 1.25rem;
  }
  .hp-sub-title { font-size: 1rem; color: var(--text-light); margin-bottom: 0.75rem; }
  .hp-cards { display: flex; flex-direction: column; gap: 0.75rem; }

  .hp-galleries-wrap { background: #f9f0d7; padding: 2.5rem 0 3rem; }
  .hp-galleries-inner { width: 90%; max-width: 860px; margin: 0 auto; }
  .hp-gallery-block { margin-bottom: 2.5rem; }
  .hp-gallery-block:last-child { margin-bottom: 0; }
  .hp-gallery-frame {
    background: linear-gradient(90deg, #b39855 0%, #fff9e6 50%, #b39855 100%);
    border: 0.35rem solid #c9c9c9;
    padding: 0.75rem 0.75rem 1.75rem;
  }
  .hp-gallery-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 0.25rem; gap: 0.5rem;
  }
  .hp-gallery-name { font-family: "Kaushan Script", cursive; font-size: 1.6rem; color: rgb(167,167,167); }
  .hp-gallery-action-btn {
    font-size: 0.8rem; padding: 0.3rem 0.7rem;
    border-radius: 12px; border: 1px solid var(--pink);
    color: var(--pink); background: rgba(230,138,182,0.15); white-space: nowrap;
  }
  .hp-gallery-action-btn:hover { background: rgba(230,138,182,0.3); }
  .hp-gallery-action-btn.done { background: var(--pink); color: #fff; }
  .hp-gallery-action-btn.done:hover { background: var(--pink-dark); }
  .hp-gallery-actions { display: flex; gap: 0.4rem; }

  /* 通常表示 */
  .hp-gallery-scroll {
    display: flex; overflow-x: auto;
    scroll-snap-type: x mandatory; gap: 0.75rem;
    padding: 1rem 0.5rem 0.5rem;
  }
  .hp-gallery-img {
    height: 12rem; border: 2px solid rgb(128,128,128);
    border-radius: 0.5rem; object-fit: cover; display: block;
    scroll-snap-align: start; flex-shrink: 0;
  }

  /* 編集モード */
  .hp-edit-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 0.6rem; padding: 1rem 0.25rem 0.5rem;
  }
  .hp-edit-photo {
    position: relative; border-radius: 0.5rem;
    overflow: hidden; aspect-ratio: 1;
    touch-action: none;
  }
  .hp-edit-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .hp-delete-badge {
    position: absolute; top: 4px; right: 4px;
    background: rgba(220,0,50,0.85); color: #fff;
    border-radius: 50%; width: 24px; height: 24px;
    font-size: 15px; line-height: 24px; text-align: center;
    box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  }
  .hp-drag-hint {
    position: absolute; bottom: 4px; left: 4px;
    color: rgba(255,255,255,0.75); font-size: 14px; line-height: 1;
    pointer-events: none;
  }

  .hp-gallery-empty { color: rgb(167,167,167); font-size: 0.9rem; padding: 1.5rem 0.5rem; text-align: center; }

  @media (max-width: 767px) {
    .hp-logo { font-size: 1.4rem; }
    .hp-nav-btn { font-size: 0.95rem; padding: 0.3rem 0.65rem; }
    .hp-events { padding: 1.75rem 1rem 1.5rem; }
    .hp-section-title { font-size: 1.8rem; }
    .hp-galleries-inner { width: 95%; }
    .hp-gallery-name { font-size: 1.3rem; }
    .hp-gallery-img { height: 8rem; }
    .hp-edit-grid { grid-template-columns: repeat(3, 1fr); gap: 0.4rem; }
  }
`;

function SortablePhoto({ url, onDelete }: { url: string; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: url });
  return (
    <div
      ref={setNodeRef}
      className="hp-edit-photo"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      {...attributes}
      {...listeners}
    >
      <img src={url} alt="" />
      <button
        className="hp-delete-badge"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
      >
        ×
      </button>
      <span className="hp-drag-hint">⠿</span>
    </div>
  );
}

function GallerySection({
  title, urls, gallery, isAdmin,
}: {
  title: string;
  urls: string[];
  gallery: "mirror" | "cute";
  isAdmin: boolean;
}) {
  const [editMode, setEditMode] = useState(false);
  const [localUrls, setLocalUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  const enterEdit = () => { setLocalUrls([...urls]); setEditMode(true); };

  const exitEdit = async () => {
    setEditMode(false);
    await updateGalleryOrder(gallery, localUrls);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      setLocalUrls((prev) => {
        const from = prev.indexOf(active.id as string);
        const to = prev.indexOf(over.id as string);
        return arrayMove(prev, from, to);
      });
    }
  };

  const handleDelete = (url: string) => {
    setLocalUrls((prev) => prev.filter((u) => u !== url));
  };

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const u = await uploadImage(file, "galleries", gallery);
      uploaded.push(u);
    }
    await addToGallery(gallery, uploaded);
    setUploading(false);
  };

  // 編集モード中にFirestoreから更新が来ても上書きしない
  useEffect(() => {
    if (!editMode) setLocalUrls([...urls]);
  }, [urls, editMode]);

  const displayUrls = editMode ? localUrls : urls;

  return (
    <div className="hp-gallery-block">
      <div className="hp-gallery-frame">
        <div className="hp-gallery-header">
          <p className="hp-gallery-name">{title}</p>
          {isAdmin && (
            <div className="hp-gallery-actions">
              {editMode ? (
                <>
                  <input
                    ref={fileInputRef} type="file" accept="image/*" multiple
                    style={{ display: "none" }}
                    onChange={(e) => e.target.files && handleUpload(e.target.files)}
                  />
                  <button className="hp-gallery-action-btn" onClick={() => fileInputRef.current?.click()}>
                    {uploading ? "追加中…" : "+ 追加"}
                  </button>
                  <button className="hp-gallery-action-btn done" onClick={exitEdit}>完了</button>
                </>
              ) : (
                <button className="hp-gallery-action-btn" onClick={enterEdit}>編集</button>
              )}
            </div>
          )}
        </div>

        {displayUrls.length === 0 ? (
          <p className="hp-gallery-empty">写真がまだありません</p>
        ) : editMode ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={localUrls} strategy={rectSortingStrategy}>
              <div className="hp-edit-grid">
                {localUrls.map((url) => (
                  <SortablePhoto key={url} url={url} onDelete={() => handleDelete(url)} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="hp-gallery-scroll">
            {displayUrls.map((src, i) => (
              <img key={i} src={src} alt="" className="hp-gallery-img" />
            ))}
          </div>
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

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ minHeight: "100svh", paddingBottom: "4rem" }}>
      <style>{css}</style>

      <header className="hp-header">
        <span className="hp-logo">Our Home</span>
        <button className="hp-nav-btn" onClick={() => scrollTo("hp-events")}>Events</button>
        <button className="hp-nav-btn" onClick={() => scrollTo("hp-galleries")}>Memories</button>
        {isAdmin && (
          <>
            <button className="hp-icon-btn" onClick={() => navigate("/events/new")}>+</button>
            <button className="hp-logout-btn" onClick={() => { if (window.confirm("ログアウトしますか？")) signOutUser(); }}>
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
              {upcoming.length === 0
                ? <p style={{ color: "var(--text-light)", fontSize: "0.9rem" }}>イベントがありません</p>
                : <div className="hp-cards">{upcoming.map((e) => <EventCard key={e.id} event={e} />)}</div>}
            </section>
            {past.length > 0 && (
              <section>
                <p className="hp-sub-title">過去</p>
                <div className="hp-cards">{past.map((e) => <EventCard key={e.id} event={e} isPast />)}</div>
              </section>
            )}
          </>
        )}
      </main>

      <div id="hp-galleries" className="hp-galleries-wrap">
        <div className="hp-galleries-inner">
          <h2 className="hp-section-title" style={{ marginBottom: "1.5rem" }}>Memories</h2>
          <GallerySection title="Mirror Moments" urls={galleries.mirrorUrls} gallery="mirror" isAdmin={isAdmin} />
          <GallerySection title="Cutest Moments" urls={galleries.cuteUrls} gallery="cute" isAdmin={isAdmin} />
        </div>
      </div>
    </div>
  );
}
