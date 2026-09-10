import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  createGameEngine,
} from "../../src/core/GameEngine.js";

describe("GameEngine", () => {
  it("creates a ready game", () => {
    const engine = createGameEngine({
      seed: 42,
    });

    const state = engine.getState();

    assert.equal(state.phase, "ready");
    assert.equal(state.score, 0);
    assert.equal(state.combo, 0);
    assert.equal(state.level, 1);
  });

  it("starts the game", () => {
    const engine = createGameEngine();

    engine.start();

    assert.equal(
      engine.getState().phase,
      "playing"
    );
  });

  it("accepts a valid move", () => {
    const engine = createGameEngine();

    engine.start();

    assert.equal(
      engine.move(2, 2),
      true
    );

    assert.deepEqual(
      engine.getState().lastMove,
      [
        { row: 2, col: 2 },
      ]
    );
  });

  it("rejects an invalid move", () => {
    const engine = createGameEngine();

    engine.start();

    assert.equal(
      engine.move(-1, 0),
      false
    );
  });

  it("supports incremental path movement", () => {
    const engine = createGameEngine();

    engine.start();

    assert.equal(
      engine.beginMove(2, 2),
      true
    );

    assert.equal(
      engine.extendMove(2, 3),
      true
    );

    const path = engine.finishMove();

    assert.deepEqual(path, [
      { row: 2, col: 2 },
      { row: 2, col: 3 },
    ]);
  });

  it("emits move events", () => {
    const engine = createGameEngine();
    const events = [];

    engine.on("move", (payload) => {
      events.push(payload);
    });

    engine.start();
    engine.move(2, 2);

    assert.equal(events.length, 1);
    assert.deepEqual(
      events[0].move,
      [{ row: 2, col: 2 }]
    );
  });

  it("generates blocks", () => {
    const engine = createGameEngine({
      seed: 42,
    });

    const generated = engine.generate(3);

    assert.equal(generated.length, 3);
    assert.equal(
      engine.getState().board
        .flat()
        .filter((cell) => cell !== null)
        .length,
      3
    );
  });

  it("restarts the game", () => {
    const engine = createGameEngine({
      seed: 42,
    });

    engine.start();
    engine.move(2, 2);

    engine.restart(99);

    const state = engine.getState();

    assert.equal(state.phase, "ready");
    assert.equal(state.seed, 99);
    assert.equal(state.score, 0);
    assert.equal(state.combo, 0);
    assert.equal(state.level, 1);
    assert.deepEqual(state.path, []);
  });
});
