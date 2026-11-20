import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

interface UseCardRevealOptions {
  rootRef?: RefObject<HTMLElement | null>;
  immediate?: boolean;
}

/**
 * Quan sát phần tử đi vào vùng nhìn thấy của khung thiệp để kích hoạt hiệu ứng trượt CineLove.
 */
export function useCardReveal(
  targetRef: RefObject<HTMLElement | null>,
  { rootRef, immediate = false }: UseCardRevealOptions = {},
): boolean {
  const [revealed, setRevealed] = useState(immediate);

  useEffect(() => {
    if (immediate) {
      setRevealed(true);
      return;
    }

    const node = targetRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }

    const root = rootRef?.current ?? null;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            setRevealed(true);
            observer.disconnect();
            break;
          }
        }
      },
      {
        root,
        threshold: 0.04,
        rootMargin: '0px 0px -24px 0px',
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [targetRef, rootRef, immediate]);

  return revealed;
}

interface UseAutoScrollOptions {
  unlocked: boolean;
  speedPxPerMs?: number;
}

/**
 * Tự động cuộn thiệp mượt mà (tương tự module AutoScroll speed=0.06 của CineLove),
 * tự dừng khi người dùng cuộn tay/chạm màn hình và có thể bật lại bất kỳ lúc nào.
 */
export function useAutoScroll(
  scrollRef: RefObject<HTMLElement | null>,
  { unlocked, speedPxPerMs = 0.055 }: UseAutoScrollOptions,
) {
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const activeRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const stopAutoScroll = useCallback(() => {
    activeRef.current = false;
    setIsAutoScrolling(false);
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const startAutoScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || !unlocked) return;

    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
    }

    const initialMax = Math.max(
      0,
      container.scrollHeight - container.clientHeight,
    );
    if (initialMax <= 1) {
      stopAutoScroll();
      return;
    }

    // Nếu người dùng bấm tự động cuộn lại khi đang ở đáy trang thì quay về đầu trang
    if (container.scrollTop >= initialMax - 2) {
      container.scrollTop = 0;
    }

    activeRef.current = true;
    setIsAutoScrolling(true);

    let lastTs: number | null = null;
    let elapsed = 0;
    let virtualTop = container.scrollTop;
    let lastWrittenTop = container.scrollTop;
    const rampDist = Math.max(40, (600 * speedPxPerMs) / 2);

    const tick = (ts: number) => {
      const el = scrollRef.current;
      if (!el || !activeRef.current) return;

      const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
      if (maxScroll <= 1) {
        stopAutoScroll();
        return;
      }

      const now =
        typeof ts === 'number' && !Number.isNaN(ts) ? ts : performance.now();
      const dt = lastTs === null ? 16 : Math.max(0, Math.min(now - lastTs, 50));
      lastTs = now;
      elapsed += dt;

      // Chỉ đồng bộ lại khi người dùng thực sự kéo thanh cuộn (tránh lệch do làm tròn sub-pixel)
      if (Math.abs(el.scrollTop - lastWrittenTop) >= 8) {
        virtualTop = el.scrollTop;
      }

      const t = Math.min(1, elapsed / 600);
      const easeIn = t * t * (3 - 2 * t);
      const nearEndFactor = Math.max(
        0.15,
        Math.sqrt(Math.min(1, Math.max(0, maxScroll - virtualTop) / rampDist)),
      );

      virtualTop = Math.min(
        maxScroll,
        virtualTop + dt * speedPxPerMs * easeIn * nearEndFactor,
      );
      if (el.style) {
        el.style.scrollBehavior = 'auto';
      }
      el.scrollTop = virtualTop;
      lastWrittenTop = el.scrollTop;

      if (virtualTop >= maxScroll - 0.5) {
        stopAutoScroll();
        return;
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);
  }, [scrollRef, unlocked, speedPxPerMs, stopAutoScroll]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (!unlocked) {
        e.preventDefault();
        return;
      }
      if (activeRef.current) {
        stopAutoScroll();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!unlocked) {
        e.preventDefault();
        return;
      }
      if (activeRef.current) {
        stopAutoScroll();
      }
    };

    const handleTouchStart = () => {
      if (unlocked && activeRef.current) {
        stopAutoScroll();
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchstart', handleTouchStart);
    };
  }, [scrollRef, unlocked, stopAutoScroll]);

  useEffect(() => stopAutoScroll, [stopAutoScroll]);

  return {
    isAutoScrolling,
    startAutoScroll,
    stopAutoScroll,
  };
}
