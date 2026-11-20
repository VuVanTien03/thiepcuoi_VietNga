import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useInvitationFlow } from '../hooks/useInvitationFlow';
import { AnimationTimingConfig } from '../types/wedding';

const TEST_TIMINGS: AnimationTimingConfig = {
  flapOpenDurationMs: 750,
  polaroidRiseDurationMs: 1350,
  holdAfterEmergeMs: 2000,
  cloudTransitionDurationMs: 1700,
};

describe('useInvitationFlow state machine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('transitions from envelope-idle -> opening -> polaroid-emerged -> 2s hold -> cloud-transition -> main-invitation', () => {
    const onOpenStart = vi.fn();
    const { result } = renderHook(() =>
      useInvitationFlow(TEST_TIMINGS, onOpenStart),
    );

    expect(result.current.stage).toBe('envelope-idle');
    expect(result.current.isMainVisible).toBe(false);

    // Click envelope
    act(() => {
      result.current.openEnvelope();
    });

    expect(onOpenStart).toHaveBeenCalledTimes(1);
    expect(result.current.stage).toBe('envelope-opening');

    // Polaroid finishes rising after 320ms delay + 1350ms rise = 1670ms
    act(() => {
      vi.advanceTimersByTime(1670);
    });
    expect(result.current.stage).toBe('polaroid-emerged');
    expect(result.current.isCloudOverlayActive).toBe(false);

    // Still holding during the 2-second window (e.g., at 1999ms)
    act(() => {
      vi.advanceTimersByTime(1999);
    });
    expect(result.current.stage).toBe('polaroid-emerged');

    // Exactly at +2000ms, cloud mist transition starts
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.stage).toBe('cloud-transition');
    expect(result.current.isCloudOverlayActive).toBe(true);
    expect(result.current.isMainVisible).toBe(false);

    // Main invitation swaps in underneath peak clouds (~45% of 1700ms = 765ms)
    act(() => {
      vi.advanceTimersByTime(765);
    });
    expect(result.current.isMainVisible).toBe(true);
    expect(result.current.isCloudOverlayActive).toBe(true);

    // Cloud overlay finishes and lands cleanly on main-invitation
    act(() => {
      vi.advanceTimersByTime(935);
    });
    expect(result.current.stage).toBe('main-invitation');
    expect(result.current.isCloudOverlayActive).toBe(false);
    expect(result.current.isMainVisible).toBe(true);
  });
});
