import {
  addToPath,
  clearPath,
  removeLastFromPath,
} from "./PathSystem.js";

export function startMove(state, row, col) {
  clearPath(state.path);

  return addToPath(
    state.board,
    state.path,
    row,
    col
  );
}

export function continueMove(state, row, col) {
  return addToPath(
    state.board,
    state.path,
    row,
    col
  );
}

export function undoMove(state) {
  return removeLastFromPath(state.path);
}

export function cancelMove(state) {
  clearPath(state.path);
  state.lastMove = null;
}

export function endMove(state) {
  if (state.path.length === 0) {
    state.lastMove = null;
    return null;
  }

  const move = state.path.map((cell) => ({
    row: cell.row,
    col: cell.col,
  }));

  state.lastMove = move;

  clearPath(state.path);

  return move;
}
