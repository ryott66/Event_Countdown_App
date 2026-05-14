import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";

export interface EventInput {
  title: string;
  date: string;
  emoji: string;
  theme: "birthday" | "travel" | "anniversary" | "date";
  memo: string;
  imageUrls: string[];
  mirrorUrls: string[];
  cuteUrls: string[];
  useCustomPage: boolean;
  customPageKey: string;
  recurring: boolean;
  createdBy: string;
}

export async function uploadImage(file: File, eventId: string, folder = ""): Promise<string> {
  const path = folder
    ? `events/${eventId}/${folder}/${Date.now()}_${file.name}`
    : `events/${eventId}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
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
