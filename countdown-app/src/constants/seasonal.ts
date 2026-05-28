// シーズン演出（背景に流れる粒子）の設定。
// 月で4季節に切り替える。月境界の議論は深入りせず、日本の気候感に合わせて固定。
export type SeasonKey = "spring" | "summer" | "autumn" | "winter";

export interface SeasonConfig {
  chars: string[]; // ランダムで採用する粒子文字（絵文字）
  count: number; // 粒子数
  minDuration: number; // 最短落下秒数（小さいほど速い）
  maxDuration: number;
  minSize: number; // 最小フォントサイズ (rem)
  maxSize: number;
  minOpacity: number;
  maxOpacity: number;
}

export const SEASONS: Record<SeasonKey, SeasonConfig> = {
  spring: {
    chars: ["🌸", "🌸", "🌸", "🌷"],
    count: 14,
    minDuration: 12,
    maxDuration: 22,
    minSize: 0.9,
    maxSize: 1.6,
    minOpacity: 0.5,
    maxOpacity: 0.85,
  },
  summer: {
    chars: ["💠", "✿", "🌿", "🌱"],
    count: 10,
    minDuration: 15,
    maxDuration: 26,
    minSize: 0.8,
    maxSize: 1.4,
    minOpacity: 0.4,
    maxOpacity: 0.7,
  },
  autumn: {
    chars: ["🍁", "🍁", "🍂", "🍃"],
    count: 14,
    minDuration: 11,
    maxDuration: 20,
    minSize: 1.0,
    maxSize: 1.7,
    minOpacity: 0.55,
    maxOpacity: 0.9,
  },
  winter: {
    chars: ["❄", "❅", "❆", "❄"],
    count: 20,
    minDuration: 10,
    maxDuration: 18,
    minSize: 0.9,
    maxSize: 1.5,
    minOpacity: 0.5,
    maxOpacity: 0.85,
  },
};

export function getCurrentSeason(date = new Date()): SeasonKey {
  const month = date.getMonth() + 1; // 1-12
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}
