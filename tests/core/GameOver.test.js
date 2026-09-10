import {
  describe,
  it,
} from "node:test";

import assert from "node:assert/strict";

import {
  createGameState,
} from "../../src/core/GameState.js";

import {
  createClassicMode,
} from "../../src/modes/classic/ClassicMode.js";

describe("Classic Game Over", () => {
  it("detects when a valid path exists", () => {
    const state =
      createGameState({
        size: 3,
      });

    const mode =
      createClassicMode();

    assert.equal(
      mode.hasPossibleMove(
        state.board,
        state.requiredBlocks
      ),
      true
    );
  });

  it("detects when no valid path exists", () => {
    const state =
      createGameState({
        size: 3,
      });

    for (
      let row = 0;
      row < state.board.length;
      row += 1
    ) {
      for (
        let col = 0;
        col < state.board[row].length;
        col += 1
      ) {
        state.board[row][col] =
          "block";
      }
    }

    const mode =
      createClassicMode();

    assert.equal(
      mode.hasPossibleMove(
        state.board,
        state.requiredBlocks
      ),
      false
    );
  });

  it("does not trigger Game Over when enough connected cells remain", () => {
    const state =
      createGameState({
        size: 3,
      });

    for (
      let row = 0;
      row < state.board.length;
      row += 1
    ) {
      for (
        let col = 0;
        col < state.board[row].length;
        col += 1
      ) {
        state.board[row][col] =
          "block";
      }
    }

    state.board[1][0] = null;
    state.board[1][1] = null;
    state.board[1][2] = null;

    const mode =
      createClassicMode();

    assert.equal(
      mode.hasPossibleMove(
        state.board,
        state.requiredBlocks
      ),
      true
    );
  });

  it("does trigger Game Over when remaining cells are disconnected", () => {
    const state =
      createGameState({
        size: 3,
      });

    for (
      let row = 0;
      row < state.board.length;
      row += 1
    ) {
      for (
        let col = 0;
        col < state.board[row].length;
        col += 1
      ) {
        state.board[row][col] =
          "block";
      }
    }

    state.board[0][0] = null;
    state.board[2][2] = null;
    state.board[1][1] = null;

    const mode =
      createClassicMode();

    assert.equal(
      mode.hasPossibleMove(
        state.board,
        state.requiredBlocks
      ),
      false
    );
  });
});
