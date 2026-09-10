const COMBO_DURATION = 1800;

export function increaseCombo(
  state,
  now = Date.now()
) {
  state.combo += 1;
  state.comboUntil =
    now + COMBO_DURATION;

  return state.combo;
}

export function resetCombo(state) {
  state.combo = 0;
  state.comboUntil = 0;

  return state.combo;
}

export function updateCombo(
  state,
  linesCleared,
  boardEmpty = false,
  now = Date.now()
) {
  if (linesCleared <= 0) {
    return resetCombo(state);
  }

  if (boardEmpty) {
    state.combo = 8;
    state.comboUntil =
      now + COMBO_DURATION;

    return state.combo;
  }

  return increaseCombo(
    state,
    now
  );
}

export function isComboActive(
  state,
  now = Date.now()
) {
  return (
    state.combo > 0 &&
    state.comboUntil > now
  );
}

export function expireCombo(
  state,
  now = Date.now()
) {
  if (
    state.combo > 0 &&
    state.comboUntil <= now
  ) {
    resetCombo(state);
    return true;
  }

  return false;
}
