import { isInside, getCell } from "./Board.js";

export function isAdjacent(first, second) {
  const rowDistance = Math.abs(first.row - second.row);
  const colDistance = Math.abs(first.col - second.col);

  return (
    rowDistance + colDistance === 1
  );
}

export function isInPath(path, row, col) {
  return path.some(
    (cell) =>
      cell.row === row &&
      cell.col === col
  );
}

export function canAddToPath(
  board,
  path,
  row,
  col
) {
  if (!isInside(board, row, col)) {
    return false;
  }

  if (getCell(board, row, col) !== null) {
    return false;
  }

  if (isInPath(path, row, col)) {
    return false;
  }

  if (path.length === 0) {
    return true;
  }

  const last = path[path.length - 1];

  return isAdjacent(last, { row, col });
}

export function addToPath(
  board,
  path,
  row,
  col
) {
  if (!canAddToPath(board, path, row, col)) {
    return false;
  }

  path.push({ row, col });

  return true;
}

export function removeLastFromPath(path) {
  if (path.length === 0) {
    return null;
  }

  return path.pop();
}

export function clearPath(path) {
  path.length = 0;
}
