import { GuestWish, IGuestbookRepository, RsvpSubmission } from '../types/wedding';

const DEFAULT_STORAGE_KEY = 'wedding_guestbook_v1';

/**
 * Triển khai lưu trữ lời chúc & RSVP bằng LocalStorage.
 * Có thể thay thế bằng API Backend (Firebase/Supabase/REST) mà không cần sửa UI (DIP).
 */
export class LocalStorageGuestbookRepository implements IGuestbookRepository {
  private readonly storageKey: string;

  constructor(storageKey: string = DEFAULT_STORAGE_KEY) {
    this.storageKey = storageKey;
  }

  async getAll(seedWishes: GuestWish[]): Promise<GuestWish[]> {
    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (!raw) {
        return [...seedWishes];
      }
      const parsed = JSON.parse(raw) as GuestWish[];
      if (!Array.isArray(parsed)) {
        return [...seedWishes];
      }
      return parsed;
    } catch {
      return [...seedWishes];
    }
  }

  async submit(entry: RsvpSubmission): Promise<GuestWish> {
    const trimmedName = entry.guestName.trim();
    if (!trimmedName) {
      throw new Error('Vui lòng nhập tên của bạn.');
    }

    const newWish: GuestWish = {
      id: `wish-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      guestName: trimmedName,
      side: entry.side,
      attendance: entry.attendance,
      guestCount: Math.max(1, entry.guestCount),
      message:
        entry.message.trim() ||
        'Chúc hai bạn trăm năm hạnh phúc viên mãn!',
      createdAt: new Date().toISOString(),
    };

    try {
      const raw = window.localStorage.getItem(this.storageKey);
      const existing: GuestWish[] = raw ? (JSON.parse(raw) as GuestWish[]) : [];
      const updated = [newWish, ...(Array.isArray(existing) ? existing : [])];
      window.localStorage.setItem(this.storageKey, JSON.stringify(updated));
    } catch {
      // Ignore storage quota errors in private browsing mode
    }

    return newWish;
  }
}
