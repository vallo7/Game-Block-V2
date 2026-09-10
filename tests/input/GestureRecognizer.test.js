import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createGestureRecognizer } from "../../src/input/GestureRecognizer.js";

describe("GestureRecognizer", () => {
  it("ignores duplicate cells and resets an active gesture", () => {
    const gesture = createGestureRecognizer();
    assert.deepEqual(gesture.start({ row: 1, col: 2 }), { row: 1, col: 2 });
    assert.equal(gesture.move({ row: 1, col: 2 }), null);
    assert.deepEqual(gesture.move({ row: 1, col: 3 }), { row: 1, col: 3 });
    gesture.reset();
    assert.equal(gesture.move({ row: 1, col: 4 }), null);
  });
});
