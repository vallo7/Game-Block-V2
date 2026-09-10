export function increaseCombo(state) {
  state.combo += 1;

  return state.combo;
}

export function resetCombo(state) {
  state.combo = 0;

  return state.combo;
}

export function updateCombo(
  state,
  linesCleared,
  boardEmpty = false
) {
  if (linesCleared <= 0) {
    return resetCombo(state);
  }

  if (boardEmpty) {
    state.combo = 8;

    return state.combo;
  }

  return increaseCombo(state);
}
