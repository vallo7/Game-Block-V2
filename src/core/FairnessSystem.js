import { getEmptyCells } from "./GenerationSystem.js";

export function countEmptyCells(board) {
  return getEmptyCells(board).length;
}

export function canGenerateBlocks(
  board,
  count
) {
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError(
      "count must be a non-negative integer"
    );
  }

  return count <= countEmptyCells(board);
}

export function hasAvailableMove(board) {
  return countEmptyCells(board) > 0;
}
