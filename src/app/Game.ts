import { Application, Assets, BaseTexture, Container, SCALE_MODES, type Texture } from 'pixi.js';
import { Viewport } from '../core/Viewport';
import { InputManager } from '../core/InputManager';
import { Artwork } from '../game/Artwork';
import { World } from './World';
import { ALL_ASSET_URLS } from '../config/assets';
import { GAME_CONFIG } from '../config/gameConfig';
import { LoadingScreen } from '../presentation/screens/LoadingScreen';
import { applyTranslations, changeLocale } from '../presentation/strings';
import { SettingsStore } from '../storage/SettingsStore';

export class Game {
  private readonly application: Application<HTMLCanvasElement>;
  private readonly root: Container = new Container();
  private readonly input: InputManager = new InputManager();
  private readonly viewport: Viewport;

  constructor() {
    BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;

    this.application = new Application<HTMLCanvasElement>({
      backgroundColor: GAME_CONFIG.arena.backgroundColor,
      antialias: false,
      autoDensity: true,
      resolution: window.devicePixelRatio,
    });

    this.application.stage.addChild(this.root);

    this.viewport = new Viewport(
      this.application.renderer,
      this.root,
      GAME_CONFIG.arena.designWidth,
      GAME_CONFIG.arena.designHeight,
    );
  }

  public async start(): Promise<void> {
    const settings = new SettingsStore();

    changeLocale(settings.locale);
    applyTranslations(document);
    this.mountCanvas();
    this.input.start(this.application.view);
    this.viewport.start();

    const loadingScreen = new LoadingScreen();
    const textures = await Assets.load<Texture>([...ALL_ASSET_URLS], (ratio) => {
      loadingScreen.showProgress(ratio);
    });

    loadingScreen.hide();

    const world = new World(
      this.root,
      new Artwork(this.application.renderer, textures),
      this.input,
      settings,
    );

    this.application.ticker.add(() => {
      world.advance(this.application.ticker.deltaMS);
    });

    world.start();
  }

  private mountCanvas(): void {
    const host = document.getElementById(GAME_CONFIG.dom.hostElementId);

    if (!host) {
      throw new Error(`Missing host element #${GAME_CONFIG.dom.hostElementId}`);
    }

    host.appendChild(this.application.view);
  }
}
