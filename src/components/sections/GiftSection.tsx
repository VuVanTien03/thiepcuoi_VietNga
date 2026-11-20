import { Check, Copy, QrCode } from 'lucide-react';
import React, { useState } from 'react';
import { useInvitationContext } from '../../context/InvitationContext';
import { SectionHeader } from '../common/SectionHeader';

export const GiftSection: React.FC = () => {
  const { config } = useInvitationContext();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string, accountNumber: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(id);
    }
  };

  return (
    <section className="section-tint" id="gift">
      <div className="section-container">
        <SectionHeader
          scriptTitle="Hộp mừng cưới"
          title="Gửi Quà Chúc Phúc"
          subtitle="Nếu ở xa không thể tham dự trực tiếp, bạn có thể gửi chút yêu thương qua thông tin dưới đây."
        />

        <div className="gift-grid">
          {config.giftAccounts.map((acc) => {
            const isCopied = copiedId === acc.id;
            return (
              <article key={acc.id} className="gift-card">
                <span className="gift-card__role">{acc.ownerRole}</span>
                <h3 className="gift-card__owner">{acc.ownerName}</h3>

                <div className="gift-card__qr" aria-label="Mã QR ngân hàng">
                  <QrCode size={102} strokeWidth={1.5} />
                </div>

                <p className="gift-card__bank">{acc.bankName}</p>
                <p className="gift-card__account">{acc.accountNumber}</p>

                <button
                  type="button"
                  className="btn-outline-moss"
                  style={{
                    color: '#faf7f1',
                    borderColor: 'rgba(231, 212, 171, 0.5)',
                  }}
                  onClick={() => handleCopy(acc.id, acc.accountNumber)}
                >
                  {isCopied ? <Check size={15} /> : <Copy size={15} />}
                  {isCopied ? 'Đã sao chép STK' : 'Sao chép số tài khoản'}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
