import { useCallback, useEffect, useState } from 'react';
import { useInvitationContext } from '../context/InvitationContext';

export function useAudioPlayer() {
  const {
    config,
    services: { audioService },
  } = useInvitationContext();

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      audioService.dispose();
    };
  }, [audioService]);

  const play = useCallback(async () => {
    const ok = await audioService.play(config.audioUrl);
    setIsPlaying(ok);
  }, [audioService, config.audioUrl]);

  const toggle = useCallback(async () => {
    const next = await audioService.toggle(config.audioUrl);
    setIsPlaying(next);
  }, [audioService, config.audioUrl]);

  return {
    isPlaying,
    audioTitle: config.audioTitle,
    play,
    toggle,
  };
}
