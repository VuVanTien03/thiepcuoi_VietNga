import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface BurstHeart {
  id: number;
  dx: number;
  scale: number;
}

interface HeartBurstButtonProps {
  initialLikes?: number;
  variant?: 'rail' | 'mobile';
}

/**
 * Nút Thả Tim kèm hiệu ứng nảy & tim bay lên (như nút Like của CineLove).
 */
export const HeartBurstButton: React.FC<HeartBurstButtonProps> = ({
  initialLikes = 68,
  variant = 'rail',
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [shaking, setShaking] = useState(false);
  const [bursts, setBursts] = useState<BurstHeart[]>([]);

  const handleLike = () => {
    setLikes((n) => n + 1);
    setShaking(true);
    window.setTimeout(() => setShaking(false), 320);

    const newBursts: BurstHeart[] = [0, 1, 2].map((idx) => ({
      id: Date.now() + idx + Math.random(),
      dx: (idx - 1) * 14 + (Math.random() * 8 - 4),
      scale: 0.75 + Math.random() * 0.45,
    }));

    const newIds = new Set(newBursts.map((b) => b.id));
    setBursts((prev) => [...prev.slice(-9), ...newBursts]);
    window.setTimeout(() => {
      setBursts((prev) => prev.filter((b) => !newIds.has(b.id)));
    }, 1100);
  };

  if (variant === 'mobile') {
    return (
      <button
        type="button"
        className={`mobile-quick-btn mobile-like-btn ${shaking ? 'like-shake' : ''}`}
        onClick={handleLike}
        aria-label={`Thả tim chúc phúc (${likes})`}
      >
        <Heart size={18} fill="#E58C9C" color="#D67687" />
        <span className="mobile-like-badge">{likes > 999 ? '999+' : likes}</span>
        <span className="like-burst-layer" aria-hidden="true">
          {bursts.map((b) => (
            <Heart
              key={b.id}
              size={14}
              fill="#F19AA9"
              color="#D67687"
              className="like-burst-heart"
              style={{
                ['--dx' as string]: `${b.dx}px`,
                ['--sc' as string]: String(b.scale),
              }}
            />
          ))}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className="feed-rail__action"
      onClick={handleLike}
      aria-label={`Thả tim chúc phúc (${likes})`}
    >
      <span
        className={`feed-rail__icon feed-rail__icon--like ${
          shaking ? 'like-shake' : ''
        }`}
      >
        <Heart size={20} fill="#E58C9C" color="#D67687" />
        <span className="like-burst-layer" aria-hidden="true">
          {bursts.map((b) => (
            <Heart
              key={b.id}
              size={14}
              fill="#F19AA9"
              color="#D67687"
              className="like-burst-heart"
              style={{
                ['--dx' as string]: `${b.dx}px`,
                ['--sc' as string]: String(b.scale),
              }}
            />
          ))}
        </span>
      </span>
      <span className="feed-rail__label">{likes}</span>
    </button>
  );
};
