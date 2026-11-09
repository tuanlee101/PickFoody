/**
 * Audio synthesis using Web Audio API (zero external audio assets needed).
 */

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Check localStorage for mute preference
    if (typeof window !== 'undefined') {
      const storedMute = localStorage.getItem('hoankiem_wheel_muted');
      if (storedMute !== null) {
        this.isMuted = storedMute === 'true';
      }
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('hoankiem_wheel_muted', String(muted));
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Play wheel tick sound when needle crosses a pin
   */
  public playTick(pitchFactor: number = 1): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Mechanical wooden click sound
      osc.type = 'triangle';
      const baseFreq = 620 + Math.min(pitchFactor * 250, 400);
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Ignore audio context errors
    }
  }

  /**
   * Play celebratory victory chime when winner is decided
   */
  public playWin(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      // Ascending pentatonic fanfare: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.5];
      const now = ctx.currentTime;

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.1);

        const startTime = now + index * 0.1;
        const duration = 0.45;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Soft click for buttons
   */
  public playClick(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.045);
    } catch {
      // Ignore
    }
  }
}

export const soundFx = new SoundEffectsManager();
