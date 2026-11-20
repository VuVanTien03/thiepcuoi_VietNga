import React from 'react';
import { Send, X } from 'lucide-react';
import { GuestWish } from '../../types/wedding';

interface FeedRightPanelProps {
  wishes: GuestWish[];
  onJumpToRsvp: () => void;
}

const formatWishTime = (iso: string) => {
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return 'Vừa xong';
  return dt.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const WishesList: React.FC<{ wishes: GuestWish[] }> = ({ wishes }) => {
  if (wishes.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: 'var(--feed-muted)', marginTop: 40 }}>
        Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc đến đôi uyên ương!
      </p>
    );
  }

  return (
    <ul className="feed-wishes-list">
      {wishes.map((w) => {
        const initial = (w.guestName.trim().charAt(0) || 'K').toUpperCase();
        const badgeText =
          w.attendance === 'attending'
            ? `Tham dự (${w.guestCount})`
            : 'Gửi lời chúc';
        return (
          <li key={w.id} className="feed-wish">
            <div className="feed-wish__avatar" aria-hidden="true">
              {initial}
            </div>
            <div className="feed-wish__body">
              <p className="feed-wish__name">
                <span>{w.guestName}</span>
                <span className="feed-wish__tag">{badgeText}</span>
              </p>
              <p className="feed-wish__text">{w.message}</p>
              <p className="feed-wish__time">{formatWishTime(w.createdAt)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export const FeedRightPanel: React.FC<FeedRightPanelProps> = ({
  wishes,
  onJumpToRsvp,
}) => {
  return (
        <aside className="feed-panel" aria-label="Lời chúc">
          <div className="feed-panel__header">
            Lời chúc ({wishes.length})
          </div>

          <div className="feed-panel__body">
            <p className="feed-wishes-count">
              {wishes.length} lời chúc mừng gửi đến cô dâu &amp; chú rể
            </p>
            <WishesList wishes={wishes} />
          </div>

          <div className="feed-composer">
            <button
              type="button"
              className="feed-composer__btn"
              onClick={onJumpToRsvp}
            >
              Gửi lời chúc &amp; xác nhận tham dự...
            </button>
            <button
              type="button"
              className="feed-composer__send"
              onClick={onJumpToRsvp}
              aria-label="Đi tới biểu mẫu gửi lời chúc"
            >
              <Send size={16} />
            </button>
          </div>
        </aside>
        );
};

        interface MobileWishesModalProps {
          isOpen: boolean;
  onClose: () => void;
        wishes: GuestWish[];
  onJumpToRsvp: () => void;
}

        export const MobileWishesModal: React.FC<MobileWishesModalProps> = ({
          isOpen,
          onClose,
          wishes,
          onJumpToRsvp,
}) => {
  if (!isOpen) return null;

          return (
          <div
            className="sage-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-wishes-title"
            onClick={onClose}
          >
            <div className="sage-modal" onClick={(e) => e.stopPropagation()}>
              <div className="sage-modal__header">
                <h3 id="mobile-wishes-title" className="sage-modal__title">
                  Lời chúc mừng ({wishes.length})
                </h3>
                <button
                  type="button"
                  className="sage-modal__close"
                  onClick={onClose}
                  aria-label="Đóng danh sách lời chúc"
                >
                  <X size={18} />
                </button>
              </div>
              <WishesList wishes={wishes} />
              <button
                type="button"
                className="rsvp-submit-btn"
                style={{ marginTop: 18 }}
                onClick={() => {
                  onClose();
                  onJumpToRsvp();
                }}
              >
                Viết lời chúc của bạn
              </button>
            </div>
          </div>
          );
};
