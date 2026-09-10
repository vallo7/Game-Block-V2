import {
  clearLines,
} from "../../core/ClearSystem.js";

import {
  updateCombo,
  expireCombo,
} from "../../core/ComboSystem.js";

import {
  addScore,
} from "../../core/ScoreSystem.js";

import {
  isInside,
} from "../../core/Board.js";

function isValidPath(
  board,
  path,
  requiredBlocks
) {
  if (
    !Array.isArray(path) ||
    path.length !== requiredBlocks
  ) {
    return false;
  }

  const visited = new Set();

  for (
    let index = 0;
    index < path.length;
    index += 1
  ) {
    const cell = path[index];

    if (
      !cell ||
      !isInside(
        board,
        cell.row,
        cell.col
      )
    ) {
      return false;
    }

    const key =
      `${cell.row}:${cell.col}`;

    if (
      visited.has(key) ||
      board[cell.row][cell.col] !== null
    ) {
      return false;
    }

    if (index > 0) {
      const previous =
        path[index - 1];

      const distance =
        Math.abs(
          previous.row - cell.row
        ) +
        Math.abs(
          previous.col - cell.col
        );

      if (distance !== 1) {
        return false;
      }
    }

    visited.add(key);
  }

  return true;
}

function hasPathFrom(
  board,
  row,
  col,
  remaining,
  visited
) {
  if (remaining === 1) {
    return true;
  }

  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  for (
    const [rowOffset, colOffset]
    of directions
  ) {
    const nextRow =
      row + rowOffset;

    const nextCol =
      col + colOffset;

    if (
      !isInside(
        board,
        nextRow,
        nextCol
      )
    ) {
      continue;
    }

    if (
      board[nextRow][nextCol] !== null
    ) {
      continue;
    }

    const key =
      `${nextRow}:${nextCol}`;

    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    if (
      hasPathFrom(
        board,
        nextRow,
        nextCol,
        remaining - 1,
        visited
      )
    ) {
      return true;
    }

    visited.delete(key);
  }

  return false;
}

function hasPossibleMove(
  board,
  requiredBlocks
) {
  if (
    !Number.isInteger(
      requiredBlocks
    ) ||
    requiredBlocks <= 0
  ) {
    return true;
  }

  let openCells = 0;

  for (
    let row = 0;
    row < board.length;
    row += 1
  ) {
    for (
      let col = 0;
      col < board[row].length;
      col += 1
    ) {
      if (
        board[row][col] === null
      ) {
        openCells += 1;
      }
    }
  }

  if (
    openCells < requiredBlocks
  ) {
    return false;
  }

  for (
    let row = 0;
    row < board.length;
    row += 1
  ) {
    for (
      let col = 0;
      col < board[row].length;
      col += 1
    ) {
      if (
        board[row][col] !== null
      ) {
        continue;
      }

      const visited = new Set([
        `${row}:${col}`,
      ]);

      if (
        hasPathFrom(
          board,
          row,
          col,
          requiredBlocks,
          visited
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

function placeMove(
  state,
  move
) {
  for (const cell of move) {
    state.board[cell.row][cell.col] =
      "block";
  }
}

function isBoardEmpty(board) {
  return board.every((row) =>
    row.every(
      (cell) => cell === null
    )
  );
}

export function createClassicMode() {
  function playMove(state) {
    if (
      !state ||
      state.phase !== "playing"
    ) {
      return {
        accepted: false,
      };
    }

    const now =
      Number.isFinite(state.gameNow)
        ? state.gameNow
        : Date.now();

    expireCombo(
      state,
      now
    );

    if (
      !isValidPath(
        state.board,
        state.path,
        state.requiredBlocks
      )
    ) {
      return {
        accepted: false,
      };
    }

    const move = state.path.map(
      (cell) => ({
        row: cell.row,
        col: cell.col,
      })
    );

    placeMove(state, move);

    state.path.length = 0;

    const lines =
      clearLines(state.board);

    const boardEmpty =
      isBoardEmpty(state.board);

    updateCombo(
      state,
      lines.count,
      boardEmpty,
      now
    );

    const gained =
      addScore(
        state,
        lines.count
      );

    state.totalCleared +=
      lines.count;

    state.lastMove = move;
    state.lastClear = lines;

    state.turn += 1;
    state.session.moves += 1;

    return {
      accepted: true,
      move,
      clear: lines,
      score: gained,
      totalScore: state.score,
      combo: state.combo,
      comboUntil: state.comboUntil,
      turn: state.turn,
      gameover:
        !hasPossibleMove(
          state.board,
          state.requiredBlocks
        ),
    };
  }

  return {
    playMove,
    hasPossibleMove,
  };
}
