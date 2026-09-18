import { describe, expect, it } from 'vitest';
import { costsALife, hasLeftTheArena, type DepartedItem } from './departure';

const fallenFood: DepartedItem = {
  hasFallenBelowScreen: true,
  hasDriftedOffScreen: false,
  isHazard: false,
};

const fallenHazard: DepartedItem = { ...fallenFood, isHazard: true };

const driftedBonus: DepartedItem = {
  hasFallenBelowScreen: false,
  hasDriftedOffScreen: true,
  isHazard: false,
};

const stillFalling: DepartedItem = {
  hasFallenBelowScreen: false,
  hasDriftedOffScreen: false,
  isHazard: false,
};

describe('hasLeftTheArena', () => {
  it('keeps items that are still on screen', () => {
    expect(hasLeftTheArena(stillFalling)).toBe(false);
  });

  it('collects items that fell through the floor or flew out sideways', () => {
    expect(hasLeftTheArena(fallenFood)).toBe(true);
    expect(hasLeftTheArena(driftedBonus)).toBe(true);
  });
});

describe('costsALife', () => {
  it('charges a life for food that reached the floor', () => {
    expect(costsALife(fallenFood)).toBe(true);
  });

  it('spares the player when a hazard reaches the floor', () => {
    expect(costsALife(fallenHazard)).toBe(false);
  });

  it('spares the player when the flying bonus leaves sideways', () => {
    expect(costsALife(driftedBonus)).toBe(false);
  });
});
