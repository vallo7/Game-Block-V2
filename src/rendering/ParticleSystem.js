export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  emit(x, y, count = 12) {
    for (let index = 0; index < count; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 130;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.45 + Math.random() * 0.4,
        maxLife: 0.85,
        size: 2 + Math.random() * 4,
      });
    }
  }

  emitBurst(x, y, intensity = 1) {
    this.emit(x, y, Math.round(12 * intensity));
  }

  update(deltaTime) {
    for (const particle of this.particles) {
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;

      particle.vy += 180 * deltaTime;
      particle.vx *= 0.985;

      particle.life -= deltaTime;
    }

    this.particles = this.particles.filter(
      (particle) => particle.life > 0
    );
  }

  render(ctx) {
    for (const particle of this.particles) {
      const alpha = Math.max(
        0,
        particle.life / particle.maxLife
      );

      ctx.save();

      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#fbbf24";

      ctx.beginPath();

      ctx.arc(
        particle.x,
        particle.y,
        particle.size,
        0,
        Math.PI * 2
      );

      ctx.fill();
      ctx.restore();
    }
  }
}
