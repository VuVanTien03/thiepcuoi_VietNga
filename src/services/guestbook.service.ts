import {
  AttendanceStatus,
  GuestSide,
  GuestWish,
  IGuestbookRepository,
  RsvpSubmission,
} from '../types/wedding';

const DEFAULT_STORAGE_KEY = 'wedding_guestbook_v1';
const DEFAULT_WISH_MESSAGE = 'Chúc hai bạn trăm năm hạnh phúc viên mãn!';
const PRELOAD_FRESH_TTL_MS = 15_000;

const VALID_ATTENDANCE: ReadonlySet<AttendanceStatus> = new Set([
  'attending',
  'not-attending',
  'maybe',
]);

const VALID_SIDES: ReadonlySet<GuestSide> = new Set(['groom', 'bride', 'both']);

function createGuestWish(entry: RsvpSubmission): GuestWish {
  const trimmedName = entry.guestName.trim();
  if (!trimmedName) {
    throw new Error('Vui lòng nhập tên của bạn.');
  }

  return {
    id: `wish-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    guestName: trimmedName,
    side: entry.side,
    attendance: entry.attendance,
    guestCount: Math.max(1, entry.guestCount),
    message: entry.message.trim() || DEFAULT_WISH_MESSAGE,
    createdAt: new Date().toISOString(),
  };
}

function normalizeRemoteWish(raw: unknown): GuestWish | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;
  const guestName = String(item.guestName ?? '').trim();
  if (!guestName) return null;

  const attendanceRaw = item.attendance as AttendanceStatus;
  const attendance: AttendanceStatus = VALID_ATTENDANCE.has(attendanceRaw)
    ? attendanceRaw
    : 'attending';

  const sideRaw = item.side as GuestSide;
  const side: GuestSide = VALID_SIDES.has(sideRaw) ? sideRaw : 'both';

  const numericCount = Number(item.guestCount);
  const guestCount =
    attendance === 'attending' && Number.isFinite(numericCount)
      ? Math.max(1, Math.round(numericCount))
      : 1;

  const message = String(item.message ?? '').trim() || DEFAULT_WISH_MESSAGE;
  const createdAt =
    String(item.createdAt ?? '').trim() || new Date().toISOString();
  const id =
    String(item.id ?? '').trim() ||
    `wish-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  return {
    id,
    guestName,
    side,
    attendance,
    guestCount,
    message,
    createdAt,
  };
}

function readWishesFromStorage(storageKey: string): GuestWish[] | null {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as GuestWish[]) : null;
  } catch {
    return null;
  }
}

function writeWishesToStorage(storageKey: string, wishes: GuestWish[]): void {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(wishes));
  } catch {
    // Ignore storage quota errors in private browsing mode
  }
}

function prependWishToStorage(storageKey: string, wish: GuestWish): void {
  const existing = readWishesFromStorage(storageKey) ?? [];
  const deduped = existing.filter((item) => item.id !== wish.id);
  writeWishesToStorage(storageKey, [wish, ...deduped]);
}

/**
 * Triển khai lưu trữ lời chúc & RSVP bằng LocalStorage (dùng khi chạy local/test hoặc chưa gắn Google Sheets URL).
 */
export class LocalStorageGuestbookRepository implements IGuestbookRepository {
  private readonly storageKey: string;

  constructor(storageKey: string = DEFAULT_STORAGE_KEY) {
    this.storageKey = storageKey;
  }

    getCached(seedWishes: GuestWish[]): GuestWish[] {
      return readWishesFromStorage(this.storageKey) ?? [...seedWishes];
    }

  async getAll(seedWishes: GuestWish[]): Promise < GuestWish[] > {
      return this.getCached(seedWishes);
    }

  async submit(entry: RsvpSubmission): Promise < GuestWish > {
      const newWish = createGuestWish(entry);
      prependWishToStorage(this.storageKey, newWish);
      return newWish;
    }
  }

/**
 * Triển khai lưu trữ & đồng bộ 2 chiều RSVP với Google Sheets qua Google Apps Script Web App.
 * Hỗ trợ tải trước từ Trang 1 (dedup in-flight request + TTL cache ngắn) và Stale-While-Revalidate.
 * Dùng Content-Type `text/plain;charset=utf-8` khi POST để tránh preflight OPTIONS mà Apps Script không hỗ trợ.
 */
export class GoogleSheetsGuestbookRepository implements IGuestbookRepository {
  private readonly endpointUrl: string;
  private readonly storageKey: string;
  private inFlightFetch: Promise<GuestWish[]> | null = null;
  private freshSnapshot: { wishes: GuestWish[]; fetchedAt: number } | null = null;
  private submitEpoch = 0;

  constructor(endpointUrl: string, storageKey: string = DEFAULT_STORAGE_KEY) {
    this.endpointUrl = endpointUrl.trim();
    this.storageKey = storageKey;
  }

  getCached(seedWishes: GuestWish[]): GuestWish[] {
    const cached = readWishesFromStorage(this.storageKey);
    return cached && cached.length > 0 ? cached : [...seedWishes];
  }

  preload(seedWishes: GuestWish[]): Promise<GuestWish[]> {
    return this.getAll(seedWishes);
  }

  async getAll(seedWishes: GuestWish[]): Promise<GuestWish[]> {
      if (
        this.freshSnapshot &&
        Date.now() - this.freshSnapshot.fetchedAt <= PRELOAD_FRESH_TTL_MS
      ) {
        return [...this.freshSnapshot.wishes];
      }

      if (this.inFlightFetch) {
        return this.inFlightFetch;
      }

      const requestPromise = this.fetchRemoteWishes(seedWishes).finally(() => {
        if (this.inFlightFetch === requestPromise) {
          this.inFlightFetch = null;
        }
      });

      this.inFlightFetch = requestPromise;
      return requestPromise;
    }

  private async fetchRemoteWishes(seedWishes: GuestWish[]): Promise < GuestWish[] > {
  const epochAtStart = this.submitEpoch;
  try {
    const response = await fetch(this.endpointUrl, { method: 'GET' });
    if(!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}

  const data = (await response.json()) as {
    ok?: boolean;
    wishes?: unknown[];
  };
  if(data.ok === false || !Array.isArray(data.wishes)) {
  throw new Error('Phản hồi danh sách lời chúc không hợp lệ.');
}

const remoteWishes = data.wishes
  .map(normalizeRemoteWish)
  .filter((item): item is GuestWish => item !== null);

const resolved = remoteWishes.length > 0 ? remoteWishes : [...seedWishes];
if (remoteWishes.length > 0 && epochAtStart === this.submitEpoch) {
  writeWishesToStorage(this.storageKey, remoteWishes);
  this.freshSnapshot = {
    wishes: [...remoteWishes],
    fetchedAt: Date.now(),
  };
}
return resolved;
    } catch {
  return this.getCached(seedWishes);
}
  }

  async submit(entry: RsvpSubmission): Promise < GuestWish > {
  const draftWish = createGuestWish(entry);
  const sheetGuestCount =
    entry.attendance === 'attending' ? draftWish.guestCount : 0;

let response: Response;
try {
  response = await fetch(this.endpointUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify({
      id: draftWish.id,
      guestName: draftWish.guestName,
      side: draftWish.side,
      attendance: draftWish.attendance,
      guestCount: draftWish.guestCount,
      sheetGuestCount,
      message: draftWish.message,
      createdAt: draftWish.createdAt,
    }),
  });
} catch {
  throw new Error(
    'Không thể kết nối máy chủ lưu xác nhận. Vui lòng kiểm tra mạng và thử lại.',
  );
}

if (!response.ok) {
  throw new Error(
    'Không thể lưu xác nhận vào Google Sheets. Vui lòng thử lại.',
  );
}

let payload: { ok?: boolean; error?: string; wish?: unknown } | null = null;
try {
  payload = (await response.json()) as {
    ok?: boolean;
    error?: string;
    wish?: unknown;
  };
} catch {
  throw new Error(
    'Phản hồi từ Google Sheets không hợp lệ. Vui lòng thử lại.',
  );
}

if (!payload || payload.ok === false) {
  throw new Error(
    payload?.error ||
    'Không thể lưu xác nhận vào Google Sheets. Vui lòng thử lại.',
  );
}

const savedWish = normalizeRemoteWish(payload.wish) ?? draftWish;
this.submitEpoch += 1;
this.freshSnapshot = null;
prependWishToStorage(this.storageKey, savedWish);
return savedWish;
  }
}

/**
 * Tạo repository lưu RSVP dựa trên biến môi trường `VITE_GOOGLE_SHEETS_URL`.
 */
export function createGuestbookRepository(
  endpointUrl?: string,
  storageKey: string = DEFAULT_STORAGE_KEY,
): IGuestbookRepository {
  const trimmed = endpointUrl?.trim();
  if (trimmed) {
    return new GoogleSheetsGuestbookRepository(trimmed, storageKey);
  }
  return new LocalStorageGuestbookRepository(storageKey);
}
