import { Overlay } from '../Overlay';
import { changeLocale, localeName } from '../strings';
import { GAME_CONFIG } from '../../config/gameConfig';
import { isLocale, LOCALES } from '../../config/locales';
import type { SettingsStore } from '../../storage/SettingsStore';

export interface SettingsActions {
  readonly onBack: () => void;
  readonly onLocaleChanged: () => void;
}

export class SettingsScreen {
  public readonly overlay: Overlay = new Overlay('screen-settings');
  private readonly localeSelect: HTMLSelectElement = this.overlay.field('locale');
  private readonly soundToggle: HTMLInputElement = this.overlay.field('sound');
  private readonly volumeSlider: HTMLInputElement = this.overlay.field('volume');

  constructor(
    private readonly settings: SettingsStore,
    actions: SettingsActions,
  ) {
    this.overlay.onAction('back', actions.onBack);
    this.fillLocaleOptions();

    this.localeSelect.addEventListener('change', () => {
      if (!isLocale(this.localeSelect.value)) {
        return;
      }

      this.settings.changeLocale(this.localeSelect.value);
      changeLocale(this.localeSelect.value);
      actions.onLocaleChanged();
    });

    this.soundToggle.addEventListener('change', () => {
      this.settings.changeSoundEnabled(this.soundToggle.checked);
    });

    this.volumeSlider.addEventListener('input', () => {
      this.settings.changeVolume(
        Number(this.volumeSlider.value) / GAME_CONFIG.audio.volumeSliderMax,
      );
    });
  }

  private fillLocaleOptions(): void {
    this.localeSelect.replaceChildren(
      ...LOCALES.map((locale) => new Option(localeName(locale), locale)),
    );
  }

  public present(): void {
    this.localeSelect.value = this.settings.locale;
    this.soundToggle.checked = this.settings.isSoundEnabled;
    this.volumeSlider.value = String(
      Math.round(this.settings.volume * GAME_CONFIG.audio.volumeSliderMax),
    );
  }
}
