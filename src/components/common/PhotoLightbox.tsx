import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface PhotoLightboxProps {
  photo: { url: string; caption?: string } | null;
  onClose: () => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photo,
  onClose,
}) => {
  useEffect(() => {
    if (!photo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [photo, onClose]);

  if (!photo) return null;

  return (
    <div
      className="sage-modal-backdrop sage-lightbox-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption || 'Xem ảnh phóng to'}
      onClick={onClose}
    >
      <div className="sage-lightbox" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="sage-lightbox__close"
          onClick={onClose}
          aria-label="Đóng ảnh phóng to"
        >
          <X size={20} />
        </button>
        <img
          src={photo.url}
          alt={photo.caption || 'Ảnh cưới'}
          className="sage-lightbox__img"
        />
        {photo.caption && (
          <p className="sage-lightbox__caption">{photo.caption}</p>
        )}
      </div>
    </div>
  );
};
