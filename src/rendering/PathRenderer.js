export class PathRenderer {
  constructor(options = {}) {
    this.color = options.color ?? "#fbbf24";
    this.width = options.width ?? 10;
  }

  render(ctx, state, viewport) {
    if (!state.path || state.path.length === 0) {
      return;
    }

    const size = state.size;

    const boardSize = Math.min(
      viewport.width - 40,
      viewport.height - 40
    );

    const cellSize = boardSize / size;

    const offsetX = (viewport.width - boardSize) / 2;
    const offsetY = (viewport.height - boardSize) / 2;

    ctx.save();

    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();

    state.path.forEach((cell, index) => {
      const x = offsetX + (cell.col + 0.5) * cellSize;
      const y = offsetY + (cell.row + 0.5) * cellSize;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    ctx.restore();
  }
}
