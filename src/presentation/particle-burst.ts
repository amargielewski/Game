import { Container, Sprite, type Texture } from 'pixi.js';
import { GAME_CONFIG } from '../config/game-config';
import type { GameEvents } from '../game/game-events';

interface Particle {
  readonly sprite: Sprite;
  velocityX: number;
  velocityY: number;
  ageSeconds: number;
}

export class ParticleBurst extends Container {
  private readonly particles: Particle[] = [];

  constructor(
    private readonly texture: Texture,
    gameEvents: GameEvents,
  ) {
    super();

    gameEvents.on('itemCaught', (item) => {
      this.spawnBurst(item.x, item.y, item.color);
    });
  }

  public update(deltaSeconds: number): void {
    for (const particle of [...this.particles]) {
      particle.ageSeconds += deltaSeconds;

      if (particle.ageSeconds >= GAME_CONFIG.particles.lifeSeconds) {
        this.removeParticle(particle);
        continue;
      }

      particle.velocityY += GAME_CONFIG.particles.gravity * deltaSeconds;
      particle.sprite.x += particle.velocityX * deltaSeconds;
      particle.sprite.y += particle.velocityY * deltaSeconds;
      particle.sprite.alpha = 1 - particle.ageSeconds / GAME_CONFIG.particles.lifeSeconds;
    }
  }

  private spawnBurst(x: number, y: number, color: number): void {
    for (let index = 0; index < GAME_CONFIG.particles.perBurst; index += 1) {
      const angle = (Math.PI * 2 * index) / GAME_CONFIG.particles.perBurst;
      const speed =
        GAME_CONFIG.particles.minSpeed + Math.random() * GAME_CONFIG.particles.speedSpread;
      const sprite = new Sprite(this.texture);

      sprite.anchor.set(0.5);
      sprite.tint = color;
      sprite.scale.set(
        GAME_CONFIG.particles.minScale + Math.random() * GAME_CONFIG.particles.scaleSpread,
      );
      sprite.position.set(x, y);
      this.addChild(sprite);

      this.particles.push({
        sprite,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed - GAME_CONFIG.particles.upwardBias,
        ageSeconds: 0,
      });
    }
  }

  private removeParticle(particle: Particle): void {
    const index = this.particles.indexOf(particle);

    if (index >= 0) {
      this.particles.splice(index, 1);
    }

    particle.sprite.destroy();
  }
}
