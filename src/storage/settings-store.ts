import { GAME_CONFIG } from '../config/game-config';
import { isLocale, type Locale } from '../config/locales';
import { readStoredValue, writeStoredValue } from './safe-local-storage';

export class SettingsStore {
  public get isSoundEnabled(): boolean {
    return readStoredValue(GAME_CONFIG.storage.soundEnabledKey) !== 'false';
  }

  public changeSoundEnabled(value: boolean): void {
    writeStoredValue(GAME_CONFIG.storage.soundEnabledKey, String(value));
  }

  public get volume(): number {
    const stored = Number.parseFloat(readStoredValue(GAME_CONFIG.storage.volumeKey) ?? '');

    if (!Number.isFinite(stored)) {
      return GAME_CONFIG.audio.defaultVolume;
    }

    return Math.min(1, Math.max(0, stored));
  }

  public get locale(): Locale {
    const stored = readStoredValue(GAME_CONFIG.storage.localeKey);

    if (isLocale(stored)) {
      return stored;
    }

    return navigator.language.startsWith('pl') ? 'pl' : 'en';
  }

  public changeLocale(locale: Locale): void {
    writeStoredValue(GAME_CONFIG.storage.localeKey, locale);
  }

  public get hasSeenGuide(): boolean {
    return readStoredValue(GAME_CONFIG.storage.guideSeenKey) === 'true';
  }

  public markGuideSeen(): void {
    writeStoredValue(GAME_CONFIG.storage.guideSeenKey, 'true');
  }

  public changeVolume(value: number): void {
    writeStoredValue(GAME_CONFIG.storage.volumeKey, String(Math.min(1, Math.max(0, value))));
  }
}
