import { createBoard } from "./Board.js";

export function createGameState({
  seed = 1,
  size = 8,
} = {}) {
  return {
    phase: "ready",

    seed,
    size,
    turn: 1,

    board: createBoard(size),
    path: [],

    score: 0,
    combo: 0,
    comboUntil: 0,
    level: 1,
    totalCleared: 0,

    requiredBlocks: 3,
    queue: [],
    obstacles: [],

    session: {
      moves: 0,
    },

    lastMove: null,
    lastClear: null,
  };
}

export function resetGameState(
  state,
  seed = state.seed
) {
  return createGameState({
    seed,
    size: state.size,
  });
}
