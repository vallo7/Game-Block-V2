import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  createBoard,
  setCell,
} from "../../src/core/Board.js";

import {
  findCompletedRows,
  findCompletedColumns,
  findCompletedLines,
  clearLines,
} from "../../src/core/ClearSystem.js";

describe("ClearSystem", () => {
  it("detects a completed row", () => {
    const board = createBoard();

    for (let col = 0; col < 8; col += 1) {
      setCell(board, 2, col, "block");
    }

    assert.deepEqual(
      findCompletedRows(board),
      [2]
    );
  });

  it("detects a completed column", () => {
    const board = createBoard();

    for (let row = 0; row < 8; row += 1) {
      setCell(board, row, 3, "block");
    }

    assert.deepEqual(
      findCompletedColumns(board),
      [3]
    );
  });

  it("detects multiple completed lines", () => {
    const board = createBoard();

    for (let col = 0; col < 8; col += 1) {
      setCell(board, 2, col, "block");
    }

    for (let row = 0; row < 8; row += 1) {
      setCell(board, row, 5, "block");
    }

    const result = findCompletedLines(board);

    assert.deepEqual(result.rows, [2]);
    assert.deepEqual(result.columns, [5]);
    assert.equal(result.count, 2);
  });

  it("returns no completed lines on an empty board", () => {
    const board = createBoard();

    assert.deepEqual(
      findCompletedLines(board),
      {
        rows: [],
        columns: [],
        count: 0,
      }
    );
  });

  it("clears completed rows", () => {
    const board = createBoard();

    for (let col = 0; col < 8; col += 1) {
      setCell(board, 2, col, "block");
    }

    clearLines(board);

    assert.ok(
      board[2].every((cell) => cell === null)
    );
  });

  it("clears completed columns", () => {
    const board = createBoard();

    for (let row = 0; row < 8; row += 1) {
      setCell(board, row, 3, "block");
    }

    clearLines(board);

    assert.ok(
      board.every((row) => row[3] === null)
    );
  });

  it("clears intersecting row and column", () => {
    const board = createBoard();

    for (let col = 0; col < 8; col += 1) {
      setCell(board, 2, col, "block");
    }

    for (let row = 0; row < 8; row += 1) {
      setCell(board, row, 5, "block");
    }

    const result = clearLines(board);

    assert.equal(result.count, 2);
    assert.ok(
      board.every((row) => row[5] === null)
    );
    assert.ok(
      board[2].every((cell) => cell === null)
    );
  });
});
