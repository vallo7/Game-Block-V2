export class CanvasRenderer {
  constructor(canvas, options = {}) {
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new TypeError("CanvasRenderer requires a canvas element");
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    if (!this.ctx) {
      throw new Error("Unable to create 2D canvas context");
    }

    this.background = options.background ?? "#111827";
    this.resizeObserver = null;

    this.resize();
    this.observeResize();
  }

  observeResize() {
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", () => this.resize());
      return;
    }

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvas.parentElement || this.canvas);
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width || window.innerWidth);
    const height = Math.max(1, rect.height || window.innerHeight);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.width = width;
    this.height = height;
    this.dpr = dpr;
  }

  clear() {
    this.ctx.save();
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();
  }

  render(renderers, state) {
    this.clear();

    for (const renderer of renderers) {
      renderer.render(this.ctx, state, {
        width: this.width,
        height: this.height,
      });
    }
  }

  destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }
}
