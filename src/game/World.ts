import { Container } from 'pixi.js';
import { AppFlow } from './AppFlow';
import type { Artwork } from './Artwork';
import { GAME_CONFIG } from '../config/GameConfig';
import type { InputManager } from '../core/InputManager';
import { Background } from '../presentation/Background';
import { Hud } from '../presentation/Hud';
import { ParticleBurst } from '../presentation/ParticleBurst';
import { Sfx } from '../presentation/Sfx';
import type { SettingsStore } from '../storage/SettingsStore';
import { HighScoreStore } from '../storage/HighScoreStore';

export class World {
  private readonly background = new Background();
  private readonly gameLayer = new Container();
  private readonly particles: ParticleBurst;
  private readonly hud: Hud;
  private readonly appFlow: AppFlow;

  constructor(root: Container, artwork: Artwork, input: InputManager, settings: SettingsStore) {
    this.particles = new ParticleBurst(artwork.sparkTexture);
    this.hud = new Hud(artwork.fullHeartTexture, artwork.emptyHeartTexture);
    this.hud.visible = false;

    root.addChild(this.background, this.gameLayer, this.particles, this.hud);

    this.appFlow = new AppFlow(
      this.gameLayer,
      artwork,
      input,
      this.hud,
      new Sfx(settings),
      settings,
      new HighScoreStore(),
    );
  }

  public start(): void {
    this.appFlow.start();
  }

  public advance(elapsedMilliseconds: number): void {
    const deltaSeconds = Math.min(elapsedMilliseconds / 1000, GAME_CONFIG.arena.maxDeltaSeconds);

    this.appFlow.update(deltaSeconds);

    if (this.appFlow.isPaused) {
      return;
    }

    this.background.update(deltaSeconds);
    this.particles.update(deltaSeconds);
    this.hud.update(deltaSeconds);
  }
}
