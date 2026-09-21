import { Sprite, type Texture } from 'pixi.js';
import { Entity } from './entity';
import { GAME_CONFIG } from '../../config/game-config';
import { isHazard, type ItemDefinition } from '../../config/items';

export class Item extends Entity {
  private readonly spin: number = (Math.random() - 0.5) * GAME_CONFIG.items.maxSpin;

  constructor(
    public readonly definition: ItemDefinition,
    texture: Texture,
    private readonly velocityX: number,
    private readonly velocityY: number,
  ) {
    super(GAME_CONFIG.items.size, GAME_CONFIG.items.size);

    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.width = GAME_CONFIG.items.size;
    sprite.height = GAME_CONFIG.items.size;
    this.addChild(sprite);
  }

  public update(deltaSeconds: number): void {
    this.x += this.velocityX * deltaSeconds;
    this.y += this.velocityY * deltaSeconds;
    this.rotation += this.spin * deltaSeconds;
  }

  public get isHazard(): boolean {
    return isHazard(this.definition);
  }

  public get hasFallenBelowScreen(): boolean {
    return this.y - GAME_CONFIG.items.size / 2 > GAME_CONFIG.arena.designHeight;
  }

  public get hasDriftedOffScreen(): boolean {
    const margin = GAME_CONFIG.items.offScreenCullMargin;

    return this.x < -margin || this.x > GAME_CONFIG.arena.designWidth + margin;
  }
}
