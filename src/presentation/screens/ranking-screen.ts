import { Overlay } from '../overlay';
import { translate } from '../strings';
import { cloneTemplateRow } from '../template-row';
import { GAME_CONFIG } from '../../config/game-config';
import type { HighScoreStore } from '../../storage/high-score-store';

export class RankingScreen {
  public readonly overlay: Overlay = new Overlay('screen-ranking');
  private readonly list: HTMLOListElement = this.overlay.field('list');

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
    return cloneTemplateRow(GAME_CONFIG.dom.rankingRowTemplateId, {
      position: `${position}.`,
      name: name === '' ? translate('anonymous') : name,
      points: String(points),
    });
  }
}
