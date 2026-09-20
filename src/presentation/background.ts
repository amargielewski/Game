import { Container, Graphics } from 'pixi.js';
import { GAME_CONFIG } from '../config/game-config';

interface DriftingCloud {
  readonly shape: Container;
  readonly speed: number;
}

export class Background extends Container {
  private readonly clouds: DriftingCloud[] = [];

  constructor() {
    super();

    this.addChild(this.createSky(), this.createGround());
    this.createClouds();
  }

  public update(deltaSeconds: number): void {
    for (const cloud of this.clouds) {
      cloud.shape.x += cloud.speed * deltaSeconds;

      if (cloud.shape.x > GAME_CONFIG.arena.designWidth + cloud.shape.width) {
        cloud.shape.x = -cloud.shape.width;
      }
    }
  }

  private createSky(): Graphics {
    const sky = new Graphics();
    const bands = GAME_CONFIG.background.skyBands;
    const bandHeight = Math.ceil(GAME_CONFIG.arena.groundY / bands.length);

    bands.forEach((color, index) => {
      sky.beginFill(color);
      sky.drawRect(0, index * bandHeight, GAME_CONFIG.arena.designWidth, bandHeight);
      sky.endFill();
    });

    return sky;
  }

  private createGround(): Graphics {
    const ground = new Graphics();
    const { groundY, designWidth, designHeight } = GAME_CONFIG.arena;
    const { dirtColor, grassShadowColor, grassShadowHeight, grassColor, grassHeight } =
      GAME_CONFIG.background;

    ground.beginFill(dirtColor);
    ground.drawRect(0, groundY, designWidth, designHeight - groundY);
    ground.endFill();

    ground.beginFill(grassShadowColor);
    ground.drawRect(0, groundY, designWidth, grassShadowHeight);
    ground.endFill();

    ground.beginFill(grassColor);
    ground.drawRect(0, groundY, designWidth, grassHeight);
    ground.endFill();

    return ground;
  }

  private createClouds(): void {
    const layouts = GAME_CONFIG.background.cloudLayout;

    layouts.forEach((layout, index) => {
      const shape = this.createCloud();

      shape.scale.set(layout.scale);
      shape.y = layout.y;
      shape.x = (GAME_CONFIG.arena.designWidth / layouts.length) * index;
      shape.alpha = GAME_CONFIG.background.cloudAlpha;

      this.clouds.push({ shape, speed: layout.speed });
      this.addChild(shape);
    });
  }

  private createCloud(): Container {
    const cloud = new Graphics();
    const pixel = GAME_CONFIG.background.cloudPixel;

    cloud.beginFill(GAME_CONFIG.background.cloudColor);
    GAME_CONFIG.background.cloudShape.forEach((row, rowIndex) => {
      [...row].forEach((cell, columnIndex) => {
        if (cell === '1') {
          cloud.drawRect(columnIndex * pixel, rowIndex * pixel, pixel, pixel);
        }
      });
    });
    cloud.endFill();

    return cloud;
  }
}
