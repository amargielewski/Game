export class Jump {
  private verticalSpeed: number = 0;
  private currentHeight: number = 0;

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

  private get gravity(): number {
    return (2 * this.apexHeight) / (this.riseSeconds * this.riseSeconds);
  }

  private get launchSpeed(): number {
    return (2 * this.apexHeight) / this.riseSeconds;
  }

  public start(): void {
    if (this.isAirborne) {
      return;
    }

    this.verticalSpeed = this.launchSpeed;
  }

  public update(deltaSeconds: number): void {
    if (!this.isAirborne && this.verticalSpeed <= 0) {
      return;
    }

    this.currentHeight +=
      this.verticalSpeed * deltaSeconds - 0.5 * this.gravity * deltaSeconds * deltaSeconds;
    this.verticalSpeed -= this.gravity * deltaSeconds;

    if (this.currentHeight <= 0) {
      this.currentHeight = 0;
      this.verticalSpeed = 0;
    }
  }
}
