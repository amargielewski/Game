import { describe, expect, it } from 'vitest';
import { LevelProgression } from './LevelProgression';

const LEVELS = [
  { scoreToAdvance: 10, fallSeconds: 4 },
  { scoreToAdvance: 20, fallSeconds: 3 },
];

describe('LevelProgression', () => {
  it('starts on the first level', () => {
    const progression = new LevelProgression(LEVELS);

    expect(progression.levelNumber).toBe(1);
    expect(progression.current.fallSeconds).toBe(4);
  });

  it('advances once the threshold is reached', () => {
    const progression = new LevelProgression(LEVELS);

    expect(progression.advanceIfReady(9)).toBe(false);
    expect(progression.advanceIfReady(10)).toBe(true);
    expect(progression.levelNumber).toBe(2);
  });

  it('never advances past the last level', () => {
    const progression = new LevelProgression(LEVELS);

    progression.advanceIfReady(10);

    expect(progression.advanceIfReady(9999)).toBe(false);
    expect(progression.levelNumber).toBe(2);
  });
});
