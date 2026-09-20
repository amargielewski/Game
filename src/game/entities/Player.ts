import { AnimatedSprite, type Texture } from 'pixi.js';
import { Entity } from './Entity';
import type { InputManager } from '../../core/InputManager';
import { GAME_CONFIG } from '../../config/GameConfig';
import type { Bounds } from '../rules/intersects';
import { Jump } from '../rules/Jump';

const PIXI_TICKS_PER_SECOND = 60;

export interface KnightAnimations {
  readonly idle: readonly Texture[];
  readonly runRight: readonly Texture[];
  readonly runLeft: readonly Texture[];
}

export class Player extends Entity {
  private readonly sprite: AnimatedSprite;
  private readonly jump: Jump = new Jump(
    GAME_CONFIG.player.jumpApexHeight,
    GAME_CONFIG.player.jumpRiseSeconds,
  );
  private currentFrames: readonly Texture[];
  private facing: number = 1;

  constructor(
    private readonly animations: KnightAnimations,
    private readonly input: InputManager,
  ) {
    super(GAME_CONFIG.player.catchWidth, GAME_CONFIG.player.catchHeight);

    this.currentFrames = animations.idle;
    this.sprite = new AnimatedSprite([...animations.idle]);
    this.sprite.autoUpdate = false;
    this.sprite.anchor.set(0.5, 1);
    this.sprite.scale.set(GAME_CONFIG.player.scale);
    this.sprite.animationSpeed = GAME_CONFIG.player.idleAnimationSpeed;
    this.sprite.play();
    this.addChild(this.sprite);

    this.x = GAME_CONFIG.arena.designWidth / 2;
    this.y = GAME_CONFIG.arena.groundY;
  }

  public override get hitBounds(): Bounds {
    return {
      x: this.x - this.hitWidth / 2,
      y: this.y - this.hitHeight,
      width: this.hitWidth,
      height: this.hitHeight,
    };
  }

  public update(deltaSeconds: number): void {
    if (this.input.consumeJumpRequest()) {
      this.jump.start();
    }

    this.jump.update(deltaSeconds);

    const direction = this.input.horizontalAxis;

    if (direction !== 0) {
      this.facing = direction;
    }

    this.x = this.clampToScreen(this.x + direction * this.currentSpeed * deltaSeconds);
    this.y = GAME_CONFIG.arena.groundY - this.jump.height;

    this.updatePose(direction);
    this.sprite.update(deltaSeconds * PIXI_TICKS_PER_SECOND);
  }

  private get currentSpeed(): number {
    const { speed, airControlFactor } = GAME_CONFIG.player;

    return this.jump.isAirborne ? speed * airControlFactor : speed;
  }

  private updatePose(direction: number): void {
    if (this.jump.isAirborne) {
      this.holdAirbornePose();

      return;
    }

    this.sprite.scale.set(GAME_CONFIG.player.scale);
    this.playAnimationFor(direction);
  }

  private holdAirbornePose(): void {
    const frames = this.framesFor(this.facing);

    if (frames !== this.currentFrames) {
      this.currentFrames = frames;
      this.sprite.textures = [...frames];
    }

    this.sprite.gotoAndStop(GAME_CONFIG.player.airborneFrameIndex);
    this.sprite.scale.set(
      GAME_CONFIG.player.scale * GAME_CONFIG.player.airborneNarrowing,
      GAME_CONFIG.player.scale * GAME_CONFIG.player.airborneStretch,
    );
  }

  private playAnimationFor(direction: number): void {
    const frames = this.framesFor(direction);

    if (frames === this.currentFrames && this.sprite.playing) {
      return;
    }

    this.currentFrames = frames;
    this.sprite.textures = [...frames];
    this.sprite.animationSpeed =
      frames === this.animations.idle
        ? GAME_CONFIG.player.idleAnimationSpeed
        : GAME_CONFIG.player.runAnimationSpeed;
    this.sprite.play();
  }

  private framesFor(direction: number): readonly Texture[] {
    if (direction > 0) {
      return this.animations.runRight;
    }

    if (direction < 0) {
      return this.animations.runLeft;
    }

    return this.animations.idle;
  }

  private clampToScreen(nextX: number): number {
    const halfWidth = GAME_CONFIG.player.catchWidth / 2;

    return Math.min(GAME_CONFIG.arena.designWidth - halfWidth, Math.max(halfWidth, nextX));
  }
}
