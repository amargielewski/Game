import { describe, expect, it } from 'vitest';
import { Jump } from './Jump';

const APEX = 180;
const RISE_SECONDS = 0.45;
const STEP = 1 / 120;

function advance(jump: Jump, seconds: number): void {
  for (let elapsed = 0; elapsed < seconds; elapsed += STEP) {
    jump.update(STEP);
  }
}

describe('Jump', () => {
  it('stays on the ground until it is started', () => {
    const jump = new Jump(APEX, RISE_SECONDS);

    advance(jump, 1);

    expect(jump.isAirborne).toBe(false);
    expect(jump.height).toBe(0);
  });

  it('reaches roughly the configured apex', () => {
    const jump = new Jump(APEX, RISE_SECONDS);

    jump.start();
    advance(jump, RISE_SECONDS);

    expect(jump.height).toBeGreaterThan(APEX * 0.9);
    expect(jump.height).toBeLessThan(APEX * 1.1);
  });

  it('lands back on the ground and clears the airborne flag', () => {
    const jump = new Jump(APEX, RISE_SECONDS);

    jump.start();
    advance(jump, RISE_SECONDS * 2 + 0.2);

    expect(jump.height).toBe(0);
    expect(jump.isAirborne).toBe(false);
  });

  it('reaches the same apex on a slow frame rate as on a fast one', () => {
    const peaks = [1 / 120, 1 / 60, 0.1].map((step) => {
      const jump = new Jump(APEX, RISE_SECONDS);
      let peak = 0;

      jump.start();
      for (let elapsed = 0; elapsed < RISE_SECONDS * 2; elapsed += step) {
        jump.update(step);
        peak = Math.max(peak, jump.height);
      }

      return peak;
    });

    for (const peak of peaks) {
      expect(peak).toBeGreaterThan(APEX * 0.95);
      expect(peak).toBeLessThan(APEX * 1.05);
    }
  });

  it('ignores a second jump while still in the air', () => {
    const jump = new Jump(APEX, RISE_SECONDS);

    jump.start();
    advance(jump, RISE_SECONDS);
    const apexHeight = jump.height;

    jump.start();
    jump.update(STEP);

    expect(jump.height).toBeLessThan(apexHeight + 1);
  });
});
