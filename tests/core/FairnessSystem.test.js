import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  createBoard,
  setCell,
} from "../../src/core/Board.js";

import {
  countEmptyCells,
  canGenerateBlocks,
  hasAvailableMove,
} from "../../src/core/FairnessSystem.js";

describe("FairnessSystem", () => {
  it("counts empty cells", () => {
    const board = createBoard(4);

    assert.equal(
      countEmptyCells(board),
      16
    );

    setCell(board, 0, 0, "block");
    setCell(board, 1, 1, "block");

    assert.equal(
      countEmptyCells(board),
      14
    );
  });

  it("allows generation when enough cells are empty", () => {
    const board = createBoard(4);

    assert.equal(
      canGenerateBlocks(board, 5),
      true
    );
  });

  it("rejects generation when there are not enough empty cells", () => {
    const board = createBoard(2);

    assert.equal(
      canGenerateBlocks(board, 5),
      false
    );
  });

  it("allows generating zero blocks", () => {
    const board = createBoard();

    assert.equal(
      canGenerateBlocks(board, 0),
      true
    );
  });

  it("rejects an invalid generation count", () => {
    const board = createBoard();

    assert.throws(
      () => canGenerateBlocks(board, -1),
      RangeError
    );

    assert.throws(
      () => canGenerateBlocks(board, 1.5),
      RangeError
    );
  });

  it("detects available moves when empty cells exist", () => {
    const board = createBoard();

    assert.equal(
      hasAvailableMove(board),
      true
    );
  });

  it("detects a full board", () => {
    const board = createBoard(2);

    for (let row = 0; row < 2; row += 1) {
      for (let col = 0; col < 2; col += 1) {
        setCell(board, row, col, "block");
      }
    }

    assert.equal(
      hasAvailableMove(board),
      false
    );
  });
});
