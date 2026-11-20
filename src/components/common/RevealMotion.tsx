import React, { createContext, RefObject, useContext, useEffect, useRef, useState } from 'react';
import { useCardReveal } from '../../hooks/useCardEffects';

export type RevealDirection = 'slide-up' | 'slide-right' | 'slide-left' | 'fade-in';

const ScrollRootContext = createContext<RefObject<HTMLElement | null> | undefined>(
  undefined,
);

export const CardScrollRootProvider: React.FC<{
  scrollRef: RefObject<HTMLElement | null>;
  children: React.ReactNode;
}> = ({ scrollRef, children }) => (
  <ScrollRootContext.Provider value={scrollRef}>
    {children}
  </ScrollRootContext.Provider>
);

interface RevealMotionProps {
  children: React.ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  immediate?: boolean;
  className?: string;
}

/**
 * Hiệu ứng xuất hiện theo hướng (slide-up / slide-right / slide-left) dài 1.3s ease-out
 * khớp hoàn toàn với transition của template CineLove 44.
 */
export const RevealMotion: React.FC<RevealMotionProps> = ({
  children,
  direction = 'slide-up',
  delay = 0,
  duration = 1.3,
  immediate = false,
  className = '',
}) => {
  const scrollRoot = useContext(ScrollRootContext);
  const elRef = useRef<HTMLDivElement | null>(null);
  const [mountedReady, setMountedReady] = useState(!immediate);
  const inView = useCardReveal(elRef, {
    rootRef: scrollRoot,
    immediate: false,
  });

  useEffect(() => {
    if (!immediate) return;
    const id = window.requestAnimationFrame(() => setMountedReady(true));
    return () => window.cancelAnimationFrame(id);
  }, [immediate]);

  const isVisible = immediate ? mountedReady : inView;

  return (
    <div
      ref={elRef}
      className={`reveal-motion reveal-motion--${direction} ${
        isVisible ? 'reveal-motion--visible' : ''
      } ${className}`.trim()}
      style={{
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
};
