import { CountdownTime, ICountdownService } from '../types/wedding';

export class CountdownService implements ICountdownService {
  calculateRemaining(targetIsoDate: string, now: Date = new Date()): CountdownTime {
    const targetMs = new Date(targetIsoDate).getTime();
    const diffMs = targetMs - now.getTime();

    if (Number.isNaN(targetMs) || diffMs <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
      };
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: false,
    };
  }
}
