import React, { useMemo } from 'react';
import { InvitationProvider, useInvitationContext } from './context/InvitationContext';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useInvitationFlow } from './hooks/useInvitationFlow';
import { CloudMistTransition } from './components/intro/CloudMistTransition';
import { MossEnvelopeScene } from './components/intro/MossEnvelopeScene';
import { MainInvitationPage } from './components/MainInvitationPage';

const WeddingInvitationShell: React.FC = () => {
  const { config, theme } = useInvitationContext();
  const audio = useAudioPlayer();
  const flow = useInvitationFlow(theme.timings, () => {
    void audio.play();
  });

  const guestName = useMemo(() => {
    if (typeof window === 'undefined') {
      return config.envelope.recipientPlaceholder;
    }
    const raw = new URLSearchParams(window.location.search).get('guest')?.trim();
    return raw || config.envelope.recipientPlaceholder;
  }, [config.envelope.recipientPlaceholder]);

  return (
    <>
      {!flow.isMainVisible && (
        <MossEnvelopeScene
          stage={flow.stage}
          guestName={guestName}
          onOpen={flow.openEnvelope}
        />
      )}

      {flow.isMainVisible && (
        <MainInvitationPage
          isPlaying={audio.isPlaying}
          onToggleAudio={() => void audio.toggle()}
        />
      )}

      {flow.isCloudOverlayActive && (
        <CloudMistTransition durationMs={theme.timings.cloudTransitionDurationMs} />
      )}
    </>
  );
};

export const App: React.FC = () => {
  return (
    <InvitationProvider>
      <WeddingInvitationShell />
    </InvitationProvider>
  );
};

export default App;
