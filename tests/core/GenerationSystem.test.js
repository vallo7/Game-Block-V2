import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { createBoard } from "../../src/core/Board.js";

import {
  getEmptyCells,
  generateBlocks,
} from "../../src/core/GenerationSystem.js";

describe("GenerationSystem", () => {
  it("returns all cells on an empty board", () => {
    const board = createBoard(2);

    assert.deepEqual(
      getEmptyCells(board),
      [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
      ]
    );
  });

  it("generates the requested number of blocks", () => {
    const board = createBoard(4);

    const generated = generateBlocks(
      board,
      3,
      42
    );

    assert.equal(generated.length, 3);

    const occupied = board.flat().filter(
      (cell) => cell !== null
    );

    assert.equal(occupied.length, 3);
  });

  it("does not generate more blocks than empty cells", () => {
    const board = createBoard(2);

    const generated = generateBlocks(
      board,
      10,
      42
    );

    assert.equal(generated.length, 4);
    assert.ok(
      board.flat().every(
        (cell) => cell === "block"
      )
    );
  });

  it("generates deterministically with the same seed", () => {
    const first = createBoard(4);
    const second = createBoard(4);

    const generatedFirst = generateBlocks(
      first,
      5,
      42
    );

    const generatedSecond = generateBlocks(
      second,
      5,
      42
    );

    assert.deepEqual(
      generatedFirst,
      generatedSecond
    );

    assert.deepEqual(first, second);
  });

  it("does not overwrite occupied cells", () => {
    const board = createBoard(3);

    board[1][1] = "existing";

    const generated = generateBlocks(
      board,
      3,
      42
    );

    assert.equal(generated.length, 3);
    assert.equal(
      board[1][1],
      "existing"
    );
  });

  it("supports a custom block value", () => {
    const board = createBoard(2);

    generateBlocks(
      board,
      1,
      42,
      "red"
    );

    assert.equal(
      board.flat().filter(
        (cell) => cell === "red"
      ).length,
      1
    );
  });

  it("rejects an invalid count", () => {
    const board = createBoard();

    assert.throws(
      () => generateBlocks(board, -1),
      RangeError
    );

    assert.throws(
      () => generateBlocks(board, 1.5),
      RangeError
    );
  });
});
