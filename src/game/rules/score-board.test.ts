import { describe, expect, it } from 'vitest';
import { ScoreBoard } from './score-board';

describe('ScoreBoard', () => {
  it('accumulates points and never drops below zero', () => {
    const board = new ScoreBoard(10);

    board.addPoints(5);
    board.addPoints(-9);

    expect(board.points).toBe(0);
  });

  it('ends the game exactly after the starting lives are spent', () => {
    const board = new ScoreBoard(3);

    board.loseLives(1);
    board.loseLives(1);
    expect(board.isGameOver).toBe(false);

    board.loseLives(1);
    expect(board.isGameOver).toBe(true);
    expect(board.lives).toBe(0);
  });

  it('keeps lives at zero when further lives are lost', () => {
    const board = new ScoreBoard(1);

    board.loseLives(1);
    board.loseLives(1);

    expect(board.lives).toBe(0);
  });
});
