import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  createGameState,
  resetGameState,
} from "../../src/core/GameState.js";

describe("GameState", () => {
  it("creates an 8x8 board by default", () => {
    const state = createGameState();

    assert.equal(state.size, 8);
    assert.equal(state.board.length, 8);
    assert.ok(
      state.board.every((row) => row.length === 8)
    );
  });

  it("initializes the core state", () => {
    const state = createGameState({
      seed: 42,
    });

    assert.equal(state.seed, 42);
    assert.equal(state.phase, "ready");

    assert.deepEqual(state.path, []);

    assert.equal(state.score, 0);
    assert.equal(state.combo, 0);
    assert.equal(state.level, 1);

    assert.deepEqual(state.queue, []);
    assert.deepEqual(state.obstacles, []);

    assert.equal(state.lastMove, null);
    assert.equal(state.lastClear, null);
  });

  it("creates an empty board", () => {
    const state = createGameState({
      size: 4,
    });

    assert.deepEqual(state.board, [
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

    assert.equal(reset.seed, 99);
    assert.equal(reset.size, 8);

    assert.equal(reset.score, 0);
    assert.equal(reset.combo, 0);
    assert.equal(reset.level, 1);

    assert.deepEqual(reset.path, []);
    assert.equal(reset.board.length, 8);
  });
});
