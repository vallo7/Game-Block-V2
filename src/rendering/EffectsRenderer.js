export class EffectsRenderer {
  constructor() {
    this.flash = 0;
  }

  triggerFlash() {
    this.flash = 1;
  }

  update(deltaTime) {
    if (this.flash <= 0) {
      return;
    }

    this.flash -= deltaTime * 4;

    if (this.flash < 0) {
      this.flash = 0;
    }
  }

  render(ctx, state, viewport) {
    if (this.flash <= 0) {
      return;
    }

    ctx.save();

    ctx.fillStyle = `rgba(255,255,255,${this.flash * 0.12})`;
    ctx.fillRect(0, 0, viewport.width, viewport.height);

    ctx.restore();
  }
}
