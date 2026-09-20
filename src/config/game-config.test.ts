import { describe, expect, it } from 'vitest';
import { KNIGHT_IDLE_URLS, KNIGHT_RUN_LEFT_URLS, KNIGHT_RUN_RIGHT_URLS } from './assets';
import { GAME_CONFIG } from './game-config';
import { ITEM_DEFINITIONS, isHazard } from './items';
import { Jump } from '../game/rules/jump';

function catchBoxOverlapsBonusLaneAt(height: number): boolean {
  const boxTop = GAME_CONFIG.arena.groundY - height - GAME_CONFIG.player.catchHeight;
  const boxBottom = GAME_CONFIG.arena.groundY - height;
  const laneTop = GAME_CONFIG.bonus.laneY - GAME_CONFIG.items.size / 2;
  const laneBottom = GAME_CONFIG.bonus.laneY + GAME_CONFIG.items.size / 2;

  return boxTop < laneBottom && boxBottom > laneTop;
}

describe('bonus lane tuning', () => {
  it('stays out of reach while the knight is on the ground', () => {
    expect(catchBoxOverlapsBonusLaneAt(0)).toBe(false);
  });

  it('comes into reach at the top of a jump', () => {
    expect(catchBoxOverlapsBonusLaneAt(GAME_CONFIG.player.jumpApexHeight)).toBe(true);
  });

  it('is reached by an actual jump, not only by the configured apex', () => {
    const jump = new Jump(GAME_CONFIG.player.jumpApexHeight, GAME_CONFIG.player.jumpRiseSeconds);
    const step = 1 / 60;
    let isEverInReach = false;

    jump.start();
    for (let elapsed = 0; elapsed < GAME_CONFIG.player.jumpRiseSeconds * 2; elapsed += step) {
      jump.update(step);
      isEverInReach = isEverInReach || catchBoxOverlapsBonusLaneAt(jump.height);
    }

    expect(isEverInReach).toBe(true);
  });
});

describe('jump arc shape', () => {
  it('keeps the airborne leap from skimming across the whole arena', () => {
    const airborneSeconds = GAME_CONFIG.player.jumpRiseSeconds * 2;
    const distance =
      GAME_CONFIG.player.speed * GAME_CONFIG.player.airControlFactor * airborneSeconds;

    expect(distance / GAME_CONFIG.arena.designWidth).toBeLessThan(0.5);
    expect(distance / GAME_CONFIG.player.jumpApexHeight).toBeLessThan(3);
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
    const gains = [
      GAME_CONFIG.audio.defaultVolume,
      GAME_CONFIG.audio.catchTone.gain,
      GAME_CONFIG.audio.penaltyTone.gain,
      GAME_CONFIG.audio.missTone.gain,
      GAME_CONFIG.audio.sequenceTone.gain,
    ];

    for (const gain of gains) {
      expect(gain).toBeGreaterThanOrEqual(0);
      expect(gain).toBeLessThanOrEqual(1);
    }
  });
});
