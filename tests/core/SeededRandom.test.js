import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  createSeededRandom,
} from "../../src/core/SeededRandom.js";

describe("SeededRandom", () => {
  it("produces the same sequence for the same seed", () => {
    const first = createSeededRandom(42);
    const second = createSeededRandom(42);

    const sequenceA = [
      first.next(),
      first.next(),
      first.next(),
      first.next(),
      first.next(),
    ];

    const sequenceB = [
      second.next(),
      second.next(),
      second.next(),
      second.next(),
      second.next(),
    ];

    assert.deepEqual(sequenceA, sequenceB);
  });

  it("produces different sequences for different seeds", () => {
    const first = createSeededRandom(42);
    const second = createSeededRandom(43);

    assert.notDeepEqual(
      [
        first.next(),
        first.next(),
        first.next(),
      ],
      [
        second.next(),
        second.next(),
        second.next(),
      ]
    );
  });

  it("returns values between 0 and 1", () => {
    const random = createSeededRandom(123);

    for (let index = 0; index < 100; index += 1) {
      const value = random.next();

      assert.ok(value >= 0);
      assert.ok(value < 1);
    }
  });

  it("returns integers within the requested range", () => {
    const random = createSeededRandom(123);

    for (let index = 0; index < 100; index += 1) {
      const value = random.nextInt(8);

      assert.ok(Number.isInteger(value));
      assert.ok(value >= 0);
      assert.ok(value < 8);
    }
  });

  it("rejects an invalid nextInt range", () => {
    const random = createSeededRandom(123);

    assert.throws(
      () => random.nextInt(0),
      RangeError
    );

    assert.throws(
      () => random.nextInt(-1),
      RangeError
    );

    assert.throws(
      () => random.nextInt(1.5),
      RangeError
    );
  });

  it("picks values from an array", () => {
    const random = createSeededRandom(123);

    const values = ["A", "B", "C", "D"];

    for (let index = 0; index < 100; index += 1) {
      assert.ok(values.includes(random.pick(values)));
    }
  });

  it("rejects an empty array", () => {
    const random = createSeededRandom(123);

    assert.throws(
      () => random.pick([]),
      RangeError
    );
  });

  it("normalizes equivalent unsigned seeds", () => {
    const first = createSeededRandom(-1);
    const second = createSeededRandom(4294967295);

    assert.equal(first.next(), second.next());
    assert.equal(first.next(), second.next());
  });

  it("rejects an invalid seed", () => {
    assert.throws(
      () => createSeededRandom(NaN),
      TypeError
    );

    assert.throws(
      () => createSeededRandom(Infinity),
      TypeError
    );
  });
});
