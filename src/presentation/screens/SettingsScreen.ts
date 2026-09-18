import { Overlay } from '../Overlay';
import { changeLocale } from '../strings';
import { GAME_CONFIG } from '../../config/GameConfig';
import { isLocale } from '../../config/locales';
import type { SettingsStore } from '../../storage/SettingsStore';

export interface SettingsActions {
  readonly onBack: () => void;
  readonly onLocaleChanged: () => void;
}

export class SettingsScreen {
  public readonly overlay = new Overlay('screen-settings');
  private readonly localeSelect = this.overlay.field<HTMLSelectElement>('locale');
  private readonly soundToggle = this.overlay.field<HTMLInputElement>('sound');
  private readonly volumeSlider = this.overlay.field<HTMLInputElement>('volume');

  constructor(
    private readonly settings: SettingsStore,
    actions: SettingsActions,
  ) {
    this.overlay.onAction('back', actions.onBack);

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

  public present(): void {
    this.localeSelect.value = this.settings.locale;
    this.soundToggle.checked = this.settings.isSoundEnabled;
    this.volumeSlider.value = String(
      Math.round(this.settings.volume * GAME_CONFIG.audio.volumeSliderMax),
    );
  }
}
