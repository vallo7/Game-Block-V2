export class EffectsRenderer {
  constructor(animationSystem) {
    this.animationSystem = animationSystem;
    this.flash = 0;
    this.pulse = 0;
  }

  triggerFlash(intensity = 1) {
    this.flash = Math.max(
      this.flash,
      Math.min(1, intensity)
    );
  }

  triggerPulse(intensity = 1) {
    this.pulse = Math.max(
      this.pulse,
      Math.min(1, intensity)
    );
  }

  update(deltaTime) {
    this.flash = Math.max(
      0,
      this.flash - deltaTime * 5
    );

    this.pulse = Math.max(
      0,
      this.pulse - deltaTime * 4
    );
  }

  render(ctx, state, viewport) {
    this.renderClearAnimations(ctx);

    if (this.flash <= 0 && this.pulse <= 0) {
      return;
    }

    ctx.save();

    if (this.flash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${
        this.flash * 0.16
      })`;

      ctx.fillRect(
        0,
        0,
        viewport.width,
        viewport.height
      );
    }

    if (this.pulse > 0) {
      ctx.strokeStyle = `rgba(251,191,36,${
        this.pulse * 0.3
      })`;

      ctx.lineWidth = 6;

      ctx.strokeRect(
        3,
        3,
        viewport.width - 6,
        viewport.height - 6
      );
    }

    ctx.restore();
  }

  renderClearAnimations(ctx) {
    const animations =
      this.animationSystem.getActive();

    for (const animation of animations) {
      if (animation.type !== "clear") {
        continue;
      }

      const progress =
        this.animationSystem.easeOutCubic(
          this.animationSystem.getProgress(animation)
        );

      const radius =
        animation.size *
        (0.2 + progress * 0.8);

      const alpha =
        (1 - progress) *
        0.45 *
        animation.intensity;

      ctx.save();

      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "#fde68a";
      ctx.lineWidth = Math.max(
        2,
        animation.size * 0.08
      );

      ctx.beginPath();

      ctx.arc(
        animation.x,
        animation.y,
        radius,
        0,
        Math.PI * 2
      );

      ctx.stroke();

      ctx.restore();
    }
  }
}
