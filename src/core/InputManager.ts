import { GAME_CONFIG } from '../config/GameConfig';

export class InputManager {
  private readonly pressedKeys = new Set<string>();
  private pointerAxis = 0;
  private isJumpRequested = false;
  private isPauseRequested = false;

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (event.target instanceof HTMLInputElement) {
      return;
    }

    if (this.matches(GAME_CONFIG.input.pauseKeys, event.code)) {
      this.isPauseRequested = true;
    }

    if (this.matches(GAME_CONFIG.input.jumpKeys, event.code)) {
      event.preventDefault();
      this.isJumpRequested = true;
    }

    this.pressedKeys.add(event.code);
  };

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    this.pressedKeys.delete(event.code);
  };

  private readonly handlePointerDown = (event: PointerEvent): void => {
    if (event.clientY < window.innerHeight * GAME_CONFIG.input.jumpTouchAreaRatio) {
      this.isJumpRequested = true;

      return;
    }

    this.pointerAxis = this.axisForPointer(event);
  };

  private readonly handlePointerMove = (event: PointerEvent): void => {
    if (this.pointerAxis !== 0) {
      this.pointerAxis = this.axisForPointer(event);
    }
  };

  private readonly handlePointerRelease = (): void => {
    this.pointerAxis = 0;
  };

  private readonly handleWindowBlur = (): void => {
    this.pressedKeys.clear();
    this.pointerAxis = 0;
  };

  public start(canvas: HTMLCanvasElement): void {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleWindowBlur);
    canvas.addEventListener('pointerdown', this.handlePointerDown);
    canvas.addEventListener('pointermove', this.handlePointerMove);
    canvas.addEventListener('pointerup', this.handlePointerRelease);
    canvas.addEventListener('pointercancel', this.handlePointerRelease);
    canvas.addEventListener('pointerleave', this.handlePointerRelease);
  }

  public reset(): void {
    this.pressedKeys.clear();
    this.pointerAxis = 0;
    this.isJumpRequested = false;
    this.isPauseRequested = false;
  }

  public get horizontalAxis(): number {
    const keyboardAxis = this.readKeyboardAxis();

    return keyboardAxis === 0 ? this.pointerAxis : keyboardAxis;
  }

  public consumeJumpRequest(): boolean {
    const isRequested = this.isJumpRequested;
    this.isJumpRequested = false;

    return isRequested;
  }

  public consumePauseRequest(): boolean {
    const isRequested = this.isPauseRequested;
    this.isPauseRequested = false;

    return isRequested;
  }

  private axisForPointer(event: PointerEvent): number {
    return event.clientX < window.innerWidth / 2 ? -1 : 1;
  }

  private readKeyboardAxis(): number {
    const isLeftDown = this.isAnyPressed(GAME_CONFIG.input.leftKeys);
    const isRightDown = this.isAnyPressed(GAME_CONFIG.input.rightKeys);

    return Number(isRightDown) - Number(isLeftDown);
  }

  private isAnyPressed(keys: readonly string[]): boolean {
    return keys.some((key) => this.pressedKeys.has(key));
  }

  private matches(keys: readonly string[], code: string): boolean {
    return keys.some((key) => key === code);
  }
}
