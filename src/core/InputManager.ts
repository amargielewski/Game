import { GAME_CONFIG } from '../config/GameConfig';

export class InputManager {
  private readonly pressedKeys: Set<string> = new Set();
  private pointerAxis: number = 0;
  private movePointerId: number | null = null;
  private isJumpRequested: boolean = false;
  private isPauseRequested: boolean = false;
  private isGameplayActive: boolean = false;

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (event.target instanceof HTMLInputElement) {
      return;
    }

    if (this.matches(GAME_CONFIG.input.pauseKeys, event.code)) {
      this.isPauseRequested = true;
    }

    if (!this.isGameplayActive) {
      return;
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

    this.movePointerId = event.pointerId;
    this.pointerAxis = this.axisForPointer(event);
  };

  private readonly handlePointerMove = (event: PointerEvent): void => {
    if (event.pointerId !== this.movePointerId) {
      return;
    }

    this.pointerAxis = this.axisForPointer(event);
  };

  private readonly handlePointerRelease = (event: PointerEvent): void => {
    if (event.pointerId !== this.movePointerId) {
      return;
    }

    this.releaseMovePointer();
  };

  private readonly handleWindowBlur = (): void => {
    this.pressedKeys.clear();
    this.releaseMovePointer();
  };

  private readonly handleVisibilityChange = (): void => {
    if (document.hidden && this.isGameplayActive) {
      this.isPauseRequested = true;
    }
  };

  public start(canvas: HTMLCanvasElement): void {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleWindowBlur);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    canvas.addEventListener('pointerdown', this.handlePointerDown);
    canvas.addEventListener('pointermove', this.handlePointerMove);
    canvas.addEventListener('pointerup', this.handlePointerRelease);
    canvas.addEventListener('pointercancel', this.handlePointerRelease);
    canvas.addEventListener('pointerleave', this.handlePointerRelease);
  }

  public setGameplayActive(isActive: boolean): void {
    this.isGameplayActive = isActive;
  }

  public reset(): void {
    this.pressedKeys.clear();
    this.releaseMovePointer();
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

  private releaseMovePointer(): void {
    this.movePointerId = null;
    this.pointerAxis = 0;
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
