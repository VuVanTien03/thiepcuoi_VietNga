import React, { useEffect, useRef, useState } from 'react';
import { GuestWish } from '../../types/wedding';

interface BlessingMarqueeProps {
  wishes: GuestWish[];
  visible: boolean;
}

/**
 * Dải lời chúc chạy trôi nhẹ ở góc dưới trái thiệp (CineLove #blessing-box),
 * phối thẻ kính mờ xanh lá nhẹ dịu, tự tạm dừng khi rê chuột hoặc chạm vào.
 */
export const BlessingMarquee: React.FC<BlessingMarqueeProps> = ({
  wishes,
  visible,
}) => {
  const copyRef = useRef<HTMLDivElement | null>(null);
  const [trackHeight, setTrackHeight] = useState(140);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const node = copyRef.current;
    if (!node) return;
    const update = () => setTrackHeight(Math.max(120, node.offsetHeight));
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(update);
    ro.observe(node);
    return () => ro.disconnect();
  }, [wishes.length]);

  if (!visible || wishes.length === 0) return null;

  const durationSec = Math.max(8, trackHeight / 28);

  return (
    <div
      className="blessing-marquee"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      aria-label="Lời chúc nổi bật"
    >
      <div className="blessing-marquee__offset">
        <div
          className="blessing-marquee__track"
          style={{
            animationDuration: `${durationSec}s`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {[0, 1].map((copyIdx) => (
            <div
              key={copyIdx}
              ref={copyIdx === 0 ? copyRef : undefined}
              aria-hidden={copyIdx > 0 || undefined}
              className="blessing-marquee__copy"
            >
              {wishes.map((w) => (
                <div key={`${copyIdx}-${w.id}`} className="blessing-marquee__pill">
                  <span>
                    <strong>{w.guestName}</strong>: {w.message}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
