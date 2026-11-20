import { ICalendarService, WeddingEvent } from '../types/wedding';

export class CalendarService implements ICalendarService {
  private formatUtcCompact(isoDate: string): string {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  buildGoogleCalendarUrl(event: WeddingEvent, coupleTitle: string): string {
    const start = this.formatUtcCompact(event.isoStart);
    const end = this.formatUtcCompact(event.isoEnd);
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `${event.title} — ${coupleTitle}`,
      dates: `${start}/${end}`,
      details: `${event.subtitle}\nĐịa điểm: ${event.venueName} - ${event.address}`,
      location: `${event.venueName}, ${event.address}`,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }
}
