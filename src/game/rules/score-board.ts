export class ScoreBoard {
  private currentPoints: number = 0;
  private remainingLives: number;

  constructor(startingLives: number) {
    this.remainingLives = startingLives;
  }

  public get points(): number {
    return this.currentPoints;
  }

  public get lives(): number {
    return this.remainingLives;
  }

  public get isGameOver(): boolean {
    return this.remainingLives <= 0;
  }

  public addPoints(value: number): void {
    this.currentPoints = Math.max(0, this.currentPoints + value);
  }

  public loseLives(count: number): void {
    this.remainingLives = Math.max(0, this.remainingLives - count);
  }
}
