import { describe, expect, it } from 'vitest';
import { costsALife, hasLeftTheArena, type DepartedItem } from './departure';

const FALLEN_ITEM: DepartedItem = {
  hasFallenBelowScreen: true,
  hasDriftedOffScreen: false,
};

const DRIFTED_BONUS: DepartedItem = {
  hasFallenBelowScreen: false,
  hasDriftedOffScreen: true,
};

const STILL_FALLING: DepartedItem = {
  hasFallenBelowScreen: false,
  hasDriftedOffScreen: false,
};

describe('hasLeftTheArena', () => {
  it('keeps items that are still on screen', () => {
    expect(hasLeftTheArena(STILL_FALLING)).toBe(false);
  });

  it('collects items that fell through the floor or flew out sideways', () => {
    expect(hasLeftTheArena(FALLEN_ITEM)).toBe(true);
    expect(hasLeftTheArena(DRIFTED_BONUS)).toBe(true);
  });
});

describe('costsALife', () => {
  it('charges a life for anything that reached the floor', () => {
    expect(costsALife(FALLEN_ITEM)).toBe(true);
  });

  it('spares the player when the flying bonus leaves sideways', () => {
    expect(costsALife(DRIFTED_BONUS)).toBe(false);
  });
});
