import { GAME_CONFIG } from '../config/game-config';
import type { GameEvents } from '../game/game-events';
import type { SettingsStore } from '../storage/settings-store';

const EXPONENTIAL_RAMP_FLOOR = 0.0001;
const MILLISECONDS_PER_SECOND = 1000;

interface Tone {
  readonly frequency: number;
  readonly durationSeconds: number;
  readonly type: OscillatorType;
  readonly gain: number;
}

export class Sfx {
  private audioContext: AudioContext | null = null;

  constructor(
    private readonly settings: SettingsStore,
    gameEvents: GameEvents,
  ) {
    gameEvents.on('itemCaught', (item) => {
      this.playTone(item.points >= 0 ? GAME_CONFIG.audio.catchTone : GAME_CONFIG.audio.penaltyTone);
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
    frequencies.forEach((frequency, index) => {
      window.setTimeout(
        () => {
          this.playTone({ ...GAME_CONFIG.audio.sequenceTone, frequency });
        },
        index * stepSeconds * MILLISECONDS_PER_SECOND,
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

    oscillator.type = tone.type;
    oscillator.frequency.setValueAtTime(tone.frequency, startTime);

    amplifier.gain.setValueAtTime(tone.gain * this.settings.volume, startTime);
    amplifier.gain.exponentialRampToValueAtTime(EXPONENTIAL_RAMP_FLOOR, endTime);

    oscillator.connect(amplifier).connect(context.destination);
    oscillator.start(startTime);
    oscillator.stop(endTime);
  }
}
