import type { ItemKind } from './items';

export interface LevelDefinition {
  readonly scoreToAdvance: number;
  readonly spawnIntervalSeconds: number;
  readonly fallSeconds: number;
  readonly spawnPool: readonly ItemKind[];
}

export const LEVELS: readonly LevelDefinition[] = [
  {
    scoreToAdvance: 12,
    spawnIntervalSeconds: 1.3,
    fallSeconds: 4.2,
    spawnPool: ['apple', 'bread'],
  },
  {
    scoreToAdvance: 30,
    spawnIntervalSeconds: 1.1,
    fallSeconds: 3.7,
    spawnPool: ['apple', 'bread', 'cherry', 'cheese'],
  },
  {
    scoreToAdvance: 60,
    spawnIntervalSeconds: 0.95,
    fallSeconds: 3.2,
    spawnPool: ['cherry', 'cheese', 'strawberry', 'cookie', 'bug'],
  },
  {
    scoreToAdvance: 100,
    spawnIntervalSeconds: 0.8,
    fallSeconds: 2.8,
    spawnPool: ['cherry', 'cheese', 'strawberry', 'cookie', 'tart', 'pineapple', 'grub', 'bug'],
  },
  {
    scoreToAdvance: Number.POSITIVE_INFINITY,
    spawnIntervalSeconds: 0.65,
    fallSeconds: 2.4,
    spawnPool: ['cheese', 'strawberry', 'cookie', 'tart', 'pineapple', 'waffles', 'grub', 'bug'],
  },
];
