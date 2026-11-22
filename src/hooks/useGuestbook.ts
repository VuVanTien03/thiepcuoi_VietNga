import { useCallback, useEffect, useState } from 'react';
import { useInvitationContext } from '../context/InvitationContext';
import { GuestWish, RsvpSubmission } from '../types/wedding';

export interface UseGuestbookReturn {
  wishes: GuestWish[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  submittedSuccess: boolean;
  submitRsvp: (entry: RsvpSubmission) => Promise<boolean>;
  resetSuccess: () => void;
}

export function useGuestbook(): UseGuestbookReturn {
  const {
    config,
    services: { guestbookRepo },
  } = useInvitationContext();

  const [wishes, setWishes] = useState<GuestWish[]>(config.initialWishes);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    guestbookRepo
      .getAll(config.initialWishes)
      .then((items) => {
        if (active) {
          setWishes(items);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [config.initialWishes, guestbookRepo]);

  const submitRsvp = useCallback(
      async (entry: RsvpSubmission): Promise<boolean> => {
        setError(null);
        setIsSubmitting(true);
        try {
          const created = await guestbookRepo.submit(entry);
          setWishes((prev) => [
            created,
            ...prev.filter((item) => item.id !== created.id),
          ]);
          setSubmittedSuccess(true);
          return true;
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : 'Không thể gửi xác nhận. Vui lòng thử lại.',
          );
          return false;
        } finally {
          setIsSubmitting(false);
        }
      },
        [guestbookRepo],
  );

  const resetSuccess = useCallback(() => {
    setSubmittedSuccess(false);
  }, []);

  return {
    wishes,
    isLoading,
    isSubmitting,
    error,
    submittedSuccess,
    submitRsvp,
    resetSuccess,
  };
}
