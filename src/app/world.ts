import { Container } from 'pixi.js';
import { AppFlow } from './app-flow';
import type { Artwork } from '../game/artwork';
import { GameEvents } from '../game/game-events';
import { GAME_CONFIG } from '../config/game-config';
import type { InputManager } from '../core/input-manager';
import { Background } from '../presentation/background';
import { Hud } from '../presentation/hud';
import { ParticleBurst } from '../presentation/particle-burst';
import { Sfx } from '../presentation/sfx';
import type { SettingsStore } from '../storage/settings-store';
import { HighScoreStore } from '../storage/high-score-store';

export class World {
  private readonly background: Background = new Background();
  private readonly gameLayer: Container = new Container();
  private readonly gameEvents: GameEvents = new GameEvents();
  private readonly particles: ParticleBurst;
  private readonly hud: Hud;
  private readonly appFlow: AppFlow;

  constructor(root: Container, artwork: Artwork, input: InputManager, settings: SettingsStore) {
    this.particles = new ParticleBurst(artwork.sparkTexture, this.gameEvents);
    this.hud = new Hud(artwork.fullHeartTexture, artwork.emptyHeartTexture, this.gameEvents);
    this.hud.visible = false;

    root.addChild(this.background, this.gameLayer, this.particles, this.hud);

    this.appFlow = new AppFlow(
      this.gameLayer,
      artwork,
      input,
      this.hud,
      new Sfx(settings, this.gameEvents),
      settings,
      new HighScoreStore(),
      this.gameEvents,
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
