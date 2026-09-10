export function increaseCombo(state) {
  state.combo += 1;

  return state.combo;
}

export function resetCombo(state) {
  state.combo = 0;

  return state.combo;
}

export function updateCombo(state, linesCleared) {
  if (linesCleared > 0) {
    return increaseCombo(state);
  }

  return resetCombo(state);
}
