// 既存画像（イベントアイコン・イベント写真・ギャラリー）をすべて
// 新しい圧縮設定 + Cache-Control 付きで再アップし、Firestore 参照を更新する。
import {
  collection, getDocs, doc, updateDoc, getDoc, setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";
import { compressImage } from "./imageCompression";

const NEW_CACHE_CONTROL = "public, max-age=31536000, immutable";

export interface MigrationProgress {
  done: number;
  total: number;
  savedBytes: number;
  failures: number;
  currentLabel: string;
}

interface MigrationTask {
  url: string;
  label: string;
  pathBase: string;
  apply: (newUrl: string) => Promise<void>;
}

async function reuploadOne(
  url: string,
  pathBase: string,
): Promise<{ newUrl: string; savedBytes: number }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${res.status}`);
  const blob = await res.blob();
  const before = blob.size;
  const file = new File([blob], "photo.jpg", { type: blob.type || "image/jpeg" });
  const compressed = await compressImage(file);
  const after = compressed.size;

  const filename = `${Date.now()}_opt.jpg`;
  const storagePath = `${pathBase}/${filename}`;
  const newRef = ref(storage, storagePath);
  await uploadBytes(newRef, compressed, {
    contentType: "image/jpeg",
    cacheControl: NEW_CACHE_CONTROL,
  });
  const newUrl = await getDownloadURL(newRef);

  try {
    await deleteObject(ref(storage, url));
  } catch {
    // 旧ファイル削除失敗は致命的でないので無視
  }

  return { newUrl, savedBytes: before - after };
}

export async function migrateAllImages(
  onProgress: (p: MigrationProgress) => void,
): Promise<{ total: number; failures: number; savedBytes: number }> {
  // 1) 全イベント取得
  const eventsSnap = await getDocs(collection(db, "events"));
  const events = eventsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }));

  // 2) ギャラリー設定取得
  const galleriesSnap = await getDoc(doc(db, "config", "galleries"));
  const galleries = galleriesSnap.exists() ? galleriesSnap.data() : {};
  const mirrorUrls: string[] = (galleries.mirrorUrls as string[]) ?? [];
  const cuteUrls: string[] = (galleries.cuteUrls as string[]) ?? [];

  // 3) タスク構築
  const tasks: MigrationTask[] = [];

  for (const ev of events) {
    const iconUrl = ev.iconUrl as string | undefined;
    const title = (ev.title as string) || ev.id;
    if (iconUrl) {
      tasks.push({
        url: iconUrl,
        label: `${title} (icon)`,
        pathBase: `events/${ev.id}`,
        apply: async (newUrl) => {
          await updateDoc(doc(db, "events", ev.id), { iconUrl: newUrl });
        },
      });
    }
    const imageUrls = (ev.imageUrls as string[] | undefined) ?? [];
    for (let i = 0; i < imageUrls.length; i++) {
      const oldUrl = imageUrls[i];
      tasks.push({
        url: oldUrl,
        label: `${title} (image ${i + 1})`,
        pathBase: `events/${ev.id}`,
        apply: async (newUrl) => {
          const snap = await getDoc(doc(db, "events", ev.id));
          const curr = (snap.data()?.imageUrls as string[] | undefined) ?? [];
          const replaced = curr.map((u) => (u === oldUrl ? newUrl : u));
          await updateDoc(doc(db, "events", ev.id), { imageUrls: replaced });
        },
      });
    }
  }

  for (const oldUrl of mirrorUrls) {
    tasks.push({
      url: oldUrl,
      label: "mirror gallery",
      pathBase: "events/galleries/mirror",
      apply: async (newUrl) => {
        const snap = await getDoc(doc(db, "config", "galleries"));
        const curr = (snap.data()?.mirrorUrls as string[] | undefined) ?? [];
        const replaced = curr.map((u) => (u === oldUrl ? newUrl : u));
        await setDoc(doc(db, "config", "galleries"), { mirrorUrls: replaced }, { merge: true });
      },
    });
  }
  for (const oldUrl of cuteUrls) {
    tasks.push({
      url: oldUrl,
      label: "cute gallery",
      pathBase: "events/galleries/cute",
      apply: async (newUrl) => {
        const snap = await getDoc(doc(db, "config", "galleries"));
        const curr = (snap.data()?.cuteUrls as string[] | undefined) ?? [];
        const replaced = curr.map((u) => (u === oldUrl ? newUrl : u));
        await setDoc(doc(db, "config", "galleries"), { cuteUrls: replaced }, { merge: true });
      },
    });
  }

  const total = tasks.length;
  let savedBytes = 0;
  let failures = 0;

  for (let i = 0; i < total; i++) {
    const t = tasks[i];
    onProgress({ done: i, total, savedBytes, failures, currentLabel: t.label });
    try {
      const { newUrl, savedBytes: saved } = await reuploadOne(t.url, t.pathBase);
      await t.apply(newUrl);
      savedBytes += saved;
    } catch (e) {
      console.error("migrate failed:", t.label, t.url, e);
      failures++;
    }
  }
  onProgress({ done: total, total, savedBytes, failures, currentLabel: "完了" });

  return { total, failures, savedBytes };
}
