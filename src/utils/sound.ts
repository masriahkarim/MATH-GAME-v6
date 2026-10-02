/**
 * Web Audio API Sound Synthesizer for MATH RUSH
 * Pure client-side audio generation for 100% reliable kid-friendly game sound effects.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;

  public initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  /**
   * Joyful game start / power-up chime when pressing MULA MAIN
   */
  public playGameStart() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [
        { f: 523.25, d: 0.1 },  // C5
        { f: 659.25, d: 0.1 },  // E5
        { f: 783.99, d: 0.1 },  // G5
        { f: 1046.50, d: 0.35 }, // C6
      ];

      notes.forEach((n, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = now + i * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, t);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + n.d);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Energetic cheerful chime for correct answers
   * Punchy, uplifting dual-tone that gives immediate joyful satisfaction!
   */
  public playCorrect() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 4-note ascending burst: C5 -> E5 -> G5 -> C6
      const notes = [
        { f: 523.25, t: 0, d: 0.09 },    // C5
        { f: 659.25, t: 0.07, d: 0.09 }, // E5
        { f: 783.99, t: 0.14, d: 0.11 }, // G5
        { f: 1046.50, t: 0.22, d: 0.32 }, // C6 (sweet high bell ring)
      ];

      notes.forEach((n) => {
        // Main melodic voice
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = now + n.t;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, startTime);

        gain.gain.setValueAtTime(0.24, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + n.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + n.d);

        // Sparkle harmonic overtone
        const sparkOsc = this.ctx!.createOscillator();
        const sparkGain = this.ctx!.createGain();

        sparkOsc.type = 'sine';
        sparkOsc.frequency.setValueAtTime(n.f * 2, startTime);

        sparkGain.gain.setValueAtTime(0.08, startTime);
        sparkGain.gain.exponentialRampToValueAtTime(0.001, startTime + n.d * 0.7);

        sparkOsc.connect(sparkGain);
        sparkGain.connect(this.ctx!.destination);

        sparkOsc.start(startTime);
        sparkOsc.stop(startTime + n.d * 0.7);
      });
    } catch {
      // Audio playback fails gracefully if blocked by browser policy
    }
  }

  /**
   * Gentle soft 'cuba lagi' tone (encouraging, not jarring)
   */
  public playWrong() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.25);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch {
      // Ignore
    }
  }

  /**
   * Ascending high-energy combo jingle
   * Plays a faster, higher-energy melodic flourish as combo rises!
   */
  public playCombo(comboCount: number) {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const pitchOffset = Math.min((comboCount - 1) * 35, 200);

      // Fast energetic 3-note arpeggio
      const comboNotes = [
        { f: 587.33 + pitchOffset, d: 0.08, t: 0 },    // D5+
        { f: 783.99 + pitchOffset, d: 0.09, t: 0.07 }, // G5+
        { f: 1174.66 + pitchOffset, d: 0.25, t: 0.15 }, // D6+
      ];

      comboNotes.forEach((n) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = now + n.t;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, t);
        gain.gain.setValueAtTime(0.24, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + n.d);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Super combo (5x+) heroic power jingle!
   * An exuberant fanfare with bass drop and celebratory chime!
   */
  public playSuperCombo() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // High-energy 5-note hero arpeggio: C5 -> E5 -> G5 -> C6 -> E6!
      const notes = [
        { f: 523.25, t: 0, d: 0.08 },
        { f: 659.25, t: 0.06, d: 0.08 },
        { f: 783.99, t: 0.12, d: 0.09 },
        { f: 1046.50, t: 0.18, d: 0.12 },
        { f: 1318.51, t: 0.26, d: 0.4 },
      ];

      notes.forEach((n) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = now + n.t;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, t);
        gain.gain.setValueAtTime(0.26, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + n.d);
      });

      // Bass punch
      const bass = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bass.type = 'sine';
      bass.frequency.setValueAtTime(130.81, now); // C3
      bass.frequency.exponentialRampToValueAtTime(65.41, now + 0.35); // C2
      bassGain.gain.setValueAtTime(0.3, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      bass.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bass.start(now);
      bass.stop(now + 0.35);
    } catch {
      // Ignore
    }
  }

  /**
   * Final Boss entrance alert
   */
  public playBossIntro() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(300, now + 0.4);
      osc.frequency.linearRampToValueAtTime(180, now + 0.7);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.8);
    } catch {
      // Ignore
    }
  }

  /**
   * Boss hit sound
   */
  public playBossHit() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.18);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Ignore
    }
  }

  /**
   * LAGU KEMENANGAN PENUH SEMANGAT (EPIC VICTORY ANTHEM! 🎉)
   * Triumphant arcade fanfare in multiple harmonious voices that makes kids feel like true champions!
   * Total duration: ~2.8 seconds of joyful victory music.
   */
  public playVictory() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Melody: Iconic celebratory fanfare rhythm:
      // Da-da-da-DAAA! Da-da-da-DAAA! ... DA-DA-DA-DA-DAAA!
      const leadMelody = [
        // Measure 1: Triplet call to victory
        { f: 523.25, t: 0.00, d: 0.12 }, // C5
        { f: 523.25, t: 0.14, d: 0.12 }, // C5
        { f: 523.25, t: 0.28, d: 0.12 }, // C5
        { f: 523.25, t: 0.42, d: 0.38 }, // C5 (held)

        // Measure 2: Ascending triumph chords
        { f: 415.30, t: 0.85, d: 0.22 }, // Ab4
        { f: 466.16, t: 1.10, d: 0.22 }, // Bb4
        { f: 523.25, t: 1.35, d: 0.38 }, // C5

        // Measure 3: Soaring celebratory climax!
        { f: 392.00, t: 1.78, d: 0.12 }, // G4
        { f: 523.25, t: 1.92, d: 0.12 }, // C5
        { f: 659.25, t: 2.06, d: 0.14 }, // E5
        { f: 783.99, t: 2.22, d: 0.18 }, // G5
        { f: 1046.50, t: 2.42, d: 0.65 }, // C6 (High Grand Finale!)
      ];

      // Play Lead Melody
      leadMelody.forEach((n) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = now + n.t;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, t);

        gain.gain.setValueAtTime(0.28, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + n.d);
      });

      // Harmonious Mid-Voice (Chords support)
      const harmonyNotes = [
        { f: 329.63, t: 0.42, d: 0.38 }, // E4
        { f: 329.63, t: 1.35, d: 0.38 }, // E4
        { f: 523.25, t: 2.22, d: 0.18 }, // C5
        { f: 659.25, t: 2.42, d: 0.65 }, // E5
      ];

      harmonyNotes.forEach((n) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = now + n.t;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, t);

        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + n.d);
      });

      // Triumphant Bass Foundation
      const bassCadence = [
        { f: 130.81, t: 0.00, d: 0.38 }, // C3
        { f: 103.83, t: 0.85, d: 0.22 }, // Ab2
        { f: 116.54, t: 1.10, d: 0.22 }, // Bb2
        { f: 130.81, t: 1.35, d: 0.38 }, // C3
        { f: 98.00,  t: 1.78, d: 0.40 }, // G2
        { f: 130.81, t: 2.42, d: 0.65 }, // C3
      ];

      bassCadence.forEach((b) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = now + b.t;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(b.f, t);

        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + b.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + b.d);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Level up fanfare "ta-da!"
   */
  public playLevelUp() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [
        { f: 523.25, t: 0, d: 0.12 }, // C5
        { f: 659.25, t: 0.12, d: 0.12 }, // E5
        { f: 783.99, t: 0.24, d: 0.15 }, // G5
        { f: 1046.50, t: 0.40, d: 0.45 }, // C6 (long flourish)
      ];

      notes.forEach((n) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = now + n.t;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, startTime);
        gain.gain.setValueAtTime(0.24, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + n.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + n.d);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Sparkle shimmer for rewards and star fly
   */
  public playSparkle() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const tones = [1200, 1500, 1800, 2200];
      tones.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = now + i * 0.05;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + 0.12);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Special round alert chime
   */
  public playSpecialAlert() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.1);
      osc.frequency.setValueAtTime(1320, now + 0.2);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Ignore
    }
  }

  /**
   * Crisp UI click
   */
  public playClick() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundEngine();
