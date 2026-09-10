import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  createStateMachine,
} from "../../src/core/StateMachine.js";

describe("StateMachine", () => {
  const transitions = {
    ready: ["playing"],
    playing: ["gameover", "ready"],
    gameover: ["ready"],
  };

  it("starts in the initial state", () => {
    const machine = createStateMachine(
      "ready",
      transitions
    );

    assert.equal(
      machine.getState(),
      "ready"
    );
  });

  it("allows valid transitions", () => {
    const machine = createStateMachine(
      "ready",
      transitions
    );

    assert.equal(
      machine.canTransition("playing"),
      true
    );

    assert.equal(
      machine.transition("playing"),
      "playing"
    );

    assert.equal(
      machine.getState(),
      "playing"
    );
  });

  it("rejects invalid transitions", () => {
    const machine = createStateMachine(
      "ready",
      transitions
    );

    assert.equal(
      machine.canTransition("gameover"),
      false
    );

    assert.throws(
      () => machine.transition("gameover"),
      Error
    );

    assert.equal(
      machine.getState(),
      "ready"
    );
  });

  it("supports returning from gameover to ready", () => {
    const machine = createStateMachine(
      "gameover",
      transitions
    );

    assert.equal(
      machine.transition("ready"),
      "ready"
    );
  });

  it("resets to the initial state", () => {
    const machine = createStateMachine(
      "ready",
      transitions
    );

    machine.transition("playing");

    assert.equal(
      machine.reset(),
      "ready"
    );

    assert.equal(
      machine.getState(),
      "ready"
    );
  });

  it("supports resetting to a specific state", () => {
    const machine = createStateMachine(
      "ready",
      transitions
    );

    assert.equal(
      machine.reset("gameover"),
      "gameover"
    );

    assert.equal(
      machine.getState(),
      "gameover"
    );
  });
});
