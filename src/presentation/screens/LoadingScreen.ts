import { Overlay } from '../Overlay';

export class LoadingScreen {
  private readonly overlay: Overlay = new Overlay('screen-loading');
  private readonly fill: HTMLElement = this.overlay.field('fill');

  public showProgress(ratio: number): void {
    this.fill.style.width = `${Math.round(ratio * 100)}%`;
  }

  public hide(): void {
    this.overlay.hide();
  }
}
