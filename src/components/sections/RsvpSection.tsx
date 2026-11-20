import React, { useState } from 'react';
import { UseGuestbookReturn } from '../../hooks/useGuestbook';
import { AttendanceStatus } from '../../types/wedding';

interface RsvpSectionProps {
  guestbook: UseGuestbookReturn;
  sectionId?: string;
}

/**
 * Thẻ Xác nhận tham dự đặt cuối thiệp (mẫu hONF6aOJQY) phối nút xanh lá dịu.
 */
export const RsvpSection: React.FC<RsvpSectionProps> = ({
  guestbook,
  sectionId = 'rsvp-section',
}) => {
  const [guestName, setGuestName] = useState('');
  const [attendance, setAttendance] = useState<AttendanceStatus>('attending');
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState('');

  const { isSubmitting, error, submittedSuccess, submitRsvp, resetSuccess } =
    guestbook;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitRsvp({
      guestName,
      side: 'both',
      attendance,
      guestCount: attendance === 'attending' ? guestCount : 1,
      message,
    });
    if (guestName.trim()) {
      setGuestName('');
      setMessage('');
    }
  };

  return (
    <div id={sectionId} className="rsvp-card">
      <h3 className="rsvp-card__title">Xác nhận tham dự</h3>

      {submittedSuccess ? (
        <div className="rsvp-success">
          <p className="rsvp-success__title">Cảm ơn bạn đã xác nhận! 💚</p>
          <p className="rsvp-success__text">
            Phản hồi và lời chúc của bạn đã được lưu vào sổ lưu bút của chúng mình.
          </p>
          <button
            type="button"
            className="rsvp-reset-btn"
            onClick={resetSuccess}
          >
            Gửi thêm phản hồi
          </button>
        </div>
      ) : (
        <form onSubmit={(e) => void handleSubmit(e)}>
          <div className="rsvp-field">
            <label htmlFor="rsvp-guest-name" className="rsvp-field__label">
              Họ và tên
            </label>
            <input
              id="rsvp-guest-name"
              type="text"
              className="rsvp-field__input"
              placeholder="Nhập tên của bạn..."
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
          </div>

          <fieldset className="rsvp-field" style={{ border: 0, padding: 0 }}>
            <legend className="rsvp-field__label">Bạn sẽ tham dự chứ?</legend>
            <div className="rsvp-radio-stack">
              <label className="rsvp-radio-option">
                <input
                  type="radio"
                  name="rsvp-attendance"
                  checked={attendance === 'attending'}
                  onChange={() => setAttendance('attending')}
                />
                <span>Có, tôi sẽ tham dự</span>
              </label>
              <label className="rsvp-radio-option">
                <input
                  type="radio"
                  name="rsvp-attendance"
                  checked={attendance === 'not-attending'}
                  onChange={() => setAttendance('not-attending')}
                />
                <span>Tôi bận, rất tiếc không thể tham dự</span>
              </label>
            </div>
          </fieldset>

          {attendance === 'attending' && (
            <div className="rsvp-field">
              <label htmlFor="rsvp-guest-count" className="rsvp-field__label">
                Số lượng người tham dự
              </label>
              <select
                id="rsvp-guest-count"
                className="rsvp-field__select"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
              >
                <option value={1}>1 người</option>
                <option value={2}>2 người</option>
                <option value={3}>3 người</option>
                <option value={4}>4 người</option>
                <option value={5}>5 người trở lên</option>
              </select>
            </div>
          )}

          <div className="rsvp-field">
            <label htmlFor="rsvp-message" className="rsvp-field__label">
              Lời chúc gửi đến cô dâu chú rể
            </label>
            <textarea
              id="rsvp-message"
              rows={2}
              className="rsvp-field__textarea"
              placeholder="Gửi một lời chúc dịu dàng..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {error && <p className="rsvp-error">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rsvp-submit-btn"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi xác nhận'}
          </button>
        </form>
      )}
    </div>
  );
};
