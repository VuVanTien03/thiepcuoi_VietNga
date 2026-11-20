import React from 'react';
import { SageHeartMark } from './SageArtwork';

interface FallingHeartSpec {
  leftPct: number;
  sizePx: number;
  color: string;
  maxOpacity: number;
  durationSec: number;
  delaySec: number;
  swayPx: number;
  rotateDeg: number;
}

const FALLING_HEARTS: FallingHeartSpec[] = [
  { leftPct: 7, sizePx: 12, color: '#E58C9C', maxOpacity: 0.52, durationSec: 12.5, delaySec: -2.2, swayPx: 18, rotateDeg: 22 },
  { leftPct: 21, sizePx: 10, color: '#F4B9C4', maxOpacity: 0.45, durationSec: 15.0, delaySec: -8.6, swayPx: -16, rotateDeg: -26 },
  { leftPct: 37, sizePx: 14, color: '#EA98A7', maxOpacity: 0.48, durationSec: 13.8, delaySec: -4.9, swayPx: 14, rotateDeg: 18 },
  { leftPct: 68, sizePx: 11, color: '#F1A6B4', maxOpacity: 0.5, durationSec: 14.5, delaySec: -10.8, swayPx: -18, rotateDeg: -20 },
  { leftPct: 83, sizePx: 13, color: '#E58C9C', maxOpacity: 0.54, durationSec: 11.8, delaySec: -1.4, swayPx: 15, rotateDeg: 25 },
  { leftPct: 92, sizePx: 10, color: '#DC8293', maxOpacity: 0.42, durationSec: 16.0, delaySec: -6.7, swayPx: -12, rotateDeg: -18 },
];

/**
 * Hiệu ứng ít trái tim hồng phấn rơi nhẹ nhàng xuyên suốt thiệp cưới.
 */
export const FallingHeartsOverlay: React.FC = () => (
  <div
    className="falling-hearts-overlay"
    data-testid="falling-hearts-overlay"
    aria-hidden="true"
  >
    {FALLING_HEARTS.map((heart, idx) => (
      <span
        key={idx}
        className="falling-heart"
        style={{
          left: `${heart.leftPct}%`,
          width: heart.sizePx,
          height: heart.sizePx,
          color: heart.color,
          animationDuration: `${heart.durationSec}s`,
          animationDelay: `${heart.delaySec}s`,
          ['--fall-sway' as string]: `${heart.swayPx}px`,
          ['--fall-rot' as string]: `${heart.rotateDeg}deg`,
          ['--fall-op' as string]: String(heart.maxOpacity),
        }}
      >
        <SageHeartMark className="falling-heart__icon" />
      </span>
    ))}
  </div>
);
