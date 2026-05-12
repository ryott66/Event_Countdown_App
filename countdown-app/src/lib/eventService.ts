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
  useCustomPage: boolean;
  customPageKey: string;
  recurring: boolean;
  createdBy: string;
}

export async function uploadImage(file: File, eventId: string): Promise<string> {
  const storageRef = ref(storage, `events/${eventId}/${Date.now()}_${file.name}`);
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
