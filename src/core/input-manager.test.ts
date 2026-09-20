import { afterEach, describe, expect, it, vi } from 'vitest';
import { InputManager } from './input-manager';

const WINDOW_WIDTH = 1000;
const WINDOW_HEIGHT = 800;

interface FakePointerEvent {
  readonly pointerId: number;
  readonly clientX: number;
  readonly clientY: number;
}

type PointerListener = (event: FakePointerEvent) => void;

const startInput = (): {
  input: InputManager;
  fire: (type: string, event: FakePointerEvent) => void;
  hideTab: () => void;
} => {
  const listeners = new Map<string, PointerListener>();
  const documentListeners = new Map<string, () => void>();
  const fakeDocument = {
    hidden: false,
    addEventListener: (type: string, listener: () => void): void => {
      documentListeners.set(type, listener);
    },
  };

  vi.stubGlobal('window', {
    innerWidth: WINDOW_WIDTH,
    innerHeight: WINDOW_HEIGHT,
    addEventListener: (): void => undefined,
  });
  vi.stubGlobal('document', fakeDocument);

  const canvas = {
    addEventListener: (type: string, listener: PointerListener): void => {
      listeners.set(type, listener);
    },
  };

  const input = new InputManager();
  input.start(canvas as unknown as HTMLCanvasElement);

  return {
    input,
    fire: (type, event): void => {
      listeners.get(type)?.(event);
    },
    hideTab: (): void => {
      fakeDocument.hidden = true;
      documentListeners.get('visibilitychange')?.();
    },
  };
};

const holdRightSide = (pointerId: number): FakePointerEvent => ({
  pointerId,
  clientX: WINDOW_WIDTH * 0.9,
  clientY: WINDOW_HEIGHT * 0.8,
});

const tapJumpArea = (pointerId: number): FakePointerEvent => ({
  pointerId,
  clientX: WINDOW_WIDTH * 0.5,
  clientY: WINDOW_HEIGHT * 0.1,
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('pointer steering', () => {
  it('keeps moving while a second finger taps for a jump', () => {
    const harness = startInput();

    harness.fire('pointerdown', holdRightSide(1));
    harness.fire('pointerdown', tapJumpArea(2));
    harness.fire('pointerup', tapJumpArea(2));

    expect(harness.input.consumeJumpRequest()).toBe(true);
    expect(harness.input.horizontalAxis).toBe(1);
  });

  it('stops when the steering finger is lifted', () => {
    const harness = startInput();

    harness.fire('pointerdown', holdRightSide(1));
    harness.fire('pointerup', holdRightSide(1));

    expect(harness.input.horizontalAxis).toBe(0);
  });

  it('ignores movement of a finger that never started steering', () => {
    const harness = startInput();

    harness.fire('pointerdown', holdRightSide(1));
    harness.fire('pointermove', { pointerId: 7, clientX: 0, clientY: WINDOW_HEIGHT * 0.8 });

    expect(harness.input.horizontalAxis).toBe(1);
  });
});

describe('leaving the tab', () => {
  it('asks for a pause when the tab is hidden during a round', () => {
    const harness = startInput();

    harness.input.setGameplayActive(true);
    harness.hideTab();

    expect(harness.input.consumePauseRequest()).toBe(true);
  });

  it('asks for nothing outside a round, so a paused game stays paused', () => {
    const harness = startInput();

    harness.input.setGameplayActive(false);
    harness.hideTab();

    expect(harness.input.consumePauseRequest()).toBe(false);
  });
});
