import { utils } from 'pixi.js';

export interface CaughtItem {
  readonly points: number;
  readonly color: number;
  readonly x: number;
  readonly y: number;
}

type GameEventMap = {
  scoreChanged: [points: number];
  livesChanged: [lives: number];
  levelChanged: [levelNumber: number];
  itemCaught: [item: CaughtItem];
  itemMissed: [];
  gameOver: [points: number];
};

export class GameEvents extends utils.EventEmitter<GameEventMap> {}
