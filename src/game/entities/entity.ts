import { Container } from 'pixi.js';
import type { Bounds } from '../rules/intersects';

export abstract class Entity extends Container {
  protected constructor(
    protected readonly hitWidth: number,
    protected readonly hitHeight: number,
  ) {
    super();
  }

  public abstract update(deltaSeconds: number): void;

  public get hitBounds(): Bounds {
    return {
      x: this.x - this.hitWidth / 2,
      y: this.y - this.hitHeight / 2,
      width: this.hitWidth,
      height: this.hitHeight,
    };
  }
}
