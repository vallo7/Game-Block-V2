import {
  clearLines,
} from "../../core/ClearSystem.js";

import {
  updateCombo,
} from "../../core/ComboSystem.js";

function placeMove(state, move) {
  for (const cell of move) {
    state.board[cell.row][cell.col] = "block";
  }
}

function calculateScore(state, linesCleared) {
  if (linesCleared <= 0) {
    return 0;
  }

  const baseScore = linesCleared * 100;

  const previousMilestones =
    Math.floor(state.totalCleared / 2);

  const nextTotal =
    state.totalCleared + linesCleared;

  const newMilestones =
    Math.floor(nextTotal / 2);

  const milestoneBonus =
    (newMilestones - previousMilestones) * 200;

  const multiplier = Math.max(1, state.combo);

  let score =
    (baseScore + milestoneBonus) * multiplier;

  const boardEmpty = state.board.every((row) =>
    row.every((cell) => cell === null)
  );

  if (boardEmpty) {
    score += 300 * 8;
  }

  return score;
}

export function createClassicMode() {
  function playMove(state) {
    if (!state || state.phase !== "playing") {
      return {
        accepted: false,
      };
    }

    if (
      !Array.isArray(state.path) ||
      state.path.length !== state.requiredBlocks
    ) {
      return {
        accepted: false,
      };
    }

    const move = state.path.map((cell) => ({
      row: cell.row,
      col: cell.col,
    }));

    placeMove(state, move);

    state.path.length = 0;

    const lines = clearLines(state.board);

    updateCombo(state, lines.count);

    const gained = calculateScore(
      state,
      lines.count
    );

    state.score += gained;
    state.totalCleared += lines.count;

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
      turn: state.turn,
    };
  }

  return {
    playMove,
  };
}
