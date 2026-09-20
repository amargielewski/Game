import { Container, Sprite, Text, type Texture } from 'pixi.js';
import { GAME_CONFIG } from '../config/gameConfig';
import type { GameEvents } from '../game/GameEvents';
import { translate } from './strings';

export class Hud extends Container {
  private readonly scoreLabel: Text = new Text('0', GAME_CONFIG.hud.labelStyle);
  private readonly hearts: Container = new Container();
  private readonly banner: Text = new Text('', GAME_CONFIG.hud.bannerStyle);
  private bannerSecondsLeft: number = 0;

  constructor(
    private readonly fullHeartTexture: Texture,
    private readonly emptyHeartTexture: Texture,
    private readonly gameEvents: GameEvents,
  ) {
    super();

    const { scorePosition, heartsPosition, bannerOffsetY } = GAME_CONFIG.hud;

    this.scoreLabel.position.set(scorePosition.x, scorePosition.y);
    this.hearts.position.set(heartsPosition.x, heartsPosition.y);
    this.drawHearts(GAME_CONFIG.scoring.startingLives);

    this.banner.anchor.set(0.5);
    this.banner.position.set(
      GAME_CONFIG.arena.designWidth / 2,
      GAME_CONFIG.arena.designHeight / 2 + bannerOffsetY,
    );
    this.banner.alpha = 0;

    this.addChild(this.scoreLabel, this.hearts, this.banner);
    this.subscribeToGameEvents();
  }

  public update(deltaSeconds: number): void {
    if (this.bannerSecondsLeft <= 0) {
      return;
    }

    this.bannerSecondsLeft -= deltaSeconds;
    this.banner.alpha = Math.min(1, this.bannerSecondsLeft / (GAME_CONFIG.hud.bannerSeconds / 2));
  }

  private subscribeToGameEvents(): void {
    this.gameEvents.on('scoreChanged', (points) => {
      this.scoreLabel.text = String(points);
    });

    this.gameEvents.on('livesChanged', (lives) => {
      this.drawHearts(lives);
    });

    this.gameEvents.on('levelChanged', (levelNumber) => {
      this.banner.text = `${translate('level')} ${levelNumber}`;
      this.bannerSecondsLeft = GAME_CONFIG.hud.bannerSeconds;
    });
  }

  private drawHearts(lives: number): void {
    this.hearts.removeChildren().forEach((heart) => {
      heart.destroy();
    });

    for (let index = 0; index < GAME_CONFIG.scoring.startingLives; index += 1) {
      const isFilled = index < lives;
      const heart = new Sprite(isFilled ? this.fullHeartTexture : this.emptyHeartTexture);

      heart.anchor.set(1, 0.5);
      heart.x = -index * GAME_CONFIG.hud.heartSpacing;
      this.hearts.addChild(heart);
    }
  }
}
