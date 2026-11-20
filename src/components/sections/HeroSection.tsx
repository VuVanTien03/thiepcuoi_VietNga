import { motion } from 'framer-motion';
import { CalendarHeart, Heart } from 'lucide-react';
import React from 'react';
import { useInvitationContext } from '../../context/InvitationContext';
import { BotanicalCorner } from '../common/BotanicalDecoration';
import { PolaroidCard } from '../common/PolaroidCard';

export const HeroSection: React.FC = () => {
  const { config } = useInvitationContext();

  return (
    <section className="hero-section" id="hero">
      <motion.div
        className="hero-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <BotanicalCorner className="hero-corner hero-corner--tl" />
        <BotanicalCorner className="hero-corner hero-corner--br" />

        <div className="hero-text">
          <span className="hero-badge">
            <Heart size={13} /> Save The Date
          </span>
          <h1 className="hero-names">{config.coupleTitle}</h1>
          <div className="hero-date-banner">
            <span>{config.weddingDisplayDate}</span>
          </div>
          <p className="hero-quote">{config.quote}</p>

          <div className="hero-actions">
            <a href="#rsvp" className="btn-moss">
              <CalendarHeart size={16} />
              Xác nhận tham dự
            </a>
            <a href="#events" className="btn-outline-moss">
              Xem lịch trình hôn lễ
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-polaroid-main">
            <PolaroidCard
              imageUrl={config.envelope.emergingPolaroidUrl}
              caption={config.coupleTitle}
              dateLabel={config.weddingDisplayDate}
              rotationDeg={-2.5}
              tapePosition="top-center"
            />
          </div>

          <div className="hero-polaroid-mini">
            <PolaroidCard
              imageUrl={config.gallery[3]?.imageUrl ?? config.bride.avatarUrl}
              caption={config.hashtag}
              rotationDeg={5.5}
              tapePosition="top-corners"
              aspect="square"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};
