import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimationTimingConfig, InvitationStage } from '../types/wedding';

export interface UseInvitationFlowReturn {
  stage: InvitationStage;
  isMainVisible: boolean;
  isCloudOverlayActive: boolean;
  openEnvelope: () => void;
  replayIntro: () => void;
  skipToMain: () => void;
}

const POLAROID_RISE_DELAY_MS = 320;

/**
 * Quản lý máy trạng thái (State Machine) của trải nghiệm mở thiệp:
 * 1. envelope-idle: Phong bì xanh rêu đung đưa nhẹ + dấu sáp mời chạm
 * 2. envelope-opening: Nắp phong bì mở & ảnh Polaroid cô dâu chú rể từ từ nhô lên
 * 3. polaroid-emerged: Ảnh đã nhô hẳn lên -> dừng 2 giây (holdAfterEmergeMs)
 * 4. cloud-transition: Hiệu ứng mây mờ lan tỏa che màn hình và tan ra trang chính
 * 5. main-invitation: Trang thiệp cưới chính
 */
export function useInvitationFlow(
  timings: AnimationTimingConfig,
  onOpenStart?: () => void,
): UseInvitationFlowReturn {
  const [stage, setStage] = useState<InvitationStage>('envelope-idle');
  const [isMainVisible, setIsMainVisible] = useState(false);
  const timersRef = useRef<number[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => clearAllTimers, [clearAllTimers]);

  const schedule = useCallback((fn: () => void, delayMs: number) => {
    const id = window.setTimeout(fn, delayMs);
    timersRef.current.push(id);
  }, []);

  const openEnvelope = useCallback(() => {
    if (stage !== 'envelope-idle') return;
    clearAllTimers();
    onOpenStart?.();
    setStage('envelope-opening');

    const emergeCompletedAt =
      POLAROID_RISE_DELAY_MS + timings.polaroidRiseDurationMs;

    schedule(() => {
      setStage('polaroid-emerged');
    }, emergeCompletedAt);

    // Sau khi ảnh nhô lên hoàn tất, đợi đúng 2s (holdAfterEmergeMs) rồi chuyển sang hiệu ứng mây mờ
    const cloudStartAt = emergeCompletedAt + timings.holdAfterEmergeMs;
    schedule(() => {
      setStage('cloud-transition');
    }, cloudStartAt);

    // Tại đỉnh điểm lớp mây mờ (~45% thời gian mây), hoán đổi nền bên dưới thành trang chính
    const revealMainUnderCloudAt =
      cloudStartAt + Math.round(timings.cloudTransitionDurationMs * 0.45);
    schedule(() => {
      setIsMainVisible(true);
    }, revealMainUnderCloudAt);

    // Kết thúc hiệu ứng mây mờ
    const finishAt = cloudStartAt + timings.cloudTransitionDurationMs;
    schedule(() => {
      setStage('main-invitation');
    }, finishAt);
  }, [clearAllTimers, onOpenStart, schedule, stage, timings]);

  const replayIntro = useCallback(() => {
    clearAllTimers();
    setIsMainVisible(false);
    setStage('envelope-idle');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [clearAllTimers]);

  const skipToMain = useCallback(() => {
    clearAllTimers();
    setIsMainVisible(true);
    setStage('main-invitation');
  }, [clearAllTimers]);

  return {
    stage,
    isMainVisible,
    isCloudOverlayActive: stage === 'cloud-transition',
    openEnvelope,
    replayIntro,
    skipToMain,
  };
}
