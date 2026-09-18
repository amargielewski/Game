import { Overlay } from '../Overlay';

export class LoadingScreen {
  private readonly overlay = new Overlay('screen-loading');
  private readonly fill = this.overlay.field<HTMLElement>('fill');

  public showProgress(ratio: number): void {
    this.fill.style.width = `${Math.round(ratio * 100)}%`;
  }

  public hide(): void {
    this.overlay.hide();
  }
}
