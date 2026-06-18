import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { Event } from "../types";

// カスタムページを追加するときはここに登録するだけでOK
// 各ページは個別の chunk に分割され、必要になったときだけダウンロードされる
export const customPageRegistry: Record<
  string,
  LazyExoticComponent<ComponentType<{ event: Event }>>
> = {
  // 年非依存の汎用テンプレ。新しい年のイベントはこのキーを使う。
  "birthday": lazy(() => import("./birthday")),
  // 旧キーの後方互換。2026ドキュメントを "birthday" + customData へ移行したら削除可。
  "birthday-2026": lazy(() => import("./birthday-2026")),
};
