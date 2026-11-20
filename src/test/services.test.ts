import { describe, expect, it, vi } from 'vitest';
import { WEDDING_CONFIG } from '../config/wedding.config';
import { WeddingAudioService } from '../services/audio.service';
import { CalendarService } from '../services/calendar.service';
import { CountdownService } from '../services/countdown.service';
import { LocalStorageGuestbookRepository } from '../services/guestbook.service';
import { WeddingEvent } from '../types/wedding';

describe('CountdownService', () => {
  it('calculates remaining days, hours, minutes, seconds accurately', () => {
    const service = new CountdownService();
    const now = new Date('2026-12-18T10:00:00+07:00');
    const target = '2026-12-20T11:30:15+07:00';

    const result = service.calculateRemaining(target, now);
    expect(result).toEqual({
      days: 2,
      hours: 1,
      minutes: 30,
      seconds: 15,
      isExpired: false,
    });
  });

  it('returns zeroed expired state when target is in the past', () => {
    const service = new CountdownService();
    const now = new Date('2026-12-25T00:00:00+07:00');
    const target = '2026-12-20T11:30:00+07:00';

    const result = service.calculateRemaining(target, now);
    expect(result).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    });
  });
});

describe('CalendarService', () => {
  it('builds a valid Google Calendar template link', () => {
    const service = new CalendarService();
    const event: WeddingEvent = {
      id: 'test',
      title: 'Lễ Thành Hôn',
      subtitle: 'Tiệc cưới chung vui',
      time: '11:30',
      solarDate: '20/12/2026',
      lunarDate: '12/11 Bính Ngọ',
      venueName: 'Thảo Điền Garden',
      address: '125 Nguyễn Văn Hưởng',
      mapUrl: 'https://maps.google.com',
      isoStart: '2026-12-20T11:30:00+07:00',
      isoEnd: '2026-12-20T14:30:00+07:00',
      accentIcon: 'rings',
    };

    const url = service.buildGoogleCalendarUrl(event, 'Quốc Việt & Thu Ngà');
    expect(url).toContain('https://calendar.google.com/calendar/render?');
    expect(url).toContain('Qu%E1%BB%91c+Vi%E1%BB%87t');
    expect(url).toContain('20261220T043000Z%2F20261220T073000Z');
  });
});

describe('LocalStorageGuestbookRepository', () => {
  it('returns seed wishes when empty and persists new RSVP entries', async () => {
    window.localStorage.clear();
    const repo = new LocalStorageGuestbookRepository('test_guestbook_key');

    const initial = await repo.getAll([
      {
        id: 's1',
        guestName: 'Lan',
        side: 'bride',
        attendance: 'attending',
        guestCount: 1,
        message: 'Chúc mừng!',
        createdAt: '2026-11-18T00:00:00Z',
      },
    ]);
    expect(initial).toHaveLength(1);

    const created = await repo.submit({
      guestName: 'Hoàng Nam',
      side: 'groom',
      attendance: 'attending',
      guestCount: 2,
      message: 'Trăm năm hạnh phúc!',
    });

    expect(created.guestName).toBe('Hoàng Nam');
    const afterSubmit = await repo.getAll([]);
    expect(afterSubmit).toHaveLength(1);
    expect(afterSubmit[0].guestName).toBe('Hoàng Nam');
  });

  it('rejects blank guest names', async () => {
    const repo = new LocalStorageGuestbookRepository('test_guestbook_key_2');
    await expect(
      repo.submit({
        guestName: '   ',
        side: 'both',
        attendance: 'attending',
        guestCount: 1,
        message: 'Hi',
      }),
    ).rejects.toThrow();
  });
});

describe('WeddingAudioService', () => {
  it('configures Em Đồng Ý (I Do).mp3 and reuses audio element across pause/resume', async () => {
    expect(WEDDING_CONFIG.audioTitle).toBe('Em Đồng Ý (I Do)');
    expect(decodeURI(WEDDING_CONFIG.audioUrl ?? '')).toBe(
      '/images/Em Đồng Ý (I Do).mp3',
    );

    const playMock = vi.fn().mockResolvedValue(undefined);
    const pauseMock = vi.fn();
    let constructedCount = 0;

    class MockAudio {
      src: string;
      loop = false;
      preload = '';
      volume = 1;
      play = playMock;
      pause = pauseMock;

      constructor(url: string) {
        constructedCount += 1;
        this.src = `http://localhost:5173${url}`;
      }
    }

    vi.stubGlobal('Audio', MockAudio);
    try {
      const audioService = new WeddingAudioService();
      const firstPlay = await audioService.play(WEDDING_CONFIG.audioUrl);
      expect(firstPlay).toBe(true);
      expect(audioService.isPlaying()).toBe(true);

      await audioService.toggle(WEDDING_CONFIG.audioUrl);
      expect(audioService.isPlaying()).toBe(false);
      expect(pauseMock).toHaveBeenCalledTimes(1);

      await audioService.toggle(WEDDING_CONFIG.audioUrl);
      expect(audioService.isPlaying()).toBe(true);
      expect(constructedCount).toBe(1);
      expect(playMock).toHaveBeenCalledTimes(2);
      audioService.dispose();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
