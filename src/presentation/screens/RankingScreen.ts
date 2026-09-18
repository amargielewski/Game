import { Overlay } from '../Overlay';
import { translate } from '../strings';
import { GAME_CONFIG } from '../../config/GameConfig';
import type { HighScoreStore } from '../../storage/HighScoreStore';

export class RankingScreen {
  public readonly overlay = new Overlay('screen-ranking');
  private readonly list = this.overlay.field<HTMLOListElement>('list');

  constructor(
    private readonly highScores: HighScoreStore,
    onBack: () => void,
  ) {
    this.overlay.onAction('back', onBack);
    this.overlay.onAction('clear', () => {
      this.highScores.clear();
      this.present();
    });
  }

  public present(): void {
    const entries = this.highScores.list();

    this.list.replaceChildren();
    this.overlay.setVisible('empty', entries.length === 0);

    entries.forEach((entry, index) => {
      this.list.appendChild(this.buildRow(index + 1, entry.name, entry.points));
    });
  }

  private buildRow(position: number, name: string, points: number): DocumentFragment {
    const template = document.getElementById(GAME_CONFIG.dom.rankingRowTemplateId);

    if (!(template instanceof HTMLTemplateElement)) {
      throw new Error(`Missing template #${GAME_CONFIG.dom.rankingRowTemplateId}`);
    }

    const row = template.content.cloneNode(true) as DocumentFragment;

    this.fillField(row, 'position', `${position}.`);
    this.fillField(row, 'name', name === '' ? translate('anonymous') : name);
    this.fillField(row, 'points', String(points));

    return row;
  }

  private fillField(row: DocumentFragment, field: string, text: string): void {
    const element = row.querySelector(`[data-field="${field}"]`);

    if (element) {
      element.textContent = text;
    }
  }
}
