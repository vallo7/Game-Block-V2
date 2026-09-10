export class BoardRenderer {
  constructor(options = {}) {
    this.padding = options.padding ?? 20;
    this.radius = options.radius ?? 18;

    this.boardColor = options.boardColor ?? "#1f2937";
    this.cellColor = options.cellColor ?? "#374151";
    this.lineColor = options.lineColor ?? "#4b5563";
  }

  getMetrics(state, viewport) {
    const size = state.size;

    const availableWidth = viewport.width - this.padding * 2;
    const availableHeight = viewport.height - this.padding * 2;

    const boardSize = Math.min(availableWidth, availableHeight);
    const cellSize = boardSize / size;

    const offsetX = (viewport.width - boardSize) / 2;
    const offsetY = (viewport.height - boardSize) / 2;

    return {
      size,
      boardSize,
      cellSize,
      offsetX,
      offsetY,
    };
  }

  render(ctx, state, viewport) {
    const metrics = this.getMetrics(state, viewport);

    const {
      size,
      boardSize,
      cellSize,
      offsetX,
      offsetY,
    } = metrics;

    ctx.save();

    ctx.fillStyle = this.boardColor;
    this.roundRect(
      ctx,
      offsetX,
      offsetY,
      boardSize,
      boardSize,
      this.radius
    );
    ctx.fill();

    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        const x = offsetX + col * cellSize;
        const y = offsetY + row * cellSize;

        const gap = Math.max(3, cellSize * 0.08);

        ctx.fillStyle = this.cellColor;

        this.roundRect(
          ctx,
          x + gap / 2,
          y + gap / 2,
          cellSize - gap,
          cellSize - gap,
          Math.max(5, cellSize * 0.14)
        );

        ctx.fill();
      }
    }

    ctx.restore();
  }

  roundRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }
}
