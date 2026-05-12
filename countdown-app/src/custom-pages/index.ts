import type { ComponentType } from "react";
import type { Event } from "../types";
import Birthday2026 from "./birthday-2026";

// カスタムページを追加するときはここに登録するだけでOK
export const customPageRegistry: Record<string, ComponentType<{ event: Event }>> = {
  "birthday-2026": Birthday2026,
};
