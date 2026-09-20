import { Graphics, type IRenderer, type Texture } from 'pixi.js';
import {
  FOOD_URLS,
  KNIGHT_IDLE_URLS,
  KNIGHT_RUN_LEFT_URLS,
  KNIGHT_RUN_RIGHT_URLS,
} from '../config/assets';
import { GAME_CONFIG } from '../config/game-config';
import { mapItemKinds, type ItemKind } from '../config/items';

export class Artwork {
  public readonly knightIdle: readonly Texture[];
  public readonly knightRunRight: readonly Texture[];
  public readonly knightRunLeft: readonly Texture[];
  public readonly foodTextures: Readonly<Record<ItemKind, Texture>>;
  public readonly fullHeartTexture: Texture;
  public readonly emptyHeartTexture: Texture;
  public readonly sparkTexture: Texture;

  constructor(
    private readonly renderer: IRenderer,
    loadedTextures: Readonly<Record<string, Texture>>,
  ) {
    this.knightIdle = KNIGHT_IDLE_URLS.map((url) => this.pick(loadedTextures, url));
    this.knightRunRight = KNIGHT_RUN_RIGHT_URLS.map((url) => this.pick(loadedTextures, url));
    this.knightRunLeft = KNIGHT_RUN_LEFT_URLS.map((url) => this.pick(loadedTextures, url));
    this.foodTextures = mapItemKinds((kind) => this.pick(loadedTextures, FOOD_URLS[kind]));
    this.fullHeartTexture = this.createHeart(GAME_CONFIG.hearts.fullColor);
    this.emptyHeartTexture = this.createHeart(GAME_CONFIG.hearts.emptyColor);
    this.sparkTexture = this.createSquare(
      GAME_CONFIG.particles.sparkSize,
      GAME_CONFIG.particles.baseColor,
    );
  }

  private createHeart(color: number): Texture {
    const heart = new Graphics();

    const pixel = GAME_CONFIG.hearts.pixelSize;

    heart.beginFill(color);
    GAME_CONFIG.hearts.pixelRows.forEach((row, rowIndex) => {
      [...row].forEach((cell, columnIndex) => {
        if (cell === '1') {
          heart.drawRect(columnIndex * pixel, rowIndex * pixel, pixel, pixel);
        }
      });
    });
    heart.endFill();

    return this.toTexture(heart);
  }

  private createSquare(size: number, color: number): Texture {
    const square = new Graphics();

    square.beginFill(color);
    square.drawRect(0, 0, size, size);
    square.endFill();

    return this.toTexture(square);
  }

  private pick(loadedTextures: Readonly<Record<string, Texture>>, url: string): Texture {
    const texture = loadedTextures[url];

    if (!texture) {
      throw new Error(`Texture was not loaded: ${url}`);
    }

    return texture;
  }

  private toTexture(graphics: Graphics): Texture {
    const texture = this.renderer.generateTexture(graphics);
    graphics.destroy();

    return texture;
  }
}
