import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, ZoomIn } from 'lucide-react';
import { FilmstripFrame } from '../../types/wedding';

interface FilmstripReelProps {
  frames: FilmstripFrame[];
  forcePaused?: boolean;
  onSelectFrame: (frame: FilmstripFrame) => void;
}

const SPROCKET_INDICES = Array.from({ length: 10 }, (_, idx) => idx);
const FILM_SPEED_PX_PER_SEC = 44;

/**
 * Thước phim 35mm chạy cuộn dọc liên tục như máy chiếu phim:
 * Lỗ phim, mã phim cạnh dải và các khung hình cùng chuyển động đồng bộ,
 * kèm nút tạm dừng/chạy lại và chạm vào từng khung hình để phóng to.
 */
export const FilmstripReel: React.FC<FilmstripReelProps> = ({
  frames,
  forcePaused = false,
  onSelectFrame,
}) => {
  const copyRef = useRef<HTMLDivElement | null>(null);
  const [copyHeight, setCopyHeight] = useState(900);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const node = copyRef.current;
    if (!node) return;

    const update = () => {
      if (node.offsetHeight > 0) {
        setCopyHeight(node.offsetHeight);
      }
    };
    update();

    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [frames.length]);

  if (frames.length === 0) return null;

  const isRunning = !userPaused && !forcePaused;
  const durationSec = Math.max(10, Number((copyHeight / FILM_SPEED_PX_PER_SEC).toFixed(2)));

  return (
    <div className="filmstrip-frame" data-testid="filmstrip-reel">
      {/* Thanh máy chiếu trên */}
      <div className="filmstrip-reel-bar">
        <div className="filmstrip-reel-bar__brand">
          <svg
            className={`filmstrip-reel-icon ${isRunning ? 'filmstrip-reel-icon--spinning' : ''}`}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="2.4" fill="currentColor" />
            <circle cx="12" cy="6.2" r="1.5" fill="currentColor" />
            <circle cx="17.5" cy="10.2" r="1.5" fill="currentColor" />
            <circle cx="15.4" cy="16.7" r="1.5" fill="currentColor" />
            <circle cx="8.6" cy="16.7" r="1.5" fill="currentColor" />
            <circle cx="6.5" cy="10.2" r="1.5" fill="currentColor" />
          </svg>
          <span>SAGE 35MM · REEL</span>
          <span
            className={`filmstrip-reel-dot ${isRunning ? 'filmstrip-reel-dot--live' : ''}`}
            aria-hidden="true"
          />
        </div>

        <button
          type="button"
          className="filmstrip-toggle-btn"
          onClick={() => setUserPaused((prev) => !prev)}
          aria-pressed={userPaused}
          aria-label={
            userPaused ? 'Tiếp tục chạy thước phim' : 'Tạm dừng thước phim'
          }
        >
          {userPaused ? <Play size={11} /> : <Pause size={11} />}
          <span>{userPaused ? 'Chạy phim' : 'Tạm dừng'}</span>
        </button>
      </div>

      {/* Cửa sổ chiếu cuộn phim liên tục */}
      <div className="filmstrip-viewport">
        <div
          className="filmstrip-track"
          data-testid="filmstrip-track"
          style={{
            animationDuration: `${durationSec}s`,
            animationPlayState: isRunning ? 'running' : 'paused',
          }}
        >
          {[0, 1].map((copyIdx) => {
            const isClone = copyIdx > 0;
            return (
              <div
                key={copyIdx}
                ref={copyIdx === 0 ? copyRef : undefined}
                aria-hidden={isClone || undefined}
                className={
                  isClone
                    ? 'filmstrip-copy filmstrip-copy--clone'
                    : 'filmstrip-copy'
                }
              >
                {frames.map((frame, idx) => (
                  <div
                    key={`${copyIdx}-${frame.id}`}
                    className="filmstrip-unit"
                  >
                    <div
                      className="filmstrip-rail filmstrip-rail--left"
                      aria-hidden="true"
                    >
                      <span className="filmstrip-code filmstrip-code--left">
                        SAGE 400 · ► {41 + idx}
                      </span>
                      <div className="filmstrip-sprockets">
                        {SPROCKET_INDICES.map((holeIdx) => (
                          <span key={holeIdx} className="filmstrip-hole" />
                        ))}
                      </div>
                    </div>

                    <div className="filmstrip-cell">
                      <button
                        type="button"
                        className="filmstrip-cell__btn"
                        tabIndex={isClone ? -1 : undefined}
                        onClick={() => onSelectFrame(frame)}
                        aria-label={`Xem phóng to ảnh: ${frame.subtitle}`}
                      >
                        <figure className="filmstrip-cell__figure">
                          <div className="filmstrip-cell__media">
                            <img
                              src={frame.imageUrl}
                              alt={isClone ? '' : frame.subtitle}
                              className="filmstrip-cell__img"
                              style={{
                                objectPosition: frame.objectPosition ?? '50% 35%',
                                animationDelay: `${idx * -4.2}s`,
                                animationPlayState: isRunning ? 'running' : 'paused',
                              }}
                            />
                          </div>
                          <span className="filmstrip-cell__zoom-hint" aria-hidden="true">
                            <ZoomIn size={13} />
                          </span>
                          <figcaption className="filmstrip-cell__scrim">
                            {frame.subtitle}
                          </figcaption>
                        </figure>
                      </button>
                    </div>

                    <div
                      className="filmstrip-rail filmstrip-rail--right"
                      aria-hidden="true"
                    >
                      <div className="filmstrip-sprockets">
                        {SPROCKET_INDICES.map((holeIdx) => (
                          <span key={holeIdx} className="filmstrip-hole" />
                        ))}
                      </div>
                      <span className="filmstrip-code filmstrip-code--right">
                        BOTANICAL 2010TX · {11 + idx}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Đường ray cổng chiếu + ánh sáng máy chiếu + mờ viền trên/dưới */}
        <div className="filmstrip-gate-rails" aria-hidden="true" />
        <div className="filmstrip-gate-fx" aria-hidden="true" />
        <div className="filmstrip-gate-mask filmstrip-gate-mask--top" aria-hidden="true" />
        <div className="filmstrip-gate-mask filmstrip-gate-mask--bottom" aria-hidden="true" />
      </div>

      {/* Thanh chân cuộn phim nối mượt vào đồng hồ đếm ngược */}
      <div className="filmstrip-reel-footer" aria-hidden="true">
        <span>MEMORY FILM · 24FPS</span>
        <span>Chạm ảnh để phóng to</span>
      </div>
    </div>
  );
};
