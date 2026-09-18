import { GAME_CONFIG } from '../config/GameConfig';
import { gameEvents } from '../game/events';
import type { SettingsStore } from '../storage/SettingsStore';

interface Tone {
  readonly frequency: number;
  readonly durationSeconds: number;
  readonly type: OscillatorType;
  readonly gain: number;
}

export class Sfx {
  private audioContext: AudioContext | null = null;

  constructor(private readonly settings: SettingsStore) {
    gameEvents.on('itemCaught', (_x, _y, _color, points) => {
      this.playTone(points >= 0 ? GAME_CONFIG.audio.catchTone : GAME_CONFIG.audio.penaltyTone);
    });

    gameEvents.on('itemMissed', () => {
      this.playTone(GAME_CONFIG.audio.missTone);
    });

    gameEvents.on('levelChanged', (levelNumber) => {
      if (levelNumber > 1) {
        this.playSequence(GAME_CONFIG.audio.levelFrequencies, GAME_CONFIG.audio.levelStepSeconds);
      }
    });

    gameEvents.on('gameOver', () => {
      this.playSequence(
        GAME_CONFIG.audio.gameOverFrequencies,
        GAME_CONFIG.audio.gameOverStepSeconds,
      );
    });
  }

  public unlock(): void {
    try {
      this.audioContext ??= new AudioContext();
      void this.audioContext.resume();
    } catch {
      this.audioContext = null;
    }
  }

  private playSequence(frequencies: readonly number[], stepSeconds: number): void {
    const millisecondsPerSecond = 1000;

    frequencies.forEach((frequency, index) => {
      window.setTimeout(
        () => {
          this.playTone({ ...GAME_CONFIG.audio.sequenceTone, frequency });
        },
        index * stepSeconds * millisecondsPerSecond,
      );
    });
  }

  private playTone(tone: Tone): void {
    const context = this.audioContext;

    if (!context || !this.settings.isSoundEnabled) {
      return;
    }

    const oscillator = context.createOscillator();
    const amplifier = context.createGain();
    const startTime = context.currentTime;
    const endTime = startTime + tone.durationSeconds;
    const silence = 0.0001;

    oscillator.type = tone.type;
    oscillator.frequency.setValueAtTime(tone.frequency, startTime);

    amplifier.gain.setValueAtTime(tone.gain * this.settings.volume, startTime);
    amplifier.gain.exponentialRampToValueAtTime(silence, endTime);

    oscillator.connect(amplifier).connect(context.destination);
    oscillator.start(startTime);
    oscillator.stop(endTime);
  }
}
