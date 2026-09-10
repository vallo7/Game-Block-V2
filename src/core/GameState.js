import { createBoard } from "./Board.js";

export function createGameState({
  seed = 1,
  size = 8,
} = {}) {
  return {
    phase: "ready",

    seed,
    size,

    board: createBoard(size),

    path: [],

    score: 0,
    combo: 0,
    level: 1,

    queue: [],
    obstacles: [],

    lastMove: null,
    lastClear: null,
  };
}

export function resetGameState(state, seed = state.seed) {
  return createGameState({
    seed,
    size: state.size,
  });
}
