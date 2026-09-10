import assert from "node:assert/strict";
import test from "node:test";

import { createGameState } from "../src/core/GameState.js";
import { createClassicMode } from "../src/modes/classic/ClassicMode.js";

test("Classic accepte un tracé de la longueur requise", () => {
  const state = createGameState();

  state.phase = "playing";
  state.path = [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
  ];

  const classic = createClassicMode();
  const result = classic.playMove(state);

  assert.equal(result.accepted, true);
  assert.equal(state.board[0][0], "block");
  assert.equal(state.board[0][1], "block");
  assert.equal(state.board[0][2], "block");
  assert.equal(state.path.length, 0);
  assert.equal(state.turn, 2);
  assert.equal(state.session.moves, 1);
});

test("Classic refuse un tracé trop court", () => {
  const state = createGameState();

  state.phase = "playing";
  state.requiredBlocks = 3;
  state.path = [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
  ];

  const classic = createClassicMode();
  const result = classic.playMove(state);

  assert.equal(result.accepted, false);
  assert.equal(state.board[0][0], null);
  assert.equal(state.board[0][1], null);
});

test("Classic efface une ligne complète", () => {
  const state = createGameState();

  state.phase = "playing";

  for (let col = 0; col < 8; col += 1) {
    state.board[0][col] = "block";
  }

  state.requiredBlocks = 1;
  state.path = [{ row: 1, col: 0 }];

  const classic = createClassicMode();
  const result = classic.playMove(state);

  assert.equal(result.accepted, true);
  assert.equal(result.clear.count, 1);
  assert.equal(state.board[0][0], null);
});
