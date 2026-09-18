import type { LevelDefinition } from '../game/rules/LevelProgression';

export const LEVELS: readonly LevelDefinition[] = [
  {
    scoreToAdvance: 12,
    spawnIntervalSeconds: 1.3,
    fallSeconds: 4.2,
    itemKinds: ['apple', 'bread'],
  },
  {
    scoreToAdvance: 30,
    spawnIntervalSeconds: 1.1,
    fallSeconds: 3.7,
    itemKinds: ['apple', 'bread', 'cherry', 'cheese'],
  },
  {
    scoreToAdvance: 60,
    spawnIntervalSeconds: 0.95,
    fallSeconds: 3.2,
    itemKinds: ['cherry', 'cheese', 'strawberry', 'cookie', 'bug'],
  },
  {
    scoreToAdvance: 100,
    spawnIntervalSeconds: 0.8,
    fallSeconds: 2.8,
    itemKinds: ['strawberry', 'cookie', 'tart', 'pineapple', 'bug', 'grub'],
  },
  {
    scoreToAdvance: Number.POSITIVE_INFINITY,
    spawnIntervalSeconds: 0.65,
    fallSeconds: 2.4,
    itemKinds: ['cookie', 'tart', 'pineapple', 'waffles', 'bug', 'grub', 'bug'],
  },
];
