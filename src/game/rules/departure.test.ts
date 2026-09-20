import { describe, expect, it } from 'vitest';
import { costsALife, hasLeftTheArena, type DepartedItem } from './departure';

const FALLEN_FOOD: DepartedItem = {
  hasFallenBelowScreen: true,
  hasDriftedOffScreen: false,
  isHazard: false,
};

const FALLEN_HAZARD: DepartedItem = { ...FALLEN_FOOD, isHazard: true };

const DRIFTED_BONUS: DepartedItem = {
  hasFallenBelowScreen: false,
  hasDriftedOffScreen: true,
  isHazard: false,
};

const STILL_FALLING: DepartedItem = {
  hasFallenBelowScreen: false,
  hasDriftedOffScreen: false,
  isHazard: false,
};

describe('hasLeftTheArena', () => {
  it('keeps items that are still on screen', () => {
    expect(hasLeftTheArena(STILL_FALLING)).toBe(false);
  });

  it('collects items that fell through the floor or flew out sideways', () => {
    expect(hasLeftTheArena(FALLEN_FOOD)).toBe(true);
    expect(hasLeftTheArena(DRIFTED_BONUS)).toBe(true);
  });
});

describe('costsALife', () => {
  it('charges a life for food that reached the floor', () => {
    expect(costsALife(FALLEN_FOOD)).toBe(true);
  });

  it('spares the player when a hazard reaches the floor', () => {
    expect(costsALife(FALLEN_HAZARD)).toBe(false);
  });

  it('spares the player when the flying bonus leaves sideways', () => {
    expect(costsALife(DRIFTED_BONUS)).toBe(false);
  });
});
