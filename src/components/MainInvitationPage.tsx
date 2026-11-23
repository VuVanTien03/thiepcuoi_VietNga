import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Gift,
  MapPin,
  MessageCircleHeart,
  Music2,
  Pause,
  Play,
  Share2,
} from 'lucide-react';
import { useInvitationContext } from '../context/InvitationContext';
import { useGuestbook } from '../hooks/useGuestbook';
import { useAutoScroll } from '../hooks/useCardEffects';
import {
  EditorialWordmark,
  SageDividerOrnament,
  SageGiftBoxIcon,
  SageHeartMark,
} from './common/SageArtwork';
import { BlessingMarquee } from './common/BlessingMarquee';
import { FallingHeartsOverlay } from './common/FallingHeartsOverlay';
import { HeartBurstButton } from './common/HeartBurstButton';
import { PhotoLightbox } from './common/PhotoLightbox';
import { CardScrollRootProvider, RevealMotion } from './common/RevealMotion';
import { CountdownSection } from './sections/CountdownSection';
import { FilmstripReel } from './sections/FilmstripReel';
import { WeddingCalendar } from './sections/WeddingCalendar';
import { GiftModal } from './sections/GiftModal';
import { RsvpSection } from './sections/RsvpSection';
import {
  FeedRightPanel,
  MobileWishesModal,
} from './sections/FeedWishesPanel';

interface MainInvitationPageProps {
  isPlaying: boolean;
  onToggleAudio: () => void;
}

const EditorialTriadHeader: React.FC<{
  words: [string, string, string];
  variant?: 'top' | 'section' | 'white';
  immediate?: boolean;
}> = ({ words, variant = 'section', immediate = false }) => {
  const cls =
    variant === 'top'
      ? 'editorial-triad editorial-triad--top'
      : variant === 'white'
        ? 'editorial-triad editorial-triad--white'
        : 'editorial-triad editorial-triad--section';

  return (
    <div className={cls}>
      <RevealMotion direction="slide-right" immediate={immediate} duration={1.3}>
        <span>{words[0]}</span>
      </RevealMotion>
      <RevealMotion direction="slide-up" immediate={immediate} duration={1.3}>
        <span>{words[1]}</span>
      </RevealMotion>
      <RevealMotion direction="slide-left" immediate={immediate} duration={1.3}>
        <span>{words[2]}</span>
      </RevealMotion>
    </div>
  );
};

/**
 * Trang 2 (Trang thiệp cưới riêng):
 * Hiển thị sau khi vượt qua hiệu ứng mây mở ra từ trang phong bì.
 */
export const MainInvitationPage: React.FC<MainInvitationPageProps> = ({
  isPlaying,
  onToggleAudio,
}) => {
  const { config } = useInvitationContext();
  const guestbook = useGuestbook();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const [mobileWishesOpen, setMobileWishesOpen] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<{
    url: string;
    caption?: string;
  } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const { isAutoScrolling, startAutoScroll, stopAutoScroll } = useAutoScroll(
    scrollRef,
    {
      unlocked: true,
      speedPxPerMs: 0.055,
    },
  );

  // Tự động cuộn nhẹ nhàng sau khi hiệu ứng mây mở ra vừa tan hoàn toàn
  useEffect(() => {
    const id = window.setTimeout(() => {
      startAutoScroll();
    }, 950);
    return () => window.clearTimeout(id);
  }, [startAutoScroll]);

  const guestDisplayName = useMemo(() => {
    if (typeof window === 'undefined') {
      return config.envelope.recipientPlaceholder;
    }
    const raw = new URLSearchParams(window.location.search).get('guest')?.trim();
    return raw || config.envelope.recipientPlaceholder;
  }, [config.envelope.recipientPlaceholder]);

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return 'https://thiepcuoi.local';
    return window.location.href;
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  const scrollCardBy = (deltaY: number) => {
    stopAutoScroll();
    scrollRef.current?.scrollBy({ top: deltaY, behavior: 'smooth' });
  };

  const scrollToElement = (id: string) => {
    stopAutoScroll();
    const container = scrollRef.current;
    const target = document.getElementById(id);
    if (!container || !target) {
      target?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const offset = targetRect.top - containerRect.top + container.scrollTop - 24;
    container.scrollTo({ top: offset, behavior: 'smooth' });
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Đã sao chép đường dẫn thiệp cưới!');
    } catch {
      showToast('Hãy sao chép đường dẫn trên thanh địa chỉ nhé!');
    }
  };

  const ed = config.editorial;

  return (
    <div className="feed-shell" aria-label="Nội dung thiệp cưới">
      <main className="feed-stage">
        <div className="feed-card-row">
          <div className="feed-card-frame">
            <button
              type="button"
              className="autoscroll-fab"
              onClick={() =>
                isAutoScrolling ? stopAutoScroll() : startAutoScroll()
              }
              aria-label={
                isAutoScrolling ? 'Tạm dừng tự động cuộn' : 'Tự động cuộn thiệp'
              }
            >
              {isAutoScrolling ? <Pause size={14} /> : <Play size={14} />}
              <span>{isAutoScrolling ? 'Đang tự cuộn' : 'Tự động cuộn'}</span>
            </button>

            <button
              type="button"
              className={`music-fab ${isPlaying ? 'music-fab--playing' : ''}`}
              onClick={onToggleAudio}
              aria-label={isPlaying ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền'}
              title={config.audioTitle}
            >
              {isPlaying ? <Music2 size={18} /> : <Pause size={17} />}
            </button>

            <FallingHeartsOverlay />

            <BlessingMarquee wishes={guestbook.wishes} visible />

            <CardScrollRootProvider scrollRef={scrollRef}>
              <div className="feed-card-scroll" ref={scrollRef}>
                <article className="card-canvas">
                  {/* 1. Tiêu đề hoa cúc + chân dung mở đầu trang thiệp */}
                  <header className="hero-cover" style={{ paddingBottom: 16 }}>
                    <EditorialTriadHeader
                      words={ed.topEyebrow}
                      variant="top"
                      immediate
                    />

                    <div className="hero-cover__bouquet-left-top" aria-hidden="true">
                      <RevealMotion direction="slide-right" delay={0.2} immediate>
                        <img src="/images/daisy-bouquet-left.png" alt="" />
                      </RevealMotion>
                    </div>
                    <div className="hero-cover__bouquet-left-mid" aria-hidden="true">
                      <RevealMotion direction="slide-right" delay={0.2} immediate>
                        <img src="/images/daisy-bouquet-left.png" alt="" />
                      </RevealMotion>
                    </div>

                    <RevealMotion direction="slide-up" immediate>
                      <h1 className="hero-cover__script">{ed.scriptHeadline}</h1>
                    </RevealMotion>

                    <div
                      className="hero-cover__bouquet-right"
                      style={{ top: 150 }}
                      aria-hidden="true"
                    >
                      <RevealMotion direction="slide-left" delay={0.2} immediate>
                        <img src="/images/eucalyptus-bouquet-right.png" alt="" />
                      </RevealMotion>
                    </div>
                  </header>

                  {/* 2. Formal Invitation & Venue Details */}
                  <section className="invite-block" aria-label="Thông tin lễ cưới">
                    <RevealMotion direction="slide-up" immediate>
                      <h2 className="invite-block__heading">
                        {ed.invitationHeading}
                      </h2>
                    </RevealMotion>
                    <RevealMotion direction="slide-up" delay={0.08} immediate>
                      <p className="invite-block__guest">{guestDisplayName}</p>
                    </RevealMotion>
                    <RevealMotion direction="slide-up" delay={0.12} immediate>
                      <p className="invite-block__sub">{ed.invitationSubheading}</p>
                    </RevealMotion>
                    <RevealMotion direction="slide-up" delay={0.16} immediate>
                      <p className="invite-block__datetime">{ed.ceremonyHeadline}</p>
                      <p className="invite-block__lunar">{ed.ceremonyLunarLine}</p>
                    </RevealMotion>

                    <RevealMotion direction="slide-up" delay={0.2}>
                      <SageDividerOrnament />
                    </RevealMotion>

                    <RevealMotion direction="slide-up" delay={0.12}>
                      <p className="invite-block__venue-label">{ed.venueHeading}</p>
                      <p className="invite-block__venue-name">
                        {ed.primaryVenueTitle}
                      </p>
                      <p className="invite-block__address">
                        {ed.primaryVenueAddress}
                      </p>
                    </RevealMotion>

                    <RevealMotion direction="slide-up" delay={0.2}>
                      <a
                        href={ed.primaryVenueMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="invite-block__map-btn"
                      >
                        <MapPin size={16} />
                        Xem đường đi
                      </a>
                    </RevealMotion>

                    <RevealMotion direction="slide-up" delay={0.2}>
                      <p className="invite-block__warm-note">
                        {ed.openingWarmNote}
                      </p>
                    </RevealMotion>
                  </section>

                  {/* 3. FALL IN | LOVE | WEDDING Panorama Band */}
                  <section className="banner-section">
                    <EditorialTriadHeader words={ed.bannerHeader} />

                    <RevealMotion direction="slide-up" delay={0.2}>
                      <div className="banner-band">
                        <img
                          src={ed.bannerImageUrl}
                          alt={config.coupleTitle}
                          className="banner-band__photo zoomable-photo"
                          onClick={() =>
                            setLightboxPhoto({
                              url: ed.bannerImageUrl,
                              caption: ed.bannerCaption,
                            })
                          }
                        />
                        <p className="banner-band__caption">{ed.bannerCaption}</p>
                      </div>
                    </RevealMotion>

                    <RevealMotion direction="slide-up" delay={0.1}>
                      <p className="banner-section__thanks">
                        {ed.thankYouParagraph}
                      </p>
                    </RevealMotion>
                  </section>

                  {/* 4. Couple Profiles ("MY LOVER") */}
                  <section className="couple-profiles" aria-label="Cô dâu và Chú rể">
                    <RevealMotion direction="slide-up" delay={0.15}>
                      <SageHeartMark />
                    </RevealMotion>
                    <RevealMotion direction="slide-up" delay={0.2}>
                      <div className="wordmark-wrap">
                        <EditorialWordmark variant="my-lover" size="lg" />
                      </div>
                    </RevealMotion>

                    <div className="couple-cards-grid">
                      <RevealMotion
                        direction="slide-right"
                        delay={0.2}
                        className="couple-portrait-card"
                      >
                        <img
                          src={config.groom.avatarUrl}
                          alt={config.groom.fullName}
                          className="couple-portrait-card__img zoomable-photo"
                          onClick={() =>
                            setLightboxPhoto({
                              url: config.groom.avatarUrl,
                              caption: `${config.groom.title}: ${config.groom.fullName}`,
                            })
                          }
                        />
                        <span className="couple-portrait-card__bar" aria-hidden="true" />
                        <p className="couple-portrait-card__name">
                          {config.groom.shortName}
                        </p>
                        <p className="couple-portrait-card__role">
                          {config.groom.title}
                        </p>
                      </RevealMotion>

                      <RevealMotion
                        direction="slide-left"
                        delay={0.2}
                        className="couple-portrait-card"
                      >
                        <img
                          src={config.bride.avatarUrl}
                          alt={config.bride.fullName}
                          className="couple-portrait-card__img zoomable-photo"
                          onClick={() =>
                            setLightboxPhoto({
                              url: config.bride.avatarUrl,
                              caption: `${config.bride.title}: ${config.bride.fullName}`,
                            })
                          }
                        />
                        <span className="couple-portrait-card__bar" aria-hidden="true" />
                        <p className="couple-portrait-card__name">
                          {config.bride.shortName}
                        </p>
                        <p className="couple-portrait-card__role">
                          {config.bride.title}
                        </p>
                      </RevealMotion>
                    </div>
                  </section>

                  {/* 5. Bilingual Poetry + 3-Frame Filmstrip Reel */}
                  <section className="filmstrip-section" aria-label="Thước phim kỷ niệm">
                    <RevealMotion direction="slide-up">
                      <p className="poem-vi">{ed.poemVi}</p>
                      <p className="poem-en">{ed.poemEn}</p>
                    </RevealMotion>

                    <EditorialTriadHeader words={ed.filmstripHeader} />

                    <RevealMotion direction="slide-up" delay={0.18}>
                      <FilmstripReel
                        frames={ed.filmstripFrames}
                        forcePaused={Boolean(lightboxPhoto)}
                        onSelectFrame={(frame) =>
                          setLightboxPhoto({
                            url: frame.imageUrl,
                            caption: frame.subtitle,
                          })
                        }
                      />
                    </RevealMotion>
                  </section>

                  {/* 6. Countdown Banner */}
                  <RevealMotion direction="slide-up" delay={0.25}>
                    <CountdownSection targetIsoDate={config.weddingDateIso} />
                  </RevealMotion>

                  {/* 7. Asymmetric Collage ("MY LOVE FOREVER" + "I LOVE YOU") */}
                  <section className="collage-section">
                    <RevealMotion direction="slide-up">
                      <p className="collage-lead">{ed.collageLeadPoem}</p>
                    </RevealMotion>

                    <div className="collage-canvas">
                      <div className="collage-vertical-tag" aria-hidden="true">
                        <RevealMotion direction="slide-right">
                          <span>MY LOVE</span>
                          <span style={{ display: 'block' }}>FOREVER</span>
                        </RevealMotion>
                      </div>

                      <RevealMotion direction="slide-up" delay={0.15}>
                        <img
                          src={ed.collageLargePhotoUrl}
                          alt={config.coupleTitle}
                          className="collage-photo-main zoomable-photo"
                          onClick={() =>
                            setLightboxPhoto({
                              url: ed.collageLargePhotoUrl,
                              caption: ed.collageLeadPoem,
                            })
                          }
                        />
                      </RevealMotion>

                      <div className="collage-bottom-grid">
                        <RevealMotion
                          direction="slide-up"
                          delay={0.22}
                          className="collage-photo-inset"
                        >
                          <img
                            src={ed.collageInsetPhotoUrl}
                            alt={config.coupleTitle}
                            className="zoomable-photo"
                            onClick={() =>
                              setLightboxPhoto({
                                url: ed.collageInsetPhotoUrl,
                                caption: config.coupleTitle,
                              })
                            }
                          />
                        </RevealMotion>

                        <RevealMotion
                          direction="slide-left"
                          delay={0.22}
                          className="collage-side-note"
                        >
                          <EditorialWordmark variant="i-love-you" size="sm" />
                          <p className="collage-side-note__verse">
                            {ed.collageSideVerse}
                          </p>
                        </RevealMotion>
                      </div>
                    </div>
                  </section>

                  {/* 8. Dual Panorama Split */}
                  <section className="panorama-split">
                    <RevealMotion direction="slide-up" delay={0.18}>
                      <img
                        src={ed.panoramaTopUrl}
                        alt={config.coupleTitle}
                        className="panorama-split__img zoomable-photo"
                        style={{ objectPosition: ed.panoramaTopPosition ?? '50% 13%' }}
                        onClick={() =>
                          setLightboxPhoto({
                            url: ed.panoramaTopUrl,
                            caption: config.coupleTitle,
                          })
                        }
                      />
                    </RevealMotion>

                    <div className="panorama-split__mid">
                      <EditorialTriadHeader words={ed.panoramaHeader} />
                    </div>

                    <RevealMotion direction="slide-up" delay={0.18}>
                      <img
                        src={ed.panoramaBottomUrl}
                        alt={config.coupleTitle}
                        className="panorama-split__img zoomable-photo"
                        style={{ objectPosition: ed.panoramaBottomPosition ?? '15% 50%' }}
                        onClick={() =>
                          setLightboxPhoto({
                            url: ed.panoramaBottomUrl,
                            caption: config.coupleTitle,
                          })
                        }
                      />
                    </RevealMotion>
                  </section>

                  {/* 9. Save The Date Polaroid Arch & Calendar Overlay */}
                  <section className="calendar-section" aria-label="Lịch ngày cưới">
                    <RevealMotion direction="slide-up" delay={0.15}>
                      <SageHeartMark />
                    </RevealMotion>
                    <RevealMotion direction="slide-up" delay={0.2}>
                      <div className="wordmark-wrap" style={{ marginBottom: 20 }}>
                        <EditorialWordmark variant="save-the-date" size="md" />
                      </div>
                    </RevealMotion>
                    <RevealMotion direction="slide-up">
                      <p className="calendar-section__verse">{ed.calendarVerse}</p>
                    </RevealMotion>

                    <RevealMotion direction="slide-up" delay={0.2}>
                      <div className="calendar-arch-card">
                        <div className="calendar-arch-photo-wrap">
                          <img
                            src={ed.calendarPortraitUrl}
                            alt={config.coupleTitle}
                            className="calendar-arch-photo"
                          />
                          <div className="calendar-arch-scrim">
                            <WeddingCalendar
                              year={config.weddingYear}
                              month={config.weddingMonthNumber}
                              weddingDay={config.weddingDayOfMonth}
                            />
                          </div>
                        </div>

                        <div className="calendar-arch-footer">
                          <div>{ed.calendarFooterLine}</div>
                          <div>{ed.calendarFooterTimeLine}</div>
                        </div>
                      </div>
                    </RevealMotion>
                  </section>

                  {/* 10. Wave-Masked Feature ("SWEET | WEDDING | INVITATION") */}
                  <section className="sweet-feature">
                    <RevealMotion direction="slide-up">
                      <p className="sweet-feature__top-poem">{ed.closingPoemTop}</p>
                    </RevealMotion>

                    <div className="sweet-feature__photo-stage">
                      <RevealMotion direction="slide-up" delay={0.2}>
                        <img
                          src={ed.closingFeaturePhotoUrl}
                          alt={config.coupleTitle}
                          className="sweet-feature__photo zoomable-photo"
                          onClick={() =>
                            setLightboxPhoto({
                              url: ed.closingFeaturePhotoUrl,
                              caption: ed.closingPoemTop,
                            })
                          }
                        />
                      </RevealMotion>
                      <div className="sweet-feature__header">
                        <EditorialTriadHeader
                          words={ed.closingFeatureHeader}
                          variant="white"
                        />
                      </div>
                    </div>

                    <RevealMotion direction="slide-up">
                      <p className="sweet-feature__bottom-poem">
                        {ed.closingPoemBottom}
                      </p>
                    </RevealMotion>
                  </section>

                  {/* 11. Gift Box + Inline RSVP Card + Chibi Footer */}
                  <footer className="gift-rsvp-footer">
                    <RevealMotion direction="slide-up" delay={0.15}>
                      <SageHeartMark />
                    </RevealMotion>

                    <RevealMotion direction="slide-up" delay={0.25}>
                      <button
                        type="button"
                        className="gift-trigger-btn"
                        onClick={() => setGiftModalOpen(true)}
                      >
                        <SageGiftBoxIcon />
                        <span className="gift-trigger-btn__label">
                          {ed.giftTitle}
                        </span>
                      </button>
                    </RevealMotion>

                    <RevealMotion direction="slide-up" delay={0.25}>
                      <RsvpSection guestbook={guestbook} />
                    </RevealMotion>

                    <RevealMotion direction="slide-up" delay={0.2}>
                      <img
                        src="/images/footer-couple-chibi.png"
                        alt="Cô dâu chú rể"
                        className="footer-chibi"
                      />
                    </RevealMotion>

                    <RevealMotion direction="slide-up" delay={0.2}>
                      <div className="footer-thankyou">
                        <EditorialWordmark variant="thank-you" size="lg" />
                      </div>
                    </RevealMotion>

                    <p className="footer-meta">
                      {config.coupleTitle} · {config.weddingDisplayDate}
                    </p>
                  </footer>
                </article>
              </div>
            </CardScrollRootProvider>
          </div>

          {/* Right Vertical Action Rail (Desktop Feed) */}
          <nav className="feed-rail" aria-label="Công cụ nhanh">
            <img
              src={config.bride.avatarUrl}
              alt={config.coupleTitle}
              className="feed-rail__avatar"
            />
            <button
              type="button"
              className="feed-rail__action feed-rail__action--active"
              onClick={() => scrollToElement('rsvp-section')}
              aria-label="Đi tới phần gửi lời chúc"
            >
              <span className="feed-rail__icon">
                <MessageCircleHeart size={20} />
              </span>
              <span className="feed-rail__label">{guestbook.wishes.length}</span>
            </button>

            <HeartBurstButton initialLikes={88} variant="rail" />

            <button
              type="button"
              className="feed-rail__action"
              onClick={() => setGiftModalOpen(true)}
            >
              <span className="feed-rail__icon feed-rail__icon--gift">
                <Gift size={20} />
              </span>
              <span className="feed-rail__label">Mừng cưới</span>
            </button>

            <button
              type="button"
              className="feed-rail__action"
              onClick={() => void handleCopyShareLink()}
            >
              <span className="feed-rail__icon">
                <Share2 size={19} />
              </span>
              <span className="feed-rail__label">Chia sẻ</span>
            </button>
          </nav>
        </div>

        {/* Center-right Scroll Arrows (Desktop Feed) */}
        <div className="feed-nav" aria-label="Cuộn thiệp">
          <button
            type="button"
            className="feed-nav__btn"
            onClick={() => scrollCardBy(-560)}
            aria-label="Cuộn lên"
          >
            <ChevronUp size={20} />
          </button>
          <button
            type="button"
            className="feed-nav__btn"
            onClick={() => scrollCardBy(560)}
            aria-label="Cuộn xuống"
          >
            <ChevronDown size={20} />
          </button>
        </div>
      </main>

      <FeedRightPanel
        wishes={guestbook.wishes}
        onJumpToRsvp={() => scrollToElement('rsvp-section')}
      />

      {/* Mobile bottom CineLove-style quick toolbar */}
      <div className="mobile-quick-bar">
        <button
          type="button"
          className="mobile-wish-pill"
          onClick={() => setMobileWishesOpen(true)}
        >
          <span>Gửi lời chúc đến đôi uyên ương...</span>
          <MessageCircleHeart size={16} color="var(--blush-deep)" />
        </button>
        <HeartBurstButton initialLikes={88} variant="mobile" />
        <button
          type="button"
          className="mobile-quick-btn mobile-gift-btn"
          onClick={() => setGiftModalOpen(true)}
          aria-label="Mở hộp quà cưới"
        >
          <Gift size={19} />
        </button>
      </div>

      <GiftModal
        isOpen={giftModalOpen}
        onClose={() => setGiftModalOpen(false)}
        title={ed.giftModalTitle}
        accounts={config.giftAccounts}
      />

      <MobileWishesModal
        isOpen={mobileWishesOpen}
        onClose={() => setMobileWishesOpen(false)}
        wishes={guestbook.wishes}
        onJumpToRsvp={() => scrollToElement('rsvp-section')}
      />

      <PhotoLightbox
        photo={lightboxPhoto}
        onClose={() => setLightboxPhoto(null)}
      />

      {toastMsg && (
        <div className="feed-toast" role="status" aria-live="polite">
          {toastMsg}
        </div>
      )}
    </div>
  );
};
