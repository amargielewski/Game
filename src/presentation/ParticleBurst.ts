import { Container, Sprite, type Texture } from 'pixi.js';
import { GAME_CONFIG } from '../config/gameConfig';
import type { GameEvents } from '../game/GameEvents';

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

    gameEvents.on('itemCaught', ({ x, y, color }) => {
      this.spawnBurst(x, y, color);
    });
  }

  public update(deltaSeconds: number): void {
    const { lifeSeconds, gravity } = GAME_CONFIG.particles;

    for (const particle of [...this.particles]) {
      particle.ageSeconds += deltaSeconds;

      if (particle.ageSeconds >= lifeSeconds) {
        this.removeParticle(particle);
        continue;
      }

      particle.velocityY += gravity * deltaSeconds;
      particle.sprite.x += particle.velocityX * deltaSeconds;
      particle.sprite.y += particle.velocityY * deltaSeconds;
      particle.sprite.alpha = 1 - particle.ageSeconds / lifeSeconds;
    }
  }

  private spawnBurst(x: number, y: number, color: number): void {
    const { perBurst, minSpeed, speedSpread, upwardBias, minScale, scaleSpread } =
      GAME_CONFIG.particles;

    for (let index = 0; index < perBurst; index += 1) {
      const angle = (Math.PI * 2 * index) / perBurst;
      const speed = minSpeed + Math.random() * speedSpread;
      const sprite = new Sprite(this.texture);

      sprite.anchor.set(0.5);
      sprite.tint = color;
      sprite.scale.set(minScale + Math.random() * scaleSpread);
      sprite.position.set(x, y);
      this.addChild(sprite);

      this.particles.push({
        sprite,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed - upwardBias,
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
