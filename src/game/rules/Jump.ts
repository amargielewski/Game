export class Jump {
  private verticalSpeed = 0;
  private currentHeight = 0;

  constructor(
    private readonly apexHeight: number,
    private readonly riseSeconds: number,
  ) {}

  public get isAirborne(): boolean {
    return this.currentHeight > 0;
  }

  public get height(): number {
    return this.currentHeight;
  }

  public start(): void {
    if (this.isAirborne) {
      return;
    }

    this.verticalSpeed = (2 * this.apexHeight) / this.riseSeconds;
  }

  public update(deltaSeconds: number): void {
    if (!this.isAirborne && this.verticalSpeed <= 0) {
      return;
    }

    const gravity = (2 * this.apexHeight) / (this.riseSeconds * this.riseSeconds);

    this.currentHeight +=
      this.verticalSpeed * deltaSeconds - 0.5 * gravity * deltaSeconds * deltaSeconds;
    this.verticalSpeed -= gravity * deltaSeconds;

    if (this.currentHeight <= 0) {
      this.currentHeight = 0;
      this.verticalSpeed = 0;
    }
  }
}
