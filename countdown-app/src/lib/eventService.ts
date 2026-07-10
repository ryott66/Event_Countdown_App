import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, setDoc, arrayUnion,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";
import { compressImage, type ImageProfile } from "./imageCompression";
import { GALLERIES, type GalleryKey } from "../constants/galleries";
import type { ThemeKey } from "../constants/themes";
import type { Event, EventLocation } from "../types";

export interface EventInput {
  title: string;
  date: string;
  emoji: string;
  theme: ThemeKey;
  memo: string;
  iconUrl: string;
  heroImageUrl?: string;
  imageUrls: string[];
  useCustomPage: boolean;
  customPageKey: string;
  seriesId?: string;
  customData?: Record<string, unknown>;
  location?: EventLocation;
  createdBy: string;
}

export async function uploadImage(
  file: File,
  eventId: string,
  folder = "",
  profile: ImageProfile = "gallery",
): Promise<string> {
  const { blob, contentType, ext } = await compressImage(file, profile);
  const baseName = file.name.replace(/\.[^.]+$/, "");
  const filename = `${Date.now()}_${baseName}.${ext}`;
  const path = folder
    ? `events/${eventId}/${folder}/${filename}`
    : `events/${eventId}/${filename}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob, {
    contentType,
    cacheControl: "public, max-age=31536000, immutable",
  });
  return getDownloadURL(storageRef);
}

export async function deleteImage(url: string): Promise<void> {
  const storageRef = ref(storage, url);
  await deleteObject(storageRef);
}

// Firestore は undefined を受け付けないため、未定義フィールドを取り除く
function stripUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
}

export async function createEvent(input: EventInput) {
  return addDoc(collection(db, "events"), {
    ...stripUndefined(input),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateEvent(id: string, input: Partial<EventInput>) {
  await updateDoc(doc(db, "events", id), {
    ...stripUndefined(input),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteEvent(id: string) {
  await deleteDoc(doc(db, "events", id));
}

// "YYYY-MM-DD" の年を1つ繰り上げる
function bumpYear(dateStr: string): string {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  parts[0] = String(Number(parts[0]) + 1);
  return parts.join("-");
}

// 既存イベントを複製して翌年の新規イベントを作る。
// customPageKey / seriesId / customData / theme などは引き継ぎ、
// 日付は翌年へ、写真(imageUrls)はクリアする。
export async function duplicateEvent(source: Event, createdBy: string) {
  const input: EventInput = {
    title: source.title,
    date: bumpYear(source.date),
    emoji: source.emoji,
    theme: source.theme,
    memo: source.memo ?? "",
    iconUrl: source.iconUrl ?? "",
    heroImageUrl: source.heroImageUrl,
    imageUrls: [],
    useCustomPage: source.useCustomPage,
    customPageKey: source.customPageKey,
    seriesId: source.seriesId,
    customData: source.customData,
    location: source.location,
    createdBy,
  };
  return createEvent(input);
}

export async function addToGallery(gallery: GalleryKey, urls: string[]): Promise<void> {
  const field = GALLERIES[gallery].field;
  await setDoc(doc(db, "config", "galleries"), { [field]: arrayUnion(...urls) }, { merge: true });
}

export async function updateGalleryOrder(gallery: GalleryKey, urls: string[]): Promise<void> {
  const field = GALLERIES[gallery].field;
  await setDoc(doc(db, "config", "galleries"), { [field]: urls }, { merge: true });
}
