class SoundEffects {
  constructor() {
    this.audioCtx = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleSound(enable) {
    this.enabled = enable;
    if (enable) this.init();
  }

  playStepSound(progressRatio = 0.5) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Pitch dynamically scales between 220Hz (A3) and 880Hz (A5)
      const baseFreq = 220 + progressRatio * 660;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.015, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.05);
    } catch {
      // Ignore audio errors if audio context is blocked
    }
  }

  playSuccessSound() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;

      // Play victory triad chord C5 -> E5 -> G5 -> C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

          gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.3);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start();
          osc.stop(this.audioCtx.currentTime + 0.3);
        }, idx * 70);
      });
    } catch {
      // Ignore audio errors
    }
  }
}

export const soundFx = new SoundEffects();
