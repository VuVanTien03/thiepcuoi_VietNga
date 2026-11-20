import { useEffect, useState } from 'react';
import { useInvitationContext } from '../context/InvitationContext';
import { CountdownTime } from '../types/wedding';

export function useCountdown(targetIsoDate: string): CountdownTime {
  const {
    services: { countdownService },
  } = useInvitationContext();

  const [remaining, setRemaining] = useState<CountdownTime>(() =>
    countdownService.calculateRemaining(targetIsoDate),
  );

  useEffect(() => {
    setRemaining(countdownService.calculateRemaining(targetIsoDate));
    const timer = window.setInterval(() => {
      setRemaining(countdownService.calculateRemaining(targetIsoDate));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdownService, targetIsoDate]);

  return remaining;
}
