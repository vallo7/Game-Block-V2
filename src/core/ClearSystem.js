import { isEmpty, setCell } from "./Board.js";

export function findCompletedRows(board) {
  const rows = [];

  for (let row = 0; row < board.length; row += 1) {
    const complete = board[row].every(
      (cell) => cell !== null
    );

    if (complete) {
      rows.push(row);
    }
  }

  return rows;
}

export function findCompletedColumns(board) {
  const columns = [];

  if (board.length === 0) {
    return columns;
  }

  for (let col = 0; col < board[0].length; col += 1) {
    let complete = true;

    for (let row = 0; row < board.length; row += 1) {
      if (isEmpty(board, row, col)) {
        complete = false;
        break;
      }
    }

    if (complete) {
      columns.push(col);
    }
  }

  return columns;
}

export function findCompletedLines(board) {
  const rows = findCompletedRows(board);
  const columns = findCompletedColumns(board);

  return {
    rows,
    columns,
    count: rows.length + columns.length,
  };
}

export function clearLines(board) {
  const lines = findCompletedLines(board);

  for (const row of lines.rows) {
    for (let col = 0; col < board[row].length; col += 1) {
      setCell(board, row, col, null);
    }
  }

  for (const col of lines.columns) {
    for (let row = 0; row < board.length; row += 1) {
      setCell(board, row, col, null);
    }
  }

  return lines;
}
