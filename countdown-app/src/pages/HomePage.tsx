import { useRef, useState, useEffect, useLayoutEffect, useCallback } from "react";
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
import { GALLERIES, type GalleryKey } from "../constants/galleries";
import EventCard from "../components/EventCard";
import TogetherCounter from "../components/TogetherCounter";

const css = `
  html { font-size: clamp(2px, 1.25vw, 16px); }
  .hp-body { background-color: #fff0f5; font-family: sans-serif; overflow-x: hidden; min-height: 100svh; }

  /* === Header === */
  .hp-header {
    height: 4rem; width: 100%;
    background-color: rgba(207,220,231,0.45);
    position: sticky; top: 0; z-index: 10;
    display: flex; align-items: center; padding: 0 1.2rem; gap: 0.8rem;
    backdrop-filter: blur(8px);
  }
  .hp-logo-wrap {
    flex: 1; display: flex; align-items: center; gap: 0.8rem; min-width: 0;
  }
  .hp-logo {
    font-family: "Dancing Script", cursive;
    font-size: 2.5rem; color: var(--pink);
    white-space: nowrap;
  }
  .hp-nav-btn {
    font-size: 1.2rem; font-family: "Dancing Script", cursive;
    padding: 0.45rem 1.15rem;
    background-color: rgba(229,166,220,0.7); color: #fff;
    border-radius: 0.65rem; box-shadow: 0 0.15rem #cbcbcb;
    border: none; cursor: pointer; white-space: nowrap;
  }
  .hp-nav-btn:active { position: relative; top: 0.15rem; box-shadow: none; }
  .hp-nav-btn:hover { background-color: rgba(229,166,220,0.85); }
  .hp-icon-btn {
    background: var(--pink); color: #fff;
    border-radius: 50%; width: 2.3rem; height: 2.3rem;
    font-size: 1.25rem; line-height: 1; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0.15rem #cbcbcb; border: none; cursor: pointer;
  }
  .hp-logout-btn {
    background: none; color: var(--text-light); font-size: 0.95rem;
    white-space: nowrap; border: none; cursor: pointer;
  }

  /* === Main 2-col Grid === */
  .hp-main {
    display: grid;
    grid-template-columns: 1fr 1.3fr;
    gap: 1.8rem;
    max-width: 1400px; margin: 0 auto;
    padding: 1.5rem 2rem 3rem;
    align-items: start;
  }
  .hp-events-section { min-width: 0; }
  .hp-memories-section {
    background-color: #f9f0d7;
    border-radius: 1rem;
    padding: 1rem 1rem 1.5rem;
    position: sticky; top: 5rem;
    min-width: 0;
    box-shadow: 0 4px 18px rgba(180,150,80,0.12);
  }

  /* === Section title === */
  .hp-section-title {
    font-family: "Dancing Script", cursive;
    color: rgba(230,138,182,0.9);
    font-size: 2.2rem;
    margin: 0 0 0.8rem;
    text-align: left;
  }

  /* === Events === */
  .hp-sub-title {
    font-size: 1.15rem; color: var(--text-light);
    margin-bottom: 0.5rem; margin-top: 1rem;
    font-family: "Dancing Script", cursive;
  }
  .hp-sub-title:first-of-type { margin-top: 0; }
  .hp-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.7rem; }
  .hp-events-empty { color: var(--text-light); font-size: 0.9rem; }

  /* 過去イベントの開閉ボタン */
  .hp-past-toggle { display: flex; justify-content: center; margin-top: 0.8rem; }
  .hp-past-toggle-btn {
    font-size: 0.9rem; padding: 0.35rem 1rem;
    border-radius: 0.6rem; border: 1.5px solid var(--pink);
    color: var(--pink); background: rgba(255,255,255,0.6);
    cursor: pointer; transition: background 0.15s;
    font-family: inherit;
  }
  .hp-past-toggle-btn:hover { background: rgba(230,138,182,0.18); }

  /* === Event Cards === */
  .ec-card {
    background: var(--card-bg); border-radius: 1.2rem;
    box-shadow: var(--shadow); cursor: pointer; overflow: hidden;
    transition: transform 0.15s;
  }
  .ec-card:hover { transform: translateY(-3px); }

  /* 当日カード: 枠に光点を散らした静的キラキラ + ふんわり明滅 */
  .ec-card-today {
    position: relative;
    box-shadow: 0 4px 18px rgba(230, 138, 182, 0.22);
  }
  .ec-card-today::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 3.5px;
    border-radius: inherit;
    background: conic-gradient(
      from 0deg,
      rgba(230, 138, 182, 0.55) 0%,
      #ffffff 7%,
      rgba(230, 138, 182, 0.55) 14%,
      rgba(230, 138, 182, 0.45) 23%,
      #ffe4ef 30%,
      rgba(230, 138, 182, 0.45) 37%,
      rgba(230, 138, 182, 0.55) 48%,
      #ffffff 55%,
      rgba(230, 138, 182, 0.55) 62%,
      rgba(230, 138, 182, 0.45) 73%,
      #ffe4ef 80%,
      rgba(230, 138, 182, 0.45) 87%,
      rgba(230, 138, 182, 0.55) 100%
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude;
    animation: ec-today-twinkle 2.6s ease-in-out infinite;
    pointer-events: none;
    z-index: 2;
  }
  @keyframes ec-today-twinkle {
    0%, 100% { opacity: 0.85; }
    50%      { opacity: 1; }
  }
  .ec-media { width: 100%; aspect-ratio: 4/3; position: relative; overflow: hidden; }
  .ec-photo { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ec-emoji-bg {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #fce4ec, #f8bbd0);
    font-size: 2rem;
  }
  .ec-upload-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.28);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.2s; font-size: 2rem;
    cursor: pointer; pointer-events: none;
  }
  .ec-media:hover .ec-upload-overlay { opacity: 1; pointer-events: auto; }
  .ec-info { padding: 0.45rem 0.6rem 0.6rem; }
  .ec-title {
    font-family: "Dancing Script", cursive; font-size: 0.95rem; color: var(--text);
    display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
    overflow: hidden; word-break: break-word; line-height: 1.2;
  }
  .ec-date { font-size: 0.7rem; color: var(--text-light); margin-top: 0.1rem; }
  .ec-memo {
    font-size: 0.65rem; color: var(--text-light); margin-top: 0.15rem;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    opacity: 0.8;
  }
  .ec-countdown { margin-top: 0.2rem; text-align: right; }
  .ec-days { font-family: "Dancing Script", cursive; font-size: 1.2rem; color: var(--pink); line-height: 1; }
  .ec-days-label { font-size: 0.6rem; color: var(--text-light); }
  .ec-today { color: var(--pink); font-family: "Dancing Script", cursive; font-size: 1.7rem; line-height: 1; }
  .ec-past-days { color: var(--text-light); font-size: 0.7rem; }

  /* === Memories === */
  .hp-gallery-block { margin-bottom: 1.2rem; }
  .hp-gallery-block:last-child { margin-bottom: 0; }
  .hp-gallery-frame {
    background: linear-gradient(90deg, #b39855 0%, #fff9e6 50%, #b39855 100%);
    border: 0.35rem solid #c9c9c9;
    padding: 0.6rem 0.6rem 1.2rem;
  }
  .hp-gallery-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 0; gap: 0.6rem; padding: 0 0.4rem;
  }
  .hp-gallery-name {
    font-family: "Kaushan Script", cursive;
    font-size: 1.6rem; color: rgb(140,140,140); margin: 0;
  }
  .hp-gallery-action-btn {
    font-size: 0.85rem; padding: 0.3rem 0.7rem;
    border-radius: 0.6rem; border: 1.5px solid var(--pink);
    color: var(--pink); background: rgba(255,255,255,0.6);
    white-space: nowrap; cursor: pointer;
  }
  .hp-gallery-action-btn:hover { background: rgba(230,138,182,0.25); }
  .hp-gallery-action-btn.done { background: var(--pink); color: #fff; }
  .hp-gallery-action-btn.done:hover { background: var(--pink-dark); }
  .hp-gallery-actions { display: flex; gap: 0.4rem; }

  /* 通常表示 */
  .hp-gallery-scroll {
    display: flex; overflow-x: auto;
    scroll-snap-type: x mandatory; gap: 0.6rem; padding: 0.8rem 0.5rem 0.5rem;
  }
  .hp-gallery-img {
    height: 15rem; border: 0.15rem solid rgb(128,128,128);
    border-radius: 0.6rem; object-fit: cover; display: block;
    scroll-snap-align: start; flex-shrink: 0;
    cursor: zoom-in; transition: transform 0.2s ease;
  }
  .hp-gallery-img:hover { transform: scale(1.02); }

  /* === Lightbox === */
  .hp-lightbox {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.85);
  }
  .hp-lightbox-scroll {
    width: 100%; height: 100%;
    display: flex; overflow-x: auto; overflow-y: hidden;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .hp-lightbox-scroll::-webkit-scrollbar { display: none; }
  .hp-lightbox-slide {
    flex: 0 0 100%; height: 100%;
    scroll-snap-align: center; scroll-snap-stop: always;
    display: flex; align-items: center; justify-content: center;
    padding: 1.5rem; box-sizing: border-box;
  }
  .hp-lightbox-slide img {
    max-width: 100%; max-height: 100%;
    border-radius: 1rem; object-fit: contain;
    box-shadow: 0 0 40px rgba(0,0,0,0.4);
  }
  .hp-lightbox-close {
    position: absolute; top: 0.75rem; right: 0.75rem;
    z-index: 1; border: none; background: rgba(255,255,255,0.95);
    color: #333; font-size: 2rem; width: 3rem; height: 3rem;
    border-radius: 50%; cursor: pointer; line-height: 1; padding: 0;
  }
  .hp-lightbox-close:hover { background: rgba(255,255,255,1); }
  .hp-lightbox-nav {
    position: absolute; top: 50%; transform: translateY(-50%);
    z-index: 1; border: none; background: rgba(255,255,255,0.9);
    color: #333; font-size: 2rem; width: 3rem; height: 3rem;
    border-radius: 50%; cursor: pointer; line-height: 1; padding: 0;
  }
  .hp-lightbox-nav.prev { left: 0.75rem; }
  .hp-lightbox-nav.next { right: 0.75rem; }
  .hp-lightbox-nav:hover { background: rgba(255,255,255,1); }
  .hp-lightbox-counter {
    position: absolute; bottom: 0.75rem; left: 50%;
    transform: translateX(-50%); z-index: 1;
    color: #fff; font-size: 0.9rem; padding: 0.3rem 0.8rem;
    background: rgba(0,0,0,0.4); border-radius: 1rem;
    pointer-events: none;
  }
  @media (max-width: 767px) {
    .hp-lightbox-nav { display: none; }
    .hp-lightbox-slide { padding: 0.5rem; }
  }

  /* 編集モード */
  .hp-edit-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem; padding: 0.8rem 0.5rem;
  }
  .hp-edit-photo {
    position: relative; border-radius: 0.4rem;
    overflow: hidden; aspect-ratio: 1; touch-action: none;
    border: 0.15rem solid rgb(128,128,128);
  }
  .hp-edit-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .hp-delete-badge {
    position: absolute; top: 0.2rem; right: 0.2rem;
    background: rgba(220,0,50,0.85); color: #fff;
    border-radius: 50%; width: 1.5rem; height: 1.5rem;
    font-size: 0.9rem; line-height: 1.5rem; text-align: center;
    box-shadow: 0 1px 4px rgba(0,0,0,0.3); border: none; cursor: pointer;
  }
  .hp-drag-hint {
    position: absolute; bottom: 0.2rem; left: 0.3rem;
    color: rgba(255,255,255,0.85); font-size: 1rem; line-height: 1;
    pointer-events: none;
    text-shadow: 0 0 4px rgba(0,0,0,0.4);
  }
  .hp-gallery-empty {
    color: rgb(167,167,167); font-size: 0.9rem;
    padding: 1.5rem 0.5rem; text-align: center;
  }

  /* === Tablet: stack columns === */
  @media (max-width: 1023px) {
    .hp-main {
      grid-template-columns: 1fr;
      gap: 1.5rem; padding: 1.2rem 1.5rem 2.5rem;
    }
    .hp-memories-section { position: static; }
    .hp-gallery-img { height: 18rem; }
    .hp-cards { grid-template-columns: repeat(auto-fill, minmax(125px, 1fr)); gap: 0.6rem; }
  }

  /* === Mobile === */
  @media (max-width: 767px) {
    html { font-size: 13px; }
    .hp-header {
      height: auto; padding: 0.6rem 0.8rem; gap: 0.45rem;
      flex-wrap: wrap;
    }
    .hp-logo-wrap { gap: 0.55rem; }
    .hp-logo { font-size: 2.05rem; }
    .hp-nav-btn { font-size: 1.05rem; padding: 0.38rem 0.85rem; border-radius: 0.55rem; }
    .hp-icon-btn { width: 2.1rem; height: 2.1rem; font-size: 1.1rem; }
    .hp-logout-btn { font-size: 0.88rem; }

    .hp-main { padding: 0.8rem 0.8rem 2rem; gap: 1.2rem; }
    .hp-memories-section { padding: 0.7rem 0.7rem 1rem; border-radius: 0.7rem; }
    .hp-section-title { font-size: 1.8rem; margin-bottom: 0.6rem; }
    .hp-sub-title { font-size: 1rem; margin-top: 0.7rem; }
    .hp-events-empty { font-size: 0.85rem; }

    .hp-cards { grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 0.5rem; }
    .ec-title { font-size: 0.9rem; }
    .ec-days { font-size: 1.15rem; }
    .ec-today { font-size: 1.55rem; }
    .ec-info { padding: 0.35rem 0.5rem 0.5rem; }
    .ec-emoji-bg { font-size: 1.8rem; }

    .hp-gallery-block { margin-bottom: 0.8rem; }
    .hp-gallery-frame { padding: 0.4rem 0.3rem 0.8rem; border-width: 0.2rem; }
    .hp-gallery-header { padding: 0 0.3rem; }
    .hp-gallery-name { font-size: 1.3rem; }
    .hp-gallery-action-btn { font-size: 0.75rem; padding: 0.25rem 0.55rem; }
    .hp-gallery-scroll { padding: 0.6rem 0.3rem 0.3rem; gap: 0.4rem; }
    .hp-gallery-img { height: 13rem; border-width: 0.12rem; border-radius: 0.4rem; }
    .hp-edit-grid { gap: 0.35rem; padding: 0.5rem 0.3rem; }
    .hp-delete-badge { width: 1.3rem; height: 1.3rem; font-size: 0.8rem; line-height: 1.3rem; }
    .hp-gallery-empty { font-size: 0.85rem; padding: 1rem 0.5rem; }
  }

  /* === Narrow phones (iPhone SE etc.) === */
  /* ヘッダーを1行に収めるため、ボタンとロゴをもう一段コンパクトに */
  @media (max-width: 480px) {
    .hp-header { padding: 0.5rem 0.55rem; gap: 0.35rem; }
    .hp-logo-wrap { gap: 0.4rem; }
    .hp-logo { font-size: 1.7rem; }
    .hp-nav-btn { font-size: 0.9rem; padding: 0.3rem 0.65rem; border-radius: 0.5rem; }
    .hp-icon-btn { width: 1.85rem; height: 1.85rem; font-size: 0.95rem; }
    .hp-logout-btn { font-size: 0.78rem; }
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
      <img src={url} alt="" loading="lazy" decoding="async" />
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
  title, urls, gallery, isAdmin, onOpen,
}: {
  title: string;
  urls: string[];
  gallery: GalleryKey;
  isAdmin: boolean;
  onOpen: (urls: string[], index: number) => void;
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
    if (confirm("この写真を削除しますか？")) {
      setLocalUrls((prev) => prev.filter((u) => u !== url));
    }
  };

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const u = await uploadImage(file, "galleries", gallery, "gallery");
      uploaded.push(u);
      setLocalUrls((prev) => [...prev, u]);
    }
    await addToGallery(gallery, uploaded);
    setUploading(false);
  };

  // localUrls は編集モード中のドラフトのみで使用する。
  // 非編集モード時は displayUrls = urls で props を直接参照するので、
  // urls との同期は enterEdit() が呼ばれた瞬間に行えば十分。
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
              <LazyGalleryImg
                key={i}
                src={src}
                index={i}
                onClick={() => onOpen(displayUrls, i)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const PAST_INITIAL_COUNT = 3;

export default function HomePage() {
  const { user, signInWithGoogle, signOutUser } = useAuth();
  const { events, loading } = useEvents();
  const { galleries } = useGalleries();
  const navigate = useNavigate();
  const [lightbox, setLightbox] = useState<{ urls: string[]; index: number } | null>(null);
  const [pastExpanded, setPastExpanded] = useState(false);
  const openLightbox = (urls: string[], index: number) => setLightbox({ urls, index });
  const closeLightbox = () => setLightbox(null);

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
        <div className="hp-logo-wrap">
          <span className="hp-logo">Our Home</span>
          <TogetherCounter />
        </div>
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
        {user.state === "guest" && (
          <button className="hp-logout-btn" onClick={() => signInWithGoogle()}>
            ログイン
          </button>
        )}
      </header>

      <div className="hp-main">
        <section className="hp-events-section" id="hp-events">
          <h2 className="hp-section-title">Events</h2>
          {loading ? (
            <p className="hp-events-empty">読み込み中...</p>
          ) : (
            <>
              <p className="hp-sub-title">これから</p>
              {upcoming.length === 0
                ? <p className="hp-events-empty">イベントがありません</p>
                : <div className="hp-cards">{upcoming.map((e) => <EventCard key={e.id} event={e} />)}</div>}
              {past.length > 0 && (
                <>
                  <p className="hp-sub-title">過去</p>
                  <div className="hp-cards">
                    {(pastExpanded ? past : past.slice(0, PAST_INITIAL_COUNT)).map((e) => (
                      <EventCard key={e.id} event={e} isPast />
                    ))}
                  </div>
                  {past.length > PAST_INITIAL_COUNT && (
                    <div className="hp-past-toggle">
                      <button
                        className="hp-past-toggle-btn"
                        onClick={() => setPastExpanded((v) => !v)}
                      >
                        {pastExpanded
                          ? "閉じる"
                          : `もっと見る (残り ${past.length - PAST_INITIAL_COUNT} 件)`}
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </section>

        <aside className="hp-memories-section" id="hp-galleries">
          <h2 className="hp-section-title">Memories</h2>
          {(Object.entries(GALLERIES) as [GalleryKey, typeof GALLERIES[GalleryKey]][]).map(([key, def]) => (
            <GallerySection
              key={key}
              title={def.title}
              urls={galleries[def.field] ?? []}
              gallery={key}
              isAdmin={isAdmin}
              onOpen={openLightbox}
            />
          ))}
        </aside>
      </div>

      {lightbox && (
        <Lightbox urls={lightbox.urls} initialIndex={lightbox.index} onClose={closeLightbox} />
      )}
    </div>
  );
}

// 画面内 + 300px手前まで来たときに初めて src を設定する遅延読み込み画像
// loading="lazy" は横スクロール内のオフスクリーン項目に効きにくいため自前で実装
// viewBox 3:4 ≒ スマホ縦写真の典型比率にして、実画像との横シフトを抑える
const LAZY_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 4'%3E%3C/svg%3E";

function LazyGalleryImg({
  src, onClick, index,
}: {
  src: string;
  onClick: () => void;
  index: number;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return;
    const el = ref.current;
    if (!el) return;

    // 1) 可視 or 近接ならすぐ読み込み（スクロールに追従）
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);

    // 2) バックグラウンドで段階的にプリフェッチ
    //    画面外の写真も時間差で先読みしておき、スクロール時のラグを抑える
    const prefetchDelay = 600 + index * 80;
    const timer = window.setTimeout(() => setShouldLoad(true), prefetchDelay);

    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [shouldLoad, index]);

  return (
    <img
      ref={ref}
      src={shouldLoad ? src : LAZY_PLACEHOLDER}
      alt=""
      className="hp-gallery-img"
      decoding="async"
      onClick={onClick}
      style={shouldLoad ? undefined : { background: "rgba(230,138,182,0.12)" }}
    />
  );
}

function Lightbox({
  urls, initialIndex, onClose,
}: {
  urls: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 初期表示: クリックされた写真にスクロール位置を合わせる
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * initialIndex, behavior: "instant" as ScrollBehavior });
  }, [initialIndex]);

  const navigateBy = useCallback((delta: number) => {
    const el = scrollRef.current;
    if (!el) return;
    setIndex((cur) => {
      const next = Math.max(0, Math.min(urls.length - 1, cur + delta));
      if (next === cur) return cur;
      el.scrollTo({ left: el.clientWidth * next, behavior: "smooth" });
      return next;
    });
  }, [urls.length]);

  // ESC で閉じる / ←→ で前後移動 / 背景スクロールロック
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") navigateBy(-1);
      else if (e.key === "ArrowRight") navigateBy(1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [navigateBy, onClose]);

  // スワイプ/スクロールに合わせて current index を追従
  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const newIndex = Math.round(el.scrollLeft / el.clientWidth);
    setIndex((cur) => (cur !== newIndex ? newIndex : cur));
  };

  return (
    <div className="hp-lightbox" onClick={onClose} role="dialog" aria-modal="true">
      <button type="button" className="hp-lightbox-close" onClick={onClose} aria-label="Close">×</button>
      <div className="hp-lightbox-scroll" ref={scrollRef} onScroll={onScroll}>
        {urls.map((url, i) => (
          <div key={i} className="hp-lightbox-slide">
            <img src={url} alt="" onClick={(e) => e.stopPropagation()} />
          </div>
        ))}
      </div>
      {index > 0 && (
        <button
          type="button" className="hp-lightbox-nav prev" aria-label="Previous"
          onClick={(e) => { e.stopPropagation(); navigateBy(-1); }}
        >‹</button>
      )}
      {index < urls.length - 1 && (
        <button
          type="button" className="hp-lightbox-nav next" aria-label="Next"
          onClick={(e) => { e.stopPropagation(); navigateBy(1); }}
        >›</button>
      )}
      {urls.length > 1 && (
        <div className="hp-lightbox-counter">{index + 1} / {urls.length}</div>
      )}
    </div>
  );
}
