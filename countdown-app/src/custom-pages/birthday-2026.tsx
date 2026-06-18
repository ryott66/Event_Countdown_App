import BirthdayTemplate, { type BirthdayCustomData } from "./birthday";
import type { Event } from "../types";

// ========================================
// Remina's Birthday 2026 — レガシー互換アダプタ
//
// 旧 customPageKey "birthday-2026" を指す既存ドキュメントを壊さないための一時ファイル。
// 2026年固有の値を customData として汎用テンプレ (birthday.tsx) に渡すだけ。
// 既存ドキュメントを customPageKey "birthday" + 下記 customData へ移行したら、
// このファイルと registry の "birthday-2026" 登録は削除してよい。
// ========================================

const BASE = import.meta.env.BASE_URL;

const LEGACY_2026: BirthdayCustomData = {
  name: "Remina",
  coupleName: "Ryo & Remina",
  // 2025=23 / 2026=24 / 2027=25 → 2002年生まれ。以降は event.date の年から年齢を自動計算。
  birthYear: 2002,
  bookImages: [
    `${BASE}images/book-image/first.webp`,
    `${BASE}images/book-image/book1.webp`,
    `${BASE}images/book-image/book2.webp`,
    `${BASE}images/book-image/book3.webp`,
    `${BASE}images/book-image/book4.webp`,
    `${BASE}images/book-image/book5.webp`,
    `${BASE}images/book-image/book6.webp`,
    `${BASE}images/book-image/book7.webp`,
    `${BASE}images/book-image/book8.webp`,
    `${BASE}images/book-image/last.webp`,
  ],
  trip: { heading: "2025", title: "Karuizawa", dates: "6/26~6/27", message: "Thank you" },
  footerMessage: "大好きなれみちゃん、いつもありがとう😄",
};

export default function Birthday2026({ event }: { event: Event }) {
  // ドキュメント側に customData があればそちらを優先（レガシー値はフォールバック）
  const customData = { ...LEGACY_2026, ...(event.customData as BirthdayCustomData | undefined) };
  return <BirthdayTemplate event={{ ...event, customData }} />;
}
