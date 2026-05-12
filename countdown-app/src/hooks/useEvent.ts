import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Event } from "../types";

export function useEvent(id: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "events", id), (snap) => {
      if (snap.exists()) {
        setEvent({
          id: snap.id,
          ...snap.data(),
          createdAt: snap.data().createdAt?.toDate() ?? new Date(),
          updatedAt: snap.data().updatedAt?.toDate() ?? new Date(),
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
