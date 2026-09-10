import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { createGameState } from "../../src/core/GameState.js";

import {
  calculateLevel,
  updateDifficulty,
} from "../../src/core/DifficultySystem.js";

describe("DifficultySystem", () => {
  it("starts at level 1", () => {
    assert.equal(
      calculateLevel(0),
      1
    );
  });

  it("increases the level every 1000 points", () => {
    assert.equal(
      calculateLevel(999),
      1
    );

    assert.equal(
      calculateLevel(1000),
      2
    );

    assert.equal(
      calculateLevel(1999),
      2
    );

    assert.equal(
      calculateLevel(2000),
      3
    );
  });

  it("rejects a negative score", () => {
    assert.throws(
      () => calculateLevel(-1),
      RangeError
    );
  });

  it("rejects a non-numeric score", () => {
    assert.throws(
      () => calculateLevel(NaN),
      RangeError
    );

    assert.throws(
      () => calculateLevel(Infinity),
      RangeError
    );
  });

  it("updates the game level", () => {
    const state = createGameState();

    state.score = 2500;

    const result = updateDifficulty(state);

    assert.equal(state.level, 3);
    assert.equal(result.level, 3);
    assert.equal(result.increased, true);
  });

  it("reports when the level does not increase", () => {
    const state = createGameState();

    state.score = 500;

    const result = updateDifficulty(state);

    assert.equal(state.level, 1);
    assert.equal(result.level, 1);
    assert.equal(result.increased, false);
  });
});
