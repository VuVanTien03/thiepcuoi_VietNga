import { motion } from 'framer-motion';
import React from 'react';
import { EnvelopeConfig } from '../../types/wedding';

interface EmergingPolaroidProps {
  envelope: EnvelopeConfig;
  isOpen: boolean;
  riseDurationMs: number;
}

/**
 * Ảnh Polaroid của cô dâu chú rể nằm gọn hoàn toàn bên trong túi phong bì xanh lá.
 * Khi ấn mở thiệp, ảnh từ từ nhô lên mượt mà qua miệng phong bì và không bị lòi cạnh dưới.
 */
export const EmergingPolaroid: React.FC<EmergingPolaroidProps> = ({
  envelope,
  isOpen,
  riseDurationMs,
}) => {
  return (
    <div className="polaroid-slot" data-open={isOpen ? 'true' : 'false'}>
      <motion.div
        className="emerging-polaroid"
        initial={{ y: 28, scale: 0.86, rotate: 1.5, opacity: 0 }}
        animate={
          isOpen
            ? {
                y: -146,
                scale: 1.04,
                rotate: -2.2,
                opacity: 1,
              }
            : {
                y: 28,
                scale: 0.86,
                rotate: 1.5,
                opacity: 0,
              }
        }
        transition={{
          delay: isOpen ? 0.32 : 0,
          duration: riseDurationMs / 1000,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="emerging-polaroid__photo-wrap">
          <img
            src={envelope.emergingPolaroidUrl}
            alt={envelope.emergingPolaroidCaption}
            className="emerging-polaroid__img"
          />
        </div>
        <p className="emerging-polaroid__caption">
          {envelope.emergingPolaroidCaption}
        </p>
        <p className="emerging-polaroid__stamp">{envelope.emergingDateStamp}</p>
      </motion.div>
    </div>
  );
};
