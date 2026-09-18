import { describe, expect, it } from 'vitest';
import { GAME_CONFIG } from './GameConfig';
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
