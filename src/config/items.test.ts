import { describe, expect, it } from 'vitest';
import { ITEM_DEFINITIONS, ITEM_KINDS, isHazard } from './items';

describe('isHazard', () => {
  it('marks every negative item as a hazard', () => {
    const hazards = ITEM_KINDS.filter((kind) => isHazard(ITEM_DEFINITIONS[kind]));

    expect(hazards).toEqual(['grub', 'bug']);
  });

  it('never marks a scoring item as a hazard', () => {
    for (const kind of ITEM_KINDS) {
      const definition = ITEM_DEFINITIONS[kind];

      expect(isHazard(definition)).toBe(definition.points < 0);
    }
  });
});
