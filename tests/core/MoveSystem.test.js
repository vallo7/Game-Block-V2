import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { createGameState } from "../../src/core/GameState.js";

import {
  startMove,
  continueMove,
  undoMove,
  cancelMove,
  endMove,
} from "../../src/core/MoveSystem.js";

describe("MoveSystem", () => {
  it("starts a move", () => {
    const state = createGameState();

    assert.equal(
      startMove(state, 2, 2),
      true
    );

    assert.deepEqual(state.path, [
      { row: 2, col: 2 },
    ]);
  });

  it("continues a valid move", () => {
    const state = createGameState();

    startMove(state, 2, 2);

    assert.equal(
      continueMove(state, 2, 3),
      true
    );

    assert.deepEqual(state.path, [
      { row: 2, col: 2 },
      { row: 2, col: 3 },
    ]);
  });

  it("rejects an invalid continuation", () => {
    const state = createGameState();

    startMove(state, 2, 2);

    assert.equal(
      continueMove(state, 4, 4),
      false
    );

    assert.deepEqual(state.path, [
      { row: 2, col: 2 },
    ]);
  });

  it("undoes the last cell", () => {
    const state = createGameState();

    startMove(state, 2, 2);
    continueMove(state, 2, 3);

    assert.deepEqual(
      undoMove(state),
      { row: 2, col: 3 }
    );

    assert.deepEqual(state.path, [
      { row: 2, col: 2 },
    ]);
  });

  it("cancels a move", () => {
    const state = createGameState();

    startMove(state, 2, 2);
    continueMove(state, 2, 3);

    cancelMove(state);

    assert.deepEqual(state.path, []);
    assert.equal(state.lastMove, null);
  });

  it("ends a move and stores the completed path", () => {
    const state = createGameState();

    startMove(state, 2, 2);
    continueMove(state, 2, 3);

    const move = endMove(state);

    assert.deepEqual(move, [
      { row: 2, col: 2 },
      { row: 2, col: 3 },
    ]);

    assert.deepEqual(state.lastMove, [
      { row: 2, col: 2 },
      { row: 2, col: 3 },
    ]);

    assert.deepEqual(state.path, []);
  });

  it("returns null when ending an empty move", () => {
    const state = createGameState();

    assert.equal(
      endMove(state),
      null
    );

    assert.equal(state.lastMove, null);
  });
});
