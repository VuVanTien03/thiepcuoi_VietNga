import { describe, expect, it, vi } from 'vitest';
import { WEDDING_CONFIG } from '../config/wedding.config';
import { WeddingAudioService } from '../services/audio.service';
import { CalendarService } from '../services/calendar.service';
import { CountdownService } from '../services/countdown.service';
import {
  createGuestbookRepository,
  GoogleSheetsGuestbookRepository,
  LocalStorageGuestbookRepository,
} from '../services/guestbook.service';
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

describe('GoogleSheetsGuestbookRepository & createGuestbookRepository', () => {
  const endpoint = 'https://script.google.com/macros/s/demo/exec';
  const seedWish = {
    id: 'seed-1',
    guestName: 'Khách Mẫu',
    side: 'both' as const,
    attendance: 'attending' as const,
    guestCount: 1,
    message: 'Chúc mừng!',
    createdAt: '2026-11-18T00:00:00Z',
  };

  it('selects GoogleSheetsGuestbookRepository when endpoint URL is set, otherwise LocalStorage', () => {
    expect(createGuestbookRepository('')).toBeInstanceOf(
      LocalStorageGuestbookRepository,
    );
    expect(createGuestbookRepository('   ')).toBeInstanceOf(
      LocalStorageGuestbookRepository,
    );
    expect(createGuestbookRepository(endpoint)).toBeInstanceOf(
      GoogleSheetsGuestbookRepository,
    );
  });

  it('posts RSVP with text/plain header and sets sheetGuestCount=0 when not attending', async () => {
    window.localStorage.clear();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        wish: {
          id: 'wish-sheet-1',
          guestName: 'Ngọc Hà',
          side: 'both',
          attendance: 'not-attending',
          guestCount: 1,
          message: 'Tiếc quá mình bận công tác!',
          createdAt: '2026-11-22T15:00:00Z',
        },
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    try {
      const repo = new GoogleSheetsGuestbookRepository(
        endpoint,
        'test_sheets_cache_1',
      );
      const saved = await repo.submit({
        guestName: '  Ngọc Hà  ',
        side: 'both',
        attendance: 'not-attending',
        guestCount: 2,
        message: 'Tiếc quá mình bận công tác!',
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [calledUrl, options] = fetchMock.mock.calls[0] as [
        string,
        RequestInit,
      ];
      expect(calledUrl).toBe(endpoint);
      expect(options.method).toBe('POST');
      expect(options.headers).toEqual({
        'Content-Type': 'text/plain;charset=utf-8',
      });

      const body = JSON.parse(String(options.body)) as Record<string, unknown>;
      expect(body.guestName).toBe('Ngọc Hà');
      expect(body.sheetGuestCount).toBe(0);
      expect(saved.id).toBe('wish-sheet-1');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('throws an error when Google Sheets POST fails instead of reporting fake success', async () => {
    window.localStorage.clear();
    const fetchMock = vi.fn().mockRejectedValue(new Error('Network down'));
    vi.stubGlobal('fetch', fetchMock);

    try {
      const repo = new GoogleSheetsGuestbookRepository(
        endpoint,
        'test_sheets_cache_err',
      );
      await expect(
        repo.submit({
          guestName: 'Minh Khôi',
          side: 'both',
          attendance: 'attending',
          guestCount: 2,
          message: 'Chúc hai bạn hạnh phúc!',
        }),
      ).rejects.toThrow(/Không thể kết nối máy chủ/i);

      expect(window.localStorage.getItem('test_sheets_cache_err')).toBeNull();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('loads remote wishes from Google Sheets, caches them, and falls back when offline', async () => {
    window.localStorage.clear();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ok: true,
          wishes: [
            {
              id: 'sheet-10',
              guestName: 'Thu Trang',
              side: 'both',
              attendance: 'attending',
              guestCount: 2,
              message: 'Hẹn gặp ngày cưới nha!',
              createdAt: '2026-11-22T12:00:00Z',
            },
          ],
        }),
      })
      .mockRejectedValueOnce(new Error('Offline'));
    vi.stubGlobal('fetch', fetchMock);

    try {
      const repo = new GoogleSheetsGuestbookRepository(
        endpoint,
        'test_sheets_cache_2',
      );
      const onlineWishes = await repo.getAll([seedWish]);
      expect(onlineWishes).toHaveLength(1);
      expect(onlineWishes[0].guestName).toBe('Thu Trang');

      const offlineWishes = await repo.getAll([seedWish]);
      expect(offlineWishes).toHaveLength(1);
      expect(offlineWishes[0].guestName).toBe('Thu Trang');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('deduplicates concurrent preload/getAll requests, reuses fresh snapshot, and invalidates on submit', async () => {
    window.localStorage.clear();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ok: true,
          wishes: [
            {
              id: 'sheet-preload-1',
              guestName: 'Gia Huy',
              side: 'both',
              attendance: 'attending',
              guestCount: 1,
              message: 'Chúc mừng hai bạn!',
              createdAt: '2026-11-23T08:00:00Z',
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ok: true,
          wish: {
            id: 'sheet-post-2',
            guestName: 'Thanh Vân',
            side: 'both',
            attendance: 'attending',
            guestCount: 2,
            message: 'Mãi hạnh phúc nhé!',
            createdAt: '2026-11-23T09:00:00Z',
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ok: true,
          wishes: [
            {
              id: 'sheet-post-2',
              guestName: 'Thanh Vân',
              side: 'both',
              attendance: 'attending',
              guestCount: 2,
              message: 'Mãi hạnh phúc nhé!',
              createdAt: '2026-11-23T09:00:00Z',
            },
            {
              id: 'sheet-preload-1',
              guestName: 'Gia Huy',
              side: 'both',
              attendance: 'attending',
              guestCount: 1,
              message: 'Chúc mừng hai bạn!',
              createdAt: '2026-11-23T08:00:00Z',
            },
          ],
        }),
      });
    vi.stubGlobal('fetch', fetchMock);

    try {
      const repo = new GoogleSheetsGuestbookRepository(
        endpoint,
        'test_sheets_preload_1',
      );
      // Returns seed synchronously before cache is populated
      expect(repo.getCached([seedWish])).toEqual([seedWish]);

      // Concurrent preload + getAll share 1 HTTP GET call
      const [preloaded, concurrent] = await Promise.all([
        repo.preload([seedWish]),
        repo.getAll([seedWish]),
      ]);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(preloaded[0].guestName).toBe('Gia Huy');
      expect(concurrent[0].guestName).toBe('Gia Huy');

      // Synchronous getCached now returns warm wishes immediately
      expect(repo.getCached([seedWish])[0].guestName).toBe('Gia Huy');

      // Subsequent getAll within TTL reuses fresh snapshot without extra GET
      const reused = await repo.getAll([seedWish]);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(reused[0].guestName).toBe('Gia Huy');

      // Submitting invalidates fresh TTL cache so next getAll fetches latest Sheet data
      await repo.submit({
        guestName: 'Thanh Vân',
        side: 'both',
        attendance: 'attending',
        guestCount: 2,
        message: 'Mãi hạnh phúc nhé!',
      });
      const refreshed = await repo.getAll([seedWish]);
      expect(fetchMock).toHaveBeenCalledTimes(3);
      expect(refreshed).toHaveLength(2);
      expect(refreshed[0].guestName).toBe('Thanh Vân');
    } finally {
      vi.unstubAllGlobals();
    }
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
