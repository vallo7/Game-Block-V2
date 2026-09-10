export class BlockRenderer {
  constructor(options = {}) {
    this.blockColor = options.blockColor ?? "#60a5fa";
    this.blockHighlight = options.blockHighlight ?? "#93c5fd";
    this.radius = options.radius ?? 14;
  }

  render(ctx, state, viewport) {
    if (!state.board) {
      return;
    }

    const size = state.size;

    const availableWidth = viewport.width - 40;
    const availableHeight = viewport.height - 40;

    const boardSize = Math.min(availableWidth, availableHeight);
    const cellSize = boardSize / size;

    const offsetX = (viewport.width - boardSize) / 2;
    const offsetY = (viewport.height - boardSize) / 2;

    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        const value = state.board[row]?.[col];

        if (value === null || value === undefined) {
          continue;
        }

        const gap = Math.max(6, cellSize * 0.15);

        const x = offsetX + col * cellSize + gap;
        const y = offsetY + row * cellSize + gap;

        const width = cellSize - gap * 2;

        ctx.save();

        ctx.fillStyle = this.blockColor;

        this.roundRect(
          ctx,
          x,
          y,
          width,
          width,
          this.radius
        );

        ctx.fill();

        ctx.fillStyle = this.blockHighlight;
        ctx.globalAlpha = 0.35;

        this.roundRect(
          ctx,
          x + width * 0.12,
          y + width * 0.1,
          width * 0.76,
          width * 0.22,
          this.radius / 2
        );

        ctx.fill();

        ctx.restore();
      }
    }
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
