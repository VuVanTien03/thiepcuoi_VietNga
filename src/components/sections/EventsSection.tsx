import { motion } from 'framer-motion';
import { CalendarPlus, Gem, Home, MapPin, Wine } from 'lucide-react';
import React from 'react';
import { useInvitationContext } from '../../context/InvitationContext';
import { WeddingEvent } from '../../types/wedding';
import { SectionHeader } from '../common/SectionHeader';

function renderEventIcon(kind: WeddingEvent['accentIcon']) {
  switch (kind) {
    case 'home':
      return <Home size={22} />;
    case 'wine':
      return <Wine size={22} />;
    case 'rings':
    default:
      return <Gem size={22} />;
  }
}

export const EventsSection: React.FC = () => {
  const {
    config,
    services: { calendarService },
  } = useInvitationContext();

  return (
    <section className="section-container" id="events">
      <SectionHeader
        scriptTitle="Thời gian & Địa điểm"
        title="Lịch Trình Hôn Lễ"
        subtitle="Sự hiện diện của quý khách là niềm vinh hạnh lớn nhất dành cho hai gia đình chúng tôi."
      />

      <div className="events-grid">
        {config.events.map((event, idx) => {
          const calendarUrl = calendarService.buildGoogleCalendarUrl(
            event,
            config.coupleTitle,
          );

          return (
            <motion.article
              key={event.id}
              className="event-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
            >
              <div>
                <div className="event-card__icon">
                  {renderEventIcon(event.accentIcon)}
                </div>
                <h3 className="event-card__title">{event.title}</h3>
                <p className="event-card__subtitle">{event.subtitle}</p>

                <div className="event-card__meta">
                  <span className="event-card__time">{event.time}</span>
                  <span>{event.solarDate}</span>
                  <span className="event-card__lunar">{event.lunarDate}</span>
                  <strong>{event.venueName}</strong>
                  <span>{event.address}</span>
                </div>
              </div>

              <div className="event-card__actions">
                <a
                  href={event.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-moss"
                >
                  <MapPin size={15} />
                  Xem bản đồ chỉ đường
                </a>
                <a
                  href={calendarUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline-moss"
                >
                  <CalendarPlus size={15} />
                  Lưu vào Google Calendar
                </a>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};
