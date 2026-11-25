export type InvitationStage =
  | 'envelope-idle'
  | 'envelope-opening'
  | 'polaroid-emerged'
  | 'cloud-transition'
  | 'main-invitation';

export interface ParentInfo {
  father: string;
  mother: string;
  address: string;
  mapUrl?: string;
}

export interface CoupleMember {
  role: 'groom' | 'bride';
  title: string;
  fullName: string;
  shortName: string;
  birthOrder: string;
  bio: string;
  avatarUrl: string;
  parents: ParentInfo;
}

export interface WeddingEvent {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  solarDate: string;
  lunarDate: string;
  venueName: string;
  address: string;
  mapUrl: string;
  isoStart: string;
  isoEnd: string;
  accentIcon: 'rings' | 'wine' | 'home';
}

export interface StoryMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
  imageUrl: string;
  caption: string;
  rotationDeg: number;
}

export interface PolaroidPhoto {
  id: string;
  imageUrl: string;
  caption: string;
  dateLabel?: string;
  rotationDeg: number;
  tapePosition?: 'top-center' | 'top-corners' | 'none';
}

export interface FilmstripFrame {
  id: string;
  imageUrl: string;
  subtitle: string;
  objectPosition?: string;
}

export interface GiftAccount {
  id: string;
  ownerRole: string;
  ownerName: string;
  bankName: string;
  accountNumber: string;
  qrNote: string;
}

export interface SurpriseCardItem {
  id: string;
  badge: string;
  title: string;
  message: string;
  imageUrl?: string;
}

export type AttendanceStatus = 'attending' | 'not-attending' | 'maybe';
export type GuestSide = 'groom' | 'bride' | 'both';

export interface GuestWish {
  id: string;
  guestName: string;
  side: GuestSide;
  attendance: AttendanceStatus;
  guestCount: number;
  message: string;
  createdAt: string;
}

export interface RsvpSubmission {
  guestName: string;
  side: GuestSide;
  attendance: AttendanceStatus;
  guestCount: number;
  message: string;
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export interface SectionVisibilityConfig {
  showHero: boolean;
  showCountdown: boolean;
  showCouple: boolean;
  showStory: boolean;
  showEvents: boolean;
  showGallery: boolean;
  showRsvp: boolean;
  showGiftBox: boolean;
}

export interface EnvelopeConfig {
  monogram: string;
  invitationLine: string;
  tapPrompt: string;
  openedPrompt?: string;
  recipientPlaceholder: string;
  emergingPolaroidUrl: string;
  emergingPolaroidCaption: string;
  emergingDateStamp: string;
}

export interface EditorialCopyConfig {
  topEyebrow: [string, string, string];
  scriptHeadline: string;
  invitationHeading: string;
  invitationSubheading: string;
  ceremonyHeadline: string;
  ceremonyDateLine: string;
  ceremonyLunarLine: string;
  venueHeading: string;
  primaryVenueTitle: string;
  primaryVenueAddress: string;
  primaryVenueMapUrl: string;
  openingWarmNote: string;
  bannerHeader: [string, string, string];
  bannerImageUrl: string;
  bannerCaption: string;
  thankYouParagraph: string;
  poemVi: string;
  poemEn: string;
  filmstripHeader: [string, string, string];
  filmstripFrames: FilmstripFrame[];
  collageLeadPoem: string;
  collageLargePhotoUrl: string;
  collageInsetPhotoUrl: string;
  collageSideVerse: string;
  calendarVerse: string;
  calendarPortraitUrl: string;
  calendarFooterLine: string;
  calendarFooterTimeLine: string;
  closingPoemTop: string;
  closingFeaturePhotoUrl: string;
  closingFeatureHeader: [string, string, string];
  closingPoemBottom: string;
  giftTitle: string;
  giftModalTitle: string;
  feedDescription: string;
}

export interface WeddingConfig {
  coupleTitle: string;
  hashtag: string;
  weddingDateIso: string;
  weddingDisplayDate: string;
  weddingMonthLabel: string;
  weddingDayOfMonth: number;
  weddingDays?: number[];
  weddingMonthNumber: number;
  weddingYear: number;
  quote: string;
  quoteAuthor: string;
  envelope: EnvelopeConfig;
  editorial: EditorialCopyConfig;
  groom: CoupleMember;
  bride: CoupleMember;
  events: WeddingEvent[];
  story: StoryMilestone[];
  gallery: PolaroidPhoto[];
  giftAccounts: GiftAccount[];
  surpriseCards?: SurpriseCardItem[];
  initialWishes: GuestWish[];
  audioTitle: string;
  audioUrl?: string;
  sections: SectionVisibilityConfig;
}

export interface AnimationTimingConfig {
  flapOpenDurationMs: number;
  polaroidRiseDurationMs: number;
  holdAfterEmergeMs: number;
  cloudTransitionDurationMs: number;
}

export interface ThemeColorsConfig {
  mossDark: string;
  mossPrimary: string;
  mossMuted: string;
  sageLight: string;
  ivoryBg: string;
  creamPaper: string;
  goldAccent: string;
  waxSeal: string;
  inkPrimary: string;
  inkSecondary: string;
  sageSoft: string;
  sageDeep: string;
  leafGold: string;
  envelopeBack: string;
  envelopeFlap: string;
  envelopeSide: string;
  envelopeBottom: string;
  feedBrand: string;
  feedBrandSoft: string;
}

export interface ThemeConfig {
  colors: ThemeColorsConfig;
  timings: AnimationTimingConfig;
}

/**
 * ISP / DIP Interfaces for Services
 */
export interface ICountdownService {
  calculateRemaining(targetIsoDate: string, now?: Date): CountdownTime;
}

export interface IGuestbookRepository {
  getCached?(seedWishes: GuestWish[]): GuestWish[];
  preload?(seedWishes: GuestWish[]): Promise<GuestWish[]>;
  getAll(seedWishes: GuestWish[]): Promise<GuestWish[]>;
  submit(entry: RsvpSubmission): Promise<GuestWish>;
}

export interface ICalendarService {
  buildGoogleCalendarUrl(event: WeddingEvent, coupleTitle: string): string;
}

export interface IAudioService {
  isPlaying(): boolean;
  play(url?: string): Promise<boolean>;
  pause(): void;
  toggle(url?: string): Promise<boolean>;
  dispose(): void;
}
