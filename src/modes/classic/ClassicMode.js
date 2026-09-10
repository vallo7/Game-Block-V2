import {
  startMove,
  continueMove,
  cancelMove,
  endMove,
} from "../../core/MoveSystem.js";

import { clearLines } from "../../core/ClearSystem.js";
import { updateCombo } from "../../core/ComboSystem.js";
import { addScore } from "../../core/ScoreSystem.js";

function placeMove(state, move) {
  for (const cell of move) {
    state.board[cell.row][cell.col] = "block";
  }
}

function calculateClassicScore(state, lines) {
  if (lines.count <= 0) {
    return 0;
  }

  const baseScore = lines.count * 100;

  const milestoneBonus =
    Math.floor(
      (state.totalCleared + lines.count) / 2
    ) * 200 -
    Math.floor(state.totalCleared / 2) * 200;

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

function updateClassicScore(state, lines) {
  const gained = calculateClassicScore(state, lines);

  state.score += gained;
  state.totalCleared += lines.count;

  return gained;
}

function updateRequiredBlocks(state) {
  if (state.queue.length > 0) {
    state.requiredBlocks = state.queue.shift();
    return state.requiredBlocks;
  }

  state.requiredBlocks = 3;
  return state.requiredBlocks;
}

export function createClassicMode(state) {
  function begin(row, col) {
    if (state.path.length > 0) {
      return false;
    }

    return startMove(state, row, col);
  }

  function extend(row, col) {
    if (state.path.length === 0) {
      return false;
    }

    if (state.path.length >= state.requiredBlocks) {
      return false;
    }

    return continueMove(state, row, col);
  }

  function cancel() {
    cancelMove(state);
  }

  function validate() {
    if (state.path.length !== state.requiredBlocks) {
      cancelMove(state);
      return false;
    }

    const move = endMove(state);

    if (!move) {
      return false;
    }

    placeMove(state, move);

    const lines = clearLines(state.board);

    updateCombo(state, lines.count);

    const gained = updateClassicScore(
      state,
      lines
    );

    state.turn += 1;
    state.session.moves += 1;

    state.lastMove = move;
    state.lastClear = lines;

    updateRequiredBlocks(state);

    return {
      move,
      clear: lines,
      score: gained,
      totalScore: state.score,
      combo: state.combo,
      turn: state.turn,
      requiredBlocks: state.requiredBlocks,
    };
  }

  function reset() {
    cancelMove(state);

    state.turn = 1;
    state.score = 0;
    state.combo = 0;
    state.totalCleared = 0;
    state.requiredBlocks = 3;
    state.queue.length = 0;
    state.session.moves = 0;
    state.lastMove = null;
    state.lastClear = null;
  }

  return {
    begin,
    extend,
    cancel,
    validate,
    reset,
  };
}
