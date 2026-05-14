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
  html { font-size: clamp(2px, 1.25vw, 16px); }
  .hp-body { background-color: #fff0f5; font-family: sans-serif; overflow-x: hidden; }

  /* === Header === */
  .hp-header {
    height: 5rem; width: 100%;
    background-color: rgba(207,220,231,0.4);
    position: sticky; top: 0; z-index: 10;
    display: flex; align-items: center; padding: 0 2rem; gap: 1.5rem;
    backdrop-filter: blur(8px);
  }
  .hp-logo {
    font-family: "Dancing Script", cursive;
    font-size: 3rem; color: var(--pink); flex: 1;
  }
  .hp-nav-btn {
    font-size: 2rem; font-family: "Dancing Script", cursive;
    padding: 0.7rem 2rem;
    background-color: rgba(229,166,220,0.7); color: #fff;
    border-radius: 1rem; box-shadow: 0 0.3rem #cbcbcb;
    border: none; cursor: pointer; white-space: nowrap;
  }
  .hp-nav-btn:active { position: relative; top: 0.3rem; box-shadow: none; }
  .hp-nav-btn:hover { background-color: rgba(229,166,220,0.85); }
  .hp-icon-btn {
    background: var(--pink); color: #fff;
    border-radius: 50%; width: 3.5rem; height: 3.5rem;
    font-size: 2rem; line-height: 1; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0.3rem #cbcbcb; border: none; cursor: pointer;
  }
  .hp-logout-btn {
    background: none; color: var(--text-light); font-size: 1.2rem;
    white-space: nowrap; border: none; cursor: pointer;
  }

  /* === Section title === */
  .hp-section-title {
    font-family: "Dancing Script", cursive;
    color: rgba(230,138,182,0.85);
    font-size: 5rem;
    padding-top: 5rem; padding-bottom: 3rem; margin: 0;
    text-align: center;
  }

  /* === Events === */
  .hp-events {
    padding: 0 0 5rem; width: 85%; margin: 0 auto;
  }
  .hp-sub-title {
    font-size: 2rem; color: var(--text-light);
    margin-bottom: 1rem; margin-top: 2rem;
    font-family: "Dancing Script", cursive;
  }
  .hp-cards { display: flex; flex-direction: column; gap: 1rem; }
  .hp-events-empty { color: var(--text-light); font-size: 1.5rem; }

  /* === Memories === */
  .hp-galleries-wrap {
    width: 100%; padding: 0 0 8rem;
    background-color: #f9f0d7;
  }
  .hp-galleries-inner { width: 85%; margin: 0 auto; }
  .hp-gallery-block { margin-bottom: 5rem; }
  .hp-gallery-block:last-child { margin-bottom: 0; }
  .hp-gallery-frame {
    background: linear-gradient(90deg, #b39855 0%, #fff9e6 50%, #b39855 100%);
    border: 0.7rem solid #c9c9c9;
    padding: 1rem 1rem 3rem 1rem;
  }
  .hp-gallery-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 0; gap: 1rem; padding: 0 1rem;
  }
  .hp-gallery-name {
    font-family: "Kaushan Script", cursive;
    font-size: 3rem; color: rgb(167,167,167); margin: 0;
  }
  .hp-gallery-action-btn {
    font-size: 1.2rem; padding: 0.5rem 1rem;
    border-radius: 1rem; border: 1.5px solid var(--pink);
    color: var(--pink); background: rgba(255,255,255,0.6);
    white-space: nowrap; cursor: pointer;
  }
  .hp-gallery-action-btn:hover { background: rgba(230,138,182,0.25); }
  .hp-gallery-action-btn.done { background: var(--pink); color: #fff; }
  .hp-gallery-action-btn.done:hover { background: var(--pink-dark); }
  .hp-gallery-actions { display: flex; gap: 0.5rem; }

  /* 通常表示 */
  .hp-gallery-scroll {
    display: flex; overflow-x: auto;
    scroll-snap-type: x mandatory; gap: 1rem; padding: 2rem;
  }
  .hp-gallery-img {
    height: 20rem; border: 0.25rem solid rgb(128,128,128);
    border-radius: 1rem; object-fit: cover; display: block;
    scroll-snap-align: start; flex-shrink: 0;
  }

  /* 編集モード */
  .hp-edit-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1rem; padding: 2rem;
  }
  .hp-edit-photo {
    position: relative; border-radius: 0.5rem;
    overflow: hidden; aspect-ratio: 1; touch-action: none;
    border: 0.25rem solid rgb(128,128,128);
  }
  .hp-edit-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .hp-delete-badge {
    position: absolute; top: 0.3rem; right: 0.3rem;
    background: rgba(220,0,50,0.85); color: #fff;
    border-radius: 50%; width: 2rem; height: 2rem;
    font-size: 1.2rem; line-height: 2rem; text-align: center;
    box-shadow: 0 1px 4px rgba(0,0,0,0.3); border: none; cursor: pointer;
  }
  .hp-drag-hint {
    position: absolute; bottom: 0.3rem; left: 0.3rem;
    color: rgba(255,255,255,0.85); font-size: 1.5rem; line-height: 1;
    pointer-events: none;
    text-shadow: 0 0 4px rgba(0,0,0,0.4);
  }
  .hp-gallery-empty {
    color: rgb(167,167,167); font-size: 1.5rem;
    padding: 3rem 1rem; text-align: center;
  }

  /* === Mobile === */
  @media (max-width: 767px) {
    html { font-size: 13px; }
    .hp-header {
      height: auto; padding: 0.5rem 0.8rem; gap: 0.5rem;
      flex-wrap: wrap;
    }
    .hp-logo { font-size: 1.8rem; }
    .hp-nav-btn { font-size: 1rem; padding: 0.35rem 0.8rem; border-radius: 0.6rem; box-shadow: 0 0.15rem #cbcbcb; }
    .hp-icon-btn { width: 2.2rem; height: 2.2rem; font-size: 1.2rem; box-shadow: 0 0.15rem #cbcbcb; }
    .hp-logout-btn { font-size: 0.85rem; }

    .hp-section-title { font-size: 2.8rem; padding-top: 3rem; padding-bottom: 1.5rem; }
    .hp-events { width: 95%; padding: 0 0 3rem; }
    .hp-sub-title { font-size: 1.3rem; }
    .hp-events-empty { font-size: 1rem; }
    .hp-galleries-wrap { padding-bottom: 4rem; }
    .hp-galleries-inner { width: 95%; }
    .hp-gallery-block { margin-bottom: 3rem; }
    .hp-gallery-frame { padding: 0.5rem 0.4rem 1.2rem; border-width: 0.25rem; }
    .hp-gallery-header { padding: 0 0.5rem; }
    .hp-gallery-name { font-size: 1.6rem; }
    .hp-gallery-action-btn { font-size: 0.85rem; padding: 0.3rem 0.6rem; }
    .hp-gallery-scroll { padding: 1rem 0.5rem; gap: 0.5rem; }
    .hp-gallery-img { height: 10rem; border-width: 0.15rem; border-radius: 0.5rem; }
    .hp-edit-grid { grid-template-columns: repeat(3, 1fr); gap: 0.5rem; padding: 1rem 0.5rem; }
    .hp-delete-badge { width: 1.6rem; height: 1.6rem; font-size: 1rem; line-height: 1.6rem; }
    .hp-gallery-empty { font-size: 1rem; padding: 1.5rem 0.5rem; }
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

  // #rootの幅制限を外す
  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    const prev = root.style.maxWidth;
    root.style.maxWidth = "100%";
    return () => { root.style.maxWidth = prev; };
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const upcoming = events.filter((e) => e.date >= today);
  const past = events.filter((e) => e.date < today).reverse();
  const isAdmin = user.state === "admin";

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="hp-body" style={{ minHeight: "100svh" }}>
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

      <main id="hp-events">
        <h2 className="hp-section-title">Events</h2>
        <div className="hp-events">
          {loading ? (
            <p className="hp-events-empty">読み込み中...</p>
          ) : (
            <>
              <section>
                <p className="hp-sub-title">これから</p>
                {upcoming.length === 0
                  ? <p className="hp-events-empty">イベントがありません</p>
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
        </div>
      </main>

      <div id="hp-galleries" className="hp-galleries-wrap">
        <h2 className="hp-section-title">Memories</h2>
        <div className="hp-galleries-inner">
          <GallerySection title="Mirror Moments" urls={galleries.mirrorUrls} gallery="mirror" isAdmin={isAdmin} />
          <GallerySection title="Cutest Moments" urls={galleries.cuteUrls} gallery="cute" isAdmin={isAdmin} />
        </div>
      </div>
    </div>
  );
}
