import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { useInvitationContext } from '../../context/InvitationContext';
import { InvitationStage } from '../../types/wedding';
import { SageWaxSeal } from '../common/SageArtwork';
import { EmergingPolaroid } from './EmergingPolaroid';

interface MossEnvelopeSceneProps {
  stage: InvitationStage;
  guestName?: string;
  onOpen: () => void;
}

const AMBIENT_MOTES = [
  { top: '22%', left: '20%', delay: 0 },
  { top: '30%', right: '18%', delay: 1.1 },
  { bottom: '28%', left: '24%', delay: 0.6 },
  { bottom: '20%', right: '22%', delay: 1.7 },
  { top: '16%', left: '52%', delay: 2.2 },
];

const OPENING_FLOATING_HEARTS = [
  { left: '14%', size: 18, color: '#E58C9C', riseY: 235, driftX: [-18, 12], rotate: -14, duration: 2.1, delay: 0.08 },
  { left: '28%', size: 24, color: '#F09CAB', riseY: 285, driftX: [16, -14], rotate: 12, duration: 2.35, delay: 0.16 },
  { left: '46%', size: 28, color: '#CE6E80', riseY: 315, driftX: [-12, 18], rotate: -8, duration: 2.45, delay: 0.12 },
  { left: '64%', size: 22, color: '#E58C9C', riseY: 270, driftX: [20, -10], rotate: 16, duration: 2.2, delay: 0.24 },
  { left: '82%', size: 19, color: '#F4B9C4', riseY: 245, driftX: [-14, 16], rotate: -12, duration: 2.15, delay: 0.3 },
  { left: '22%', size: 16, color: '#F4B9C4', riseY: 260, driftX: [14, -18], rotate: 15, duration: 2.2, delay: 0.45 },
  { left: '53%', size: 22, color: '#E58C9C', riseY: 300, driftX: [-16, 14], rotate: -10, duration: 2.3, delay: 0.56 },
  { left: '74%', size: 25, color: '#EA90A1', riseY: 290, driftX: [12, -16], rotate: 14, duration: 2.25, delay: 0.68 },
  { left: '37%', size: 17, color: '#CE6E80', riseY: 275, driftX: [-20, 12], rotate: -16, duration: 2.15, delay: 0.82 },
  { left: '60%', size: 20, color: '#F1A6B4', riseY: 260, driftX: [18, -12], rotate: 11, duration: 2.1, delay: 0.96 },
];

/**
 * Trang 1 (Trang mở thiệp riêng):
 * Phong bì xanh lá nhẹ nhàng kèm hoa cúc trắng, dấu sáp bạch đàn,
 * khi chạm mở sẽ bật nắp & đẩy ảnh Polaroid cặp đôi trồi lên trước khi rẽ mây sang Trang 2.
 */
export const MossEnvelopeScene: React.FC<MossEnvelopeSceneProps> = ({
  stage,
  guestName,
  onOpen,
}) => {
  const { config, theme } = useInvitationContext();
  const isIdle = stage === 'envelope-idle';
  const isOpened = stage !== 'envelope-idle';
  const { flapOpenDurationMs, polaroidRiseDurationMs } = theme.timings;
  const ed = config.editorial;

  // Giải mã trước ảnh mây trong GPU để hiệu ứng chuyển cảnh mây mở ra đạt 60fps không khựng
  useEffect(() => {
    ['/images/cloud-cumulus.png', '/images/cloud-mist.png'].forEach((src) => {
      const img = new Image();
      img.src = src;
      if (typeof img.decode === 'function') {
        void img.decode().catch(() => undefined);
      }
    });
  }, []);

  return (
    <motion.section
      className="intro-scene"
      aria-label="Mở thiệp cưới"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
    >
      {/* Hoa cúc & lá bạch đàn dịu nhẹ ở 4 góc */}
      <div className="intro-daisy intro-daisy--tl" aria-hidden="true">
        <img src="/images/daisy-bouquet-left.png" alt="" />
      </div>
      <div className="intro-daisy intro-daisy--bl" aria-hidden="true">
        <img src="/images/daisy-bouquet-left.png" alt="" />
      </div>
      <div className="intro-daisy intro-daisy--tr" aria-hidden="true">
        <img src="/images/eucalyptus-bouquet-right.png" alt="" />
      </div>
      <div className="intro-daisy intro-daisy--br" aria-hidden="true">
        <img src="/images/eucalyptus-bouquet-right.png" alt="" />
      </div>

      {/* Hạt sáng xanh pastel lơ lửng */}
      {AMBIENT_MOTES.map((mote, idx) => (
        <motion.span
          key={idx}
          className="intro-ambient-mote"
          style={{
            top: mote.top,
            left: mote.left,
            right: mote.right,
            bottom: mote.bottom,
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.25, 0.85, 0.25],
            scale: [0.9, 1.4, 0.9],
          }}
          transition={{
            duration: 4.5,
            delay: mote.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="intro-triad-bar">
        <span>{ed.topEyebrow[0]}</span>
        <span>{ed.topEyebrow[1]}</span>
        <span>{ed.topEyebrow[2]}</span>
      </div>

      <motion.div
        className="intro-heading"
        animate={isOpened ? { y: -22, opacity: 0.3 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="intro-heading__script">{ed.scriptHeadline}</h1>
        <p className="intro-heading__eyebrow">
          {config.envelope.invitationLine}
        </p>
        <p className="intro-heading__names">{config.coupleTitle}</p>
      </motion.div>

      {/* Khối phong bì xanh lá nhẹ nhàng + dấu sáp lá */}
      <motion.div
        className={`envelope-stage ${isOpened ? 'envelope-stage--opened' : ''}`}
        onClick={isIdle ? onOpen : undefined}
        role={isIdle ? 'button' : undefined}
        tabIndex={isIdle ? 0 : undefined}
        aria-label={isIdle ? 'Mở phong bì thiệp cưới' : undefined}
        onKeyDown={
          isIdle
            ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpen();
              }
            }
            : undefined
        }
        animate={
          isIdle
            ? {
              y: [0, -11, 0],
              rotate: [-0.6, 0.6, -0.6],
            }
            : {
              y: 44,
              rotate: 0,
            }
        }
        transition={
          isIdle
            ? {
              duration: 3.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }
            : {
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }
        }
        whileHover={isIdle ? { scale: 1.025 } : undefined}
        whileTap={isIdle ? { scale: 0.985 } : undefined}
      >
        <motion.div
          className="envelope-shadow"
          animate={
            isIdle
              ? { scaleX: [1, 0.9, 1], opacity: [0.65, 0.42, 0.65] }
              : { scaleX: 1.06, opacity: 0.55 }
          }
          transition={
            isIdle
              ? { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.8 }
          }
        />

        <div className="envelope-body">
          <div className="envelope-back">
            <div className="envelope-lining" />
          </div>

          <EmergingPolaroid
            envelope={config.envelope}
            isOpen={isOpened}
            riseDurationMs={polaroidRiseDurationMs}
          />

          <div className="envelope-pocket">
            <div className="envelope-pocket__sides" />
            <div className="envelope-pocket__bottom" />
            <span className="envelope-pocket__trim">
              {config.weddingDisplayDate}
            </span>
          </div>

          {isIdle && (
            <div className="envelope-shimmer" aria-hidden="true">
              <motion.div
                className="envelope-shimmer__beam"
                animate={{ x: ['-40%', '380%'] }}
                transition={{
                  duration: 3.4,
                  repeat: Infinity,
                  repeatDelay: 2.2,
                  ease: 'easeInOut',
                }}
              />
            </div>
          )}

          <motion.div
            className="envelope-flap"
            style={{ zIndex: isOpened ? 1 : 5 }}
            initial={{ rotateX: 0 }}
            animate={{ rotateX: isOpened ? -175 : 0 }}
            transition={{
              duration: flapOpenDurationMs / 1000,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <div className="envelope-flap__face" />
          </motion.div>

          <motion.button
            type="button"
            className="wax-seal-btn"
            aria-label={config.envelope.tapPrompt}
            onClick={(e) => {
              e.stopPropagation();
              if (isIdle) onOpen();
            }}
            animate={
              isOpened
                ? { scale: 0.4, opacity: 0, y: -30 }
                : { scale: [1, 1.06, 1], opacity: 1, y: 0 }
            }
            transition={
              isOpened
                ? { duration: 0.35 }
                : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            {isIdle && (
              <motion.span
                className="wax-seal-pulse"
                animate={{ scale: [1, 1.48], opacity: [0.75, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            )}
            <SageWaxSeal />
          </motion.button>

          {isOpened && (
            <div
              className="intro-hearts-layer"
              data-testid="intro-floating-hearts"
              aria-hidden="true"
            >
              {OPENING_FLOATING_HEARTS.map((heart, i) => (
                <motion.span
                  key={i}
                  className="intro-heart-float"
                  style={{ left: heart.left, color: heart.color }}
                  initial={{ y: 12, opacity: 0, scale: 0.35, rotate: 0 }}
                  animate={{
                    y: -heart.riseY,
                    x: [0, heart.driftX[0], heart.driftX[1]],
                    opacity: [0, 0.96, 0.9, 0],
                    scale: [0.35, 1.08, 0.96, 0.72],
                    rotate: [0, heart.rotate, -heart.rotate * 0.6],
                  }}
                  transition={{
                    duration: heart.duration,
                    delay: heart.delay,
                    times: [0, 0.22, 0.72, 1],
                    ease: 'easeOut',
                  }}
                >
                  <svg width={heart.size} height={heart.size} viewBox="0 0 100 100">
                    <path
                      fill="currentColor"
                      d="M70.7,71.3c-10.6,7.5-19.6,17.9-20.7,22.2c-1.3-4.3-9.4-14.5-20.8-22C17.5,63.8-0.1,56.6,0,37.4c0.2-35,37-42,50-11.9C62.3-3.4,99.8,2.1,100,37.2C100.1,56.4,82.3,63.1,70.7,71.3L70.7,71.3z"
                    />
                  </svg>
                </motion.span>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        className="intro-prompt"
        animate={{ opacity: isOpened ? 0 : 1, y: isOpened ? 10 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="intro-prompt__text">{config.envelope.tapPrompt}</p>
        <p className="intro-prompt__recipient">
          Kính mời: {guestName || config.envelope.recipientPlaceholder}
        </p>
      </motion.div>
    </motion.section>
  );
};
