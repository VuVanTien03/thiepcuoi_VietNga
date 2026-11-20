import React from 'react';

export interface PolaroidCardProps {
  imageUrl: string;
  caption: string;
  dateLabel?: string;
  rotationDeg?: number;
  tapePosition?: 'top-center' | 'top-corners' | 'none';
  aspect?: 'portrait' | 'square';
  onClick?: () => void;
  className?: string;
}

/**
 * Khung ảnh Polaroid tái sử dụng theo SRP:
 * Hỗ trợ góc xoay, băng dính washi và chú thích viết tay.
 */
export const PolaroidCard: React.FC<PolaroidCardProps> = ({
  imageUrl,
  caption,
  dateLabel,
  rotationDeg = 0,
  tapePosition = 'top-center',
  aspect = 'portrait',
  onClick,
  className = '',
}) => {
  return (
    <figure
      className={`polaroid-card ${className}`}
      style={{ transform: `rotate(${rotationDeg}deg)` }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {tapePosition === 'top-center' && (
        <span className="washi-tape washi-tape--center" aria-hidden="true" />
      )}
      {tapePosition === 'top-corners' && (
        <>
          <span className="washi-tape washi-tape--left" aria-hidden="true" />
          <span className="washi-tape washi-tape--right" aria-hidden="true" />
        </>
      )}

      <div
        className={`polaroid-card__frame ${
          aspect === 'square' ? 'polaroid-card__frame--square' : ''
        }`}
      >
        <img
          src={imageUrl}
          alt={caption}
          className="polaroid-card__img"
          loading="lazy"
        />
      </div>

      <figcaption className="polaroid-card__footer">
        <span className="polaroid-card__caption">{caption}</span>
        {dateLabel && <span className="polaroid-card__date">{dateLabel}</span>}
      </figcaption>
    </figure>
  );
};
