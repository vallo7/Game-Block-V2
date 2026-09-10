import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { createGameState } from "../../src/core/GameState.js";

import {
  increaseCombo,
  resetCombo,
  updateCombo,
} from "../../src/core/ComboSystem.js";

describe("ComboSystem", () => {
  it("increases the combo", () => {
    const state = createGameState();

    assert.equal(
      increaseCombo(state),
      1
    );

    assert.equal(state.combo, 1);

    assert.equal(
      increaseCombo(state),
      2
    );

    assert.equal(state.combo, 2);
  });

  it("resets the combo", () => {
    const state = createGameState();

    state.combo = 5;

    assert.equal(
      resetCombo(state),
      0
    );

    assert.equal(state.combo, 0);
  });

  it("increases the combo when lines are cleared", () => {
    const state = createGameState();

    state.combo = 2;

    assert.equal(
      updateCombo(state, 1),
      3
    );

    assert.equal(state.combo, 3);
  });

  it("resets the combo when no line is cleared", () => {
    const state = createGameState();

    state.combo = 3;

    assert.equal(
      updateCombo(state, 0),
      0
    );

    assert.equal(state.combo, 0);
  });

  it("keeps increasing the combo across consecutive clears", () => {
    const state = createGameState();

    assert.equal(updateCombo(state, 1), 1);
    assert.equal(updateCombo(state, 2), 2);
    assert.equal(updateCombo(state, 1), 3);

    assert.equal(state.combo, 3);
  });
});
