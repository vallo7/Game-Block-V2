import {
  describe,
  it,
} from "node:test";

import assert from "node:assert/strict";

import {
  createGameEngine,
} from "../../src/core/GameEngine.js";

describe("GameEngine", () => {
  it("creates a ready game", () => {
    const engine =
      createGameEngine({
        seed: 42,
      });

    const state =
      engine.getState();

    assert.equal(
      state.phase,
      "ready"
    );

    assert.equal(
      state.score,
      0
    );

    assert.equal(
      state.combo,
      0
    );

    assert.equal(
      state.level,
      1
    );
  });

  it("starts the game", () => {
    const engine =
      createGameEngine();

    engine.start();

    assert.equal(
      engine.getState().phase,
      "playing"
    );
  });

  it("accepts a valid Classic move", () => {
    const engine =
      createGameEngine();

    engine.start();

    assert.equal(
      engine.beginMove(2, 2),
      true
    );

    assert.equal(
      engine.extendMove(2, 3),
      true
    );

    assert.equal(
      engine.extendMove(2, 4),
      true
    );

    const result =
      engine.finishMove();

    assert.equal(
      result.accepted,
      true
    );

    assert.deepEqual(
      result.move,
      [
        {
          row: 2,
          col: 2,
        },
        {
          row: 2,
          col: 3,
        },
        {
          row: 2,
          col: 4,
        },
      ]
    );

    assert.equal(
      engine.getState()
        .board[2][2],
      "block"
    );
  });

  it("rejects an invalid move", () => {
    const engine =
      createGameEngine();

    engine.start();

    assert.equal(
      engine.beginMove(-1, 0),
      false
    );
  });

  it("rejects a path that is too short", () => {
    const engine =
      createGameEngine();

    engine.start();

    assert.equal(
      engine.beginMove(2, 2),
      true
    );

    assert.equal(
      engine.extendMove(2, 3),
      true
    );

    const result =
      engine.finishMove();

    assert.equal(
      result.accepted,
      false
    );

    assert.equal(
      engine.getState()
        .board[2][2],
      null
    );

    assert.equal(
      engine.getState()
        .board[2][3],
      null
    );
  });

  it("supports incremental path movement", () => {
    const engine =
      createGameEngine();

    engine.start();

    assert.equal(
      engine.beginMove(2, 2),
      true
    );

    assert.equal(
      engine.extendMove(2, 3),
      true
    );

    assert.equal(
      engine.extendMove(2, 4),
      true
    );

    assert.equal(
      engine.getState()
        .path.length,
      3
    );

    const result =
      engine.finishMove();

    assert.equal(
      result.accepted,
      true
    );

    assert.equal(
      engine.getState()
        .path.length,
      0
    );
  });

  it("emits move events", () => {
    const engine =
      createGameEngine();

    const events = [];

    engine.on(
      "move",
      (payload) => {
        events.push(payload);
      }
    );

    engine.start();

    engine.beginMove(2, 2);
    engine.extendMove(2, 3);
    engine.extendMove(2, 4);

    engine.finishMove();

    assert.equal(
      events.length,
      1
    );

    assert.deepEqual(
      events[0].move,
      [
        {
          row: 2,
          col: 2,
        },
        {
          row: 2,
          col: 3,
        },
        {
          row: 2,
          col: 4,
        },
      ]
    );
  });

  it("generates blocks", () => {
    const engine =
      createGameEngine({
        seed: 42,
      });

    const generated =
      engine.generate(3);

    assert.equal(
      generated.length,
      3
    );

    assert.equal(
      engine.getState()
        .board
        .flat()
        .filter(
          (cell) =>
            cell !== null
        ).length,
      3
    );
  });

  it("restarts the game", () => {
    const engine =
      createGameEngine({
        seed: 42,
      });

    engine.start();

    engine.beginMove(2, 2);
    engine.extendMove(2, 3);
    engine.extendMove(2, 4);
    engine.finishMove();

    engine.restart(99);

    const state =
      engine.getState();

    assert.equal(
      state.phase,
      "ready"
    );

    assert.equal(
      state.seed,
      99
    );

    assert.equal(
      state.score,
      0
    );

    assert.equal(
      state.combo,
      0
    );

    assert.equal(
      state.level,
      1
    );

    assert.deepEqual(
      state.path,
      []
    );
  });
});

describe("GameEngine session controls", () => {
  it("pauses and resumes a playing game without accepting input while paused", () => {
    const engine = createGameEngine();
    engine.start();
    assert.equal(engine.pause(), true);
    assert.equal(engine.getState().phase, "paused");
    assert.equal(engine.beginMove(0, 0), false);
    assert.equal(engine.resume(), true);
    assert.equal(engine.getState().phase, "playing");
  });

  it("rejects revive unless the game is over", () => {
    const engine = createGameEngine();
    engine.start();
    assert.equal(engine.revive(), false);
  });
});

  it("revives a game-over state once and emits a revive event", () => {
    const engine = createGameEngine({
      mode: {
        playMove: () => ({ accepted: true, move: [], clear: { count: 0 }, score: 0, gameover: true }),
        hasPossibleMove: () => true,
      },
    });
    let reviveEvents = 0;
    engine.on("game:revive", () => { reviveEvents += 1; });
    engine.start();
    engine.beginMove(0, 0);
    engine.finishMove();
    assert.equal(engine.getState().phase, "gameover");
    assert.equal(engine.revive(), true);
    assert.equal(engine.getState().phase, "playing");
    assert.equal(engine.getState().session.revives, 1);
    assert.equal(reviveEvents, 1);
    assert.equal(engine.revive(), false);
  });
