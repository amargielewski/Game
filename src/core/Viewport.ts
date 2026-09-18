import type { Container, IRenderer } from 'pixi.js';

export class Viewport {
  private readonly handleWindowResize = (): void => {
    this.fitToWindow();
  };

  constructor(
    private readonly renderer: IRenderer,
    private readonly root: Container,
    private readonly designWidth: number,
    private readonly designHeight: number,
  ) {}

  public start(): void {
    window.addEventListener('resize', this.handleWindowResize);
    window.addEventListener('orientationchange', this.handleWindowResize);
    this.fitToWindow();
  }

  private fitToWindow(): void {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (windowWidth === 0 || windowHeight === 0) {
      return;
    }

    const scale = Math.min(windowWidth / this.designWidth, windowHeight / this.designHeight);

    this.renderer.resize(windowWidth, windowHeight);
    this.root.scale.set(scale);
    this.root.position.set(
      (windowWidth - this.designWidth * scale) / 2,
      (windowHeight - this.designHeight * scale) / 2,
    );
  }
}
