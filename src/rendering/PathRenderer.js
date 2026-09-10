export class PathRenderer {
  constructor(options = {}) {
    this.color = options.color ?? "#fbbf24";
    this.glowColor = options.glowColor ?? "#fde68a";

    this.width = options.width ?? 10;
    this.glowWidth = options.glowWidth ?? 22;

    this.progress = 1;
    this.targetProgress = 1;
  }

  update(state, deltaTime) {
    const hasPath =
      Array.isArray(state.path) &&
      state.path.length > 0;

    this.targetProgress = hasPath ? 1 : 0;

    const speed = hasPath ? 10 : 14;

    this.progress +=
      (this.targetProgress - this.progress) *
      Math.min(1, deltaTime * speed);

    if (Math.abs(this.targetProgress - this.progress) < 0.01) {
      this.progress = this.targetProgress;
    }
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

    const offsetX =
      (viewport.width - boardSize) / 2;

    const offsetY =
      (viewport.height - boardSize) / 2;

    const visibleCount = Math.max(
      1,
      Math.ceil(state.path.length * this.progress)
    );

    const visiblePath =
      state.path.slice(0, visibleCount);

    ctx.save();

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    this.drawPath(
      ctx,
      visiblePath,
      cellSize,
      offsetX,
      offsetY,
      this.glowWidth,
      this.glowColor,
      0.35
    );

    this.drawPath(
      ctx,
      visiblePath,
      cellSize,
      offsetX,
      offsetY,
      this.width,
      this.color,
      1
    );

    this.drawHead(
      ctx,
      visiblePath[visiblePath.length - 1],
      cellSize,
      offsetX,
      offsetY
    );

    ctx.restore();
  }

  drawPath(
    ctx,
    path,
    cellSize,
    offsetX,
    offsetY,
    width,
    color,
    alpha
  ) {
    if (path.length === 0) {
      return;
    }

    ctx.save();

    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();

    path.forEach((cell, index) => {
      const x =
        offsetX +
        (cell.col + 0.5) * cellSize;

      const y =
        offsetY +
        (cell.row + 0.5) * cellSize;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
    ctx.restore();
  }

  drawHead(
    ctx,
    cell,
    cellSize,
    offsetX,
    offsetY
  ) {
    if (!cell) {
      return;
    }

    const x =
      offsetX +
      (cell.col + 0.5) * cellSize;

    const y =
      offsetY +
      (cell.row + 0.5) * cellSize;

    const radius =
      Math.max(4, this.width * 0.65);

    ctx.save();

    ctx.shadowColor = this.glowColor;
    ctx.shadowBlur = 14;

    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.arc(
      x,
      y,
      radius,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  }
}
