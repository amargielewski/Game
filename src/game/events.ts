import { utils } from 'pixi.js';

type GameEvents = {
  scoreChanged: [points: number];
  livesChanged: [lives: number];
  levelChanged: [levelNumber: number];
  itemCaught: [x: number, y: number, color: number, points: number];
  itemMissed: [];
  gameOver: [points: number];
};

export const gameEvents = new utils.EventEmitter<GameEvents>();
