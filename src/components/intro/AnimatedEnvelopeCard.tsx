import React from 'react';
import { SageWaxSeal } from '../common/SageArtwork';

interface AnimatedEnvelopeCardProps {
  imageUrl: string;
  coupleTitle: string;
  isOpen: boolean;
  onToggle: () => void;
  openedHint?: string;
}

/**
 * Phong bì tương tác CineLove (PluginAnimatedEnvelope) phối màu xanh lá pastel dịu nhẹ.
 * Chạm để mở nắp phong bì, ảnh thiệp cặp đôi trượt lên kèm trái tim bay bổng.
 */
export const AnimatedEnvelopeCard: React.FC<AnimatedEnvelopeCardProps> = ({
  imageUrl,
  coupleTitle,
  isOpen,
  onToggle,
  openedHint,
}) => {
  return (
    <div className="sage-envelope-wrap">
      <div className="sage-envelope-shadow" aria-hidden="true" />
      <div
        role="button"
        tabIndex={0}
        aria-pressed={isOpen}
        aria-label={isOpen ? 'Đóng phong bì thiệp cưới' : 'Mở phong bì thiệp cưới'}
        className={`sage-envelope ${isOpen ? 'sage-envelope--open' : 'sage-envelope--close'}`}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <div className="sage-envelope__front sage-envelope__flap" aria-hidden="true" />
        <div
          className="sage-envelope__front sage-envelope__pocket-sides"
          aria-hidden="true"
        />
        <div
          className="sage-envelope__front sage-envelope__pocket-bottom"
          aria-hidden="true"
        />

        <div className="sage-envelope__seal" aria-hidden="true">
          <SageWaxSeal />
        </div>

        <div className="sage-envelope__letter">
          <img
            src={imageUrl}
            alt={`Ảnh thiệp cưới ${coupleTitle}`}
            className="sage-envelope__photo"
          />
        </div>

        <div className="sage-envelope__hearts" aria-hidden="true">
          <span className="sage-envelope__heart sage-envelope__heart--a1">
            <svg width="20" height="20" viewBox="0 0 100 100">
              <path
                fill="currentColor"
                d="M70.7,71.3c-10.6,7.5-19.6,17.9-20.7,22.2c-1.3-4.3-9.4-14.5-20.8-22C17.5,63.8-0.1,56.6,0,37.4c0.2-35,37-42,50-11.9C62.3-3.4,99.8,2.1,100,37.2C100.1,56.4,82.3,63.1,70.7,71.3L70.7,71.3z"
              />
            </svg>
          </span>
          <span className="sage-envelope__heart sage-envelope__heart--a2">
            <svg width="26" height="26" viewBox="0 0 100 100">
              <path
                fill="currentColor"
                d="M70.7,71.3c-10.6,7.5-19.6,17.9-20.7,22.2c-1.3-4.3-9.4-14.5-20.8-22C17.5,63.8-0.1,56.6,0,37.4c0.2-35,37-42,50-11.9C62.3-3.4,99.8,2.1,100,37.2C100.1,56.4,82.3,63.1,70.7,71.3L70.7,71.3z"
              />
            </svg>
          </span>
          <span className="sage-envelope__heart sage-envelope__heart--a3">
            <svg width="22" height="22" viewBox="0 0 100 100">
              <path
                fill="currentColor"
                d="M70.7,71.3c-10.6,7.5-19.6,17.9-20.7,22.2c-1.3-4.3-9.4-14.5-20.8-22C17.5,63.8-0.1,56.6,0,37.4c0.2-35,37-42,50-11.9C62.3-3.4,99.8,2.1,100,37.2C100.1,56.4,82.3,63.1,70.7,71.3L70.7,71.3z"
              />
            </svg>
          </span>
        </div>
      </div>

      {isOpen && openedHint && (
        <div className="hero-cover__open-cue">{openedHint}</div>
      )}
    </div>
  );
};
