import { Texture } from 'pixi.js';
import { describe, expect, it } from 'vitest';
import { ItemField } from './item-field';
import { GAME_CONFIG } from '../../config/game-config';
import { ITEM_DEFINITIONS, mapItemKinds, type ItemKind } from '../../config/items';

const FALL_SECONDS = 4;
const MID_FALL_SECONDS = 1;
const PAST_THE_FLOOR_SECONDS = 5;
const NEVER_SECONDS = GAME_CONFIG.bonus.intervalSeconds * 10;

const ARTWORK = { foodTextures: mapItemKinds(() => Texture.EMPTY) };

const CATCHER_COVERING_THE_ARENA_AND_BELOW = {
  hitBounds: {
    x: 0,
    y: 0,
    width: GAME_CONFIG.arena.designWidth,
    height: GAME_CONFIG.arena.designHeight * 2,
  },
};

const CATCHER_FAR_AWAY = { hitBounds: { x: -1000, y: -1000, width: 1, height: 1 } };

function fieldDropping(kind: ItemKind, spawnIntervalSeconds: number): ItemField {
  return new ItemField(ARTWORK, {
    scoreToAdvance: 1,
    spawnIntervalSeconds,
    fallSeconds: FALL_SECONDS,
    spawnPool: [kind],
  });
}

function fieldWithOneItem(kind: ItemKind, fallingForSeconds: number): ItemField {
  const field = fieldDropping(kind, fallingForSeconds);

  field.update(fallingForSeconds);

  return field;
}

describe('ItemField catching', () => {
  it('hands a caught item over with its score and removes it', () => {
    const field = fieldWithOneItem('apple', MID_FALL_SECONDS);

    const caught = field.takeCaughtBy(CATCHER_COVERING_THE_ARENA_AND_BELOW);

    expect(caught).toHaveLength(1);
    expect(caught[0]?.points).toBe(ITEM_DEFINITIONS.apple.points);
    expect(field.children).toHaveLength(0);
  });

  it('hands over every overlapping item in a single sweep', () => {
    const field = fieldDropping('apple', 0.1);

    field.update(MID_FALL_SECONDS);

    const spawnedCount = field.children.length;
    const caught = field.takeCaughtBy(CATCHER_COVERING_THE_ARENA_AND_BELOW);

    expect(spawnedCount).toBeGreaterThan(1);
    expect(caught).toHaveLength(spawnedCount);
    expect(field.children).toHaveLength(0);
  });

  it('never hands the same item over twice', () => {
    const field = fieldWithOneItem('apple', MID_FALL_SECONDS);

    field.takeCaughtBy(CATCHER_COVERING_THE_ARENA_AND_BELOW);

    expect(field.takeCaughtBy(CATCHER_COVERING_THE_ARENA_AND_BELOW)).toHaveLength(0);
  });

  it('leaves an item alone while the catcher is elsewhere', () => {
    const field = fieldWithOneItem('apple', MID_FALL_SECONDS);

    expect(field.takeCaughtBy(CATCHER_FAR_AWAY)).toHaveLength(0);
    expect(field.children).toHaveLength(1);
  });

  it('does not charge a life for an item caught on its way through the floor', () => {
    const field = fieldWithOneItem('apple', PAST_THE_FLOOR_SECONDS);

    field.takeCaughtBy(CATCHER_COVERING_THE_ARENA_AND_BELOW);

    expect(field.takeMissedCount()).toBe(0);
  });
});

describe('ItemField missing', () => {
  it('charges a life for food that fell through the floor and clears it', () => {
    const field = fieldWithOneItem('apple', PAST_THE_FLOOR_SECONDS);

    expect(field.takeMissedCount()).toBe(1);
    expect(field.children).toHaveLength(0);
  });

  it('charges a life for a fallen hazard too', () => {
    const field = fieldWithOneItem('bug', PAST_THE_FLOOR_SECONDS);

    expect(field.takeMissedCount()).toBe(1);
    expect(field.children).toHaveLength(0);
  });

  it('keeps an item that is still falling', () => {
    const field = fieldWithOneItem('apple', MID_FALL_SECONDS);

    expect(field.takeMissedCount()).toBe(0);
    expect(field.children).toHaveLength(1);
  });

  it('lets the flying bonus leave sideways without charging a life', () => {
    const field = fieldDropping('apple', NEVER_SECONDS);

    field.update(GAME_CONFIG.bonus.intervalSeconds);

    expect(field.children).toHaveLength(1);
    expect(field.takeMissedCount()).toBe(0);
    expect(field.children).toHaveLength(0);
  });
});

describe('ItemField spawning', () => {
  it('drops every item inside the horizontal spawn margins', () => {
    const field = fieldDropping('apple', 0.1);

    field.update(MID_FALL_SECONDS);

    expect(field.children.length).toBeGreaterThan(1);
    for (const item of field.children) {
      expect(item.x).toBeGreaterThanOrEqual(GAME_CONFIG.items.spawnMargin);
      expect(item.x).toBeLessThanOrEqual(
        GAME_CONFIG.arena.designWidth - GAME_CONFIG.items.spawnMargin,
      );
    }
  });
});
