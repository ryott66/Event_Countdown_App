import type { ThemeKey } from "../constants/themes";

export type AuthState = "admin" | "guest" | "unauthorized" | "loading";

export interface AppUser {
  state: AuthState;
  uid?: string;
  email?: string;
}

export interface Event {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
}
