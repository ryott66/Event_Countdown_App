import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, setDoc, arrayUnion,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";
import { compressImage } from "./imageCompression";
import { GALLERIES, type GalleryKey } from "../constants/galleries";
import type { ThemeKey } from "../constants/themes";

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
  createdBy: string;
}

export async function uploadImage(file: File, eventId: string, folder = ""): Promise<string> {
  const blob = await compressImage(file);
  const filename = `${Date.now()}_${file.name.replace(/\.[^.]+$/, "")}.jpg`;
  const path = folder
    ? `events/${eventId}/${folder}/${filename}`
    : `events/${eventId}/${filename}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob, {
    contentType: "image/jpeg",
    cacheControl: "public, max-age=31536000, immutable",
  });
  return getDownloadURL(storageRef);
}

export async function deleteImage(url: string): Promise<void> {
  const storageRef = ref(storage, url);
  await deleteObject(storageRef);
}

export async function createEvent(input: EventInput) {
  return addDoc(collection(db, "events"), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateEvent(id: string, input: Partial<EventInput>) {
  await updateDoc(doc(db, "events", id), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteEvent(id: string) {
  await deleteDoc(doc(db, "events", id));
}

export async function addToGallery(gallery: GalleryKey, urls: string[]): Promise<void> {
  const field = GALLERIES[gallery].field;
  await setDoc(doc(db, "config", "galleries"), { [field]: arrayUnion(...urls) }, { merge: true });
}

export async function updateGalleryOrder(gallery: GalleryKey, urls: string[]): Promise<void> {
  const field = GALLERIES[gallery].field;
  await setDoc(doc(db, "config", "galleries"), { [field]: urls }, { merge: true });
}
