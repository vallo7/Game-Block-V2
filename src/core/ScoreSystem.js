export function calculateScore(linesCleared, combo = 0) {
  if (!Number.isInteger(linesCleared) || linesCleared <= 0) {
    return 0;
  }

  if (!Number.isInteger(combo) || combo < 0) {
    throw new RangeError("combo must be a non-negative integer");
  }

  const baseScore = linesCleared * linesCleared * 100;
  const comboBonus = combo * 50;

  return baseScore + comboBonus;
}

export function addScore(state, linesCleared) {
  const gained = calculateScore(
    linesCleared,
    state.combo
  );

  state.score += gained;

  return gained;
}
