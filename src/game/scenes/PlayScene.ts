import { Container } from 'pixi.js';
import { Player } from '../entities/Player';
import { ItemField } from '../entities/ItemField';
import { ScoreBoard } from '../rules/ScoreBoard';
import { LevelProgression } from '../rules/LevelProgression';
import { GAME_CONFIG } from '../../config/GameConfig';
import { LEVELS, type LevelDefinition } from '../../config/levels';
import type { GameEvents } from '../events';
import type { Artwork } from '../Artwork';
import type { InputManager } from '../../core/InputManager';

export class PlayScene extends Container {
  private readonly scoreBoard: ScoreBoard = new ScoreBoard(GAME_CONFIG.scoring.startingLives);
  private readonly progression: LevelProgression<LevelDefinition> = new LevelProgression(LEVELS);
  private readonly itemField: ItemField;
  private readonly player: Player;
  private finished: boolean = false;

  constructor(
    artwork: Artwork,
    input: InputManager,
    private readonly gameEvents: GameEvents,
  ) {
    super();

    this.itemField = new ItemField(artwork, this.progression.current);
    this.player = new Player(
      {
        idle: artwork.knightIdle,
        runRight: artwork.knightRunRight,
        runLeft: artwork.knightRunLeft,
      },
      input,
    );

    this.addChild(this.itemField, this.player);
  }

  public get isFinished(): boolean {
    return this.finished;
  }

  public start(): void {
    this.gameEvents.emit('scoreChanged', this.scoreBoard.points);
    this.gameEvents.emit('livesChanged', this.scoreBoard.lives);
    this.gameEvents.emit('levelChanged', this.progression.levelNumber);
  }

  public update(deltaSeconds: number): void {
    if (this.finished) {
      return;
    }

    this.player.update(deltaSeconds);
    this.itemField.update(deltaSeconds);
    this.collectCaughtItems();
    this.punishMissedItems();
    this.advanceLevelIfReady();
  }

  private collectCaughtItems(): void {
    const caught = this.itemField.takeCaughtBy(this.player);

    if (caught.length === 0) {
      return;
    }

    for (const item of caught) {
      this.scoreBoard.addPoints(item.points);
      this.gameEvents.emit('itemCaught', item);
    }

    this.gameEvents.emit('scoreChanged', this.scoreBoard.points);
  }

  private punishMissedItems(): void {
    const missedCount = this.itemField.takeMissedCount();

    if (missedCount === 0) {
      return;
    }

    this.scoreBoard.loseLives(missedCount);
    this.gameEvents.emit('itemMissed');
    this.gameEvents.emit('livesChanged', this.scoreBoard.lives);

    if (this.scoreBoard.isGameOver) {
      this.finish();
    }
  }

  private advanceLevelIfReady(): void {
    if (!this.progression.advanceIfReady(this.scoreBoard.points)) {
      return;
    }

    this.itemField.applyLevel(this.progression.current);
    this.gameEvents.emit('levelChanged', this.progression.levelNumber);
  }

  private finish(): void {
    this.finished = true;
    this.gameEvents.emit('gameOver', this.scoreBoard.points);
  }
}
