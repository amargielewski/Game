export interface AdvanceableLevel {
  readonly scoreToAdvance: number;
}

export class LevelProgression<TLevel extends AdvanceableLevel> {
  private currentIndex = 0;

  constructor(private readonly levels: readonly TLevel[]) {
    if (levels.length === 0) {
      throw new Error('LevelProgression requires at least one level');
    }
  }

  public get current(): TLevel {
    const level = this.levels[this.currentIndex];

    if (!level) {
      throw new Error(`No level defined at index ${this.currentIndex}`);
    }

    return level;
  }

  public get levelNumber(): number {
    return this.currentIndex + 1;
  }

  private get isOnLastLevel(): boolean {
    return this.currentIndex === this.levels.length - 1;
  }

  public advanceIfReady(points: number): boolean {
    if (this.isOnLastLevel || points < this.current.scoreToAdvance) {
      return false;
    }

    this.currentIndex += 1;

    return true;
  }
}
