import React, { useEffect, useState } from 'react';
import { Shuffle, Sparkles, X } from 'lucide-react';
import { SurpriseCardItem } from '../../types/wedding';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  cards: SurpriseCardItem[];
  coupleSignature?: string;
}

function pickRandomCardIndex(total: number, excludeIndex: number | null): number {
  if (total <= 1) return 0;
  let next = Math.floor(Math.random() * total);
  if (excludeIndex !== null && next === excludeIndex) {
    next = (next + 1) % total;
  }
  return next;
}

/**
 * Hộp Lì Xì Lời Cảm Ơn & Kỷ Niệm Bí Mật:
 * Mỗi lần mở sẽ rút ngẫu nhiên một tấm thẻ nhỏ từ Quốc Việt & Thu Ngà.
 */
export const GiftModal: React.FC<GiftModalProps> = ({
  isOpen,
  onClose,
  title,
  cards,
  coupleSignature = 'Quốc Việt & Thu Ngà',
}) => {
  const [cardIndex, setCardIndex] = useState(0);
  const [drawCount, setDrawCount] = useState(0);

  useEffect(() => {
    if (isOpen && cards.length > 0) {
      setCardIndex((prev) => pickRandomCardIndex(cards.length, prev));
      setDrawCount((c) => c + 1);
    }
  }, [isOpen, cards.length]);

  if (!isOpen || cards.length === 0) return null;

  const activeCard = cards[cardIndex % cards.length];

  const handleDrawAnother = () => {
    setCardIndex((prev) => pickRandomCardIndex(cards.length, prev));
    setDrawCount((c) => c + 1);
  };

  return (
    <div
      className="sage-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gift-modal-title"
      onClick={onClose}
    >
      <div className="sage-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sage-modal__header">
          <h3 id="gift-modal-title" className="sage-modal__title">
            {title}
          </h3>
          <button
            type="button"
            className="sage-modal__close"
            onClick={onClose}
            aria-label="Đóng hộp quà cưới"
          >
            <X size={18} />
          </button>
        </div>

        <div
          key={`${activeCard.id}-${drawCount}`}
          className="gift-surprise-card"
          data-testid="gift-surprise-card"
        >
          <span className="gift-surprise-card__badge">
            <Sparkles size={13} />
            {activeCard.badge}
          </span>

          {activeCard.imageUrl && (
            <div className="gift-surprise-card__photo-wrap">
              <img
                src={activeCard.imageUrl}
                alt={activeCard.title}
                className="gift-surprise-card__photo"
              />
            </div>
          )}

          <h4 className="gift-surprise-card__title">{activeCard.title}</h4>
          <p className="gift-surprise-card__message">{activeCard.message}</p>
          <p className="gift-surprise-card__sig">— {coupleSignature} —</p>
        </div>

        {cards.length > 1 && (
          <button
            type="button"
            className="gift-surprise-shuffle-btn"
            onClick={handleDrawAnother}
          >
            <Shuffle size={15} />
            Mở thẻ bất ngờ khác
          </button>
        )}
      </div>
    </div>
  );
};
