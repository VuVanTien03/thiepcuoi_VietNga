import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import { useInvitationContext } from '../../context/InvitationContext';
import { PolaroidPhoto } from '../../types/wedding';
import { PolaroidCard } from '../common/PolaroidCard';
import { SectionHeader } from '../common/SectionHeader';

export const GallerySection: React.FC = () => {
  const { config } = useInvitationContext();
  const [selectedPhoto, setSelectedPhoto] = useState<PolaroidPhoto | null>(
    null,
  );

  return (
    <section className="section-tint" id="gallery">
      <div className="section-container">
        <SectionHeader
          scriptTitle="Album ảnh Polaroid"
          title="Khoảnh Khắc Hạnh Phúc"
          subtitle="Chạm vào từng tấm ảnh Polaroid để xem rõ hơn kỷ niệm của tụi mình."
        />

        <div className="gallery-grid">
          {config.gallery.map((photo, idx) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: idx * 0.08 }}
            >
              <PolaroidCard
                imageUrl={photo.imageUrl}
                caption={photo.caption}
                dateLabel={photo.dateLabel}
                rotationDeg={photo.rotationDeg}
                tapePosition={photo.tapePosition}
                onClick={() => setSelectedPhoto(photo)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="lightbox-close"
                aria-label="Đóng ảnh"
                onClick={() => setSelectedPhoto(null)}
              >
                <X size={18} />
              </button>

              <PolaroidCard
                imageUrl={selectedPhoto.imageUrl}
                caption={selectedPhoto.caption}
                dateLabel={selectedPhoto.dateLabel}
                rotationDeg={0}
                tapePosition="none"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
