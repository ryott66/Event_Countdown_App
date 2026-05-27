import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Event } from "../types";

export function useEvent(id: string | undefined | null) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(!!id);

  // id が変わった瞬間に同期的に state をリセット。
  // useEffect の中で setState すると React 19 のルール (set-state-in-effect) に違反する。
  // render 時に prev と比較して setState する公式パターンを採用。
  const [prevId, setPrevId] = useState(id);
  if (prevId !== id) {
    setPrevId(id);
    setEvent(null);
    setLoading(!!id);
  }

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, "events", id), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setEvent({
          id: snap.id,
          ...d,
          imageUrls: d.imageUrls ?? [],
          createdAt: d.createdAt?.toDate() ?? new Date(),
          updatedAt: d.updatedAt?.toDate() ?? new Date(),
        } as Event);
      } else {
        setEvent(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [id]);

  return { event, loading };
}
