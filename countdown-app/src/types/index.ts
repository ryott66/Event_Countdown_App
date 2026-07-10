import type { ThemeKey } from "../constants/themes";

export type AuthState = "admin" | "guest" | "unauthorized" | "loading";

export interface AppUser {
  state: AuthState;
  uid?: string;
  email?: string;
}

export interface EventLocation {
  name: string; // 表示名（例: "日光東照宮"）
  lat: number;
  lng: number;
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
  // 年に一度などの繰り返しイベントを関連付けるためのシリーズ識別子（例: "remina-birthday"）
  seriesId?: string;
  // カスタムページが解釈する年差分などの自由形式データ。各カスタムページが自分の型として読む。
  customData?: Record<string, unknown>;
  // イベントの場所（地図ピン）。未設定のイベントもあるため optional。
  location?: EventLocation;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
