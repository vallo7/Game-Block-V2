export function createBoard(size = 8) {
  return Array.from({ length: size }, () =>
    Array(size).fill(null)
  );
}

export function isInside(board, row, col) {
  return (
    row >= 0 &&
    row < board.length &&
    col >= 0 &&
    col < board[row].length
  );
}

export function getCell(board, row, col) {
  if (!isInside(board, row, col)) {
    return null;
  }

  return board[row][col];
}

export function isEmpty(board, row, col) {
  return getCell(board, row, col) === null;
}

export function setCell(board, row, col, value) {
  if (!isInside(board, row, col)) {
    throw new RangeError(`Invalid cell: ${row},${col}`);
  }

  board[row][col] = value;
}

export function clearBoard(board) {
  for (let row = 0; row < board.length; row += 1) {
    board[row].fill(null);
  }
}
