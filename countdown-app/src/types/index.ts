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
  theme: "birthday" | "travel" | "anniversary" | "date";
  memo: string;
  iconUrl: string;
  imageUrls: string[];
  useCustomPage: boolean;
  customPageKey: string;
  recurring: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
