// イベントテーマの一元定義。
// EventFormPage はここの label / emoji を、
// EventDetailPage はここの bg / accent / numColor / confettiColors を参照する。
export const THEMES = {
  birthday: {
    label: "🎂 Birthday",
    bg: "linear-gradient(160deg, #fff0f5 0%, #ffe4ef 100%)",
    accent: "#e68ab6",
    numColor: "rgb(200, 247, 255)",
    numBg: "rgba(230, 138, 182, 0.7)",
    confettiColors: ["#ff9ec4", "#ffb3d1", "#fff0f5", "#ff69a5", "#ffd6e7"],
  },
  travel: {
    label: "✈️ Travel",
    bg: "linear-gradient(160deg, #e3f6ff 0%, #c8ecff 100%)",
    accent: "#4fc3f7",
    numColor: "rgb(200, 247, 255)",
    numBg: "rgba(79, 195, 247, 0.6)",
    confettiColors: ["#4fc3f7", "#81d4fa", "#b3e5fc", "#29b6f6", "#e3f6ff"],
  },
  anniversary: {
    label: "🥂 Anniversary",
    bg: "linear-gradient(160deg, #fce4ec 0%, #f8bbd9 100%)",
    accent: "#8b1a4a",
    numColor: "rgb(255, 220, 235)",
    numBg: "rgba(139, 26, 74, 0.6)",
    confettiColors: ["#8b1a4a", "#c2185b", "#f06292", "#fce4ec", "#ff80ab"],
  },
  date: {
    label: "🍽️ Date",
    bg: "linear-gradient(160deg, #fff3e0 0%, #ffe0b2 100%)",
    accent: "#ff8a50",
    numColor: "rgb(255, 245, 220)",
    numBg: "rgba(255, 138, 80, 0.6)",
    confettiColors: ["#ff8a50", "#ffb74d", "#ffd54f", "#fff3e0", "#ffcc02"],
  },
} as const;

export type ThemeKey = keyof typeof THEMES;
export const THEME_KEYS = Object.keys(THEMES) as ThemeKey[];
