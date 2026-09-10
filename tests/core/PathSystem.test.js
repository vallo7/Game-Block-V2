import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  createBoard,
  setCell,
} from "../../src/core/Board.js";

import {
  isAdjacent,
  isInPath,
  canAddToPath,
  addToPath,
  removeLastFromPath,
  clearPath,
} from "../../src/core/PathSystem.js";

describe("PathSystem", () => {
  it("detects orthogonally adjacent cells", () => {
    assert.equal(
      isAdjacent(
        { row: 2, col: 2 },
        { row: 2, col: 3 }
      ),
      true
    );

    assert.equal(
      isAdjacent(
        { row: 2, col: 2 },
        { row: 3, col: 2 }
      ),
      true
    );
  });

  it("rejects diagonal cells", () => {
    assert.equal(
      isAdjacent(
        { row: 2, col: 2 },
        { row: 3, col: 3 }
      ),
      false
    );
  });

  it("rejects distant cells", () => {
    assert.equal(
      isAdjacent(
        { row: 0, col: 0 },
        { row: 0, col: 2 }
      ),
      false
    );
  });

  it("detects whether a cell is already in the path", () => {
    const path = [
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ];

    assert.equal(
      isInPath(path, 1, 1),
      true
    );

    assert.equal(
      isInPath(path, 2, 1),
      false
    );
  });

  it("allows the first cell of a path", () => {
    const board = createBoard();
    const path = [];

    assert.equal(
      canAddToPath(board, path, 2, 2),
      true
    );
  });

  it("allows an orthogonally adjacent empty cell", () => {
    const board = createBoard();
    const path = [
      { row: 2, col: 2 },
    ];

    assert.equal(
      canAddToPath(board, path, 2, 3),
      true
    );
  });

  it("rejects a diagonal cell", () => {
    const board = createBoard();
    const path = [
      { row: 2, col: 2 },
    ];

    assert.equal(
      canAddToPath(board, path, 3, 3),
      false
    );
  });

  it("rejects an occupied cell", () => {
    const board = createBoard();

    setCell(board, 2, 3, "block");

    const path = [
      { row: 2, col: 2 },
    ];

    assert.equal(
      canAddToPath(board, path, 2, 3),
      false
    );
  });

  it("rejects a cell already in the path", () => {
    const board = createBoard();

    const path = [
      { row: 2, col: 2 },
      { row: 2, col: 3 },
    ];

    assert.equal(
      canAddToPath(board, path, 2, 2),
      false
    );
  });

  it("rejects a cell outside the board", () => {
    const board = createBoard();
    const path = [];

    assert.equal(
      canAddToPath(board, path, -1, 0),
      false
    );

    assert.equal(
      canAddToPath(board, path, 8, 0),
      false
    );
  });

  it("adds valid cells to the path", () => {
    const board = createBoard();
    const path = [];

    assert.equal(
      addToPath(board, path, 2, 2),
      true
    );

    assert.equal(
      addToPath(board, path, 2, 3),
      true
    );

    assert.deepEqual(path, [
      { row: 2, col: 2 },
      { row: 2, col: 3 },
    ]);
  });

  it("does not add invalid cells", () => {
    const board = createBoard();
    const path = [
      { row: 2, col: 2 },
    ];

    assert.equal(
      addToPath(board, path, 4, 4),
      false
    );

    assert.deepEqual(path, [
      { row: 2, col: 2 },
    ]);
  });

  it("removes the last cell", () => {
    const path = [
      { row: 2, col: 2 },
      { row: 2, col: 3 },
    ];

    const removed = removeLastFromPath(path);

    assert.deepEqual(
      removed,
      { row: 2, col: 3 }
    );

    assert.deepEqual(path, [
      { row: 2, col: 2 },
    ]);
  });

  it("returns null when removing from an empty path", () => {
    const path = [];

    assert.equal(
      removeLastFromPath(path),
      null
    );
  });

  it("clears the path", () => {
    const path = [
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ];

    clearPath(path);

    assert.deepEqual(path, []);
  });
});
