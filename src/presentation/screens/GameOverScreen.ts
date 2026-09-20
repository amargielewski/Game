import { Overlay } from '../Overlay';
import type { HighScoreStore } from '../../storage/HighScoreStore';

export class GameOverScreen {
  public readonly overlay: Overlay = new Overlay('screen-gameover');
  private readonly nameInput: HTMLInputElement = this.overlay.field('name');
  private lastScore: number = 0;

  constructor(
    private readonly highScores: HighScoreStore,
    actions: { onRestart: () => void; onMenu: () => void },
  ) {
    this.overlay.onAction('restart', actions.onRestart);
    this.overlay.onAction('menu', actions.onMenu);
    this.overlay.onSubmit(() => {
      this.saveRecord();
    });
  }

  public present(points: number): void {
    this.lastScore = points;
    this.overlay.setText('score', String(points));
    this.overlay.setVisible('record', this.highScores.qualifies(points));
    this.nameInput.value = '';
  }

  private saveRecord(): void {
    this.highScores.submit(this.nameInput.value, this.lastScore);
    this.overlay.setVisible('record', false);
  }
}
