import { describe, expect, it } from "vitest";

import {
  createGameState,
  resetGameState,
} from "../../src/core/GameState.js";

describe("GameState", () => {
  it("creates an 8x8 board by default", () => {
    const state = createGameState();

    expect(state.size).toBe(8);
    expect(state.board).toHaveLength(8);
    expect(
      state.board.every((row) => row.length === 8)
    ).toBe(true);
  });

  it("initializes the core state", () => {
    const state = createGameState({
      seed: 42,
    });

    expect(state.seed).toBe(42);
    expect(state.phase).toBe("ready");

    expect(state.path).toEqual([]);

    expect(state.score).toBe(0);
    expect(state.combo).toBe(0);
    expect(state.level).toBe(1);

    expect(state.queue).toEqual([]);
    expect(state.obstacles).toEqual([]);

    expect(state.lastMove).toBeNull();
    expect(state.lastClear).toBeNull();
  });

  it("creates an empty board", () => {
    const state = createGameState({
      size: 4,
    });

    expect(state.board).toEqual([
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]);
  });

  it("resets the state", () => {
    const state = createGameState({
      seed: 42,
    });

    state.score = 100;
    state.combo = 3;
    state.level = 5;
    state.path.push({ row: 1, col: 1 });

    const reset = resetGameState(state, 99);

    expect(reset.seed).toBe(99);
    expect(reset.size).toBe(8);

    expect(reset.score).toBe(0);
    expect(reset.combo).toBe(0);
    expect(reset.level).toBe(1);

    expect(reset.path).toEqual([]);
    expect(reset.board).toHaveLength(8);
  });
});
