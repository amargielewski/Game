import { describe, expect, it } from 'vitest';
import { ITEM_DEFINITIONS, isHazard } from './items';
import { LEVELS } from './levels';

describe('level table', () => {
  it('defines at least one level', () => {
    expect(LEVELS.length).toBeGreaterThan(0);
  });

  it('raises the score threshold with every level', () => {
    const thresholds = LEVELS.map((level) => level.scoreToAdvance);

    expect(thresholds).toEqual([...new Set(thresholds)].sort((first, second) => first - second));
  });

  it('never advances past the last level', () => {
    expect(LEVELS[LEVELS.length - 1]?.scoreToAdvance).toBe(Number.POSITIVE_INFINITY);
  });

  it('keeps every timing positive', () => {
    for (const level of LEVELS) {
      expect(level.spawnIntervalSeconds).toBeGreaterThan(0);
      expect(level.fallSeconds).toBeGreaterThan(0);
    }
  });

  it('offers something worth catching on every level', () => {
    for (const level of LEVELS) {
      expect(level.spawnPool.some((kind) => !isHazard(ITEM_DEFINITIONS[kind]))).toBe(true);
    }
  });
});
