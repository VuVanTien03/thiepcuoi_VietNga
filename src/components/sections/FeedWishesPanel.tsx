import React from 'react';
import { CalendarPlus, Check, Copy, Send, X } from 'lucide-react';
import { GuestWish, WeddingConfig } from '../../types/wedding';
import { SimpleQrSvg } from '../common/SimpleQrSvg';

interface FeedLeftSidebarProps {
  config: WeddingConfig;
  calendarUrl: string;
  onJumpToRsvp: () => void;
}

export const FeedLeftSidebar: React.FC<FeedLeftSidebarProps> = ({
  config,
  calendarUrl,
  onJumpToRsvp,
}) => {
  return (
    <aside className="feed-side" aria-label="Thông tin thiệp cưới">
      <div className="feed-brand">
        <span className="feed-brand__badge" aria-label={config.coupleTitle}>
          {config.envelope.monogram.replace(/\s+/g, '')}
        </span>
      </div>

      <div className="feed-info">
        <img
          src={config.editorial.bannerImageUrl}
          alt={config.coupleTitle}
          className="feed-info__cover"
        />
        <h2 className="feed-info__title">
          {config.coupleTitle} — Hoa Cúc Xanh Nhẹ
        </h2>
        <p className="feed-info__desc">{config.editorial.feedDescription}</p>
      </div>

      <div className="feed-promo">
        <p className="feed-promo__eyebrow">SAVE THE DATE</p>
        <p className="feed-promo__text">
          {config.editorial.ceremonyDateLine} • {config.editorial.primaryVenueTitle}
        </p>
        <div style={{ display: 'grid', gap: '8px' }}>
          <button
            type="button"
            className="feed-promo__cta"
            onClick={onJumpToRsvp}
          >
            Xác nhận tham dự ngay
          </button>
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="feed-copy-btn"
            style={{ width: '100%', justifyContent: 'center', marginTop: 0 }}
          >
            <CalendarPlus size={15} />
            Thêm vào Google Calendar
          </a>
        </div>
      </div>

      <p className="feed-side__foot">
        {config.hashtag} · {config.weddingDisplayDate}
      </p>
    </aside>
  );
};

interface FeedRightPanelProps {
  activeTab: 'wishes' | 'phone';
  onTabChange: (tab: 'wishes' | 'phone') => void;
  wishes: GuestWish[];
  onJumpToRsvp: () => void;
  shareUrl: string;
  copiedLink: boolean;
  onCopyLink: () => void;
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
  activeTab,
  onTabChange,
  wishes,
  onJumpToRsvp,
  shareUrl,
  copiedLink,
  onCopyLink,
}) => {
  return (
    <aside className="feed-panel" aria-label="Lời chúc và mã QR">
      <div className="feed-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'wishes'}
          className="feed-tab"
          onClick={() => onTabChange('wishes')}
        >
          Lời chúc ({wishes.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'phone'}
          className="feed-tab"
          onClick={() => onTabChange('phone')}
        >
          Xem trên điện thoại
        </button>
      </div>

      <div className="feed-panel__body">
        {activeTab === 'wishes' ? (
          <>
            <p className="feed-wishes-count">
              {wishes.length} lời chúc mừng gửi đến cô dâu &amp; chú rể
            </p>
            <WishesList wishes={wishes} />
          </>
        ) : (
          <div className="feed-phone-view">
            <div className="feed-phone-qr">
              <SimpleQrSvg seed={shareUrl} size={172} fgColor="#243025" />
            </div>
            <h3 className="feed-phone-title">Quét mã QR bằng điện thoại</h3>
            <p className="feed-phone-text">
              Mở camera hoặc Zalo để xem thiệp cưới trực tiếp trên màn hình di động.
            </p>
            <button type="button" className="feed-copy-btn" onClick={onCopyLink}>
              {copiedLink ? <Check size={15} /> : <Copy size={15} />}
              {copiedLink ? 'Đã sao chép liên kết' : 'Sao chép đường dẫn thiệp'}
            </button>
          </div>
        )}
      </div>

      {activeTab === 'wishes' && (
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
      )}
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
