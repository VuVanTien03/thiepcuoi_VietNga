import { WeddingConfig } from '../types/wedding';

/**
 * Cấu hình trung tâm cho Thiệp Cưới Xanh Lá Nhẹ Nhàng & Hoa Cúc.
 */
export const WEDDING_CONFIG: WeddingConfig = {
  coupleTitle: 'Quốc Việt & Thu Ngà',
  hashtag: '#VietNga2026',
  weddingDateIso: '2026-12-20T11:30:00+07:00',
  weddingDisplayDate: '20 . 12 . 2026',
  weddingMonthLabel: 'Tháng 12, 2026',
  weddingDayOfMonth: 20,
  weddingMonthNumber: 12,
  weddingYear: 2026,
  quote:
    '“Giữa muôn vàn ngã rẽ của cuộc đời, cảm ơn vì chúng ta đã dừng lại, nắm tay nhau và chọn cùng đi hết quãng đường mai sau.”',
  quoteAuthor: 'Quốc Việt & Thu Ngà',

  envelope: {
    monogram: 'V & N',
    invitationLine: 'Trân trọng kính mời',
    tapPrompt: 'Chạm để mở thiệp',
    openedPrompt: 'Đã mở thiệp ♥ Cuộn xuống xem chi tiết',
    recipientPlaceholder: 'Quý khách & Gia đình',
    emergingPolaroidUrl: '/images/wedding/polaroid-cover.jpg',
    emergingPolaroidCaption: 'Save Our Date — 20.12.2026',
    emergingDateStamp: 'CHỦ NHẬT • 20 THÁNG 12',
  },

  editorial: {
    topEyebrow: ['YOU ARE', 'THE LOVE OF', 'MY LIFE'],
    scriptHeadline: 'Wedding Invitation',
    invitationHeading: 'TRÂN TRỌNG KÍNH MỜI',
    invitationSubheading:
      'ĐẾN DỰ BUỔI TIỆC CHUNG VUI\nCÙNG GIA ĐÌNH CHÚNG TÔI VÀO LÚC',
    ceremonyHeadline: '11 GIỜ 30 | CHỦ NHẬT | 20.12.2026',
    ceremonyDateLine: 'Chủ Nhật, 20/12/2026',
    ceremonyLunarLine: '(Nhằm ngày 12 tháng 11 năm Bính Ngọ)',
    venueHeading: 'HÔN LỄ ĐƯỢC CỬ HÀNH TẠI',
    primaryVenueTitle: 'THẢO ĐIỀN GARDEN',
    primaryVenueAddress: '125 Nguyễn Văn Hưởng, Thảo Điền, TP. Thủ Đức, TP. HCM',
    primaryVenueMapUrl: 'https://maps.google.com/?q=Thao+Dien+Ho+Chi+Minh+City',
    openingWarmNote:
      'Gửi đến bạn tấm thiệp cưới đầy yêu thương.\nNhững ai nhận được lời mời này đều là những người đặc biệt với bọn mình.\nMong bạn và gia đình sẽ đến chung vui,\nCùng chứng kiến khoảnh khắc hạnh phúc nhất của hai đứa.\nCảm ơn vì luôn bên cạnh và yêu thương.\nBọn mình rất mong được gặp bạn trong ngày vui này! 💚',
    bannerHeader: ['FALL IN', 'LOVE', 'WEDDING'],
    bannerImageUrl: '/images/wedding/studio-suit.jpg',
    bannerCaption:
      'As the clouds and mist dissipate, I love you and everyone knows it',
    thankYouParagraph:
      'To Our Family And Friends,\nThank You For Celebrating Our Special Day,\nSupporting Us And Sharing Our Love.',
    poemVi:
      'Trái tim em,\nTựa cánh chim nhỏ giữa đồng hoang,\nĐã tìm thấy bầu trời của riêng mình\nTrong đôi mắt anh.',
    poemEn: 'My heart, the bird of the wilderness has found its sky in your eye.',
    filmstripHeader: ['Welcome', 'To', 'Wedding'],
    filmstripFrames: [
      {
        id: 'film-1',
        imageUrl: '/images/wedding/film-camera.jpg',
        subtitle: 'I love three things in this world.',
        objectPosition: '50% 50%',
      },
      {
        id: 'film-2',
        imageUrl: '/images/wedding/film-vows.jpg',
        subtitle: 'Sun, moon and you.',
        objectPosition: '50% 50%',
      },
      {
        id: 'film-3',
        imageUrl: '/images/wedding/studio-rings.jpg',
        subtitle: 'Sun for morning, moon for night, and you forever.',
        objectPosition: '50% 24%',
      },
    ],
    collageLeadPoem:
      'Có lẽ thế gian này có vô vàn điều tươi đẹp,\nNhưng trong lòng em, đẹp nhất vẫn chỉ có anh',
    collageLargePhotoUrl: '/images/wedding/balcony-couple.jpg',
    collageInsetPhotoUrl: '/images/wedding/couple-cutout.png',
    collageSideVerse:
      'Mong gió xuân dịu dàng với em hơn,\nXua tan muộn phiền,\nĐể mọi thứ chỉ còn lại dịu êm.',
    panoramaTopUrl: '/images/wedding/aodai-hands.jpg',
    panoramaTopPosition: '50% 13%',
    panoramaHeader: ['Fall in', 'love', 'Wedding'],
    panoramaBottomUrl: '/images/wedding/polaroid-cover.jpg',
    panoramaBottomPosition: '15% 50%',
    calendarVerse:
      'Đi một vòng lớn rồi vẫn gặp anh,\nTừ đó, thế gian bỗng hóa dịu dàng.',
    calendarPortraitUrl: '/images/wedding/uniform-main.jpg',
    calendarFooterLine: 'Chủ Nhật, 20/12/2026',
    calendarFooterTimeLine: 'Âm lịch 12/11 | 11:30 AM',
    closingPoemTop:
      'Hạnh phúc lớn nhất chính là được nắm tay anh,\nCùng nhau đi hết cuộc đời lãng mạn này',
    closingFeaturePhotoUrl: '/images/wedding/garden-kiss.jpg',
    closingFeatureHeader: ['SWEET', 'WEDDING', 'INVITATION'],
    closingPoemBottom:
      '“Hết lần này đến lần khác, đem chuyện tình riêng khoe với thế gian,\nChỉ vì mỗi lần nhìn em, anh lại thấy đó là điều đáng tự hào nhất.”',
    giftTitle: 'Hộp quà cưới',
    giftModalTitle: 'Hộp Quà Yêu Thương',
    feedDescription:
      'Thiệp mời cưới trực tuyến tông xanh lá nhẹ nhàng & hoa cúc trắng — Trân trọng kính mời bạn đến chung vui cùng Quốc Việt & Thu Ngà ngày 20.12.2026.',
  },

  groom: {
    role: 'groom',
    title: 'Chú Rể',
    fullName: 'Quốc Việt',
    shortName: 'Quốc Việt',
    birthOrder: 'Trưởng Nam',
    bio: 'Chàng trai yêu nhiếp ảnh phim, cà phê sáng cuối tuần và luôn giữ nụ cười dịu dàng dành riêng cho cô dâu.',
    avatarUrl: '/images/wedding/groom-solo.jpg',
    parents: {
      father: 'Ông Nguyễn Văn Hùng',
      mother: 'Bà Trần Thị Lan Anh',
      address: 'Số 28, Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
    },
  },

  bride: {
    role: 'bride',
    title: 'Cô Dâu',
    fullName: 'Thu Ngà',
    shortName: 'Thu Ngà',
    birthOrder: 'Út Nữ',
    bio: 'Cô gái thích mùi hương hoa cúc trắng, lá bạch đàn xanh mát và lưu giữ từng khoảnh khắc bên nhau.',
    avatarUrl: '/images/wedding/bride-solo.jpg',
    parents: {
      father: 'Ông Phạm Minh Tuấn',
      mother: 'Bà Lê Thu Hà',
      address: 'Số 104, Đường Trần Hưng Đạo, TP. Đà Lạt',
    },
  },

  events: [
    {
      id: 'vu-quy',
      title: 'Lễ Vu Quy',
      subtitle: 'Nghi thức gia tiên tại tư gia Nhà Gái',
      time: '08:00 Sáng',
      solarDate: 'Chủ Nhật, 20/12/2026',
      lunarDate: 'Nhằm ngày 12 tháng 11 năm Bính Ngọ',
      venueName: 'Tư Gia Nhà Gái',
      address: '104 Trần Hưng Đạo, Phường 10, TP. Đà Lạt',
      mapUrl: 'https://maps.google.com/?q=Da+Lat+Lam+Dong',
      isoStart: '2026-12-20T08:00:00+07:00',
      isoEnd: '2026-12-20T10:00:00+07:00',
      accentIcon: 'home',
    },
    {
      id: 'thanh-hon',
      title: 'Lễ Thành Hôn & Tiệc Cưới',
      subtitle: 'Đón khách, nghi lễ trao nhẫn & khai tiệc chung vui',
      time: '11:30 Trưa',
      solarDate: 'Chủ Nhật, 20/12/2026',
      lunarDate: 'Nhằm ngày 12 tháng 11 năm Bính Ngọ',
      venueName: 'Sảnh Magnolia — Thảo Điền Garden',
      address: '125 Nguyễn Văn Hưởng, Thảo Điền, TP. Thủ Đức, TP. HCM',
      mapUrl: 'https://maps.google.com/?q=Thao+Dien+Ho+Chi+Minh+City',
      isoStart: '2026-12-20T11:30:00+07:00',
      isoEnd: '2026-12-20T14:30:00+07:00',
      accentIcon: 'rings',
    },
    {
      id: 'after-party',
      title: 'Tiệc Trà & Giao Lưu',
      subtitle: 'Khoảnh khắc ấm cúng cùng bạn bè thân thiết',
      time: '14:30 Chiều',
      solarDate: 'Chủ Nhật, 20/12/2026',
      lunarDate: 'Nhằm ngày 12 tháng 11 năm Bính Ngọ',
      venueName: 'Sân Vườn Ngoài Trời — Thảo Điền Garden',
      address: '125 Nguyễn Văn Hưởng, Thảo Điền, TP. Thủ Đức, TP. HCM',
      mapUrl: 'https://maps.google.com/?q=Thao+Dien+Ho+Chi+Minh+City',
      isoStart: '2026-12-20T14:30:00+07:00',
      isoEnd: '2026-12-20T17:00:00+07:00',
      accentIcon: 'wine',
    },
  ],

  story: [
    {
      id: 'story-1',
      year: 'Tháng 10, 2021',
      title: 'Lần Đầu Gặp Gỡ Dưới Cơn Mưa Đà Lạt',
      description:
        'Chúng mình tình cờ trú mưa tại một tiệm sách nhỏ trên con dốc sương mù, cùng chọn chung một cuốn tập ảnh và bắt đầu câu chuyện kéo dài đến tận tối muộn.',
      imageUrl: '/images/wedding/garden-vows.jpg',
      caption: 'Chiều mưa tháng 10 ở phố núi',
      rotationDeg: -2.5,
    },
    {
      id: 'story-2',
      year: 'Tháng 05, 2023',
      title: 'Chuyến Đi Xa Đầu Tiên Cùng Nhau',
      description:
        'Những tấm ảnh phim đầu tiên được chụp trên đồi cỏ xanh dịu. Từ đó, đi đâu chúng mình cũng lưu giữ thanh xuân qua từng khung hình nhẹ nhàng.',
      imageUrl: '/images/wedding/garden-camera.jpg',
      caption: 'Đồi cỏ xanh & nắng chiều',
      rotationDeg: 2.2,
    },
    {
      id: 'story-3',
      year: 'Tháng 03, 2026',
      title: 'Lời Hứa Trọn Đời',
      description:
        'Giữa khu vườn ngập tràn hoa cúc trắng và lá xanh dịu mát, câu hỏi “Làm vợ anh nhé?” đã nhận được cái gật đầu hạnh phúc nhất.',
      imageUrl: '/images/wedding/studio-rings.jpg',
      caption: 'She said Yes!',
      rotationDeg: -1.8,
    },
  ],

  gallery: [
    {
      id: 'gal-1',
      imageUrl: '/images/wedding/aodai-nhacohy.jpg',
      caption: 'Ánh nắng đầu ngày trong khu vườn xanh',
      dateLabel: '10.2026',
      rotationDeg: -3,
      tapePosition: 'top-center',
    },
    {
      id: 'gal-2',
      imageUrl: '/images/wedding/aodai-hands.jpg',
      caption: 'Bước bên nhau qua những triền cỏ',
      dateLabel: '10.2026',
      rotationDeg: 2.4,
      tapePosition: 'top-corners',
    },
    {
      id: 'gal-3',
      imageUrl: '/images/wedding/garden-bouquet.jpg',
      caption: 'Khoảnh khắc bình yên nhất',
      dateLabel: '11.2026',
      rotationDeg: -1.6,
      tapePosition: 'top-center',
    },
    {
      id: 'gal-4',
      imageUrl: '/images/wedding/uniform-embrace.jpg',
      caption: 'Hai bàn tay đan chặt lời hẹn ước',
      dateLabel: '11.2026',
      rotationDeg: 3.1,
      tapePosition: 'top-corners',
    },
  ],

  giftAccounts: [
    {
      id: 'gift-groom',
      ownerRole: 'Mừng Cưới Nhà Trai',
      ownerName: 'QUOC VIET',
      bankName: 'Vietcombank',
      accountNumber: '0071001234567',
      qrNote: 'Chúc mừng hạnh phúc Quốc Việt & Thu Ngà',
    },
    {
      id: 'gift-bride',
      ownerRole: 'Mừng Cưới Nhà Gái',
      ownerName: 'THU NGA',
      bankName: 'Techcombank',
      accountNumber: '19036888999001',
      qrNote: 'Chúc mừng hạnh phúc Quốc Việt & Thu Ngà',
    },
  ],

  initialWishes: [
    {
      id: 'seed-1',
      guestName: 'Hoàng Bảo & Thùy Linh',
      side: 'both',
      attendance: 'attending',
      guestCount: 2,
      message:
        'Chúc Việt và Ngà trăm năm hạnh phúc, mãi giữ được sự dịu dàng như những ngày đầu tiên!',
      createdAt: '2026-11-18T09:15:00+07:00',
    },
    {
      id: 'seed-2',
      guestName: 'Anh Tuấn (Team Design)',
      side: 'groom',
      attendance: 'attending',
      guestCount: 1,
      message:
        'Thiệp xanh lá hoa cúc dịu nhẹ xinh quá! Hẹn gặp hai em ở Thảo Điền ngày 20/12 nhé.',
      createdAt: '2026-11-19T14:40:00+07:00',
    },
  ],

  audioTitle: 'Em Đồng Ý (I Do)',
  audioUrl: encodeURI('/images/Em Đồng Ý (I Do).mp3'),

  sections: {
    showHero: true,
    showCountdown: true,
    showCouple: true,
    showStory: true,
    showEvents: true,
    showGallery: true,
    showRsvp: true,
    showGiftBox: true,
  },
};
