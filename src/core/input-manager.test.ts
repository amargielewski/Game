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

const holdLeftSide = (pointerId: number): FakePointerEvent => ({
  ...holdRightSide(pointerId),
  clientX: WINDOW_WIDTH * 0.1,
});

const raisedBy = (event: FakePointerEvent, pixels: number): FakePointerEvent => ({
  ...event,
  clientY: event.clientY - pixels,
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('touch jumping', () => {
  it('jumps on a tap from a second finger and keeps steering with the first', () => {
    const harness = startInput();

    harness.fire('pointerdown', holdRightSide(1));
    harness.fire('pointerdown', holdLeftSide(2));
    harness.fire('pointerup', holdLeftSide(2));

    expect(harness.input.consumeJumpRequest()).toBe(true);
    expect(harness.input.horizontalAxis).toBe(1);
  });

  it('jumps when the steering finger swipes up', () => {
    const harness = startInput();

    harness.fire('pointerdown', holdRightSide(1));
    harness.fire('pointermove', raisedBy(holdRightSide(1), 40));

    expect(harness.input.consumeJumpRequest()).toBe(true);
    expect(harness.input.horizontalAxis).toBe(1);
  });

  it('ignores a small wobble of the steering finger', () => {
    const harness = startInput();

    harness.fire('pointerdown', holdRightSide(1));
    harness.fire('pointermove', raisedBy(holdRightSide(1), 10));

    expect(harness.input.consumeJumpRequest()).toBe(false);
  });

  it('asks for one jump per swipe and another after sliding back down', () => {
    const harness = startInput();

    harness.fire('pointerdown', holdRightSide(1));
    harness.fire('pointermove', raisedBy(holdRightSide(1), 40));
    harness.input.consumeJumpRequest();
    harness.fire('pointermove', raisedBy(holdRightSide(1), 50));

    expect(harness.input.consumeJumpRequest()).toBe(false);

    harness.fire('pointermove', holdRightSide(1));
    harness.fire('pointermove', raisedBy(holdRightSide(1), 40));

    expect(harness.input.consumeJumpRequest()).toBe(true);
  });
});

describe('pointer steering', () => {
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
