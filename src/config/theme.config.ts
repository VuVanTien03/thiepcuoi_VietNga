import { ThemeConfig } from '../types/wedding';

/**
 * Bảng màu Xanh Lá Nhẹ Nhàng (Soft Pastel Sage & Chamomile Botanical).
 * Giữ tinh thần bố cục thanh lịch trên nền giấy trắng tinh khôi (#FFFFFF),
 * nhấn bằng sắc xanh lá dịu, phong bì xanh bơ pastel và dấu sáp lá bạch đàn.
 */
export const THEME_CONFIG: ThemeConfig = {
  colors: {
    mossDark: '#233024',
    mossPrimary: '#5D7D58',
    mossMuted: '#7B9A74',
    sageLight: '#DCEAD7',
    ivoryBg: '#FFFFFF',
    creamPaper: '#F5F9F3',
    goldAccent: '#869F6E',
    waxSeal: '#76926F',
    inkPrimary: '#243025',
    inkSecondary: '#546655',
    sageSoft: '#7B9A74',
    sageDeep: '#5C7B56',
    leafGold: '#7C9862',
    envelopeBack: '#A7C1A1',
    envelopeFlap: '#BAD0B4',
    envelopeSide: '#CFE0C9',
    envelopeBottom: '#E3EEE0',
    feedBrand: '#6B8E67',
    feedBrandSoft: '#EFF5ED',
  },
  timings: {
    flapOpenDurationMs: 650,
    polaroidRiseDurationMs: 1100,
    holdAfterEmergeMs: 1250,
    cloudTransitionDurationMs: 1850,
  },
};
