import { createSeededRandom } from "./SeededRandom.js";
import { isEmpty, setCell } from "./Board.js";

export function getEmptyCells(board) {
  const cells = [];

  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      if (isEmpty(board, row, col)) {
        cells.push({ row, col });
      }
    }
  }

  return cells;
}

export function generateBlocks(
  board,
  count,
  seed = 1,
  value = "block"
) {
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError(
      "count must be a non-negative integer"
    );
  }

  const random = createSeededRandom(seed);
  const emptyCells = getEmptyCells(board);
  const generated = [];

  const amount = Math.min(
    count,
    emptyCells.length
  );

  for (let index = 0; index < amount; index += 1) {
    const cellIndex = random.nextInt(
      emptyCells.length
    );

    const [cell] = emptyCells.splice(
      cellIndex,
      1
    );

    setCell(
      board,
      cell.row,
      cell.col,
      value
    );

    generated.push(cell);
  }

  return generated;
}
