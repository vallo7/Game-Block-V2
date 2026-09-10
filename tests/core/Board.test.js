import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  createBoard,
  isInside,
  getCell,
  isEmpty,
  setCell,
  clearBoard,
} from "../../src/core/Board.js";

describe("Board", () => {
  it("creates an 8x8 board by default", () => {
    const board = createBoard();

    assert.equal(board.length, 8);
    assert.ok(
      board.every((row) => row.length === 8)
    );
  });

  it("creates a board with a custom size", () => {
    const board = createBoard(4);

    assert.deepEqual(board, [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]);
  });

  it("checks whether a cell is inside the board", () => {
    const board = createBoard(4);

    assert.equal(isInside(board, 0, 0), true);
    assert.equal(isInside(board, 3, 3), true);

    assert.equal(isInside(board, -1, 0), false);
    assert.equal(isInside(board, 4, 0), false);
    assert.equal(isInside(board, 0, 4), false);
  });

  it("reads a cell", () => {
    const board = createBoard();

    assert.equal(getCell(board, 2, 3), null);
    assert.equal(getCell(board, -1, 0), null);
  });

  it("detects empty cells", () => {
    const board = createBoard();

    assert.equal(isEmpty(board, 2, 3), true);

    setCell(board, 2, 3, "block");

    assert.equal(isEmpty(board, 2, 3), false);
  });

  it("sets a cell value", () => {
    const board = createBoard();

    setCell(board, 1, 2, "block");

    assert.equal(getCell(board, 1, 2), "block");
  });

  it("rejects invalid cell coordinates", () => {
    const board = createBoard();

    assert.throws(
      () => setCell(board, -1, 0, "block"),
      RangeError
    );

    assert.throws(
      () => setCell(board, 8, 0, "block"),
      RangeError
    );
  });

  it("clears the entire board", () => {
    const board = createBoard();

    setCell(board, 0, 0, "block");
    setCell(board, 3, 4, "block");

    clearBoard(board);

    assert.ok(
      board.every((row) =>
        row.every((cell) => cell === null)
      )
    );
  });
});
