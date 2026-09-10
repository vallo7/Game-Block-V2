import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { createEventBus } from "../../src/core/EventBus.js";

describe("EventBus", () => {
  it("subscribes and receives events", () => {
    const bus = createEventBus();
    const received = [];

    bus.on("move", (payload) => {
      received.push(payload);
    });

    bus.emit("move", { row: 2, col: 3 });

    assert.deepEqual(received, [
      { row: 2, col: 3 },
    ]);
  });

  it("supports multiple listeners", () => {
    const bus = createEventBus();
    const calls = [];

    bus.on("move", () => {
      calls.push("first");
    });

    bus.on("move", () => {
      calls.push("second");
    });

    bus.emit("move");

    assert.deepEqual(calls, [
      "first",
      "second",
    ]);
  });

  it("unsubscribes a listener", () => {
    const bus = createEventBus();
    let calls = 0;

    const listener = () => {
      calls += 1;
    };

    bus.on("move", listener);
    bus.off("move", listener);

    bus.emit("move");

    assert.equal(calls, 0);
  });

  it("returns an unsubscribe function", () => {
    const bus = createEventBus();
    let calls = 0;

    const unsubscribe = bus.on(
      "move",
      () => {
        calls += 1;
      }
    );

    unsubscribe();
    bus.emit("move");

    assert.equal(calls, 0);
  });

  it("does nothing when emitting an unknown event", () => {
    const bus = createEventBus();

    assert.doesNotThrow(() => {
      bus.emit("unknown", {});
    });
  });

  it("clears all listeners", () => {
    const bus = createEventBus();
    let calls = 0;

    bus.on("move", () => {
      calls += 1;
    });

    bus.on("clear", () => {
      calls += 1;
    });

    bus.clear();

    bus.emit("move");
    bus.emit("clear");

    assert.equal(calls, 0);
  });

  it("rejects a non-function listener", () => {
    const bus = createEventBus();

    assert.throws(
      () => bus.on("move", null),
      TypeError
    );
  });
});
