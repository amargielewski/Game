import { utils } from 'pixi.js';

export interface CaughtItem {
  readonly points: number;
  readonly color: number;
  readonly x: number;
  readonly y: number;
}

type GameEvents = {
  scoreChanged: [points: number];
  livesChanged: [lives: number];
  levelChanged: [levelNumber: number];
  itemCaught: [item: CaughtItem];
  itemMissed: [];
  gameOver: [points: number];
};

export const gameEvents = new utils.EventEmitter<GameEvents>();
