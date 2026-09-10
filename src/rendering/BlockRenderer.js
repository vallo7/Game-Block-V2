export class BlockRenderer {
  constructor(options = {}) {
    this.blockColor = options.blockColor ?? "#60a5fa";
    this.blockHighlight = options.blockHighlight ?? "#bfdbfe";
    this.blockShadow = options.blockShadow ?? "#2563eb";
    this.radius = options.radius ?? 14;

    this.previousBoard = null;
    this.animations = new Map();
  }

  update(state, deltaTime) {
    if (!state.board) {
      return;
    }

    const board = state.board;

    for (let row = 0; row < state.size; row += 1) {
      for (let col = 0; col < state.size; col += 1) {
        const value = board[row]?.[col];

        if (
          value !== null &&
          value !== undefined &&
          !this.hasPreviousBlock(row, col)
        ) {
          this.animations.set(
            this.getKey(row, col),
            0
          );
        }
      }
    }

    for (const [key, progress] of this.animations) {
      const nextProgress = progress + deltaTime * 5;

      if (nextProgress >= 1) {
        this.animations.delete(key);
      } else {
        this.animations.set(key, nextProgress);
      }
    }

    this.previousBoard = board.map((row) => [...row]);
  }

  hasPreviousBlock(row, col) {
    return (
      this.previousBoard?.[row]?.[col] !== null &&
      this.previousBoard?.[row]?.[col] !== undefined
    );
  }

  getKey(row, col) {
    return `${row}:${col}`;
  }

  getMetrics(state, viewport) {
    const boardSize = Math.min(
      viewport.width - 40,
      viewport.height - 40
    );

    const cellSize = boardSize / state.size;

    return {
      boardSize,
      cellSize,
      offsetX: (viewport.width - boardSize) / 2,
      offsetY: (viewport.height - boardSize) / 2,
    };
  }

  render(ctx, state, viewport) {
    if (!state.board) {
      return;
    }

    const {
      cellSize,
      offsetX,
      offsetY,
    } = this.getMetrics(state, viewport);

    for (let row = 0; row < state.size; row += 1) {
      for (let col = 0; col < state.size; col += 1) {
        const value = state.board[row]?.[col];

        if (value === null || value === undefined) {
          continue;
        }

        const key = this.getKey(row, col);
        const animation = this.animations.get(key);

        const progress =
          animation === undefined
            ? 1
            : this.easeOutBack(animation);

        const gap = Math.max(6, cellSize * 0.15);

        const baseSize = cellSize - gap * 2;
        const size = baseSize * progress;

        const centerX =
          offsetX + (col + 0.5) * cellSize;

        const centerY =
          offsetY + (row + 0.5) * cellSize;

        const x = centerX - size / 2;
        const y = centerY - size / 2;

        ctx.save();

        ctx.shadowColor = this.blockShadow;
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 4;

        ctx.fillStyle = this.blockColor;

        this.roundRect(
          ctx,
          x,
          y,
          size,
          size,
          this.radius
        );

        ctx.fill();

        ctx.shadowColor = "transparent";

        ctx.fillStyle = this.blockHighlight;
        ctx.globalAlpha = 0.35;

        this.roundRect(
          ctx,
          x + size * 0.12,
          y + size * 0.1,
          size * 0.76,
          Math.max(3, size * 0.18),
          this.radius / 2
        );

        ctx.fill();

        ctx.restore();
      }
    }
  }

  easeOutBack(value) {
    const c1 = 1.70158;
    const c3 = c1 + 1;

    return (
      1 +
      c3 * Math.pow(value - 1, 3) +
      c1 * Math.pow(value - 1, 2)
    );
  }

  roundRect(ctx, x, y, width, height, radius) {
    if (width <= 0 || height <= 0) {
      return;
    }

    const r = Math.min(
      radius,
      width / 2,
      height / 2
    );

    ctx.beginPath();

    ctx.moveTo(x + r, y);
    ctx.arcTo(
      x + width,
      y,
      x + width,
      y + height,
      r
    );

    ctx.arcTo(
      x + width,
      y + height,
      x,
      y + height,
      r
    );

    ctx.arcTo(
      x,
      y + height,
      x,
      y,
      r
    );

    ctx.arcTo(
      x,
      y,
      x + width,
      y,
      r
    );

    ctx.closePath();
  }
}
