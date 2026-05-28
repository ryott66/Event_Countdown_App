import { useMemo } from "react";
import { SEASONS, getCurrentSeason, type SeasonKey } from "../constants/seasonal";

interface Props {
  // テスト用や手動切り替え用の override。通常は省略して自動判定。
  season?: SeasonKey;
}

interface Particle {
  char: string;
  style: React.CSSProperties;
}

// CSS 変数を React の style に渡すため、独自プロパティを許容する型キャストが必要。
type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

const css = `
  .sd-layer {
    position: fixed;
    inset: 0;
    pointer-events: none;
    /* hp-body の stacking context 内で、背景色とメインコンテンツの間に配置する */
    z-index: -1;
    overflow: hidden;
  }
  .sd-particle {
    position: absolute;
    top: -8vh;
    will-change: transform;
    left: var(--sd-x);
    font-size: var(--sd-size);
    opacity: var(--sd-opacity);
    animation: sd-fall var(--sd-duration) linear infinite;
    animation-delay: var(--sd-delay);
    user-select: none;
  }
  @keyframes sd-fall {
    0%   { transform: translate3d(0, 0, 0) rotate(0deg); }
    100% { transform: translate3d(var(--sd-sway), 115vh, 0) rotate(var(--sd-rotation)); }
  }
  /* アクセシビリティ: モーション抑制設定時は完全非表示 */
  @media (prefers-reduced-motion: reduce) {
    .sd-layer { display: none; }
  }
`;

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function SeasonalDecoration({ season }: Props = {}) {
  const activeSeason = season ?? getCurrentSeason();
  const config = SEASONS[activeSeason];

  // 粒子の配置はマウント時に1度だけ生成。再レンダーごとに変わるとちらつく。
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: config.count }, () => {
        const vars: CSSVars = {
          "--sd-x": `${rand(0, 100)}vw`,
          "--sd-duration": `${rand(config.minDuration, config.maxDuration)}s`,
          // 負のディレイで「既に降ってる途中」の状態から始める → 起動時に空中が空っぽにならない
          "--sd-delay": `${rand(-25, 0)}s`,
          "--sd-size": `${rand(config.minSize, config.maxSize)}rem`,
          "--sd-opacity": `${rand(config.minOpacity, config.maxOpacity)}`,
          "--sd-sway": `${rand(-80, 80)}px`,
          "--sd-rotation": `${rand(-360, 360)}deg`,
        };
        return {
          char: pick(config.chars),
          style: vars,
        };
      }),
    [config],
  );

  return (
    <div className="sd-layer" aria-hidden="true">
      <style>{css}</style>
      {particles.map((p, i) => (
        <span key={i} className="sd-particle" style={p.style}>
          {p.char}
        </span>
      ))}
    </div>
  );
}
