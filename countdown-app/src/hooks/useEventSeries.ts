import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Event } from "../types";

// 同じ seriesId を持つイベント（＝年に一度などの繰り返しイベントの全回）を取得する。
// where 等価のみで取得し、並べ替えはクライアント側で行う（複合インデックス不要）。
export function useEventSeries(seriesId: string | undefined | null) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(!!seriesId);

  // seriesId が変わった瞬間に同期的に state をリセットする。
  // useEffect 内で setState すると React 19 のルール (set-state-in-effect) に違反するため、
  // render 時に prev と比較して setState する公式パターンを採用（useEvent と同じ）。
  const [prevSeriesId, setPrevSeriesId] = useState(seriesId);
  if (prevSeriesId !== seriesId) {
    setPrevSeriesId(seriesId);
    setEvents([]);
    setLoading(!!seriesId);
  }

  useEffect(() => {
    if (!seriesId) return;
    const q = query(collection(db, "events"), where("seriesId", "==", seriesId));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          imageUrls: doc.data().imageUrls ?? [],
          createdAt: doc.data().createdAt?.toDate() ?? new Date(),
          updatedAt: doc.data().updatedAt?.toDate() ?? new Date(),
        })) as Event[];
        // 新しい年が先頭になるよう日付の降順で並べる
        data.sort((a, b) => b.date.localeCompare(a.date));
        setEvents(data);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsubscribe;
  }, [seriesId]);

  return { events, loading };
}
