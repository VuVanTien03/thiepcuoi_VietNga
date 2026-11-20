import React from 'react';

/**
 * Tim trang trí bo tròn theo tỉ lệ template gốc, phối màu xanh lá dịu nhẹ.
 */
export const SageHeartMark: React.FC<{ className?: string }> = ({ className = 'heart-mark' }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M70.7,71.3c-10.6,7.5-19.6,17.9-20.7,22.2c-1.3-4.3-9.4-14.5-20.8-22C17.5,63.8-0.1,56.6,0,37.4c0.2-35,37-42,50-11.9C62.3-3.4,99.8,2.1,100,37.2C100.1,56.4,82.3,63.1,70.7,71.3L70.7,71.3z"
    />
  </svg>
);

/**
 * Đường phân cách hoa văn cổ điển nằm giữa ngày giờ & địa điểm lễ cưới.
 */
export const SageDividerOrnament: React.FC<{ className?: string }> = ({
  className = 'invite-block__divider',
}) => (
  <svg
    className={className}
    viewBox="0 468 1024 88"
    aria-hidden="true"
  >
    <path
      fill="#7B9A74"
      d="M371.5072 518.656H39.2192c-3.9936 0-7.2704-3.2768-7.2704-7.2704s3.2768-7.2704 7.2704-7.2704h31.8464c1.536 0 2.7648-1.2288 2.7648-2.7648v-0.9216c0-1.536-1.2288-2.7648-2.7648-2.7648H2.9696v-4.608h68.096c3.9936 0 7.2704 3.2768 7.2704 7.2704v0.9216c0 3.9936-3.2768 7.2704-7.2704 7.2704H39.2192c-1.536 0-2.7648 1.2288-2.7648 2.7648s1.2288 2.7648 2.7648 2.7648h332.288v4.608zM382.1568 518.656H49.8688c-3.9936 0-7.2704-3.2768-7.2704-7.2704s3.2768-7.2704 7.2704-7.2704h31.8464c1.536 0 2.7648-1.2288 2.7648-2.7648v-0.9216c0-1.536-1.2288-2.7648-2.7648-2.7648H13.6192v-4.608h68.096c3.9936 0 7.2704 3.2768 7.2704 7.2704v0.9216c0 3.9936-3.2768 7.2704-7.2704 7.2704H49.8688c-1.536 0-2.7648 1.2288-2.7648 2.7648s1.2288 2.7648 2.7648 2.7648h332.288v4.608zM984.8832 518.656H652.4928v-4.608h332.3904c1.536 0 2.7648-1.2288 2.7648-2.7648s-1.2288-2.7648-2.7648-2.7648h-31.9488c-3.9936 0-7.2704-3.2768-7.2704-7.2704v-0.9216c0-3.9936 3.2768-7.2704 7.2704-7.2704h68.096v4.608h-68.096a2.6624 2.6624 0 0 0-2.6624 2.7648v0.9216c0 1.536 1.2288 2.7648 2.6624 2.7648h31.9488c3.9936 0 7.2704 3.2768 7.2704 7.2704s-3.2768 7.2704-7.2704 7.2704zM974.2336 518.656H641.9456v-4.608h332.288c1.536 0 2.7648-1.2288 2.7648-2.7648s-1.2288-2.7648-2.7648-2.7648h-31.9488c-3.9936 0-7.2704-3.2768-7.2704-7.2704v-0.9216c0-3.9936 3.2768-7.2704 7.2704-7.2704h68.096v4.608h-68.096a2.6624 2.6624 0 0 0-2.6624 2.7648v0.9216c0 1.536 1.2288 2.7648 2.6624 2.7648h31.9488c3.9936 0 7.2704 3.2768 7.2704 7.2704s-3.2768 7.2704-7.2704 7.2704zM408.1664 530.8416h-28.16v-26.624h4.5056v22.1184h19.1488v-17.92h-13.0048v10.752h4.7104v-6.656h4.5056v11.1616h-13.7216v-19.7632h22.016zM441.6512 530.8416h-28.16v-26.624h4.5056v22.1184h19.1488v-17.92h-13.0048v10.752h4.608v-6.656h4.5056v11.1616h-13.6192v-19.7632h22.016zM475.136 530.8416h-28.16v-26.624h4.5056v22.1184h19.1488v-17.92h-13.0048v10.752h4.608v-6.656h4.5056v11.1616h-13.6192v-19.7632h22.016zM508.6208 530.8416h-28.16v-26.624h4.5056v22.1184h19.1488v-17.92h-13.0048v10.752h4.608v-6.656h4.5056v11.1616h-13.6192v-19.7632h22.016zM542.0032 530.8416h-28.16v-26.624h4.5056v22.1184h19.1488v-17.92h-12.9024v10.752h4.608v-6.656h4.5056v11.1616h-13.6192v-19.7632h21.9136zM575.488 530.8416h-28.16v-26.624h4.5056v22.1184h19.1488v-17.92h-13.0048v10.752h4.608v-6.656h4.5056v11.1616h-13.6192v-19.7632h22.016zM608.9728 530.8416h-28.16v-26.624h4.5056v22.1184h19.1488v-17.92h-13.0048v10.752h4.608v-6.656h4.5056v11.1616h-13.6192v-19.7632h22.016zM642.4576 530.8416h-28.16v-26.624h4.5056v22.1184h19.1488v-17.92h-13.0048v10.752h4.608v-6.656h4.5056v11.1616h-13.6192v-19.7632h22.016z"
    />
  </svg>
);

/**
 * Con dấu sáp lá bạch đàn tông xanh olive nhẹ nhàng gắn giữa nắp phong bì.
 */
export const SageWaxSeal: React.FC = () => (
  <svg viewBox="0 0 80 80" aria-hidden="true">
    <defs>
      <radialGradient id="sageWaxGrad" cx="38%" cy="34%" r="65%">
        <stop offset="0%" stopColor="#9AB592" />
        <stop offset="55%" stopColor="#75916E" />
        <stop offset="100%" stopColor="#556F50" />
      </radialGradient>
    </defs>
    <path
      d="M40 5 C49 4, 59 9, 65 15 C72 22, 76 31, 74 42 C72 54, 67 65, 57 71 C46 77, 33 76, 23 70 C12 63, 6 53, 6 41 C5 30, 11 19, 19 13 C25 8, 32 6, 40 5 Z"
      fill="url(#sageWaxGrad)"
      stroke="#5C7756"
      strokeWidth="1.5"
    />
    <circle
      cx="40"
      cy="40"
      r="25"
      fill="none"
      stroke="rgba(255,255,255,0.28)"
      strokeWidth="1.2"
    />
    {/* Cành lá ép nổi */}
    <path
      d="M40 58 V24"
      stroke="#EFF6EC"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M40 48 C33 48, 28 43, 28 38 C34 38, 38 42, 40 48 Z"
      fill="#EFF6EC"
      opacity="0.92"
    />
    <path
      d="M40 40 C47 40, 52 35, 52 30 C46 30, 42 34, 40 40 Z"
      fill="#EFF6EC"
      opacity="0.92"
    />
    <path
      d="M40 31 C34 31, 30 27, 30 22 C35 22, 39 26, 40 31 Z"
      fill="#EFF6EC"
      opacity="0.92"
    />
    <ellipse cx="40" cy="21" rx="3.2" ry="4.5" fill="#EFF6EC" opacity="0.92" />
  </svg>
);

/**
 * Display Serif Wordmarks ("MY LOVER", "I LOVE YOU", "SAVE THE DATE", "Thank you")
 * tái hiện nét chữ thanh mảnh + ngôi sao 4 cánh trong chữ O theo tông xanh lá dịu.
 */
export const EditorialWordmark: React.FC<{
  variant: 'my-lover' | 'i-love-you' | 'save-the-date' | 'thank-you';
  size?: 'sm' | 'md' | 'lg';
}> = ({ variant, size = 'md' }) => {
  const starSize = size === 'lg' ? 9 : size === 'sm' ? 6 : 7.5;
  const resolvedFontSize =
    size === 'lg'
      ? 'clamp(25px, 6.8vw, 34px)'
      : size === 'sm'
      ? 'clamp(14px, 3.4vw, 18px)'
      : 'clamp(20px, 5.4vw, 27px)';

  const renderOWithStar = (key: string) => (
    <span
      key={key}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      O
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          fontSize: `${starSize}px`,
          lineHeight: 1,
          transform: 'translateY(-1px)',
        }}
      >
        ✦
      </span>
    </span>
  );

  const renderText = () => {
    switch (variant) {
      case 'my-lover':
        return <>MY L{renderOWithStar('o1')}VER</>;
      case 'i-love-you':
        return (
          <>
            I L{renderOWithStar('o1')}VE Y{renderOWithStar('o2')}U
          </>
        );
      case 'save-the-date':
        return <>SAVE THE DATE</>;
      case 'thank-you':
        return <>Thank you</>;
    }
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        color: 'var(--sage-primary)',
        fontFamily: 'var(--font-display-serif)',
        fontSize: resolvedFontSize,
        fontWeight: 500,
        letterSpacing:
          variant === 'thank-you'
            ? '0.06em'
            : size === 'sm'
            ? '0.08em'
            : '0.14em',
        lineHeight: 1.1,
      }}
    >
      {renderText()}
    </div>
  );
};

/**
 * Hộp quà cưới hoa cúc xanh pastel dịu dàng.
 */
export const SageGiftBoxIcon: React.FC<{ className?: string }> = ({
  className = 'gift-trigger-btn__box',
}) => (
  <svg className={className} viewBox="0 0 120 120" aria-hidden="true">
    {/* Thắt nơ trên nắp */}
    <path
      d="M60 35 C47 16, 26 22, 30 37 C32 43, 47 41, 60 37 Z"
      fill="#8DAF85"
      stroke="#5C7B56"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <path
      d="M60 35 C73 16, 94 22, 90 37 C88 43, 73 41, 60 37 Z"
      fill="#8DAF85"
      stroke="#5C7B56"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    {/* Tim hồng phấn dịu ở giữa nơ xanh */}
    <path
      d="M60 39 C46 28, 46 15, 56 15 C59 15, 60 18, 60 20 C60 18, 61 15, 64 15 C74 15, 74 28, 60 39 Z"
      fill="#F3A6B4"
      stroke="#5C7B56"
      strokeWidth="3.2"
      strokeLinejoin="round"
    />
    {/* Thân hộp */}
    <rect
      x="18"
      y="56"
      width="84"
      height="50"
      rx="6"
      fill="#DCEAD7"
      stroke="#5C7B56"
      strokeWidth="3.8"
    />
    {/* Nắp hộp */}
    <rect
      x="13"
      y="37"
      width="94"
      height="20"
      rx="5"
      fill="#CEE0C8"
      stroke="#5C7B56"
      strokeWidth="3.8"
    />
    {/* Ruy băng dọc */}
    <rect
      x="50"
      y="37"
      width="20"
      height="69"
      fill="#8DAF85"
      stroke="#5C7B56"
      strokeWidth="3.2"
    />
  </svg>
);

/**
 * Dấu tim hồng phấn dịu đánh dấu ngày trọng đại trên Lịch Thiệp Cưới.
 */
export const CalendarHeartMark: React.FC<{ className?: string }> = ({
  className = 'wedding-cal-heart',
}) => (
  <svg className={className} viewBox="0 0 64 60" aria-hidden="true">
    <path
      d="M32 52 C20 42, 7 32, 7 19 C7 10, 14 4, 22 4 C27 4, 30 7, 32 10 C34 7, 37 4, 42 4 C50 4, 57 10, 57 19 C57 32, 44 42, 32 52 Z"
      fill="#E58C9C"
      fillOpacity="0.9"
      stroke="#FCE8EC"
      strokeWidth="2.2"
    />
    <path
      d="M28 19 C28 16.5, 30.5 15.5, 32 17.5 C33.5 15.5, 36 16.5, 36 19 C36 22, 32 24.5, 32 24.5 C32 24.5, 28 22, 28 19 Z"
      fill="#FFFFFF"
      fillOpacity="0.9"
    />
  </svg>
);
