import { motion } from 'framer-motion';
import React from 'react';

interface CloudMistTransitionProps {
  durationMs: number;
}

interface CloudBankConfig {
  id: string;
  src: string;
  className: string;
  flipX?: boolean;
  initial: { x: string; y: string; scale: number; opacity: number };
  animate: {
    x: string[];
    y: string[];
    scale: number[];
    opacity: number[];
  };
  times: number[];
}

/**
 * Các tầng mây thuần GPU (chỉ dùng transform3d + opacity, không filter/blur nặng)
 * chuyển động liên tục 3 nhịp mượt mà: cuộn tụ ở 44% -> rẽ tỏa hai bên đến 100%.
 */
const CLOUD_BANKS: CloudBankConfig[] = [
  {
    id: 'mist-rear-left',
    src: '/images/cloud-mist.png',
    className: 'cloud-layer cloud-layer--rear-left',
    initial: { x: '-45vw', y: '0vh', scale: 1.24, opacity: 0 },
    animate: {
      x: ['-45vw', '-8vw', '-102vw'],
      y: ['1vh', '0vh', '-3vh'],
      scale: [1.24, 1.44, 1.66],
      opacity: [0, 0.92, 0],
    },
    times: [0, 0.44, 1],
  },
  {
    id: 'mist-rear-right',
    src: '/images/cloud-mist.png',
    className: 'cloud-layer cloud-layer--rear-right',
    flipX: true,
    initial: { x: '45vw', y: '0vh', scale: 1.24, opacity: 0 },
    animate: {
      x: ['45vw', '8vw', '102vw'],
      y: ['-1vh', '0vh', '3vh'],
      scale: [1.24, 1.44, 1.66],
      opacity: [0, 0.92, 0],
    },
    times: [0, 0.44, 1],
  },
  {
    id: 'cumulus-upper-left',
    src: '/images/cloud-cumulus.png',
    className: 'cloud-layer cloud-layer--upper-left',
    initial: { x: '-42vw', y: '-10vh', scale: 1.15, opacity: 0 },
    animate: {
      x: ['-42vw', '-6vw', '-96vw'],
      y: ['-10vh', '-4vh', '-16vh'],
      scale: [1.15, 1.38, 1.62],
      opacity: [0, 1, 0],
    },
    times: [0, 0.45, 1],
  },
  {
    id: 'cumulus-upper-right',
    src: '/images/cloud-cumulus.png',
    className: 'cloud-layer cloud-layer--upper-right',
    flipX: true,
    initial: { x: '42vw', y: '-9vh', scale: 1.18, opacity: 0 },
    animate: {
      x: ['42vw', '6vw', '96vw'],
      y: ['-9vh', '-3vh', '-15vh'],
      scale: [1.18, 1.4, 1.64],
      opacity: [0, 1, 0],
    },
    times: [0, 0.45, 1],
  },
  {
    id: 'cumulus-lower-left',
    src: '/images/cloud-cumulus.png',
    className: 'cloud-layer cloud-layer--lower-left',
    flipX: true,
    initial: { x: '-38vw', y: '12vh', scale: 1.2, opacity: 0 },
    animate: {
      x: ['-38vw', '-4vw', '-94vw'],
      y: ['12vh', '4vh', '18vh'],
      scale: [1.2, 1.42, 1.68],
      opacity: [0, 0.98, 0],
    },
    times: [0, 0.45, 1],
  },
  {
    id: 'cumulus-lower-right',
    src: '/images/cloud-cumulus.png',
    className: 'cloud-layer cloud-layer--lower-right',
    initial: { x: '38vw', y: '12vh', scale: 1.2, opacity: 0 },
    animate: {
      x: ['38vw', '4vw', '94vw'],
      y: ['12vh', '4vh', '18vh'],
      scale: [1.2, 1.42, 1.68],
      opacity: [0, 0.98, 0],
    },
    times: [0, 0.45, 1],
  },
];

export const CloudMistTransition: React.FC<CloudMistTransitionProps> = ({
  durationMs,
}) => {
  const durationSec = durationMs / 1000;

  return (
    <div
      className="cloud-overlay"
      data-testid="cloud-transition"
      aria-hidden="true"
    >
      <motion.div
        className="cloud-overlay__veil"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.96, 0.98, 0] }}
        transition={{
          duration: durationSec,
          times: [0, 0.34, 0.54, 1],
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="cloud-sunbeam"
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: [0, 0.75, 0], scale: [0.75, 1.25, 1.7] }}
        transition={{
          duration: durationSec,
          times: [0.25, 0.62, 1],
          ease: 'easeOut',
        }}
      />

      {CLOUD_BANKS.map((bank) => (
        <motion.div
          key={bank.id}
          className={bank.className}
          initial={bank.initial}
          animate={bank.animate}
          transition={{
            duration: durationSec,
            times: bank.times,
            ease: [0.37, 0, 0.25, 1],
          }}
        >
          <img
            src={bank.src}
            alt=""
            decoding="sync"
            className={`cloud-layer__img ${
              bank.flipX ? 'cloud-layer__img--flip' : ''
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
};
