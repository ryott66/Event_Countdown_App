import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { Event } from "../types";

// カスタムページを追加するときはここに登録するだけでOK
// 各ページは個別の chunk に分割され、必要になったときだけダウンロードされる
export const customPageRegistry: Record<
  string,
  LazyExoticComponent<ComponentType<{ event: Event }>>
> = {
  "birthday-2026": lazy(() => import("./birthday-2026")),
};
