import { Container } from 'pixi.js';
import { FallingItem } from './FallingItem';
import type { Player } from './Player';
import type { Artwork } from '../Artwork';
import { GAME_CONFIG } from '../../config/GameConfig';
import { ITEM_DEFINITIONS, type ItemKind } from '../../config/items';
import type { LevelDefinition } from '../../config/levels';
import { intersects } from '../rules/intersects';
import { SpawnTimer } from '../rules/SpawnTimer';

export interface CaughtItem {
  readonly points: number;
  readonly color: number;
  readonly x: number;
  readonly y: number;
}

export class ItemField extends Container {
  private readonly items: FallingItem[] = [];
  private readonly spawnTimer: SpawnTimer;
  private readonly bonusTimer = new SpawnTimer(GAME_CONFIG.bonus.intervalSeconds);
  private level: LevelDefinition;

  constructor(
    private readonly artwork: Artwork,
    startingLevel: LevelDefinition,
  ) {
    super();

    this.level = startingLevel;
    this.spawnTimer = new SpawnTimer(startingLevel.spawnIntervalSeconds);
  }

  public applyLevel(level: LevelDefinition): void {
    this.level = level;
    this.spawnTimer.changeInterval(level.spawnIntervalSeconds);
  }

  public update(deltaSeconds: number): void {
    const dueSpawns = this.spawnTimer.countDueSpawns(deltaSeconds);

    for (let spawn = 0; spawn < dueSpawns; spawn += 1) {
      this.spawnFallingItem();
    }

    if (this.bonusTimer.countDueSpawns(deltaSeconds) > 0) {
      this.spawnFlyingBonus();
    }

    for (const item of this.items) {
      item.update(deltaSeconds);
    }
  }

  public takeCaughtBy(player: Player): readonly CaughtItem[] {
    const caught: CaughtItem[] = [];

    for (const item of [...this.items]) {
      if (!intersects(player.hitBounds, item.hitBounds)) {
        continue;
      }

      caught.push({
        points: item.definition.points,
        color: item.definition.sparkColor,
        x: item.x,
        y: item.y,
      });
      this.removeItem(item);
    }

    return caught;
  }

  public takeMissedCount(): number {
    const gone = this.items.filter((item) => item.hasFallenBelowScreen || item.hasDriftedOffScreen);
    const missedCount = gone.filter((item) => item.hasFallenBelowScreen && !item.isHazard).length;

    for (const item of gone) {
      this.removeItem(item);
    }

    return missedCount;
  }

  private spawnFallingItem(): void {
    const kind = this.pickItemKind();
    const fallSpeed = GAME_CONFIG.arena.designHeight / this.level.fallSeconds;
    const item = this.createItem(kind, 0, fallSpeed);

    item.x = this.randomSpawnX();
    item.y = -GAME_CONFIG.items.size;

    this.addItem(item);
  }

  private spawnFlyingBonus(): void {
    const isEnteringFromLeft = Math.random() < 0.5;
    const speed = GAME_CONFIG.arena.designWidth / GAME_CONFIG.bonus.crossingSeconds;
    const item = this.createItem(GAME_CONFIG.bonus.kind, isEnteringFromLeft ? speed : -speed, 0);

    item.x = isEnteringFromLeft
      ? -GAME_CONFIG.items.size
      : GAME_CONFIG.arena.designWidth + GAME_CONFIG.items.size;
    item.y = GAME_CONFIG.bonus.laneY;

    this.addItem(item);
  }

  private createItem(kind: ItemKind, velocityX: number, velocityY: number): FallingItem {
    return new FallingItem(
      ITEM_DEFINITIONS[kind],
      this.artwork.foodTextures[kind],
      velocityX,
      velocityY,
    );
  }

  private addItem(item: FallingItem): void {
    this.items.push(item);
    this.addChild(item);
  }

  private pickItemKind(): ItemKind {
    const pool = this.level.spawnPool;
    const kind = pool[Math.floor(Math.random() * pool.length)];

    if (!kind) {
      throw new Error('Level defines no spawn pool');
    }

    return kind;
  }

  private randomSpawnX(): number {
    const span = GAME_CONFIG.arena.designWidth - GAME_CONFIG.items.spawnMargin * 2;

    return GAME_CONFIG.items.spawnMargin + Math.random() * span;
  }

  private removeItem(item: FallingItem): void {
    const index = this.items.indexOf(item);

    if (index >= 0) {
      this.items.splice(index, 1);
    }

    item.destroy({ children: true });
  }
}
