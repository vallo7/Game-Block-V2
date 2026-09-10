import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { createGameState } from "../../src/core/GameState.js";

import {
  calculateScore,
  addScore,
} from "../../src/core/ScoreSystem.js";

describe("ScoreSystem", () => {
  it("returns zero when no line is cleared", () => {
    assert.equal(calculateScore(0), 0);
  });

  it("calculates the score for one line", () => {
    assert.equal(
      calculateScore(1),
      100
    );
  });

  it("calculates a higher score for multiple lines", () => {
    assert.equal(
      calculateScore(2),
      400
    );

    assert.equal(
      calculateScore(3),
      900
    );
  });

  it("adds a combo bonus", () => {
    assert.equal(
      calculateScore(1, 1),
      150
    );

    assert.equal(
      calculateScore(2, 2),
      500
    );
  });

  it("rejects an invalid line count", () => {
    assert.equal(
      calculateScore(-1),
      0
    );

    assert.equal(
      calculateScore(1.5),
      0
    );
  });

  it("rejects an invalid combo", () => {
    assert.throws(
      () => calculateScore(1, -1),
      RangeError
    );

    assert.throws(
      () => calculateScore(1, 1.5),
      RangeError
    );
  });

  it("adds the gained score to the game state", () => {
    const state = createGameState();

    const gained = addScore(state, 2);

    assert.equal(gained, 400);
    assert.equal(state.score, 400);
  });

  it("uses the current combo when adding score", () => {
    const state = createGameState();

    state.combo = 2;

    const gained = addScore(state, 1);

    assert.equal(gained, 200);
    assert.equal(state.score, 200);
  });
});
