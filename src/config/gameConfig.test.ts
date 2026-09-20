import { describe, expect, it } from 'vitest';
import { KNIGHT_IDLE_URLS, KNIGHT_RUN_LEFT_URLS, KNIGHT_RUN_RIGHT_URLS } from './assets';
import { GAME_CONFIG } from './gameConfig';
import { ITEM_DEFINITIONS, isHazard } from './items';
import { Jump } from '../game/rules/Jump';

const { groundY } = GAME_CONFIG.arena;
const { catchHeight, jumpApexHeight, jumpRiseSeconds, speed, airControlFactor } =
  GAME_CONFIG.player;

function catchBoxOverlapsBonusLaneAt(height: number): boolean {
  const boxTop = groundY - height - catchHeight;
  const boxBottom = groundY - height;
  const laneTop = GAME_CONFIG.bonus.laneY - GAME_CONFIG.items.size / 2;
  const laneBottom = GAME_CONFIG.bonus.laneY + GAME_CONFIG.items.size / 2;

  return boxTop < laneBottom && boxBottom > laneTop;
}

describe('bonus lane tuning', () => {
  it('stays out of reach while the knight is on the ground', () => {
    expect(catchBoxOverlapsBonusLaneAt(0)).toBe(false);
  });

  it('comes into reach at the top of a jump', () => {
    expect(catchBoxOverlapsBonusLaneAt(jumpApexHeight)).toBe(true);
  });

  it('is reached by an actual jump, not only by the configured apex', () => {
    const jump = new Jump(jumpApexHeight, jumpRiseSeconds);
    const step = 1 / 60;
    let isEverInReach = false;

    jump.start();
    for (let elapsed = 0; elapsed < jumpRiseSeconds * 2; elapsed += step) {
      jump.update(step);
      isEverInReach = isEverInReach || catchBoxOverlapsBonusLaneAt(jump.height);
    }

    expect(isEverInReach).toBe(true);
  });
});

describe('jump arc shape', () => {
  it('keeps the airborne leap from skimming across the whole arena', () => {
    const airborneSeconds = jumpRiseSeconds * 2;
    const distance = speed * airControlFactor * airborneSeconds;

    expect(distance / GAME_CONFIG.arena.designWidth).toBeLessThan(0.5);
    expect(distance / jumpApexHeight).toBeLessThan(3);
  });
});

describe('bonus item', () => {
  it('rewards the jump instead of punishing it', () => {
    expect(isHazard(ITEM_DEFINITIONS[GAME_CONFIG.bonus.kind])).toBe(false);
  });
});

describe('airborne pose', () => {
  it('points at a frame every knight animation has', () => {
    const shortestAnimation = Math.min(
      KNIGHT_IDLE_URLS.length,
      KNIGHT_RUN_LEFT_URLS.length,
      KNIGHT_RUN_RIGHT_URLS.length,
    );

    expect(Number.isInteger(GAME_CONFIG.player.airborneFrameIndex)).toBe(true);
    expect(GAME_CONFIG.player.airborneFrameIndex).toBeGreaterThanOrEqual(0);
    expect(GAME_CONFIG.player.airborneFrameIndex).toBeLessThan(shortestAnimation);
  });
});

describe('pixel art', () => {
  it.each([
    ['heart', GAME_CONFIG.hearts.pixelRows],
    ['cloud', GAME_CONFIG.background.cloudShape],
  ])('draws the %s as a rectangle of filled and empty cells', (_name, rows) => {
    const width = rows[0]?.length ?? 0;

    expect(width).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row).toMatch(new RegExp(`^[01]{${width}}$`));
    }
  });
});

describe('audio levels', () => {
  it('keeps every gain between silence and full volume', () => {
    const { defaultVolume, catchTone, penaltyTone, missTone, sequenceTone } = GAME_CONFIG.audio;
    const gains = [
      defaultVolume,
      catchTone.gain,
      penaltyTone.gain,
      missTone.gain,
      sequenceTone.gain,
    ];

    for (const gain of gains) {
      expect(gain).toBeGreaterThanOrEqual(0);
      expect(gain).toBeLessThanOrEqual(1);
    }
  });
});
