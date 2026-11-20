import { IAudioService } from '../types/wedding';

/**
 * Trình phát nhạc nền nhẹ nhàng.
 * Nếu chưa cấu hình file MP3 riêng (audioUrl), tự động phát hợp âm piano ambient êm dịu bằng Web Audio API
 * để tránh lỗi broken link khi chạy offline/demo.
 */
export class WeddingAudioService implements IAudioService {
  private playing = false;
  private audioEl: HTMLAudioElement | null = null;
  private currentUrl: string | null = null;
  private audioCtx: AudioContext | null = null;
  private loopTimerId: number | null = null;

  isPlaying(): boolean {
    return this.playing;
  }

  async play(url?: string): Promise<boolean> {
    if (this.playing) return true;

    if (url) {
      try {
        if (!this.audioEl || this.currentUrl !== url) {
          if (this.audioEl) {
            this.audioEl.pause();
          }
          this.audioEl = new Audio(url);
          this.audioEl.loop = true;
          this.audioEl.preload = 'auto';
          this.audioEl.volume = 0.45;
          this.currentUrl = url;
        }
        await this.audioEl.play();
        this.playing = true;
        return true;
      } catch {
        // Fallback to ambient chime if external audio is blocked or missing
      }
    }

    return this.startAmbientMelody();
  }

  pause(): void {
    this.playing = false;
    if (this.audioEl) {
      this.audioEl.pause();
    }
    if (this.loopTimerId !== null) {
      window.clearInterval(this.loopTimerId);
      this.loopTimerId = null;
    }
    if (this.audioCtx && this.audioCtx.state === 'running') {
      void this.audioCtx.suspend();
    }
  }

  async toggle(url?: string): Promise<boolean> {
    if (this.playing) {
      this.pause();
      return false;
    }
    return this.play(url);
  }

  dispose(): void {
    this.pause();
    if (this.audioCtx) {
      void this.audioCtx.close();
      this.audioCtx = null;
    }
    this.audioEl = null;
    this.currentUrl = null;
  }

  private async startAmbientMelody(): Promise<boolean> {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextClass) {
        return false;
      }

      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      this.playing = true;
      const progression = [
        [261.63, 329.63, 392.0, 493.88], // Cmaj7
        [220.0, 261.63, 329.63, 392.0], // Am7
        [174.61, 220.0, 261.63, 329.63], // Fmaj7
        [196.0, 246.94, 293.66, 392.0], // G6
      ];
      let step = 0;

      const playArpeggio = () => {
        if (!this.playing || !this.audioCtx) return;
        const chord = progression[step % progression.length];
        step += 1;

        chord.forEach((freq, idx) => {
          if (!this.audioCtx) return;
          const now = this.audioCtx.currentTime + idx * 0.28;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.exponentialRampToValueAtTime(0.032, now + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 2.25);
        });
      };

      playArpeggio();
      this.loopTimerId = window.setInterval(playArpeggio, 3200);
      return true;
    } catch {
      this.playing = false;
      return false;
    }
  }
}
