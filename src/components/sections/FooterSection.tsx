import { MailOpen } from 'lucide-react';
import React from 'react';
import { useInvitationContext } from '../../context/InvitationContext';

interface FooterSectionProps {
  onReplayIntro: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  onReplayIntro,
}) => {
  const { config } = useInvitationContext();

  return (
    <footer className="wedding-footer">
      <p className="wedding-footer__script">Thank You!</p>
      <p className="wedding-footer__names">{config.coupleTitle}</p>
      <p className="wedding-footer__hashtag">
        {config.weddingDisplayDate} • {config.hashtag}
      </p>

      <button
        type="button"
        className="wedding-footer__replay"
        onClick={onReplayIntro}
      >
        <MailOpen size={15} />
        Mở lại phong bì xanh rêu
      </button>
    </footer>
  );
};
