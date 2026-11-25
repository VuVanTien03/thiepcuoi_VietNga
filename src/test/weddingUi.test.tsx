import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { App } from '../App';
import { MainInvitationPage } from '../components/MainInvitationPage';
import { buildWeddingCalendarCells } from '../components/sections/WeddingCalendar';
import { InvitationProvider } from '../context/InvitationContext';
import { useAutoScroll } from '../hooks/useCardEffects';
import { LocalStorageGuestbookRepository } from '../services/guestbook.service';
import { IGuestbookRepository } from '../types/wedding';

beforeAll(() => {
  if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
    class MockIntersectionObserver {
      observe() { }
      unobserve() { }
      disconnect() { }
      takeRecords() {
        return [];
      }
    }
    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: MockIntersectionObserver,
    });
  }
  if (typeof window !== 'undefined' && 'HTMLMediaElement' in window) {
    vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockResolvedValue(
      undefined,
    );
    vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(
      () => { },
    );
  }
});

afterAll(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('buildWeddingCalendarCells', () => {
  it('places December 20, 2026 on Sunday and highlights only day 20', () => {
    const cells = buildWeddingCalendarCells(2026, 12, 20);
    expect(cells).toHaveLength(32);
    expect(cells[0].day).toBeNull();
    expect(cells[1].day).toBe(1);

    const weddingCell = cells.find((c) => c.day === 20);
    expect(weddingCell?.isWeddingDay).toBe(true);

    const weddingIndex = cells.findIndex((c) => c.day === 20);
    expect(weddingIndex % 7).toBe(6);
    expect(cells.filter((c) => c.isWeddingDay)).toHaveLength(1);
  });

  it('highlights both December 26 (Saturday) and December 27 (Sunday), 2026 when passed an array', () => {
    const cells = buildWeddingCalendarCells(2026, 12, [26, 27]);
    expect(cells).toHaveLength(32);

    const dec26Index = cells.findIndex((c) => c.day === 26);
    const dec27Index = cells.findIndex((c) => c.day === 27);
    expect(dec26Index % 7).toBe(5);
    expect(dec27Index % 7).toBe(6);
    expect(cells[dec26Index]?.isWeddingDay).toBe(true);
    expect(cells[dec27Index]?.isWeddingDay).toBe(true);
    expect(cells.filter((c) => c.isWeddingDay)).toHaveLength(2);
  });
});

describe('Two-Page Soft Green Wedding Invitation & Cloud Parting Transition', () => {
  it('renders dedicated envelope opening page first, transitions via cloud parting mist into dedicated main invitation page', async () => {
    vi.useFakeTimers();
    window.localStorage.clear();
    render(<App />);

    // Flush async initial guestbook fetch
    await act(async () => {
      await Promise.resolve();
    });

    // Page 1 only: Envelope scene visible, Main Invitation not yet mounted
    expect(screen.getByRole('region', { name: 'Mở thiệp cưới' })).toBeInTheDocument();
    expect(screen.queryByText('TRÂN TRỌNG KÍNH MỜI')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Xem nhanh nội dung thiệp/i }),
    ).not.toBeInTheDocument();

    // Tap envelope to open & trigger floating hearts + polaroid emerge -> 1.25s hold -> cloud parting transition
    act(() => {
      fireEvent.click(
        screen.getByRole('button', { name: 'Mở phong bì thiệp cưới' }),
      );
    });

    const heartsLayer = screen.getByTestId('intro-floating-hearts');
    expect(heartsLayer.querySelectorAll('.intro-heart-float')).toHaveLength(10);

    // Polaroid finishes rising (320 + 1100 = 1420ms), Page 2 still hidden during 1.25s hold
    act(() => {
      vi.advanceTimersByTime(1420);
    });
    expect(screen.queryByTestId('cloud-transition')).not.toBeInTheDocument();

    // After 1250ms hold, cloud mist transition overlays the screen
    act(() => {
      vi.advanceTimersByTime(1250);
    });
    expect(screen.getByTestId('cloud-transition')).toBeInTheDocument();

    // At peak mist (~45% of 1850ms = 833ms), swaps from Page 1 to Page 2 underneath the clouds
    await act(async () => {
      vi.advanceTimersByTime(833);
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.getByText('TRÂN TRỌNG KÍNH MỜI')).toBeInTheDocument();
    expect(screen.getByTestId('cloud-transition')).toBeInTheDocument();

    // Remaining 1017ms completes cloud parting and lands on Page 2
    act(() => {
      vi.advanceTimersByTime(1017);
    });
    expect(screen.queryByTestId('cloud-transition')).not.toBeInTheDocument();
    expect(screen.getByText('TRÂN TRỌNG KÍNH MỜI')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Xem lại trang mở thiệp/i }),
    ).not.toBeInTheDocument();
  });

  it('supports blessing marquee, like heart burst, gift QR modal, and live RSVP wishes sync', async () => {
    window.localStorage.clear();
    render(
      <InvitationProvider
        services={{ guestbookRepo: new LocalStorageGuestbookRepository() }}
      >
        <MainInvitationPage isPlaying={false} onToggleAudio={vi.fn()} />
      </InvitationProvider>,
    );

    expect(await screen.findByText('TRÂN TRỌNG KÍNH MỜI')).toBeInTheDocument();
    expect(screen.getByText('16 GIỜ 30 | THỨ BẢY | 26.12.2026')).toBeInTheDocument();
    expect(screen.getByText('Bữa Tiệc')).toBeInTheDocument();
    expect(screen.getByText('Hôn Lễ')).toBeInTheDocument();
    expect(screen.getByText('Ông Vũ Văn Chín')).toBeInTheDocument();
    expect(screen.getByText('Bà Nguyễn Thị Thắng')).toBeInTheDocument();
    expect(screen.getByText('Ông Nguyễn Tiến Trường')).toBeInTheDocument();
    expect(screen.getByText('Bà Nguyễn Thị Ngọc Băng')).toBeInTheDocument();
    expect(
      screen.getAllByText('Thôn Đặng Xuyên, Xã Nguyễn Trãi, Tỉnh Hưng Yên').length,
    ).toBeGreaterThanOrEqual(2);
    expect(
      screen.getByText('Thôn Đan Tràng, Xã Hồng Quang, Tỉnh Hưng Yên'),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText('Nguyễn Quốc Việt').length,
    ).toBeGreaterThanOrEqual(2);
    expect(
      screen.getAllByText('Vũ Thị Thu Ngà').length,
    ).toBeGreaterThanOrEqual(2);
    const selectedCalendarCells = screen
      .getByRole('grid', { name: 'Lịch Tháng 12 năm 2026' })
      .querySelectorAll('[aria-selected="true"]');
    expect(selectedCalendarCells).toHaveLength(1);
    expect(selectedCalendarCells[0]).toHaveTextContent('27');
    expect(screen.getByLabelText('Lời chúc nổi bật')).toBeInTheDocument();
    expect(
      screen.getByTestId('falling-hearts-overlay').querySelectorAll('.falling-heart'),
    ).toHaveLength(6);
    const autoScrollBtn = screen.getByRole('button', { name: /tự động cuộn/i });
    expect(autoScrollBtn).toBeInTheDocument();
    expect(autoScrollBtn).toHaveTextContent('');

    // Filmstrip reel runs continuously, toggles pause/play, and pauses when lightbox opens
    const filmTrack = screen.getByTestId('filmstrip-track');
    expect(filmTrack).toHaveStyle({ animationPlayState: 'running' });

    const pauseReelBtn = screen.getByRole('button', {
      name: 'Tạm dừng thước phim',
    });
    fireEvent.click(pauseReelBtn);
    expect(filmTrack).toHaveStyle({ animationPlayState: 'paused' });

    const resumeReelBtn = screen.getByRole('button', {
      name: 'Tiếp tục chạy thước phim',
    });
    fireEvent.click(resumeReelBtn);
    expect(filmTrack).toHaveStyle({ animationPlayState: 'running' });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Xem phóng to ảnh: I love three things in this world.',
      }),
    );
    expect(
      screen.getByRole('dialog', { name: 'I love three things in this world.' }),
    ).toBeInTheDocument();
    expect(filmTrack).toHaveStyle({ animationPlayState: 'paused' });

    fireEvent.click(screen.getByRole('button', { name: 'Đóng ảnh phóng to' }));
    expect(filmTrack).toHaveStyle({ animationPlayState: 'running' });

    const likeBtns = screen.getAllByRole('button', {
      name: /Thả tim chúc phúc \(88\)/i,
    });
    fireEvent.click(likeBtns[0]);
    expect(
      screen.getByRole('button', { name: /Thả tim chúc phúc \(89\)/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Hộp quà cưới' }));
    expect(
      screen.getByRole('dialog', { name: 'Hộp Quà Yêu Thương' }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Đóng hộp quà cưới' }));

    fireEvent.change(screen.getByLabelText('Họ và tên'), {
      target: { value: 'Lan Phương' },
    });
    fireEvent.change(
      screen.getByLabelText('Lời chúc gửi đến cô dâu chú rể'),
      { target: { value: 'Chúc hai bạn mãi hạnh phúc nhé!' } },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Gửi xác nhận' }));

    await waitFor(() => {
      expect(screen.getByText('Cảm ơn bạn đã xác nhận! 💚')).toBeInTheDocument();
      expect(screen.getAllByText('Lan Phương').length).toBeGreaterThanOrEqual(1);
      expect(
        screen.getAllByText(/Chúc hai bạn mãi hạnh phúc nhé!/i).length,
      ).toBeGreaterThanOrEqual(1);
    });
  });

  it('useAutoScroll smoothly advances scrollTop across sub-pixel frames and pauses cleanly', () => {
    vi.useFakeTimers({
      toFake: [
        'setTimeout',
        'clearTimeout',
        'requestAnimationFrame',
        'cancelAnimationFrame',
        'performance',
        'Date',
      ],
    });
    let storedTop = 0;
    const fakeContainer = {
      scrollHeight: 4000,
      clientHeight: 700,
      style: { scrollBehavior: 'auto' },
      get scrollTop() {
        return storedTop;
      },
      set scrollTop(val: number) {
        // Simulate browser truncating sub-pixel values on 1x displays
        storedTop = Math.floor(val);
      },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as HTMLElement;

    const ref = { current: fakeContainer };
    const { result } = renderHook(() =>
      useAutoScroll(ref, { unlocked: true, speedPxPerMs: 0.06 }),
    );

    act(() => {
      result.current.startAutoScroll();
    });
    expect(result.current.isAutoScrolling).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(storedTop).toBeGreaterThan(20);

    act(() => {
      result.current.stopAutoScroll();
    });
    expect(result.current.isAutoScrolling).toBe(false);
  });

  it('preserves RSVP form input and displays error when Google Sheets submission fails', async () => {
    const failingRepo: IGuestbookRepository = {
      getAll: vi.fn().mockResolvedValue([]),
      submit: vi
        .fn()
        .mockRejectedValue(
          new Error('Không thể kết nối máy chủ lưu xác nhận.'),
        ),
    };

    render(
      <InvitationProvider services={{ guestbookRepo: failingRepo }}>
        <MainInvitationPage isPlaying={false} onToggleAudio={vi.fn()} />
      </InvitationProvider>,
    );

    const nameInput = (await screen.findByLabelText(
      'Họ và tên',
    )) as HTMLInputElement;
    const messageInput = screen.getByLabelText(
      'Lời chúc gửi đến cô dâu chú rể',
    ) as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: 'Minh Anh' } });
    fireEvent.change(messageInput, {
      target: { value: 'Chúc hai bạn mãi hạnh phúc!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Gửi xác nhận' }));

    await waitFor(() => {
      expect(
        screen.getByText('Không thể kết nối máy chủ lưu xác nhận.'),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByText('Cảm ơn bạn đã xác nhận! 💚'),
    ).not.toBeInTheDocument();
    expect(nameInput.value).toBe('Minh Anh');
    expect(messageInput.value).toBe('Chúc hai bạn mãi hạnh phúc!');
  });

  it('preloads wishes on Page 1 mount and renders cached wishes immediately while refreshing', async () => {
    const cachedWish = {
      id: 'cached-1',
      guestName: 'Khách Đã Cache',
      side: 'both' as const,
      attendance: 'attending' as const,
      guestCount: 2,
      message: 'Lời chúc hiển thị ngay từ cache!',
      createdAt: '2026-11-23T09:00:00Z',
    };
    const freshWish = {
      id: 'fresh-2',
      guestName: 'Khách Mới Nhất',
      side: 'both' as const,
      attendance: 'attending' as const,
      guestCount: 1,
      message: 'Lời chúc vừa đồng bộ từ Sheet!',
      createdAt: '2026-11-23T10:00:00Z',
    };

    let resolveGetAll!: (items: typeof freshWish[]) => void;
    const pendingGetAll = new Promise<typeof freshWish[]>((resolve) => {
      resolveGetAll = resolve;
    });

    const preloadSpy = vi.fn().mockResolvedValue([freshWish]);
    const repo: IGuestbookRepository = {
      preload: preloadSpy,
      getCached: () => [cachedWish],
      getAll: () => pendingGetAll,
      submit: vi.fn(),
    };

    // Page 1 mount triggers preload immediately
    const { unmount } = render(
      <InvitationProvider services={{ guestbookRepo: repo }}>
        <App />
      </InvitationProvider>,
    );
    expect(preloadSpy).toHaveBeenCalledTimes(1);
    unmount();

    // Main page renders cached wish synchronously before getAll resolves
    render(
      <InvitationProvider services={{ guestbookRepo: repo }}>
        <MainInvitationPage isPlaying={false} onToggleAudio={vi.fn()} />
      </InvitationProvider>,
    );
    expect(screen.getAllByText('Khách Đã Cache').length).toBeGreaterThanOrEqual(1);

    await act(async () => {
      resolveGetAll([freshWish, cachedWish]);
      await Promise.resolve();
    });
    expect(
      await screen.findAllByText('Khách Mới Nhất'),
    ).not.toHaveLength(0);
  });
});
