import { describe, expect, it } from 'vitest';
import { LevelProgression, type LevelDefinition } from './LevelProgression';

const levels: readonly LevelDefinition[] = [
  { scoreToAdvance: 10, spawnIntervalSeconds: 1, fallSeconds: 4, itemKinds: ['apple'] },
  { scoreToAdvance: 20, spawnIntervalSeconds: 0.8, fallSeconds: 3, itemKinds: ['cherry'] },
];

describe('LevelProgression', () => {
  it('starts on the first level', () => {
    const progression = new LevelProgression(levels);

    expect(progression.levelNumber).toBe(1);
    expect(progression.current.fallSeconds).toBe(4);
  });

  it('advances once the threshold is reached', () => {
    const progression = new LevelProgression(levels);

    expect(progression.advanceIfReady(9)).toBe(false);
    expect(progression.advanceIfReady(10)).toBe(true);
    expect(progression.levelNumber).toBe(2);
  });

  it('never advances past the last level', () => {
    const progression = new LevelProgression(levels);

    progression.advanceIfReady(10);

    expect(progression.advanceIfReady(9999)).toBe(false);
    expect(progression.levelNumber).toBe(2);
  });
});
