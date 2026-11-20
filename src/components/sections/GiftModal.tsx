import React, { useState } from 'react';
import { Check, Copy, X } from 'lucide-react';
import { GiftAccount } from '../../types/wedding';
import { SimpleQrSvg } from '../common/SimpleQrSvg';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  accounts: GiftAccount[];
}

export const GiftModal: React.FC<GiftModalProps> = ({
  isOpen,
  onClose,
  title,
  accounts,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = async (acc: GiftAccount) => {
    try {
      await navigator.clipboard.writeText(acc.accountNumber);
      setCopiedId(acc.id);
      window.setTimeout(() => {
        setCopiedId((prev) => (prev === acc.id ? null : prev));
      }, 2200);
    } catch {
      // Fallback ignored if clipboard is restricted
    }
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

        <p
          style={{
            margin: '0 0 16px',
            fontSize: '13.5px',
            lineHeight: 1.55,
            color: 'var(--ink-muted)',
          }}
        >
          Sự hiện diện của bạn là món quà quý giá nhất với chúng mình. Nếu không thể
          tham dự trực tiếp, bạn có thể gửi lời chúc và quà mừng qua thông tin bên dưới.
        </p>

        <div className="gift-account-cards">
          {accounts.map((acc) => {
            const copied = copiedId === acc.id;
            return (
              <div key={acc.id} className="gift-account-card">
                <div className="gift-account-card__qr">
                  <SimpleQrSvg
                    seed={`${acc.bankName}:${acc.accountNumber}:${acc.ownerName}`}
                    size={82}
                    fgColor="#243025"
                  />
                </div>
                <div>
                  <div className="gift-account-card__role">{acc.ownerRole}</div>
                  <div className="gift-account-card__bank">{acc.bankName}</div>
                  <div className="gift-account-card__owner">{acc.ownerName}</div>
                  <div className="gift-account-card__num">{acc.accountNumber}</div>
                  <button
                    type="button"
                    className="gift-copy-btn"
                    onClick={() => void handleCopy(acc)}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Đã sao chép STK' : 'Sao chép số tài khoản'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
