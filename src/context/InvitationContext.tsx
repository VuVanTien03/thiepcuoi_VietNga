import React, { createContext, useContext, useMemo } from 'react';
import { THEME_CONFIG } from '../config/theme.config';
import { WEDDING_CONFIG } from '../config/wedding.config';
import { WeddingAudioService } from '../services/audio.service';
import { CalendarService } from '../services/calendar.service';
import { CountdownService } from '../services/countdown.service';
import { createGuestbookRepository } from '../services/guestbook.service';
import {
  IAudioService,
  ICalendarService,
  ICountdownService,
  IGuestbookRepository,
  ThemeConfig,
  WeddingConfig,
} from '../types/wedding';

export interface InvitationServices {
  countdownService: ICountdownService;
  guestbookRepo: IGuestbookRepository;
  calendarService: ICalendarService;
  audioService: IAudioService;
}

export interface InvitationContextValue {
  config: WeddingConfig;
  theme: ThemeConfig;
  services: InvitationServices;
}

const InvitationContext = createContext<InvitationContextValue | null>(null);

export interface InvitationProviderProps {
  children: React.ReactNode;
  config?: WeddingConfig;
  theme?: ThemeConfig;
  services?: Partial<InvitationServices>;
}

/**
 * Dependency Injection Provider (DIP):
 * Cung cấp cấu hình và các service trừu tượng cho toàn bộ cây component,
 * giúp dễ kiểm thử (mock) và dễ thay thế implementation (VD: đổi LocalStorage thành API).
 */
export const InvitationProvider: React.FC<InvitationProviderProps> = ({
  children,
  config = WEDDING_CONFIG,
  theme = THEME_CONFIG,
  services,
}) => {
  const value = useMemo<InvitationContextValue>(() => {
    const sheetsEndpoint =
      import.meta.env.MODE === 'test'
        ? undefined
        : import.meta.env.VITE_GOOGLE_SHEETS_URL;

    const resolvedServices: InvitationServices = {
      countdownService: services?.countdownService ?? new CountdownService(),
      guestbookRepo:
      services?.guestbookRepo ?? createGuestbookRepository(sheetsEndpoint),
      calendarService: services?.calendarService ?? new CalendarService(),
          audioService: services?.audioService ?? new WeddingAudioService(),
    };

  return {
    config,
    theme,
    services: resolvedServices,
  };
}, [config, theme, services]);

return (
  <InvitationContext.Provider value={value}>
    {children}
  </InvitationContext.Provider>
);
};

export function useInvitationContext(): InvitationContextValue {
  const ctx = useContext(InvitationContext);
  if (!ctx) {
    throw new Error(
      'useInvitationContext must be used inside <InvitationProvider>',
    );
  }
  return ctx;
}
