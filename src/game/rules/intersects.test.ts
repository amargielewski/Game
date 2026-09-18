import { describe, expect, it } from 'vitest';
import { intersects } from './intersects';

const player = { x: 100, y: 500, width: 80, height: 80 };

describe('intersects', () => {
  it('detects an overlapping item', () => {
    expect(intersects(player, { x: 150, y: 540, width: 50, height: 50 })).toBe(true);
  });

  it('rejects an item that only touches the edge', () => {
    expect(intersects(player, { x: 180, y: 500, width: 50, height: 50 })).toBe(false);
  });

  it('rejects an item passing above the player', () => {
    expect(intersects(player, { x: 120, y: 380, width: 50, height: 50 })).toBe(false);
  });
});
