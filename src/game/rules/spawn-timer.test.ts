import { describe, expect, it } from 'vitest';
import { SpawnTimer } from './spawn-timer';

describe('SpawnTimer', () => {
  it('reports no spawn before the interval elapses', () => {
    const timer = new SpawnTimer(1);

    expect(timer.countDueSpawns(0.4)).toBe(0);
    expect(timer.countDueSpawns(0.5)).toBe(0);
  });

  it('reports every spawn contained in a long frame', () => {
    const timer = new SpawnTimer(0.25);

    expect(timer.countDueSpawns(1)).toBe(4);
  });

  it('carries the remainder over to the next frame', () => {
    const timer = new SpawnTimer(1);

    timer.countDueSpawns(0.9);

    expect(timer.countDueSpawns(0.2)).toBe(1);
    expect(timer.countDueSpawns(0.85)).toBe(0);
    expect(timer.countDueSpawns(0.1)).toBe(1);
  });
});
