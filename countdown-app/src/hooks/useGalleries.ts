import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

interface Galleries {
  mirrorUrls: string[];
  cuteUrls: string[];
}

export function useGalleries() {
  const [galleries, setGalleries] = useState<Galleries>({ mirrorUrls: [], cuteUrls: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "config", "galleries"), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setGalleries({ mirrorUrls: d.mirrorUrls ?? [], cuteUrls: d.cuteUrls ?? [] });
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { galleries, loading };
}
