import { Disc3, MailOpen, Pause } from 'lucide-react';
import React from 'react';

interface FloatingControlsProps {
  isPlaying: boolean;
  audioTitle: string;
  onToggleAudio: () => void;
  onReplayIntro: () => void;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  isPlaying,
  audioTitle,
  onToggleAudio,
  onReplayIntro,
}) => {
  return (
    <div className="floating-controls">
      <button
        type="button"
        className="floating-pill"
        onClick={onToggleAudio}
        aria-label={isPlaying ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền'}
        title={audioTitle}
      >
        {isPlaying ? (
          <Disc3 size={16} className="spin-slow" />
        ) : (
          <Pause size={16} />
        )}
        <span>{isPlaying ? 'Đang phát nhạc' : 'Bật nhạc nền'}</span>
      </button>

      <button
        type="button"
        className="floating-pill"
        onClick={onReplayIntro}
        aria-label="Xem lại hiệu ứng mở phong bì"
      >
        <MailOpen size={15} />
        <span>Mở lại thiệp</span>
      </button>
    </div>
  );
};
