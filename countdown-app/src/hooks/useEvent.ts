import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Event } from "../types";

export function useEvent(id: string | undefined | null) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) {
      setEvent(null);
      setLoading(false);
      return;
    }
    setLoading(true);
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
