const MINIMUM_INTERVAL_SECONDS = 0.05;

export class SpawnTimer {
  private elapsedSeconds: number = 0;

  constructor(private intervalSeconds: number) {}

  public changeInterval(seconds: number): void {
    this.intervalSeconds = Math.max(MINIMUM_INTERVAL_SECONDS, seconds);
  }

  public countDueSpawns(deltaSeconds: number): number {
    this.elapsedSeconds += deltaSeconds;

    const dueSpawns = Math.floor(this.elapsedSeconds / this.intervalSeconds);
    this.elapsedSeconds -= dueSpawns * this.intervalSeconds;

    return dueSpawns;
  }
}
