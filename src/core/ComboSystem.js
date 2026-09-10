export function increaseCombo(
  state,
  now = Date.now(),
  duration = 0
) {
  state.combo += 1;

  state.comboUntil =
    now + duration;

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
  now = Date.now(),
  duration = 0
) {
  if (linesCleared <= 0) {
    return resetCombo(state);
  }

  if (boardEmpty) {
    state.combo = 8;
    state.comboUntil =
      now + duration;

    return state.combo;
  }

  return increaseCombo(
    state,
    now,
    duration
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
