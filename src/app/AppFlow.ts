import type { Container } from 'pixi.js';
import { PlayScene } from '../game/scenes/PlayScene';
import type { GameEvents } from '../game/GameEvents';
import type { Artwork } from '../game/Artwork';
import type { InputManager } from '../core/InputManager';
import type { Hud } from '../presentation/Hud';
import type { Sfx } from '../presentation/Sfx';
import { Overlay } from '../presentation/Overlay';
import { applyTranslations } from '../presentation/strings';
import { GuideScreen } from '../presentation/screens/GuideScreen';
import { SettingsScreen } from '../presentation/screens/SettingsScreen';
import { RankingScreen } from '../presentation/screens/RankingScreen';
import { GameOverScreen } from '../presentation/screens/GameOverScreen';
import type { SettingsStore } from '../storage/SettingsStore';
import type { HighScoreStore } from '../storage/HighScoreStore';

export class AppFlow {
  private readonly menuOverlay: Overlay = new Overlay('screen-menu');
  private readonly pauseOverlay: Overlay = new Overlay('screen-pause');
  private readonly hudControls: Overlay = new Overlay('hud-controls');
  private readonly guideScreen: GuideScreen;
  private readonly settingsScreen: SettingsScreen;
  private readonly rankingScreen: RankingScreen;
  private readonly gameOverScreen: GameOverScreen;
  private readonly overlays: readonly Overlay[];
  private playScene: PlayScene | null = null;
  private paused: boolean = false;

  constructor(
    private readonly gameLayer: Container,
    private readonly artwork: Artwork,
    private readonly input: InputManager,
    private readonly hud: Hud,
    private readonly sfx: Sfx,
    private readonly settings: SettingsStore,
    highScores: HighScoreStore,
    private readonly gameEvents: GameEvents,
  ) {
    this.guideScreen = new GuideScreen(() => {
      this.goToMenu();
    });

    this.settingsScreen = new SettingsScreen(settings, {
      onBack: () => {
        this.goToMenu();
      },
      onLocaleChanged: () => {
        this.refreshTranslations();
      },
    });

    this.rankingScreen = new RankingScreen(highScores, () => {
      this.goToMenu();
    });

    this.gameOverScreen = new GameOverScreen(highScores, {
      onRestart: () => {
        this.startGame();
      },
      onMenu: () => {
        this.goToMenu();
      },
    });

    this.overlays = [
      this.menuOverlay,
      this.pauseOverlay,
      this.guideScreen.overlay,
      this.settingsScreen.overlay,
      this.rankingScreen.overlay,
      this.gameOverScreen.overlay,
    ];

    this.menuOverlay.onAction('play', () => {
      this.startGame();
    });

    this.menuOverlay.onAction('ranking', () => {
      this.rankingScreen.present();
      this.showOnly(this.rankingScreen.overlay);
    });

    this.menuOverlay.onAction('guide', () => {
      this.guideScreen.present();
      this.showOnly(this.guideScreen.overlay);
    });

    this.menuOverlay.onAction('settings', () => {
      this.settingsScreen.present();
      this.showOnly(this.settingsScreen.overlay);
    });

    this.hudControls.onAction('pause', () => {
      this.togglePause();
    });

    this.pauseOverlay.onAction('resume', () => {
      this.togglePause();
    });

    this.pauseOverlay.onAction('menu', () => {
      this.goToMenu();
    });

    this.gameEvents.on('gameOver', (points) => {
      this.input.setGameplayActive(false);
      this.gameOverScreen.present(points);
      this.hudControls.hide();
      this.showOnly(this.gameOverScreen.overlay);
    });
  }

  public get isPaused(): boolean {
    return this.paused;
  }

  public start(): void {
    if (this.settings.hasSeenGuide) {
      this.goToMenu();

      return;
    }

    this.settings.markGuideSeen();
    this.guideScreen.present();
    this.showOnly(this.guideScreen.overlay);
  }

  public update(deltaSeconds: number): void {
    if (this.input.consumePauseRequest()) {
      this.togglePause();
    }

    if (this.paused) {
      return;
    }

    this.playScene?.update(deltaSeconds);
  }

  private startGame(): void {
    this.sfx.unlock();
    this.input.reset();
    this.disposePlayScene();

    const scene = new PlayScene(this.artwork, this.input, this.gameEvents);

    this.playScene = scene;
    this.paused = false;
    this.input.setGameplayActive(true);
    this.gameLayer.addChild(scene);
    this.hud.visible = true;
    this.showOnly(null);
    this.hudControls.show();
    scene.start();
  }

  private goToMenu(): void {
    this.disposePlayScene();
    this.showOnly(this.menuOverlay);
  }

  private togglePause(): void {
    if (!this.playScene || this.playScene.isFinished) {
      return;
    }

    this.paused = !this.paused;
    this.input.setGameplayActive(!this.paused);
    this.showOnly(this.paused ? this.pauseOverlay : null);

    if (this.paused) {
      this.hudControls.hide();
    } else {
      this.hudControls.show();
    }
  }

  private refreshTranslations(): void {
    applyTranslations(document);
    this.guideScreen.present();
    this.rankingScreen.present();
  }

  private showOnly(target: Overlay | null): void {
    for (const overlay of this.overlays) {
      if (overlay === target) {
        overlay.show();
      } else {
        overlay.hide();
      }
    }
  }

  private disposePlayScene(): void {
    this.input.setGameplayActive(false);
    this.playScene?.destroy({ children: true });
    this.playScene = null;
    this.paused = false;
    this.hud.visible = false;
    this.hudControls.hide();
  }
}
